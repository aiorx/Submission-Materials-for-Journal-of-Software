```typescript
callback: async ({ client, msg, args, shortMessage, message }) => {
    const { from } = msg
    if (args.length < 1) return msg.error(shortMessage.require.link)
    let json = await getJson(`https://api.lolhuman.xyz/api/spotify?apikey=${lolhuman}&url=${args.join(' ')}`)
    if (json.error) return msg.error(shortMessage.error.nosong)
    let buffer = await getBuffer(json.result.thumbnail)
    let str = `*${json.result.title}* - ${json.result.artists}\n\n\`\`\`Please wait for the song to be sent\`\`\``
    await client.sendMessage(from, { image: buffer, jpegThumbnail: buffer, caption: str })
    return client.sendMessage(from, { audio: { url: json.result.link }, ptt: false }, { quoted: message })
}
```