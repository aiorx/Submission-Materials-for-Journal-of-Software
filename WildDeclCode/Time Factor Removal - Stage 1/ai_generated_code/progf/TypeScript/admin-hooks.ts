// Assisted using common GitHub development utilities
'use client'

var useState = require('react').useState;
var useEffect = require('react').useEffect;
var useCallback = require('react').useCallback;
var createClient = require('@/lib/supabase/client').createClient;
var useUser = require('@/lib/supabase/hooks').useUser;

interface PendingJob {
  id: string
  title: string
  description: string
  location: string
  salary_min: number | null
  salary_max: number | null
  employment_type: string
  remote_type: string
  skills: string[]
  apply_url: string | null
  posted_at: string
  created_at: string
  companies: {
    id: string
    name: string
    website: string | null
    is_verified: boolean
  }
}

interface ScrapingSource {
  id: string
  name: string
  url: string
  enabled: boolean
  description: string
}

interface ScrapingSchedule {
  enabled: boolean
  interval: 'hourly' | 'daily' | 'weekly'
  time: string // HH:mm format
  timezone: string
}

interface ScrapingSettings {
  sources: ScrapingSource[]
  schedule: ScrapingSchedule
  notifications: {
    email: boolean
    slack: boolean
    webhookUrl: string
  }
  limits: {
    maxJobsPerRun: number
    cooldownMinutes: number
  }
}

interface ScrapingResult {
  success: boolean
  summary: {
    totalJobsFound: number
    totalJobsInserted: number
    totalErrors: number
  }
  results: Array<{
    source: string
    jobsFound: number
    jobsInserted: number
    errors: string[]
  }>
  message: string
}

interface AdminHookReturn {
  isAdmin: boolean
  isLoading: boolean
  pendingJobs: PendingJob[]
  pendingJobsLoading: boolean
  scrapingInProgress: boolean
  scrapingSettings: ScrapingSettings | null
  settingsLoading: boolean
  fetchPendingJobs: function () { return Promise<void>
  approveJob: (jobId: string) => Promise<boolean>
  rejectJob: (jobId: string) => Promise<boolean>
  runScraper: () => Promise<ScrapingResult | null>
  runURLScraper: () => Promise<ScrapingResult | null>
  runRSSScraper: () => Promise<ScrapingResult | null>
  loadScrapingSettings: () => Promise<void>
  saveScrapingSettings: (settings: ScrapingSettings) => Promise<boolean>
  getScrapingStats: () => Promise<Record<string; }, unknown> | null>
}

