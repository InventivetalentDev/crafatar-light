const express = require('express')
const app = express()
const port = process.env.PORT || 80

let allowedPrefixes = [
    'http://textures.minecraft.net/texture/',
    'https://textures.minecraft.net/texture/'
];
if (process.env.ALLOWED_URL_PREFIXES) {
    allowedPrefixes = process.env.ALLOWED_URL_PREFIXES.split(',');
}

const render = require("./renders");

app.get('/render', (req, res) => {
    let start = Date.now();
    let url = req.query['url'];
    if (!url) {
        res.status(400).end();
        return;
    }
    let allowed = false;
    for (let prefix of allowedPrefixes) {
        if (url.startsWith(prefix)) {
            allowed = true;
            break;
        }
    }
    if (!allowed) {
        res.status(403).end();
        return;
    }

    try {
        render.draw_model(undefined, url, parseInt(req.query['scale'] || '10'), req.query['overlay'] === 'true', req.query['body'] === 'true', req.query['slim'] === 'true', (err, img) => {
            if (err) {
                console.error(err);
                res.header("Content-Type", "text/plain");
                res.status(500);
                res.send(err.message);
                res.end();
                return;
            }
            res.status(200);
            res.header("Content-Length", img.length);
            res.header("Content-Type", "image/png");
            res.header("Cache-Control", "public, max-age=2630000")
            res.header("X-Timing", "" + (Date.now() - start));
            res.send(img);
            res.end();
        });
    } catch (e) {
        console.error(e);
        res.header("Content-Type", "text/plain");
        res.status(500);
        res.send(e.message);
        res.end();
        return;
    }
})

app.listen(port, () => {
    console.log(`listening on port ${ port }`)
})
