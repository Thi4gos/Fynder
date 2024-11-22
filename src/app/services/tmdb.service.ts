import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, shareReplay } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; 
import { ErrorService } from'./error.service';
import { environment } from '../../environments/environment'; 
import { SeriesDetails } from '../models/seriesdetails';
import { MovieDetails } from '../models/moviedetails'; 
import { ApiResponse } from '../models/apiresponse'; 
import { Video, VideoResponse } from '../models/videoresponse';

@Injectable({
  providedIn: 'root' 
})
export class TmdbService {
  private readonly apiKey: string = environment.tmdbApiKey;
  private readonly apiUrl: string = 'https://api.themoviedb.org/3';
  private readonly defaultLanguage: string = 'pt-BR';
  private genresCache$: Observable<any> | null = null; 


  constructor(private http: HttpClient, private errorservice: ErrorService) {}

  // Método auxiliar para criar parâmetros HTTP
  private getDefaultParams(additionalParams: { [key: string]: string } = {}): HttpParams {
    return new HttpParams()
      .set('api_key', this.apiKey) 
      .set('language', this.defaultLanguage)
      .appendAll(additionalParams);
  }

  // Filmes Populares com paginação
  getPopularMovies(page: number = 1): Observable<ApiResponse<MovieDetails>> { 
    return this.http.get<ApiResponse<MovieDetails>>(`${this.apiUrl}/movie/popular`, {
      params: this.getDefaultParams({ page: page.toString() })
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Gêneros com cache
  getGenres(): Observable<any> {
    if (!this.genresCache$) {
      this.genresCache$ = this.http.get(`${this.apiUrl}/genre/movie/list`, {
        params: this.getDefaultParams()
      }).pipe( //NÃO ENTENDI ESSA FUNÇÃO, NEM TODAS AS PARECIDAS
        shareReplay(1),
        catchError(this.errorservice.handleError)
      );
    }
    return this.genresCache$;
  }

  // Gêneros de séries
  getSeriesGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/genre/tv/list`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Filmes por gênero com paginação
  getMoviesByGenre(genreId: number, page: number = 1): Observable<ApiResponse<MovieDetails>> {
    return this.http.get<ApiResponse<MovieDetails>>(`${this.apiUrl}/discover/movie`, {
      params: this.getDefaultParams({
        with_genres: genreId.toString(),
        page: page.toString()
      })
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Busca de filmes com paginação
  searchMovies(query: string, page: number = 1): Observable<ApiResponse<MovieDetails>> {
    return this.http.get<ApiResponse<MovieDetails>>(`${this.apiUrl}/search/movie`, {
      params: this.getDefaultParams({
        query: query,
        page: page.toString()
      })
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Busca de séries
  searchSeries(query: string, page: number = 1): Observable<ApiResponse<SeriesDetails>> {
    return this.http.get<ApiResponse<SeriesDetails>>(`${this.apiUrl}/search/tv`, {
      params: this.getDefaultParams({
        query: query,
        page: page.toString()
      })
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Provedores de streaming para filmes
  getMovieWatchProviders(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}/watch/providers`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Provedores de streaming para séries
  getSeriesWatchProviders(seriesId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/${seriesId}/watch/providers`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Detalhes do filme
  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.apiUrl}/movie/${movieId}`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Detalhes da série
  getSeriesDetails(seriesId: number): Observable<SeriesDetails> {
    return this.http.get<SeriesDetails>(`${this.apiUrl}/tv/${seriesId}`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Vídeos do filme
  getMovieVideos(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}/videos`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Vídeos da série
  getSeriesVideos(seriesId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/${seriesId}/videos`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Séries populares
  getPopularSeries(page: number = 1): Observable<ApiResponse<SeriesDetails>> {
    return this.http.get<ApiResponse<SeriesDetails>>(`${this.apiUrl}/tv/popular`, {
      params: this.getDefaultParams({ page: page.toString() })
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Elenco do filme
  getMovieCredits(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}/credits`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Elenco da série
  getSeriesCredits(seriesId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/${seriesId}/credits`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Classificação indicativa do filme
  getMovieCertification(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}/release_dates`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  // Classificação indicativa da série
  getSeriesCertification(seriesId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/${seriesId}/content_ratings`, {
      params: this.getDefaultParams()
    }).pipe(catchError(this.errorservice.handleError));
  }

  getMovieTrailers(movieId: number): Observable<VideoResponse> {
    return this.http.get<VideoResponse>(
      `${this.apiUrl}/movie/${movieId}/videos`,
      {
        params: {
          api_key: this.apiKey,
          language: 'pt-BR'
        }
      }
    );
  }

  getSeriesTrailers(seriesId: number): Observable<VideoResponse> {
    return this.http.get<VideoResponse>(
      `${this.apiUrl}/serie/${seriesId}/videos`,
      {
        params: {
          api_key: this.apiKey,
          language: 'pt-BR'
        }
      }
    );
  }

  // Método auxiliar para gerar URL do YouTube
  getYoutubeUrl(key: string): string {
    return `https://www.youtube.com/watch?v=${key}`;
  }

  // Método auxiliar para gerar URL da thumbnail do YouTube
  getYoutubeThumbnail(key: string): string {
    return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
  }
}