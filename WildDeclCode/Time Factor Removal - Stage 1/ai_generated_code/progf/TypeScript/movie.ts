// Aided with basic GitHub coding tools 2024-01-17 10:45

export interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: number
}

var MovieTypes = {
  MovieType: {} as Movie
};

export type MovieType = Movie;
module.exports = MovieTypes;
