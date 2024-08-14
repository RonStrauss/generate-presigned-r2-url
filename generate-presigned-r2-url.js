#!/usr/bin/env node

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Command } from 'commander';

const program = new Command();

program
	.requiredOption('-b, --bucket <bucket>', 'R2 bucket name:')
	.requiredOption('-a, --account <account>', 'R2 account ID')
	.requiredOption('-k, --accessKey <accessKey>', 'R2 access key ID')
	.requiredOption('-s, --secretKey <secretKey>', 'R2 secret access key')
	.option('-f, --filename <filename>', 'Filename to upload', 'repo-backup.zip')
	.option('-e, --expires <expires>', 'Presigned URL expiration time in seconds', 60);

program.parse(process.argv);

const { bucket, account, accessKey, secretKey, filename, expires } = program.opts();

const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${account}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretKey,
	},
});

getSignedUrl(S3, new PutObjectCommand({ Bucket: bucket, Key: filename }), { expiresIn: expires })
	.then((signedUrl) => console.log(signedUrl))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
