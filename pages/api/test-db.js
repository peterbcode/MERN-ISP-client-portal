import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    return res.status(200).json({ success: true, message: "MongoDB connected" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

