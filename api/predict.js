export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    // 1. Check cache via API Gateway (GET)
    const getResponse = await fetch(
      `${process.env.API_GET_URL}?input=${encodeURIComponent(input)}`
    );

    const cachedData = await getResponse.json();

    if (cachedData && cachedData.result) {
      return res.status(200).json({
        source: "cache",
        result: cachedData.result,
      });
    }

    // 2. Call ML model
    const mlResponse = await fetch(process.env.ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const mlData = await mlResponse.json();

    // 3. Store result via API Gateway (POST)
    await fetch(process.env.API_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        result: mlData,
        createdAt: Date.now(),
      }),
    });

    return res.status(200).json({
      source: "ml",
      result: mlData,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}