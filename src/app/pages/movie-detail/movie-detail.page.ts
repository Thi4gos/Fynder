import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {
  movieId!: number;
  movie: any;
  movieGenres: string = ''; // Armazena gêneros formatados
  cast: any[] = [];
  trailers: any[] = [];
  isFavorite: boolean = false;
  userRating: string | null = null;
  watchProviders: any[] = []; // Provedores de streaming
  certification: string | null = null; // Para armazenar a classificação indicativa

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) { }

  ngOnInit() {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovieDetails();
    this.loadMovieCredits();
    this.loadMovieTrailers();
    this.loadWatchProviders();
    this.loadMovieCertification(); // Carrega a classificação etária do filme
  }

  loadMovieDetails() {
    this.tmdbService.getMovieDetails(this.movieId).subscribe((response: any) => {
      this.movie = response;
      this.movieGenres = this.movie.genres.map((genre: any) => genre.name).join(', ');
    });
  }

  loadMovieCertification() {
    this.tmdbService.getMovieCertification(this.movieId).subscribe((response: any) => {
      const brCertification = response.results.find((cert: any) => cert.iso_3166_1 === 'BR');
      this.certification = brCertification ? brCertification.release_dates[0].certification : 'N/A';
    });
  }

  loadMovieCredits() {
    this.tmdbService.getMovieCredits(this.movieId).subscribe((response: any) => {
      this.cast = response.cast;
    });
  }

  loadMovieTrailers() {
    this.tmdbService.getMovieTrailers(this.movieId).subscribe((response: any) => {
      this.trailers = response.results.filter((video: any) => video.type === 'Trailer');
    });
  }

  loadWatchProviders() {
    this.tmdbService.getMovieWatchProviders(this.movieId).subscribe((response: any) => {
      if (response.results.BR) {
        this.watchProviders = response.results.BR.flatrate || [];
      }
    });
  }

  openTrailer(videoKey: string) {
    window.open(`https://www.youtube.com/watch?v=${videoKey}`, '_blank');
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  rateMovie(rating: string) {
    this.userRating = rating;
  }
}
