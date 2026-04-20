export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const normalizedUrl = input.trim();
    const fetchUrl = `${process.env.API_GET_URL}?entityType=product&id=${encodeURIComponent(normalizedUrl)}`;

    const getResponse = await fetch(fetchUrl);
    const cachedData = await getResponse.json();

    if (
      cachedData &&
      Array.isArray(cachedData.data) &&
      cachedData.data.length > 0
    ) {
      const cachedItem = cachedData.data[0];

      // Best case: full model result was stored
      if (cachedItem.modelResult) {
        return res.status(200).json({
          source: "cache",
          result: cachedItem.modelResult,
        });
      }

      // Fallback for old cache entries
      const riskScore =
        typeof cachedItem.riskScore === "number" ? cachedItem.riskScore : 0;

      const normalizedScore = riskScore > 1 ? riskScore / 100 : riskScore;

      const verdict =
        riskScore > 60
          ? "warning"
          : riskScore > 30
            ? "moderate"
            : "legitimate";

      return res.status(200).json({
        source: "cache",
        result: {
          score: normalizedScore,
          prob_phishing: normalizedScore,
          threshold: 0.8,
          url: normalizedUrl,
          verdict,
          why_flagged: ["Loaded from cached scan result"],
        },
      });
    }

    const mlResponse = await fetch(process.env.ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: normalizedUrl,
      }),
    });

    const mlData = await mlResponse.json();

    await fetch(process.env.API_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entityType: "product",
        id: normalizedUrl,
        dataType: "PROFILE",
        riskScore:
          typeof mlData.score === "number"
            ? mlData.score <= 1
              ? Math.round(mlData.score * 100)
              : Math.round(mlData.score)
            : 0,
        socialMediaScore: 0,
        userId: "model-scan",
        modelResult: mlData,
      }),
    });

    return res.status(200).json({
      source: "ml",
      result: mlData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}