import * as tumblr from "tumblr.js";

export async function login() {
  const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET,
  });

  return client;
}

export async function post(client, post) {
  await client.createPost(process.env.TUMBLR_BLOG_NAME, {
    content: [
      {
        type: "text",
        text: post.title,
      },
      {
        type: "text",
        text: post.url,
        formatting: [
          {
            start: 0,
            end: post.url.length,
            type: "link",
            url: post.url,
          },
        ],
      },
    ],
  });

  console.log(`[INFO] Tumblr: posted ${post.title}`);
}
