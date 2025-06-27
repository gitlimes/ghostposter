import * as tumblr from "tumblr.js";

export async function login() {
  const client = tumblr.createClient({
    consumer_key: "<consumer key>",
    consumer_secret: "<consumer secret>",
    token: "<oauth token>",
    token_secret: "<oauth token secret>",
  });

  return client;
}

export async function post(client, post) {
  await client.createPost(blogName, {
    content: [
      {
        type: "text",
        text: post.title,
      },
      {
        type: "text",
        text: "post.url",
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
