# Cloudflare R2 File Manager

`cloudflare-r2-file-manager` is a Node.js-based REST API for performing CRUD operations on files and folders stored in Cloudflare R2. This tool allows you to create, read, update, and delete JSON files, as well as manage folders within your R2 bucket.

## Features
- **Create** a file inside a folder.
- **Read** a file inside a folder.
- **Update** a file inside a folder.
- **Delete** a file inside a folder.
- **List files** inside a folder.
- **List all folders** in your Cloudflare R2 bucket.


## Prerequisites
- Node.js (v14 or above)
- Cloudflare R2 account and API credentials

## Setup

1. **Clone the repository:**
    ```
    https://github.com/YsrajSingh/cloudflare-r2-file-manager.git
    cd cloudflare-r2-file-manager
    ```

2. **Install dependencies:**

    ```
    npm install
    ```

3. **Create an .env file** in the root directory with the following content:

    ```
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

```
npm start
```

The server will be available at `http://localhost:3000`

## API Endpoints

1. **Create a File**
- Endpoint: `POST /create-file`
- Request Body:
    ```
    {
        "folder": "folder-name",
        "fileName": "file.json",
        "content": { "key": "value" }
    }
    ```

2. **Delete a File**
- Endpoint: `DELETE /delete-file`
- Request Body:
    ```
    {
        "folder": "folder-name",
        "fileName": "file.json"
    }
    ```

3. **Update a File**
- Endpoint: `PUT /update-file`
- Request Body:
    ```
    {
        "folder": "folder-name",
        "fileName": "file.json",
        "content": { "key": "updated-value" }
    }
    ```

4. **Read a File**
- Endpoint: `GET /read-file`
- Query Parameters: `folder=folder-name&fileName=file.json`

5. **List Files in a Folder**
- Endpoint: `GET /list-files`
- Query Parameters: `folder=folder-name`

6. **List All Folders**
- Endpoint: `GET /list-folders`

## Contributing
1. Fork the repository.
1. Create a new branch (`git checkout -b feature-name`).
1. Commit your changes (`git commit -am 'Add new feature'`).
1. Push to the branch (`git push origin feature-name`).
1. Create a new pull request.

## License
This project is licensed under the [MIT License](https://github.com/YsrajSingh/cloudflare-r2-file-manager/blob/main/LICENSE).


