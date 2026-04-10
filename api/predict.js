export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const fetchUrl = `${process.env.API_GET_URL}?entityType=product&id=${encodeURIComponent(input)}`;
    const getResponse = await fetch(fetchUrl);
    const cachedData = await getResponse.json();

    if (cachedData && Array.isArray(cachedData.data) && cachedData.data.length > 0) {
      return res.status(200).json({
        source: "cache",
        result: cachedData.data[0].result,
        debug: {
          fetchUrl,
          fetchResponse: cachedData
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

    const saveResponse = await fetch(process.env.API_POST_URL, {
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