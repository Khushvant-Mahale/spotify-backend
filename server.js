const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const basePath = path.join(__dirname, "libraries");

app.use(cors());
app.use("/libraries", express.static(basePath));

// ✅ Playlist Fetcher
app.get("/api/playlists", (req, res) => {
  try {
    const categories = fs
      .readdirSync(basePath)
      .filter((c) => fs.statSync(path.join(basePath, c)).isDirectory());

    const result = categories.map((category) => {
      const catPath = path.join(basePath, category);
      const catInfoPath = path.join(catPath, "info.json");

      let catTitle = category;
      if (fs.existsSync(catInfoPath)) {
        const catInfo = JSON.parse(fs.readFileSync(catInfoPath, "utf-8"));
        catTitle = catInfo.title || category;
      }

      const subfolders = fs
        .readdirSync(catPath)
        .filter((sub) => fs.statSync(path.join(catPath, sub)).isDirectory());

      const playlists = subfolders.map((playlist) => {
        const playlistPath = path.join(catPath, playlist);
        const infoPath = path.join(playlistPath, "info.json");

        let title = playlist;
        let description = "";
        let img = "";

        if (fs.existsSync(infoPath)) {
          const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
          title = info.title || title;
          description = info.description || "";
          img = info.img || "";
        }

        const songs = fs
          .readdirSync(playlistPath)
          .filter((f) => f.endsWith(".mp3"))
          .map((song) => `/libraries/${category}/${playlist}/${song}`);

        return {
          folder: playlist,
          title,
          description,
          img: img ? `/libraries/${category}/${playlist}/${img}` : null,
          songs,
        };
      });

      return {
        category,
        title: catTitle,
        playlists,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("🔥 API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running: http://localhost:${PORT}`)
);
