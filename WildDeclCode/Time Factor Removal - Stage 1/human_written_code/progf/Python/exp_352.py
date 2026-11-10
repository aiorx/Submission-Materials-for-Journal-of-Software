import math
import time
import requests
import json
import asyncio
from pyrogram import filters
from pyrogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from thebot import dankbot

from thebot.utils.errors import capture_err

def shorten(description, info='anilist.co'):
    ms_g = ""
    if len(description) > 700:
        description = description[0:500] + '....'
        ms_g += "
**Description**: __{}__[Read More]({})".format(description, info)
    else:
        ms_g += "
**Description**: __{}__".format(description)
    return (
        ms_g.replace("<br>", "")
        .replace("</br>", "")
        .replace("<i>", "")
        .replace("</i>", "")
    )


# time formatter from uniborg
def t(milliseconds: int) -> str:
    """Inputs time in milliseconds, to get beautified time,
    as string"""
    seconds, milliseconds = divmod(int(milliseconds), 1000)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    tmp = ((str(days) + " Days, ") if days else "") + \
        ((str(hours) + " Hours, ") if hours else "") + \
        ((str(minutes) + " Minutes, ") if minutes else "") + \
        ((str(seconds) + " Seconds, ") if seconds else "") + \
        ((str(milliseconds) + " ms, ") if milliseconds else "")
    return tmp[:-2]


airing_query = '''
    query ($id: Int,$search: String) { 
      Media (id: $id, type: ANIME,search: $search) { 
        id
        episodes
        title {
          romaji
          english
          native
        }
        siteUrl
        nextAiringEpisode {
           airingAt
           timeUntilAiring
           episode
        } 
      }
    }
    '''

fav_query = """
query ($id: Int) { 
      Media (id: $id, type: ANIME) { 
        id
        title {
          romaji
          english
          native
        }
     }
}
"""

anime_query = '''
   query ($id: Int,$search: String) { 
      Media (id: $id, type: ANIME,search: $search) { 
        id
        idMal
        title {
          romaji
          english
          native
        }
        description (asHtml: false)
        startDate{
            year
          }
          episodes
          season
          type
          format
          status
          duration
          siteUrl
          studios{
              nodes{
                   name
              }
          }
          trailer{
               id
               site 
               thumbnail
          }
          averageScore
          genres
          bannerImage
      }
    }
'''
character_query = """
    query ($query: String) {
        Character (search: $query) {
               id
               name {
                     first
                     last
                     full
               }
               siteUrl
               favourites
               image {
                        large
               }
               description
        }
    }
"""

manga_query = """
query ($id: Int,$search: String) { 
      Media (id: $id, type: MANGA,search: $search) { 
        id
        title {
          romaji
          english
          native
        }
        description (asHtml: false)
        startDate{
            year
          }
          type
          format
          status
          siteUrl
          averageScore
          genres
          bannerImage
      }
    }
"""


url = 'https://graphql.anilist.co'


@dankbot.on_message(~filters.me & filters.command('airinfo', prefixes='/'), group=8)
@capture_err
async def anime_airing(_client, message):
    search_str = message.text.split(' ', 1)
    if len(search_str) == 1:
        await message.reply_text('Provide anime name!')
        return
    variables = {'search': search_str[1]}
    response = requests.post(
        url, json={'query': airing_query, 'variables': variables}).json()['data']['Media']
    ms_g = "**Name**: **{}**(`{}`)
**ID**: `{}`".format(response['title']['romaji'], response['title']['native'], response['id'])
    if response['nextAiringEpisode']:
        airing_time = response['nextAiringEpisode']['timeUntilAiring'] * 1000
        airing_time_final = t(airing_time)
        ms_g += "
**Episode**: `{}`
**Airing In**: `{}`".format(response['nextAiringEpisode']['episode'], airing_time_final)
    else:
        ms_g += "
**Episode**:{}
**Status**: `N/A`".format(response['episodes'])
    await message.reply_text(ms_g)


