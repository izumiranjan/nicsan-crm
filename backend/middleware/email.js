const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPolicyEmail = async (toEmail, policyData) => {
  try {
    const mailOptions = {
      from: `"Nicsan CRM" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Policy Created - ${policyData.policy_number}`,
      html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;"><div style="background:#1a56db;padding:20px;border-radius:8px 8px 0 0;text-align:center;"><h1 style="color:white;margin:0;">Nicsan Insurance</h1><p style="color:#cce0ff;margin:5px 0;">Policy Confirmation</p></div><div style="padding:30px;background:#f9fafb;"><h2 style="color:#1a56db;">Dear ' + policyData.customer_name + ',</h2><p>Your insurance policy has been successfully created.</p><table style="width:100%;border-collapse:collapse;margin:20px 0;"><tr style="background:#e8f0fe;"><td style="padding:12px;border:1px solid #ddd;font-weight:bold;">Policy Number</td><td style="padding:12px;border:1px solid #ddd;">' + policyData.policy_number + '</td></tr><tr><td style="padding:12px;border:1px solid #ddd;font-weight:bold;">Vehicle Number</td><td style="padding:12px;border:1px solid #ddd;">' + (policyData.vehicle_number || 'N/A') + '</td></tr><tr style="background:#e8f0fe;"><td style="padding:12px;border:1px solid #ddd;font-weight:bold;">Insurer</td><td style="padding:12px;border:1px solid #ddd;">' + (policyData.insurer || 'N/A') + '</td></tr><tr><td style="padding:12px;border:1px solid #ddd;font-weight:bold;">Premium</td><td style="padding:12px;border:1px solid #ddd;">Rs.' + policyData.premium + '</td></tr><tr style="background:#e8f0fe;"><td style="padding:12px;border:1px solid #ddd;font-weight:bold;">Status</td><td style="padding:12px;border:1px solid #ddd;color:green;font-weight:bold;">Active</td></tr></table><p style="color:#666;">Contact us at support@nicsan.com</p></div><div style="background:#1a56db;padding:15px;border-radius:0 0 8px 8px;text-align:center;"><p style="color:white;margin:0;">2026 Nicsan Insurance Marketing LLP</p></div></div>',
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', toEmail);
  } catch (err) {
    console.error('Email error:', err);
  }
};

module.exports = { sendPolicyEmail };