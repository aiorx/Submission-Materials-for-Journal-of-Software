// Aided with basic GitHub coding tools 2025-04-23 16:40
var defineStore = require('pinia').defineStore;
var axios = require('axios');

// Define Movie interface inline instead of importing it
export interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: number
}

export interface Genre {
  id: number
  name: string
}

var useMoviesStore = defineStore('movies', {
  state: function () { return ({
    trendingMovies: [] as Movie[],
    popularMovies: [] as Movie[],
    searchResults: [] as Movie[],
    genreMovies: [] as Movie[],
    genres: [] as Genre[],
    selectedMovie: null as Movie | null,
    loading: false,
    recommendedMovies: [] as Movie[],
    recommendationsLoading: false,
    error: null as string | null,
    currentGenreId: null as number | null,
    totalGenrePages: 1
  }); },
  
  actions: {
    async fetchTrending() {
      var config = useRuntimeConfig()
      try {
        this.loading = true
        var response = await axios.get("" + (config.public.tmdbApiBaseUrl) + "/trending/movie/week", {
          params: {
            api_key: config.public.tmdbApiKey
          }
        })
        this.trendingMovies = response.data.results
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchTrendingPage(page: number) {
      var config = useRuntimeConfig()
      try {
        this.loading = true
        var response = await axios.get("" + (config.public.tmdbApiBaseUrl) + "/trending/movie/week", {
          params: {
            api_key: config.public.tmdbApiKey,
            page
          }
        })
        // Append new results without duplicates
        var newMovies = response.data.results.filter(function (movie: Movie) { return !this.trendingMovies.some(existingMovie => existingMovie.id === movie.id); })
        this.trendingMovies = [...this.trendingMovies, ...newMovies]
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async fetchPopular() {
      var config = useRuntimeConfig()
      try {
        this.loading = true
        var response = await axios.get("" + (config.public.tmdbApiBaseUrl) + "/movie/popular", {
          params: {
            api_key: config.public.tmdbApiKey
          }
        })
        this.popularMovies = response.data.results
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchRecommendationsForFavorites(favorites: Movie[]) {
      if (favorites.length === 0) {
        this.recommendedMovies = []
        return
      }

      var config = useRuntimeConfig()
      try {
        this.recommendationsLoading = true
        var unique = new Map<number, Movie>()

        await Promise.all(
          favorites.map(async function fav {
            var response = await axios.get(
              "" + (config.public.tmdbApiBaseUrl) + "/movie/" + (fav.id) + "/recommendations",
              {
                params: { api_key: config.public.tmdbApiKey }
              }
            )
            var results: Movie[] = response.data.results || []
            results.forEach(movie => {
              if (!favorites.some(f => f.id === movie.id) && !unique.has(movie.id)) {
                unique.set(movie.id, movie)
              }
            })
          })
        )

        this.recommendedMovies = Array.from(unique.values())
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.recommendationsLoading = false
      }
    },

    clearSearch() {
      this.searchResults = []
      this.error = null
    },

    async searchMovies(query: string) {
      if (!query) {
        this.searchResults = []
        return
      }

      var config = useRuntimeConfig()
      try {
        this.loading = true
        this.error = null

        // Search for movies by title and people (actors/directors) simultaneously
        var [movieResponse, personResponse] = await Promise.all([
          axios.get("" + (config.public.tmdbApiBaseUrl) + "/search/movie", {
            params: {
              api_key: config.public.tmdbApiKey,
              query
            }
          }),
          axios.get("" + (config.public.tmdbApiBaseUrl) + "/search/person", {
            params: {
              api_key: config.public.tmdbApiKey,
              query
            }
          })
        ])

        var uniqueMovies = new Map<number, Movie>()

        // Find the most relevant person (actor/director) for the query
        var lowerQuery = query.toLowerCase()
        var person = personResponse.data.results?.find(function (p: any) { return ['Directing', 'Acting'].includes(p.known_for_department) &&
          p.name.toLowerCase().includes(lowerQuery); }) || (personResponse.data.results == null ? undefined : personResponse.data.results[0])

        // If a matching person is found, fetch their movie credits first
        if (person) {
          var creditsResponse = await axios.get(
            "" + (config.public.tmdbApiBaseUrl) + "/person/" + (person.id) + "/movie_credits",
            {
              params: {
                api_key: config.public.tmdbApiKey
              }
            }
          )

          var castMovies = (creditsResponse.data.cast || []) as Movie[]
          var directedMovies = (creditsResponse.data.crew || [])
            .filter(function (c: any) { return c.job === 'Director'; }) as Movie[]

          ;[...castMovies, ...directedMovies].forEach(function movie {
            uniqueMovies.set(movie.id, movie)
          })
        }

        // Now append movie title search results without duplicates
        var movieResults = movieResponse.data.results as Movie[]
        movieResults.forEach(function movie {
          if (!uniqueMovies.has(movie.id)) {
            uniqueMovies.set(movie.id, movie)
          }
        })

        this.searchResults = Array.from(uniqueMovies.values())
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchGenres() {
      var config = useRuntimeConfig()
      try {
        this.loading = true
        var response = await axios.get("" + (config.public.tmdbApiBaseUrl) + "/genre/movie/list", {
          params: {
            api_key: config.public.tmdbApiKey
          }
        })
        this.genres = response.data.genres
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchMoviesByGenre(genreId: number, page: number = 1) {
      var config = useRuntimeConfig()
      try {
        this.loading = true
        this.currentGenreId = genreId
        
        var response = await axios.get("" + (config.public.tmdbApiBaseUrl) + "/discover/movie", {
          params: {
            api_key: config.public.tmdbApiKey,
            with_genres: genreId,
            sort_by: 'popularity.desc,release_date.desc', // Show trending movies first, then by newest release date
            'vote_count.gte': 50, // Ensure some minimum popularity
            page,
            include_adult: false
          }
        })
        
        this.genreMovies = response.data.results
        this.totalGenrePages = response.data.total_pages
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
