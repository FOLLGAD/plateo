import short from "short-uuid";
import { LocalR2Bucket } from "./LocalR2Bucket";

export const processFile = async (
  file: Blob,
  fileName: string
): Promise<string | null> => {
  if (file) {
    const ext = fileName.split(".").pop();
    const fileId = short.generate() + "." + ext;
    const fileStream = await file.arrayBuffer();

    // Store the file in the R2 bucket
    const bucket = new LocalR2Bucket();
    await bucket.put(fileId, fileStream);

    return fileId;
  }
  return null;
};
