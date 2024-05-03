// can this be done directly from client?
import type { NextRequest } from "next/server";
import { LocalR2Bucket } from "../../scan/LocalR2Bucket";

export async function GET(
  request: NextRequest,
  context: { params: { image_id: string } }
) {
  const id = context.params.image_id;

  const bucket = new LocalR2Bucket();
  const file = await bucket.get(id);

  return new Response(await file.arrayBuffer(), {
    headers: {
      "content-type": file.type,
    },
  });
}
