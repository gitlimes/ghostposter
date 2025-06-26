import 'dotenv/config';

import * as crypto from "node:crypto";
import express from 'express';
const app = express();
const port = 3000;

import setUpPostHandlers from './lib/postHandlers.js';

const postHandlers = await setUpPostHandlers();


// if we're missing GHOST_WEBHOOK_SECRET we can't verify that hooks are actually coming from ghost. Abort.
if (!process.env.GHOST_WEBHOOK_SECRET) {
    throw new Error("GHOST_WEBHOOK_SECRET not found in docker-compose.yml env. Create the webhook again, and make sure to copy that.")
}

async function post(post) {
    //console.log("post =", post)
    postHandlers?.bsky(post);
    postHandlers?.twitter(post);
    postHandlers?.masto(post)

}

// parses the webhook and returns some text and the link
async function handleWebhook(req) {
    // do something with the webhook.
    console.log("handling webhook", req.body);
    const parsedWebhook = req.body.post.current;
    console.log("parsedWebhook", parsedWebhook)

    await post(parsedWebhook)
}


function verifyWebhook(body, signature, timestamp, secret) {
    const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${JSON.stringify(body)}${timestamp}`)
        .digest('hex');

    return computedSignature === signature.replace('sha256=', '');
}

app.post('/hook', express.json(), (req, res) => {
    const signature = req.headers['x-ghost-signature'].split(', t=')[0];
    const timestamp = req.headers['x-ghost-signature'].split(', t=')[1];

    if (!verifyWebhook(req.body, signature, timestamp, process.env.GHOST_WEBHOOK_SECRET)) {
        return res.status(401).send('Unauthorized');
    }

    res.status(200).send('OK');
    handleWebhook(req);
});

app.listen(port, () => {
    console.log(`Crossposter listening on http://localhost:${port}/hook`);
});
