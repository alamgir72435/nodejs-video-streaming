import express from "express";
import fs from 'fs';
import path from 'path';

const app = express();



app.use(express.static(path.join(__dirname,"public")));

app.get('/video', (req, res) => {
  // 

  try {
    const videoPath = path.join(__dirname, 'public/video.mp4');
    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    const parts = range!.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } catch (error) {
    console.log(error);
    return res.json({ error: error})
  }
})


app.listen(5000, ()=> {
  console.log('listening on port 5000');
})