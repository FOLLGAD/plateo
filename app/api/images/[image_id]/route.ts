// can this be done directly from client?
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
import { R2Bucket } from "@cloudflare/workers-types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const context = getRequestContext();
  const id = request.nextUrl.searchParams.get("image_id");

  // @ts-expect-error
  const R2 = context.env.BUCKET as R2Bucket;
  const file = await R2.get(id);

  return new Response(await file.arrayBuffer(), {
    headers: {
      "content-type": file.httpMetadata.contentType,
    },
  });
}
