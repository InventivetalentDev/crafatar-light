const express = require('express')
const app = express()
const port = process.env.PORT || 80

const render = require("./renders")

app.get('/render', (req, res) => {
    let start = Date.now();
    let url = req.query['url'];
    if (!url || !url.startsWith('http://textures.minecraft.net/texture/') && !url.startsWith('https://textures.minecraft.net/texture/')) {
        res.status(400).end();
        return;
    }
    render.draw_model(undefined, url, parseInt(req.query['scale'] || '10'), req.query['overlay'] === 'true', req.query['body'] === 'true', req.query['slim'] === 'true', (err, img) => {
        res.status(200)
        res.header("Content-Length", img.length);
        res.header("Content-Type", "image/png");
        res.header("Cache-Control", "public, max-age=2630000")
        res.header("X-Timing", "" + (Date.now() - start));
        res.send(img);
        res.end();
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${ port }`)
})
