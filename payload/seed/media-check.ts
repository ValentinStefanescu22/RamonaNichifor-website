/** Seed safety nets for media: Payload silently renames an upload whose name is taken (`name-1.webp`), and an R2 upload can fail without a trace. */

/** The seed matches media by filename, so a renamed file would be created again on every run: stop at the first one. */
export function assertSameFilename(doc: { filename?: string | null }, wanted: string) {
  if (doc.filename !== wanted) throw new Error(`seed: media "${wanted}" was stored as "${doc.filename}" (a file or document with that name already exists); clean it up and re-run`);
}

/** With R2 on, the object must really be in the bucket (HEAD); `head` throws when it is not. */
export async function assertInBucket(filename: string, head: (key: string) => Promise<unknown>) {
  try {
    await head(filename);
  } catch (err) {
    throw new Error(`seed: media "${filename}" is in the database but not in the R2 bucket (${err instanceof Error ? err.message : err})`);
  }
}

/** HEAD against the configured bucket (credentials from S3_*; never logged). ponytail: @aws-sdk/client-s3 is storage-s3's own dependency, not ours. */
export async function headObject(key: string) {
  const { S3Client, HeadObjectCommand } = await import("@aws-sdk/client-s3");
  const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: "auto",
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "" },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
}
