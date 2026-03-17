export const runtime = "nodejs";

export async function GET() {
  try {
    const { default: clientPromise } = await import("@/lib/mongodb");
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    return Response.json({ success: true, message: "MongoDB connected" }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error: error?.message }, { status: 500 });
  }
}
