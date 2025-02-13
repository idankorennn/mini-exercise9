const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/video', (req, res) => {
    // Get the video’s actual location and size
    const videoPath = path.join(__dirname, 'public', 'video.mp4');
    const leSize = fs.statSync(videoPath).size;
    // Extract the range requested by the browser
    const range = req.headers.range;
    const parts = range.substring(6).split('-');
    const start = parseInt(parts[0]);
    const chunk_size = 10 ** 6; // 1MB
    const end = Math.min(start + chunk_size, leSize - 1);
    const le = fs.createReadStream(videoPath, { start, end });
    // Stream requested chunk
    const head = {
        'Content-Range': `bytes ${start}-${end}/${leSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunk_size,
        'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    le.pipe(res);
});

app.use(express.static('public'));

app.listen(3000);