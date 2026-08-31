/* note: this file are Supported via standard programming aids */

import { Buffer } from 'node:buffer'
import { TOTP, Secret } from 'otpauth'
import { Feed } from 'feed'
import { USER_AGENT } from '../const.ts'

const { fromHex } = Secret

const R1 = (x: string) => x + 'ify'
const R2 = (x: string) => `https://${x}.${R1('spot')}.com`
const CLIENT_VERSION = '1.2.62.403.g450c6e1e'
const REFERER = `${R2('open')}/`
const MIKO = 35
const MI = 3
const KO = 5
const BUTTER_CUP = [
  [[2, 2, 13759], 56],
  [[2, 31, 739], 33],
  [[2, 3, 23, 353], 17],
  [2, 3, 3, 73, 73],
  [2, 3, 5, 1621],
  [2, 3, 11, 499],
  [[-28], 46],
]

function genRandomMd5(): string {
  const buf = Buffer.alloc(16)
  crypto.getRandomValues(buf)
  return buf.toString('hex')
}

export function getSanityIdAt(timestamp: number) {
  const mikoCode = BUTTER_CUP.map((x) => {
    if (Array.isArray(x[0])) {
      return x[0].reduce((a, b) => a * b, 1) + MIKO
    } else {
      return (x as number[]).reduce((a, b) => a * b, 1)
    }
  })
    .map((x) =>
      String(x)
        .split('')
        .reduce((a, b) => {
          return String(
            Number(a) * (MIKO - MI * KO) * KO + MIKO - KO + Number(b)
          )
        }, '0')
    )
    .join('')
  const totp = new TOTP({
    algorithm: 'SHA1',
    period: 30,
    digits: 6,
    secret: fromHex(mikoCode),
  })
  return totp.generate({
    timestamp,
  })
}

function getSanityStatement() {
  const clientTimeMs = Number(new Date())
  const serverTimeTs = Math.floor(clientTimeMs / 1000 - 1)
  const serverTimeMs = serverTimeTs * 1000
  return {
    reason: 'init',
    productType: 'web-player',
    totp: getSanityIdAt(clientTimeMs),
    totpServer: getSanityIdAt(serverTimeMs),
    totpVer: '5',
    sTime: String(serverTimeTs),
    cTime: String(clientTimeMs),
  }
}

export function getSanityToken(): Promise<string> {
  const sanityStatement = getSanityStatement()
  const base = new URL(`${R2('open')}/get_access_token`)
  for (const [key, val] of Object.entries(sanityStatement)) {
    base.searchParams.set(key, val)
  }
  return fetch(base)
    .then((x) => x.json())
    .then((x) => x.accessToken)
}

function getClientToken(): Promise<string> {
  return fetch(`${R2('clienttoken')}/v1/clienttoken`, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    referrer: REFERER,
    body: JSON.stringify({
      client_data: {
        client_version: CLIENT_VERSION,
        client_id: 'd8a5ed958d274c2e8ee717e6a4b0971d',
        js_sdk_data: {
          device_brand: 'unknown',
          device_model: 'unknown',
          device_id: genRandomMd5(),
          device_type: 'computer',
          os: 'windows',
          os_version: 'NT 10.0',
        },
      },
    }),
  })
    .then((x) => x.json())
    .then((x) => x.granted_token.token)
}

class SpotifyUtils {
  #initialized = false
  #clientToken = ''
  #sanityToken = ''

  async ensureInit() {
    if (this.#initialized) return

    this.#clientToken = await getClientToken()
    this.#sanityToken = await getSanityToken()
    this.#initialized = true
  }

  #buildRequestHeader() {
    return {
      Accept: 'application/json',
      'Accept-Language': 'en',
      authorization: `Bearer ${this.#sanityToken}`,

      'content-type': 'application/json;charset=UTF-8',
      'client-token': this.#clientToken,
      [`${R1('spot')}-app-version`]: CLIENT_VERSION,
      'app-platform': 'WebPlayer',
      'User-Agent': USER_AGENT,
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
    }
  }

  #buildPathfinderQuery(
    op: string,
    uri: string,
    offset: number,
    limit: number
  ) {
    const url = new URL(
      [R2(['api', 'partner'].join('-')), 'pathfinder', 'v1', 'query'].join('/')
    )
    url.searchParams.set('operationName', op)
    url.searchParams.set(
      'variables',
      JSON.stringify({
        uri,
        offset,
        limit,
        enableWatchFeedEntrypoint: false,
      })
    )
    url.searchParams.set(
      'extensions',
      atob(
        'eyJwZXJzaXN0ZWRRdWVyeSI6' + //
          'eyJ2ZXJzaW9uIjoxLCJzaGEy' + //
          'NTZIYXNoIjoiNzNlNTJhMjQ3Njc2Z' +
          'mFlOTUzODU2NzQ3ZGQ3ZjQzYTE5Mz' +
          'gzZjE5NjllOTcwYTJjNmQzMTM5M2Q' +
          'yYjM1MTg3ZSJ9fQ=='
      )
    )
    return fetch(url, {
      headers: this.#buildRequestHeader(),
      referrer: REFERER,
    })
  }

  async *getSpotifyPlaylist(playlistId: string) {
    let totalCount = Infinity
    let offset = 0
    const limit = 25

    while (offset < totalCount) {
      const payload = await this.#buildPathfinderQuery(
        'fetchPlaylist',
        `spotify:playlist:${playlistId}`,
        offset,
        limit
      ).then((x) => x.json())
      if (totalCount === Infinity) {
        totalCount = payload.data.playlistV2.content.totalCount
      }
      yield* payload.data.playlistV2.content.items
      offset += 25
    }
  }

  async buildSpotifyPlaylist(playlistId: string, feed: Feed) {
    await this.ensureInit()
    let itemCount = 0

    for await (const i of this.getSpotifyPlaylist(playlistId)) {
      const {
        addedAt: { isoString },
      } = i
      const { uri, name, artists } = i.itemV2.data

      const artistNames = artists.items
        .map((x: any) => x.profile.name)
        .join(', ')
      console.log([R2('open'), ...uri.split(':').slice(1)].join('/'))
      feed.addItem({
        id: uri,
        title: `${name} by ${artistNames}`,
        date: new Date(isoString),
        link: [R2('open'), ...uri.split(':').slice(1)].join('/'),
        description: `New release by ${artistNames}: "${name}"`,
        author: artists.items.map((x: any) => ({
          name: x.profile.name,
        })),
      })
      itemCount += 1
      if (itemCount > 15) {
        break
      }
    }
  }
}

export default new SpotifyUtils()
