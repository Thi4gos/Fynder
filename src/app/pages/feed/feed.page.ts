import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { TmdbService } from 'src/app/services/tmdb.service';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  movies: any[] = [];
  genres: any[] = [];
  selectedGenre: number | null = null;
  searchTerm: string = '';
  ratings: { [key: number]: number } = {};
  streamingProviders: { [key: number]: string[] } = {};
  additionalDetails: { [key: number]: any } = {};
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private tmdbService: TmdbService,
    private toastcontroller: ToastService
  ) { }

  ngOnInit() {
    this.getPopularMovies();
    this.getGenres();
  }

  forProfile() {
    this.router.navigate(['/profile']);
  }

  forLogin() {
    this.router.navigate(['/login']);
  }

  forRegistry() {
    this.router.navigate(['/registry']);
  }

  
  getPopularMovies() {
    this.isLoading = true;
    this.tmdbService.getPopularMovies().subscribe(
      {next:(data) => {
        this.movies = data.results;
        this.isLoading = false;
        this.loadWatchProviders();
        // this.loadAdditionalMovieDetails();
      },
      error:(error) => {
        console.error('Erro ao buscar filmes populares: ', error); //TRATAR ERRO
        this.isLoading = false;
      }}
    );
  }

  // Método para buscar gêneros de filmes via TmdbService
  getGenres() {
    this.tmdbService.getGenres().subscribe(
      {next:(response) => {
        this.genres = response.genres;
      },
      error:(error) => {
        console.error('Erro ao buscar gêneros: ', error); //TRATAR ERRO
      }
    }
    );
  }

  // FILTRO
  filterByGenre() {
    this.isLoading = true;
    if (this.selectedGenre) {
      this.tmdbService.getMoviesByGenre(this.selectedGenre).subscribe(
        { next: (data) => {
          this.movies = data.results;
          this.isLoading = false;
          this.loadWatchProviders();
          // this.loadAdditionalMovieDetails();
        },
        error: (error) => {
          console.error('Erro ao buscar filmes por gênero: ', error); //TRATAR ERRO
          this.isLoading = false;
        }
      }
      );
    } else {
      this.getPopularMovies();
    }
  }

  // PROVEDORES
  loadWatchProviders() {
    this.movies.forEach(movie => {
      const movieId = movie.id;
      this.tmdbService.getMovieWatchProviders(movieId).subscribe(
        { next: (response) => {
          const providers = response.results?.['BR']?.flatrate || [];
          this.streamingProviders[movieId] = providers.map((provider: any) => provider.provider_name);
        },
        error: (error) => {
          console.error('Erro ao buscar provedores de streaming: ', error); //TRATAR ERRO
        }
      }
      );
    });
  }

  // loadAdditionalMovieDetails() {
  //   this.movies.forEach(movie => {
  //     const movieId = movie.id;
  //     this.tmdbService.getMovieDetails(movieId).subscribe(
  //       { next:(details) => {
  //         this.additionalDetails[movieId] = {
  //           genres: details.genres.map((genre: any) => genre.name),
  //           duration: details.runtime,
  //           budget: details.budget,
  //           revenue: details.revenue,
  //           certification: details.release_dates.results.find((release: any) => release.iso_3166_1 === 'BR')?.release_dates[0]?.certification || 'N/A'
  //         };
  //       },
  //       error: (error) => {
  //         console.error('Erro ao buscar detalhes adicionais: ', error); //TRATAR ERRO
  //       }
  //     }
  //     );
  //   });
  // }

  // BARRA DE PESQUISA
  searchMovies() {
    this.isLoading = true;
    if (this.searchTerm.trim() === '') {
      this.getPopularMovies();
    } else {
      this.tmdbService.searchMovies(this.searchTerm).subscribe(
        { next: (data) => {
          this.movies = data.results;
          this.isLoading = false;
          this.loadWatchProviders();
          // this.loadAdditionalMovieDetails();
        },
        error:(error) => {
          console.error('Erro ao buscar filmes: ', error); //TRATAR ERRO
          this.isLoading = false;
        }
      }
      );
    }
  }

  // Avaliação de filmes pelo usuário
  rateMovie(movieId: number, rating: number) {
    this.ratings[movieId] = rating;
  }

  // Exibir trailer
  watchTrailer(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).subscribe(
      { next:(response) => {
        const trailer = response.results.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
          const url = `https://www.youtube.com/watch?v=${trailer.key}`;
          window.open(url, '_blank');
        } else {
          alert('Trailer não encontrado.');
        }
      },                  
      error: (error) => {
        console.error('Erro ao buscar trailer: ', error); //TRATAR ERRO
        alert('Erro ao buscar trailer.');
      }
    }
    );
  }

  getStarIcon(movieId: number, star: number): { icon: string, colorClass: string } {
    let colorClass = '';
    if (this.ratings[movieId] && this.ratings[movieId] >= star) {
      colorClass = 'rated';
      return { icon: 'star', colorClass };
    }
    return { icon: 'star-outline', colorClass: '' };
  }
}
