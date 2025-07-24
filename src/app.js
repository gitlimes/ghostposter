import "dotenv/config";

import * as crypto from "node:crypto";
import express from "express";
const app = express();
const port = 3000;

import setUpPostHandlers from "./lib/postHandlers.js";

const postHandlers = await setUpPostHandlers();

// if we're missing GHOST_WEBHOOK_SECRET we can't verify that hooks are actually coming from ghost. Abort.
if (!process.env.GHOST_WEBHOOK_SECRET) {
  throw new Error(
    "GHOST_WEBHOOK_SECRET not found in docker-compose.yml env. Create the webhook again, making sure to set a secret, and copy it in the env."
  );
}

async function post(post) {
  //console.log("post =", post);
  postHandlers?.bsky(post);
  postHandlers?.twitter(post);
  postHandlers?.masto(post);
  postHandlers?.tumblr(post);
}

// parses the webhook and returns some text and the link
async function handleWebhook(req) {
  // do something with the webhook.
  //console.log("handling webhook", req.body);
  const parsedWebhook = req.body.post.current;
  //console.log("parsedWebhook", parsedWebhook);

  await post(parsedWebhook);
}

function verifyWebhook(body, signatureHeader, secret) {
  const { sha256: signature, t: timestamp } = Object.fromEntries(
    signatureHeader
      .split(", ")
      .map((pair) => pair.split("=").map((item) => item.trim()))
  );

  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${JSON.stringify(body)}${timestamp}`)
    .digest("hex");

  return computedSignature === signature;
}

app.get('/hook', (req, res) => {
  res.status(200).send('ghostposter is listening for webhooks here! https://github.com/gitlimes/ghostposter')
})

app.post("/hook", express.json(), (req, res) => {
  const signatureHeader = req.headers["x-ghost-signature"];

  if (
    !verifyWebhook(req.body, signatureHeader, process.env.GHOST_WEBHOOK_SECRET)
  ) {
    console.log(
      "\n[WARN] received unauthorized webhook",
      req.body,
      req.headers
    );
    return res.status(401).send("Unauthorized");
  }

  res.status(200).send("OK");
  handleWebhook(req);
});

app.listen(port, () => {
  console.log(`ghostposter listening on http://localhost:${port}/hook`);
});
  excerpt: "Well, not entirely. But they're pretty uncommon now, in 1.1.2",
  reading_time: 0,
  og_image: null,
  og_title: null,
  og_description: null,
  twitter_image: null,
  twitter_title: null,
  twitter_description: null,
  meta_title: null,
  meta_description: null,
  email_subject: null,
  frontmatter: null,
  feature_image_alt: "image alt text",
  feature_image_caption:
    '<span style="white-space: pre-wrap;">Photo by </span><a href="https://unsplash.com/@berkayekener?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit"><span style="white-space: pre-wrap;">Berkay Ekener</span></a><span style="white-space: pre-wrap;"> / </span><a href="https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit"><span style="white-space: pre-wrap;">Unsplash</span></a>',
  email_only: false,
});
