# generate-presigned-r2-url

## Description

`generate-presigned-r2-url` is a Node.js script that generates a presigned URL for uploading files to an R2 bucket using AWS SDK (Thanks to Cloudflare's S3 compatible API). This URL can be used to securely upload files to the specified R2 bucket without requiring direct access to the R2 credentials.

This project is intended to be used as a `npx` argument, however, you can also call it directly from the directory using `node`.

## Why

I needed a quick way to adjust a github action workflow, and publishing a npm package is extremely easy.

## Features

-  Generates a presigned URL for uploading files to an R2 bucket.
-  Uses AWS SDK for S3 and S3 request presigner.
-  Command-line interface for easy usage.

## Prerequisites

-  Nodejs (Version 20 and up).
-  Dependencies installed.
-  An R2 account with access keys.

## Installation

1. Clone the repository or download the script.
2. Install the required dependencies by running:

```sh
   npm install
```

## Usage

Run the script with the required options:

```sh
node generate-presigned-r2-url.js -b <bucket> -a <account> -k <accessKey> -s <secretKey> [-f <filename>] [-e <expires>]
```

Alternatively, you can use `npx` to run the script without installing it globally:

```sh
# add -y flag to skip installation question
npx -y generate-presigned-r2-url -b <bucket> -a <account> -k <accessKey> -s <secretKey> [-f <filename>] [-e <expires>]
```

### Options

-  `-b, --bucket <bucket>`: R2 bucket name (required).
-  `-a, --account <account>`: R2 account ID (required).
-  `-k, --accessKey <accessKey>`: R2 access key ID (required).
-  `-s, --secretKey <secretKey>`: R2 secret access key (required).
-  `-f, --filename <filename>`: Filename to upload (optional, default: `repo-backup.zip`).
-  `-e, --expires <expires>`: Amount of seconds for the url to be valid for (optional, default: 60 (60 seconds))

### Example

```sh
#while inside root directory
node generate-presigned-r2-url.js -b my-bucket -a my-account-id -k my-access-key -s my-secret-key -f my-file.zip
```

This command will output a presigned URL that can be used to upload `my-file.zip` to the specified R2 bucket:

```sh
https://my-bucket.my-account-id.r2.cloudflarestorage.com/my-file.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=my-access-key%2F20240812%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20240812T153313Z&X-Amz-Expires=1800&X-Amz-Signature=7714bd43f0b5ed892e3e74c52131bde0dcfd6d38f2342dcfeee4d96cda89dd78&X-Amz-SignedHeaders=host&x-id=PutObject
```

In your workflow, the step would look something like this:

```yml
- name: Run script to generate presigned URL
  run: echo "UPLOAD_URL=$(npx -y generate-presigned-r2-url -b ${{ secrets.R2_BUCKET_NAME }} -a ${{ secrets.R2_ACCOUNT_ID }} -k ${{ secrets.R2_ACCESS_KEY_ID }} -s ${{ secrets.R2_SECRET_ACCESS_KEY }})" >> $GITHUB_ENV
  continue-on-error: true
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

-  [AWS SDK for JavaScript](https://github.com/aws/aws-sdk-js-v3)
-  [Commander.js](https://github.com/tj/commander.js/)

---
