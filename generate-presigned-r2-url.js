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
	.option('-f, --filename <filename>', 'Filename to upload', 'repo-backup.zip');

program.parse(process.argv);

const options = program.opts();

const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${options.account}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: options.accessKey,
		secretAccessKey: options.secretKey,
	},
});

(async () => {
	const signedUrl = await getSignedUrl(S3, new PutObjectCommand({ Bucket: options.bucket, Key: options.filename }), { expiresIn: 60 * 30 });
	console.log(signedUrl);
})();