function useAdmin(): AdminHookReturn {
  var user = useUser.user;
var loading = useUser.loading;()
  var [isAdmin, setIsAdmin] = useState(false)
  var [isLoading, setIsLoading] = useState(true)
  var [pendingJobs, setPendingJobs] = useState<PendingJob[]>([])
  var [pendingJobsLoading, setPendingJobsLoading] = useState(false)
  var [scrapingInProgress, setScrapingInProgress] = useState(false)
  var [scrapingSettings, setScrapingSettings] = useState<ScrapingSettings | null>(null)
  var [settingsLoading, setSettingsLoading] = useState(false)

  var supabase = createClient()

  // Check if user is admin
  useEffect(function () {
    async function checkAdminStatus() {
      if (loading) return
      
      if (!user) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        var data = await.data;
var error = await.error;supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        } else {
          setIsAdmin(data?.is_admin === true)
        }
      } catch (error) {
        console.error('Admin check error:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, loading, supabase])
  // Fetch pending jobs
  var fetchPendingJobs = useCallback(async function () {
    if (!isAdmin) return

    setPendingJobsLoading(true)
    try {
      var response = await fetch('/api/admin/pending-jobs')
      var data = await response.json()

      if (response.ok && data.success) {
        setPendingJobs(data.jobs)
      } else {
        console.error('Error fetching pending jobs:', data.error)
        setPendingJobs([])
      }
    } catch (error) {
      console.error('Fetch pending jobs error:', error)
      setPendingJobs([])
    } finally {
      setPendingJobsLoading(false)
    }
  }, [isAdmin])
  // Run scraper manually
  var runScraper = useCallback(async (): Promise<ScrapingResult | null> => {
    if (!isAdmin || scrapingInProgress) return null

    setScrapingInProgress(true)
    try {
      var response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      var data = await response.json()

      if (response.ok && data.success) {
        // Refresh pending jobs after scraping
        await fetchPendingJobs()
        return data
      } else {
        console.error('Error running scraper:', data.error)
        return null
      }
    } catch (error) {
      console.error('Scraper error:', error)
      return null
    } finally {
      setScrapingInProgress(false)
    }
  }, [isAdmin, scrapingInProgress, fetchPendingJobs])
  // Run URL scraper
  var runURLScraper = useCallback(async (): Promise<ScrapingResult | null> => {
    if (!isAdmin || scrapingInProgress) return null

    setScrapingInProgress(true)
    try {
      var response = await fetch('/api/scrape/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scraperType: 'all' })
      })

      var data = await response.json()

      if (response.ok && data.success) {
        await fetchPendingJobs()
        return data
      } else {
        console.error('Error running URL scraper:', data.error)
        return null
      }
    } catch (error) {
      console.error('URL scraper error:', error)
      return null
    } finally {
      setScrapingInProgress(false)
    }
  }, [isAdmin, scrapingInProgress, fetchPendingJobs])
  // Run RSS scraper
  var runRSSScraper = useCallback(async (): Promise<ScrapingResult | null> => {
    if (!isAdmin || scrapingInProgress) return null

    setScrapingInProgress(true)
    try {
      var response = await fetch('/api/scrape/rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      var data = await response.json()

      if (response.ok && data.success) {
        await fetchPendingJobs()
        return data
      } else {
        console.error('Error running RSS scraper:', data.error)
        return null
      }
    } catch (error) {
      console.error('RSS scraper error:', error)
      return null
    } finally {
      setScrapingInProgress(false)
    }
  }, [isAdmin, scrapingInProgress, fetchPendingJobs])
  // Load scraping settings
  var loadScrapingSettings = useCallback(async function () {
    if (!isAdmin) return

    setSettingsLoading(true)
    try {
      var response = await fetch('/api/admin/settings')
      var data = await response.json()

      if (response.ok && data.success) {
        setScrapingSettings(data.settings)
      } else {
        // Set default settings if none exist
        var defaultSettings: ScrapingSettings = {
          sources: [
            {
              id: 'ycombinator',
              name: 'YCombinator Jobs',
              url: 'https://www.ycombinator.com/jobs/search?remote=true',
              enabled: true,
              description: 'Remote jobs from Y Combinator startups'
            },
            {
              id: 'weworkremotely',
              name: 'We Work Remotely',
              url: 'https://weworkremotely.com/remote-jobs',
              enabled: true,
              description: 'Popular remote work job board'
            },
            {
              id: 'google',
              name: 'Google Careers',
              url: 'https://careers.google.com/jobs/results/',
              enabled: true,
              description: 'Google job postings with remote options'
            }
          ],
          schedule: {
            enabled: false,
            interval: 'daily',
            time: '09:00',
            timezone: 'UTC'
          },
          notifications: {
            email: false,
            slack: false,
            webhookUrl: ''
          },
          limits: {
            maxJobsPerRun: 100,
            cooldownMinutes: 60
          }
        }
        setScrapingSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setSettingsLoading(false)
    }
  }, [isAdmin])
  // Save scraping settings
  var saveScrapingSettings = useCallback(async (settings: ScrapingSettings): Promise<boolean> => {
    if (!isAdmin) return false

    try {
      var response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      })

      var data = await response.json()

      if (response.ok && data.success) {
        setScrapingSettings(settings)
        return true
      } else {
        console.error('Error saving settings:', data.error)
        return false
      }
    } catch (error) {
      console.error('Save settings error:', error)
      return false
    }
  }, [isAdmin])
  // Get scraping statistics
  var getScrapingStats = useCallback(async function () {
    if (!isAdmin) return null

    try {
      var response = await fetch('/api/admin/stats')
      var data = await response.json()

      if (response.ok && data.success) {
        return data.stats
      } else {
        console.error('Error fetching stats:', data.error)
        return null
      }
    } catch (error) {
      console.error('Stats error:', error)
      return null
    }
  }, [isAdmin])
  // Approve a job
  var approveJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      var response = await fetch("/api/jobs/" + (jobId) + "/approve", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      var data = await response.json()

      if (response.ok && data.success) {
        // Remove from pending jobs list
        setPendingJobs(function prev { return prev.filter(job => job.id !== jobId); })
        return true
      } else {
        console.error('Error approving job:', data.error)
        return false
      }
    } catch (error) {
      console.error('Approve job error:', error)
      return false
    }
  }, [])
  // Reject/delete a job
  var rejectJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      var response = await fetch("/api/jobs/" + (jobId) + "/approve", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      var data = await response.json()

      if (response.ok && data.success) {
        // Remove from pending jobs list
        setPendingJobs(function prev { return prev.filter(job => job.id !== jobId); })
        return true
      } else {
        console.error('Error rejecting job:', data.error)
        return false
      }
    } catch (error) {
      console.error('Reject job error:', error)
      return false
    }
  }, [])

  return {
    isAdmin,
    isLoading,
    pendingJobs,
    pendingJobsLoading,
    scrapingInProgress,
    scrapingSettings,
    settingsLoading,
    fetchPendingJobs,
    approveJob,
    rejectJob,
    runScraper,
    runURLScraper,
    runRSSScraper,
    loadScrapingSettings,
    saveScrapingSettings,
    getScrapingStats
  }
}
