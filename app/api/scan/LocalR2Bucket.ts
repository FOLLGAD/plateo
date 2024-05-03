import fs from "fs";
import path from "path";

export class LocalR2Bucket {
  private bucketPath = "./fileBucket";

  constructor() {
    if (!fs.existsSync(this.bucketPath)) {
      fs.mkdirSync(this.bucketPath);
    }
  }

  async put(key: string, value: ArrayBuffer) {
    fs.writeFileSync(path.join(this.bucketPath, key), Buffer.from(value));
  }

  async get(key: string): Promise<File> {
    const ext = key.split(".").pop();
    return new File([fs.readFileSync(path.join(this.bucketPath, key))], key, {
      type: "image/" + ext,
    });
  }
}
