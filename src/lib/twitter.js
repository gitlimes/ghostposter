import { TwitterApi } from "twitter-api-v2";

export async function login() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const rwClient = client.readWrite;

  return rwClient;
}

export async function post(client, post) {
  const formattedPost = `${post.title}\n\n${post.url}`;

  await client.v2.tweet({
    text: formattedPost,
  });

  console.log(`Twitter: posted ${post.title}`);
}
