const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors')
const path = require('path');
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors())


const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Helper to convert S3 streams to strings
const streamToString = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

// 1. Create a file inside a folder
app.post("/create-file", async (req, res) => {
  const { folder, fileName, content } = req.body;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: JSON.stringify(content),
    ContentType: "application/json",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.status(201).send({ message: "File created successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 2. Delete a file inside a folder
app.delete("/delete-file", async (req, res) => {
  const { folder, fileName } = req.body;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 3. Update a file inside a folder (overwrite)
app.put("/update-file", async (req, res) => {
  const { folder, fileName, content } = req.body;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: JSON.stringify(content),
    ContentType: "application/json",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.status(200).send({ message: "File updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 4. Read a file inside a folder
app.get("/read-file", async (req, res) => {
  const { folder, fileName } = req.query;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3.send(command);
    const content = await streamToString(data.Body);
    res.status(200).send(JSON.parse(content));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 5. List files inside a folder
app.get("/list-files", async (req, res) => {
  const { folder } = req.query;

  const params = {
    Bucket: BUCKET_NAME,
    Prefix: `${folder}/`,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    const files = data.Contents?.map((item) => item.Key) || [];
    res.status(200).send(files);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 6. List all folders
app.get("/list-folders", async (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
    Delimiter: "/",
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    const folders = data.CommonPrefixes?.map((prefix) => prefix.Prefix) || [];
    res.status(200).send(folders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 7. Duplicate a folder
app.post("/duplicate-folder", async (req, res) => {
  const { sourceFolder, targetFolder } = req.body;

  const listParams = {
    Bucket: BUCKET_NAME,
    Prefix: `${sourceFolder}/`,
  };

  try {
    // List all objects in the source folder
    const listCommand = new ListObjectsV2Command(listParams);
    const listData = await s3.send(listCommand);

    if (!listData.Contents || listData.Contents.length === 0) {
      return res.status(404).send({ message: "Source folder is empty or not found" });
    }

    // Copy each object to the target folder
    const copyPromises = listData.Contents.map(async (item) => {
      const copyParams = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${item.Key}`,
        Key: item.Key.replace(sourceFolder, targetFolder),
      };
      const copyCommand = new PutObjectCommand(copyParams);
      return s3.send(copyCommand);
    });

    await Promise.all(copyPromises);
    res.status(201).send({ message: "Folder duplicated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 8. Rename a folder
app.put("/rename-folder", async (req, res) => {
  const { sourceFolder, targetFolder } = req.body;

  const listParams = {
    Bucket: BUCKET_NAME,
    Prefix: `${sourceFolder}/`,
  };

  try {
    // List all objects in the source folder
    const listCommand = new ListObjectsV2Command(listParams);
    const listData = await s3.send(listCommand);

    if (!listData.Contents || listData.Contents.length === 0) {
      return res.status(404).send({ message: "Source folder is empty or not found" });
    }

    // Copy each object to the target folder and delete original
    const copyAndDeletePromises = listData.Contents.map(async (item) => {
      const newKey = item.Key.replace(sourceFolder, targetFolder);

      // Copy object to new location
      const copyParams = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${item.Key}`,
        Key: newKey,
      };
      const copyCommand = new PutObjectCommand(copyParams);
      await s3.send(copyCommand);

      // Delete original object
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: item.Key,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      return s3.send(deleteCommand);
    });

    await Promise.all(copyAndDeletePromises);
    res.status(200).send({ message: "Folder renamed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;