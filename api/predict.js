/* export default async function handler(req, res) {
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
      `${process.env.API_GET_URL}?entityType=product&id=${encodeURIComponent(input)}`
    );

    const cachedData = await getResponse.json();
    console.log("GET response:", cachedData);

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
    console.log("ML response:", mlData);

    // 3. Store result via API Gateway (POST)
    const postResponse = await fetch(process.env.API_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entityType: "product",
        id: input,
        result: mlData,
        createdAt: Date.now(),
      }),
    });

    const postData = await postResponse.json();
    console.log("POST response:", postData);

    return res.status(200).json({
      source: "ml",
      result: mlData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
} */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const getResponse = await fetch(
      `${process.env.API_GET_URL}?entityType=product&id=${encodeURIComponent(input)}`
    );

    const cachedData = await getResponse.json();
    console.log("GET response:", cachedData);

    if (cachedData && cachedData.result) {
      return res.status(200).json({
        source: "cache",
        result: cachedData.result,
      });
    }

    const fakeMlData = {
      prediction: "safe",
      confidence: 0.95,
    };

    const postResponse = await fetch(process.env.API_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entityType: "product",
        id: input,
        result: fakeMlData,
        createdAt: Date.now(),
      }),
    });

    let postData = null;
    try {
      postData = await postResponse.json();
    } catch {
      postData = { message: "No JSON returned from POST route" };
    }

    console.log("POST response:", postData);

    return res.status(200).json({
      source: "fake-ml",
      result: fakeMlData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}