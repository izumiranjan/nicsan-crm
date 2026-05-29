const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractPolicyData = async (pdfBuffer) => {
  try {
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text.slice(0, 3000);
    console.log('PDF text extracted:', text.slice(0, 200));

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const result = await model.generateContent(
      `Extract insurance policy info from this text and return ONLY JSON with no extra text:
      {"policy_number":"...","customer_name":"...","customer_email":"...","vehicle_number":"...","insurer":"...","premium":0,"status":"active"}
      
      Text: ${text}`
    );

    const response = result.response.text();
    console.log('Gemini response:', response);
    const cleaned = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini extraction error:', err.message);
    try {
      const pdfData = await pdfParse(pdfBuffer);
      const text = pdfData.text;
      
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const premiumMatch = text.match(/Total Premium[^\d]*(\d+(?:,\d+)*)/i) || 
                          text.match(/Premium[^\d]*(\d+(?:,\d+)*)/i);
      
      return {
        policy_number: 'POL-' + Date.now(),
        customer_name: text.match(/Customer Name[:\s]+([^\n]+)/i)?.[1]?.trim() || 
                       text.match(/Name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/)?.[1]?.trim() || 'N/A',
        customer_email: emailMatch?.[0] || 'N/A',
        vehicle_number: text.match(/Registration Number[:\s]+([^\n]+)/i)?.[1]?.trim() ||
                        text.match(/[A-Z]{2}\s*\d{2}\s*[A-Z]{1,2}\s*\d{4}/)?.[0] || 'N/A',
        insurer: text.match(/Insurance Provider[:\s]+([^\n]+)/i)?.[1]?.trim() ||
                 text.match(/Insurance[:\s]+([^\n]+)/i)?.[1]?.trim() || 'N/A',
        premium: premiumMatch ? parseInt(premiumMatch[1].replace(/,/g, '')) : 0,
        status: 'active',
      };
    } catch(e) {
      return {
        policy_number: 'POL-' + Date.now(),
        customer_name: 'N/A',
        customer_email: 'N/A',
        vehicle_number: 'N/A',
        insurer: 'N/A',
        premium: 0,
        status: 'active',
      };
    }
  }
};

module.exports = { extractPolicyData };