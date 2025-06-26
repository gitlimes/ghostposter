import { AtpAgent, RichText } from '@atproto/api'

export async function login() {
    const agent = new AtpAgent({
        service: 'https://bsky.social'
    })
    await agent.login({
        identifier: process.env.BSKY_IDENTIFIER,
        password: process.env.BSKY_PASSWORD
    })

    return agent;
}

export async function post(agent, post) {
    const formattedPost = `${post.title}\n\n${post.url}`

    const blob = await fetch(post.feature_image).then(r => r.blob())
    const { data } = await agent.uploadBlob(blob, { encoding: "image/jpeg" })

    const rt = new RichText({
        text: formattedPost
    })
    await rt.detectFacets(agent);

    await agent.post({
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        langs: ["en-US"],
        embed: {
            $type: "app.bsky.embed.external",
            external: {
                uri: post.url,
                title: post.title,
                description: post.excerpt,
                thumb: data.blob,
            },
        },

        createdAt: new Date().toISOString()
    })

    console.log(`Bsky : posted ${post.title}`)
}
