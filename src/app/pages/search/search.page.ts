import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirebaseAuthService } from 'src/app/services/auth.service';
import { ErrorService } from '../../services/error.service';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  query: string = '';
  popularMovies: any[] = [];
  popularSeries: any[] = [];
  filteredResults: any[] = [];
  filteredSeries: any[] = [];
  selectedGenre: string = 'all';
  genres: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  
  loggedInUser: string | null = null;
  
  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private errorService: ErrorService,
    private authservice: FirebaseAuthService,
  ) {}

  ngOnInit() {
    this.authservice.loggedInUser$.subscribe((email) => {
      this.loggedInUser = email;
    });
  
    this.getPopularMovies();
    this.getPopularSeries();
    this.loadGenres();
  }
  
  
  navigateToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  navigateToSeriesDetails(seriesId: number) {
    this.router.navigate(['/series-detail', seriesId]);
  }

  onSearchInput(event: any) {
    this.query = event.target.value;

    if (this.query.trim() === '') {
      this.filteredResults = this.popularMovies;
      this.filteredSeries = this.popularSeries;
      return;
    }

    this.search();
  }

  search() {
    this.filteredResults = [];
    this.filteredSeries = [];
    this.isLoading = true;
    this.error = null;

    forkJoin({
      movies: this.tmdbService.searchMovies(this.query),
      series: this.tmdbService.searchSeries(this.query),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (results) => {
          this.filteredResults = results.movies.results;
          this.filteredSeries = results.series.results;
          this.applyFilter();
        },
        error: (error) => this.errorService.handleError(error),
      });
  }

  getPopularMovies() {
    this.tmdbService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies = data.results;
        if (this.filteredResults.length === 0 && this.query === '') {
          this.filteredResults = this.popularMovies;
        }
      },
      error: (error) => this.errorService.handleError(error),
    });
  }

  getPopularSeries() {
    this.tmdbService.getPopularSeries().subscribe({
      next: (data) => {
        this.popularSeries = data.results;
        if (this.filteredSeries.length === 0 && this.query === '') {
          this.filteredSeries = this.popularSeries;
        }
      },
      error: (error) => this.errorService.handleError(error),
    });
  }

  filterByGenre(event: any) {
    this.selectedGenre = event.detail.value;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedGenre === 'all') {
      this.filteredResults = this.query ? this.filteredResults : this.popularMovies;
    } else {
      this.filteredResults = this.filteredResults.filter((movie) =>
        movie.genre_ids.includes(Number(this.selectedGenre))
      );
    }

    if (this.selectedGenre === 'all') {
      this.filteredSeries = this.query ? this.filteredSeries : this.popularSeries;
    } else {
      this.filteredSeries = this.filteredSeries.filter((series) =>
        series.genre_ids.includes(Number(this.selectedGenre))
      );
    }
  }

  loadGenres() {
    this.tmdbService.getGenres().subscribe({
      next: (data) => {
        this.genres = data.genres;
      },
      error: (error) => this.errorService.handleError(error),
    });
  }
}
