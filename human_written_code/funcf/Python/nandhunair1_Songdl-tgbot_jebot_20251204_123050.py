```python
@Jebot.on_message(filters.edited & filters.group & ~filters.command("help") & ~filters.command("start"))
async def song(client, message):
 #tvseriezzz_music #tvseriezzz_music
    cap = "@tvseriezzz_music"
    url = message.text
    rkp = await message.reply("Processing...")
    search = SearchVideos(url, offset=1, mode="json", max_results=1)
    test = search.result()
    p = json.loads(test)
    q = p.get("search_result")
    try:
        url = q[0]["link"]
    except BaseException:
        return await rkp.edit("Failed to find that song.")
    type = "audio"
    if type == "audio":
        opts = {
            "format": "bestaudio",
            "addmetadata": True,
            "key": "FFmpegMetadata",
            "writethumbnail": True,
            "prefer_ffmpeg": True,
            "geo_bypass": True,
            "nocheckcertificate": True,
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "320",
                }
            ],
            "outtmpl": "%(id)s.mp3",
            "quiet": True,
            "logtostderr": False,
        }
        song = True
    try:
        await rkp.edit("Downloading...[🎧](https://te.legra.ph/file/c3dce12116a0a8af80c93.jpg)")
        with YoutubeDL(opts) as rip:
            rip_data = rip.extract_info(url)
    except DownloadError as DE:
        await rkp.edit(f"`{str(DE)}`")
        return
    except ContentTooShortError:
        await rkp.edit("`The download content was too short.`")
        return
    except GeoRestrictedError:
        await rkp.edit(
            "`Video is not available from your geographic location due to geographic restrictions imposed by a website.`"
        )
        return
    except MaxDownloadsReached:
        await rkp.edit("`Max-downloads limit has been reached.`")
        return
    except PostProcessingError:
        await rkp.edit("`There was an error during post processing.`")
        return
    except UnavailableVideoError:
        await rkp.edit("`Media is not available in the requested format.`")
        return
    except XAttrMetadataError as XAME:
        await rkp.edit(f"`{XAME.code}: {XAME.msg}\n{XAME.reason}`")
        return
    except ExtractorError:
        await rkp.edit("`There was an error during info extraction.`")
        return
    except Exception as e:
        await rkp.edit(f"{str(type(e)): {str(e)}}")
        return
    time.time()
    if song:
        await rkp.edit("Uploading....[🎧](https://te.legra.ph/file/c3dce12116a0a8af80c93.jpg)") #tvseriezzz_music
        lol = "./thumb.jpg"
        lel = await message.reply_audio(
            audio=f"{rip_data['id']}.mp3",
            caption=f"🎧 **Song Downloaded**\n\n**Title:** {rip_data['title']}\n**Duration:** {rip_data['duration']} seconds\n\n**Requested by:** {message.from_user.mention}",
            thumb=lol,
        )
        await rkp.delete()
```