import * as bsky from "./bsky.js";
import * as twitter from "./twitter.js";
import * as masto from "./masto.js";
import * as tumblr from "./tumblr.js";

export default async function setUpPostHandlers() {
  const postHandlers = {};

  // bsky
  try {
    const client = await bsky.login();

    postHandlers.bsky = (post) => {
      bsky.post(client, post);
    };
  } catch (e) {
    console.log("[ERROR] Bsky:\n", e);
  }

  // twitter
  try {
    const client = await twitter.login();

    postHandlers.twitter = (post) => {
      twitter.post(client, post);
    };
  } catch (e) {
    console.log("[ERROR] Twitter:\n", e);
  }

  // masto
  try {
    const client = await masto.login();

    postHandlers.masto = (post) => {
      masto.post(client, post);
    };
  } catch (e) {
    console.log("[ERROR] Masto:\n", e);
  }

  // tumblr
  try {
    const client = await tumblr.login();

    postHandlers.tumblr = (post) => {
      tumblr.post(client, post);
    };
  } catch (e) {
    console.log("[ERROR] Tumblr:\n", e);
  }

  return postHandlers;
}
