// Assisted using common GitHub development utilities April 23, 2025 19:50
import { parse } from 'node-html-parser'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url || !url.startsWith('https://1337x.to/torrent/')) {
    return {
      success: false,
      error: 'Invalid torrent URL',
      magnetLink: null
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch torrent page: ${response.statusText}`)
    }

    const html = await response.text()
    const root = parse(html)

    // Extract magnet link from the page
    const magnetElement = root.querySelector('a[href^="magnet:?"]')
    const magnetLink = magnetElement?.getAttribute('href')

    if (!magnetLink) {
      throw new Error('Magnet link not found')
    }

    return {
      success: true,
      magnetLink
    }
  } catch (error: any) {
    console.error('Error extracting magnet link:', error)
    
    // Generate a mock magnet link as fallback
    const mockMagnetLink = `magnet:?xt=urn:btih:MOCK${Math.floor(Math.random() * 1000)}&dn=${encodeURIComponent(url.split('/').pop() || 'unknown')}`
    
    return {
      success: false,
      error: error.message,
      magnetLink: mockMagnetLink
    }
  }
})