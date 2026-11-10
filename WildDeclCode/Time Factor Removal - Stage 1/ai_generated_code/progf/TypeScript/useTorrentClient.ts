// Aided with basic GitHub coding tools April 23, 2025 19:35
var useTorrentClient = function () {
  var config = useRuntimeConfig()
  
  // Use proxy path instead of direct URL to avoid CORS issues
  var qb = $fetch.create({
    baseURL: '/qbittorrent/api/v2',
    credentials: 'include'
  })

  var login = async () => {
    await qb('/auth/login', {
      method: 'POST',
      body: new URLSearchParams({
        username: config.public.qBittorrentUsername || 'admin',
        password: config.public.qBittorrentPassword || ''
      })
    })
  }

  var add = async (url: string) => {
    var form = new FormData()
    form.append('urls', url)
    form.append('savepath', config.public.downloadsPath || '/downloads')
    await qb('/torrents/add', {
      method: 'POST',
      body: form
    })
  }

  return { login, add }
}