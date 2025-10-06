# Cloudflare R2 File Manager

`cloudflare-r2-file-manager` is a Node.js-based REST API for performing CRUD operations on files and folders stored in Cloudflare R2. This tool allows you to create, read, update, and delete JSON files, as well as manage folders within your R2 bucket.

## Features

- **Create** a file inside a folder.
- **Read** a file inside a folder.
- **Update** a file inside a folder.
- **Delete** a file inside a folder (supports wildcards to delete all files in a folder).
- **List files** inside a folder.
- **List all folders** in your Cloudflare R2 bucket.
- **Upload multiple files** (up to 50 files per request).
- **Duplicate** and **rename** folders.
- **Generate pre-signed URLs** for file access.

## Prerequisites

- Node.js (v14 or above)
- Cloudflare R2 account and API credentials

## Setup

1. **Clone the repository:**

    ```bash
    https://github.com/YsrajSingh/cloudflare-r2-file-manager.git
    cd cloudflare-r2-file-manager
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create an .env file** in the root directory with the following content:

    ```bash
    PORT=3000
    AWS_ACCESS_KEY_ID=<your-cloudflare-r2-access-key>
    AWS_SECRET_ACCESS_KEY=<your-cloudflare-r2-secret-key>
    R2_BUCKET_NAME=<your-cloudflare-r2-bucket-name>
    R2_BUCKET=<your-cloudflare-r2-bucket-name>
    R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
    ```

    Replace `<your-cloudflare-r2-access-key>`, `<your-cloudflare-r2-secret-key>`, `<your-cloudflare-r2-bucket-name>`, and `<account-id>` with your Cloudflare R2 credentials.

## Running the Server

To start the server, run:

```bash
npm start
```

The server will be available at `http://localhost:3000`

## API Endpoints

1.**Create a File**

- Endpoint: `POST /create-file`
- Request Body:

    ```json
    {
        "folder": "folder-name",
        "fileName": "file.json",
        "content": { "key": "value" }
    }
    ```

2.**Delete a File**

- Endpoint: `DELETE /delete-file`
- Request Body (single file):

    ```json
    {
        "folder": "folder-name",
        "fileName": "file.json"
    }
    ```

- Request Body (delete all files in folder):

    ```json
    {
        "folder": "folder-name",
        "fileName": "*"
    }
    ```

- Response for wildcard: `{"message": "Deleted X files successfully"}`

3.**Update a File**

- Endpoint: `PUT /update-file`
- Request Body:

    ```json
    {
        "folder": "folder-name",
        "fileName": "file.json",
        "content": { "key": "updated-value" }
    }
    ```

4.**Read a File**

- Endpoint: `GET /read-file`
- Query Parameters: `folder=folder-name&fileName=file.json`

5.**List Files in a Folder**

- Endpoint: `GET /list-files`
- Query Parameters: `folder=folder-name`

6.**List All Folders**

- Endpoint: `GET /list-folders`

7.**Duplicate a Folder**

- Endpoint: `POST /duplicate-folder`
- Request Body:

    ```json
    {
        "sourceFolder": "source-folder",
        "targetFolder": "target-folder"
    }
    ```

8.**Rename a Folder**

- Endpoint: `PUT /rename-folder`
- Request Body:

    ```json
    {
        "sourceFolder": "old-folder-name",
        "targetFolder": "new-folder-name"
    }
    ```

9.**Upload Files**

- Endpoint: `POST /upload-files`
- Content-Type: `multipart/form-data`
- Form Data:
  - `files`: Multiple files (up to 50)
  - `folder`: Target folder name (optional, defaults to "uploads")
- Response: `{"message": "Files uploaded successfully", "fileNames": ["file1.jpg", "file2.png"]}`

10.**Get File URLs**

- Endpoint: `GET /get-file-urls`
- Query Parameters: `folder=folder-name&expires=3600` (expires is optional)
- Returns pre-signed URLs for all files in the specified folder

## Contributing

1. Fork the repository.
1. Create a new branch (`git checkout -b feature-name`).
1. Commit your changes (`git commit -am 'Add new feature'`).
1. Push to the branch (`git push origin feature-name`).
1. Create a new pull request.

## License

This project is licensed under the [MIT License](https://github.com/YsrajSingh/cloudflare-r2-file-manager/blob/main/LICENSE).