@dankbot.on_message(~filters.me & filters.command('animeinfo', prefixes='/'), group=8)
@capture_err
async def anime_search(client, message):
    search = message.text.split(' ', 1)
    if len(search) == 1:
        await message.delete()
        return
    else:
        search = search[1]
    variables = {'search': search}
    json = requests.post(url, json={'query': anime_query, 'variables': variables}).json()[
        'data'].get('Media', None)
    if json:
        msg = "**{}**(`{}`)
**Type**: {}
**Status**: {}
**Episodes**: {}
**Duration**: {} Per Ep.
**Score**: {}
**Genres**: `".format(json['title']['romaji'], json['title']['native'], json['format'], json['status'], json.get('episodes', 'N/A'), json.get('duration', 'N/A'), json['averageScore'])
        for x in json['genres']:
            msg += "{}, ".format(x)
        msg = msg[:-2] + '`\n'
        msg += "**Studios**: `"
        for x in json['studios']['nodes']:
            msg += "{}, ".format(x['name'])
        msg = msg[:-2] + '`\n'
        info = json.get('siteUrl')
        trailer = json.get('trailer', None)
        if trailer:
            trailer_id = trailer.get('id', None)
            site = trailer.get('site', None)
            if site == "youtube":
                trailer = 'https://youtu.be/' + trailer_id
        description = json.get(
            'description', 'N/A').replace('<i>', '').replace('</i>', '').replace('<br>', '')
        msg += shorten(description, info)
        image = info.replace('anilist.co/anime/', 'img.anili.st/media/')
        if trailer:
            buttons = [
                    [InlineKeyboardButton("More Info", url=info),
                    InlineKeyboardButton("Trailer 🎬", url=trailer)]
                    ]
        else:
            buttons = [
                    [InlineKeyboardButton("More Info", url=info)]
                    ]
        if image:
            try:
                await message.reply_photo(image, caption=msg, reply_markup=InlineKeyboardMarkup(buttons))
            except:
                msg += " [〽️]({})".format(image)             await message.edit(msg)
        else:
            await message.edit(msg)



@dankbot.on_message(~filters.me & filters.command('charinfo', prefixes='/'), group=8)
@capture_err
async def character_search(client, message):
    search = message.text.split(' ', 1)
    if len(search) == 1:
        await message.delete()
        return
    search = search[1]
    variables = {'query': search}
    json = requests.post(url, json={'query': character_query, 'variables': variables}).json()[
        'data'].get('Character', None)
    if json:
        ms_g = "**{}**(`{}`)
".format(json.get('name').get('full'), json.get('name').get('native'))
        description = "{}".format(json['description'])
        site_url = json.get('siteUrl')
        ms_g += shorten(description, site_url)
        image = json.get('image', None)
        if image:
            image = image.get('large')
            await message.reply_photo(image, caption=ms_g)
        else:
            await message.reply(ms_g)


@dankbot.on_message(~filters.me & filters.command('mangainfo', prefixes='/'), group=8)
@capture_err
async def manga_search(client, message):
    search = message.text.split(' ', 1)
    if len(search) == 1:
        await message.delete()
        return
    search = search[1]
    variables = {'search': search}
    json = requests.post(url, json={'query': manga_query, 'variables': variables}).json()[
        'data'].get('Media', None)
    ms_g = ''
    if json:
        title, title_native = json['title'].get(
            'romaji', False), json['title'].get('native', False)
        start_date, status, score = json['startDate'].get('year', False), json.get(
            'status', False), json.get('averageScore', False)
        if title:
            ms_g += "**{}**".format(title)
            if title_native:
                ms_g += "(`{}`)".format(title_native)
        if start_date:
            ms_g += "
**Start Date** - `{}`".format(start_date)
        if status:
            ms_g += "
**Status** - `{}`".format(status)
        if score:
            ms_g += "
**Score** - `{}`".format(score)
        ms_g += '\n**Genres** - '
        for x in json.get('genres', []):
            ms_g += "{}, ".format(x)
        ms_g = ms_g[:-2]

        image = json.get("bannerImage", False)
        ms_g += "_{}_".format(json.get('description', None))
        if image:
            try:
                await message.reply_photo(image, caption=ms_g)
            except:
                ms_g += " [〽️]({})".format(image)             await message.reply(ms_g)
        else:
            await message.reply(ms_g)

