// Aided with basic GitHub coding tools April 23, 2025 19:35
export const useTorrentClient = () => {
  const config = useRuntimeConfig()
  
  // Use proxy path instead of direct URL to avoid CORS issues
  const qb = $fetch.create({
    baseURL: '/qbittorrent/api/v2',
    credentials: 'include'
  })

  const login = async () => {
    await qb('/auth/login', {
      method: 'POST',
      body: new URLSearchParams({
        username: config.public.qBittorrentUsername || 'admin',
        password: config.public.qBittorrentPassword || ''
      })
    })
  }

  const add = async (url: string) => {
    const form = new FormData()
    form.append('urls', url)
    form.append('savepath', config.public.downloadsPath || '/downloads')
    await qb('/torrents/add', {
      method: 'POST',
      body: form
    })
  }

  return { login, add }
}