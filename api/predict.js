export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const normalizedId = input.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const fetchUrl =
      `${process.env.API_GET_URL}?entityType=WEBSITE&id=${encodeURIComponent(normalizedId)}&dataType=PROFILE`;

    const getResponse = await fetch(fetchUrl);
    const cachedData = await getResponse.json();

    if (cachedData && cachedData.data && !Array.isArray(cachedData.data)) {
      return res.status(200).json({
        source: "cache",
        result: {
          riskScore: cachedData.data.riskScore,
          socialMediaScore: cachedData.data.socialMediaScore,
          userId: cachedData.data.userId,
          raw: cachedData.data
        }
      });
    }

    const mlResponse = await fetch(process.env.ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: input,
      }),
    });

    const mlData = await mlResponse.json();

    const riskScore = Math.round((mlData.score ?? 0) * 100);

    const saveResponse = await fetch(process.env.API_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entityType: "WEBSITE",
        id: normalizedId,
        dataType: "PROFILE",
        riskScore,
        socialMediaScore: 0,
        userId: "demo-user"
      }),
    });

    const saveText = await saveResponse.text();

    return res.status(200).json({
      source: "ml",
      result: mlData,
      debug: {
        fetchUrl,
        fetchResponse: cachedData,
        saveStatus: saveResponse.status,
        saveResponse: saveText
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}