import { createRestAPIClient } from "masto";

export async function login() {
  const client = createRestAPIClient({
    url: process.env.MASTO_INSTANCE_URL,
    accessToken: process.env.MASTO_TOKEN,
  });

  return client;
}

export async function post(client, post) {
  try {
    const formattedPost = `${post.title}\n\n${post.url}`;

    const status = await client.v1.statuses.create({
      status: formattedPost,
    });

    console.log(`[INFO] Mastodon: posted ${post.title}`);
  } catch (e) {
    console.log("[ERROR] Mastodon:\n", e);
  }
}
