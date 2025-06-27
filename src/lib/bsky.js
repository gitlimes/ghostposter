import { AtpAgent, RichText } from "@atproto/api";
import sharp from "sharp";

export async function login() {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER,
    password: process.env.BSKY_PASSWORD,
  });

  return agent;
}

export async function post(agent, blogpost, imageQuality = 100) {
  try {
    const formattedPost = `${blogpost.title}\n\n${blogpost.url}`;

    const blob = await fetch(blogpost.feature_image).then((r) => r.blob());

    const compressedImage = await sharp(await blob.arrayBuffer())
      .resize(1200, 675)
      .jpeg({ quality: imageQuality })
      .toBuffer();

    const { data } = await agent.uploadBlob(compressedImage, {
      encoding: "image/jpeg",
    });

    const rt = new RichText({
      text: formattedPost,
    });
    await rt.detectFacets(agent);

    await agent.post({
      $type: "app.bsky.feed.post",
      text: rt.text,
      facets: rt.facets,
      langs: ["en-US"],
      embed: {
        $type: "app.bsky.embed.external",
        external: {
          uri: blogpost.url,
          title: blogpost.title,
          description: blogpost.excerpt,
          thumb: data.blob,
        },
      },

      createdAt: new Date().toISOString(),
    });

    console.log(`[INFO] Bsky: posted ${blogpost.title}`);
  } catch (e) {
    // if the image is too large we set a lower compression level
    if (e.error === "BlobTooLarge") {
      console.log(
        `[WARN] Bsky: image too large, retrying with compression level ${
          imageQuality - 15
        }`
      );
      await post(agent, blogpost, imageQuality - 15);
    } else {
      console.log("[ERROR] Bsky:\n", e);
    }
  }
}
