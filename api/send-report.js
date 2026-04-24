export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { url, category, description, reportId } = req.body;

  if (!url || !category || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.REPORT_FROM_EMAIL,
        to: process.env.REPORT_TO_EMAIL,
        subject: `New RiskLens Site Report: ${category}`,
        html: `
          <h2>New RiskLens Site Report</h2>
          <p><strong>Report ID:</strong> ${reportId || 'N/A'}</p>
          <p><strong>URL:</strong> ${url}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Description:</strong></p>
          <p>${description}</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Email failed' });
    }

    return res.status(200).json({ success: true, email: data });
  } catch (error) {
    return res.status(500).json({ error: 'Email server error' });
  }
}