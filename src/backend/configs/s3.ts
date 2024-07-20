import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client()
export enum FILE_CONTEXT {
    PROFILE = 'profile',
    PLACE = 'place',
    GROUP = 'group'
}
export async function saveFile(base64: string, key: string, context: FILE_CONTEXT) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${context}/${key}`,
        Body: Buffer.from(base64, 'base64')
    })
    return s3Client.send(command)

}

export async function getFile(key: string, context: FILE_CONTEXT) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${context}/${key}`
    })
    return s3Client.send(command)
}

export async function generateLinkOfFile(key: string, context: FILE_CONTEXT) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${context}/${key}`
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 30 })
    return url
}