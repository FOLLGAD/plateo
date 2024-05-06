import { getRequestContext } from "@cloudflare/next-on-pages";
import short from "short-uuid";

export const processFile = async (
  file: Blob,
  fileName: string
): Promise<string | null> => {
  if (file) {
    const context = getRequestContext();
    const ext = fileName.split(".").pop();
    const fileIdName = short.generate() + "." + ext;
    const fileStream = await file.arrayBuffer();

    // Store the file in the R2 bucket
    // @ts-expect-error
    const bucket = context.env.BUCKET as R2Bucket;
    await bucket.put(fileIdName, fileStream);

    return fileIdName;
  }
  return null;
};
