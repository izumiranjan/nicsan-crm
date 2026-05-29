const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { extractPolicyData } = require('../middleware/gemini');
const { sendPolicyEmail } = require('../middleware/email');
const { authenticateToken } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM policies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM policies WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'nicsan-policies' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    const extractedData = await extractPolicyData(file.buffer);

    const result = await pool.query(
      `INSERT INTO policies 
        (policy_number, customer_name, customer_email, vehicle_number, insurer, premium, status, s3_file_url, extracted_data, uploaded_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        extractedData.policy_number || 'N/A',
        extractedData.customer_name || 'N/A',
        extractedData.customer_email || 'N/A',
        extractedData.vehicle_number || 'N/A',
        extractedData.insurer || 'N/A',
        extractedData.premium || 0,
        'active',
        uploadResult.secure_url,
        extractedData,
        req.user.id,
      ]
    );

    const io = req.app.get('io');
    io.emit('policy_added', result.rows[0]);

    if (extractedData.customer_email && extractedData.customer_email !== 'N/A') {
      await sendPolicyEmail(extractedData.customer_email, extractedData);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE policies SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    const io = req.app.get('io');
    io.emit('policy_updated', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM policies WHERE id=$1', [req.params.id]);
    const io = req.app.get('io');
    io.emit('policy_deleted', { id: req.params.id });
    res.json({ message: 'Policy deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;