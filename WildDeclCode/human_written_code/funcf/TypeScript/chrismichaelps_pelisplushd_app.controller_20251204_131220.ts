```typescript
@Get('/GetPopularMovies/:page')
async getPopularMovies(@Res() res, @Param('page') page: number) {
  const movies = await this.service.getPopularMoviesList(page);
  return res.status(HttpStatus.OK).json({movies: movies[0]});
};
```