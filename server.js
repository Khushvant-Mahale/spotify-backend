const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use("/libraries", express.static(path.join(__dirname, "libraries")));

app.get("/api/playlists", (req, res) => {
  const basePath = path.join(__dirname, "libraries");

  const folders = fs
    .readdirSync(basePath)
    .filter((folder) => fs.statSync(path.join(basePath, folder)).isDirectory());

  const playlistData = folders.map((folder) => {
    const files = fs
      .readdirSync(path.join(basePath, folder))
      .filter((f) => f.endsWith(".mp3"));
    return {
      folder,
      songs: files,
      cover: `/libraries/${folder}/thumb.jpg`, // Optional image
    };
  });

  res.json(playlistData);
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
