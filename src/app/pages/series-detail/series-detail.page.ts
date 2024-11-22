import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.page.html',
  styleUrls: ['./series-detail.page.scss'],
})
export class SeriesDetailPage implements OnInit {
  seriesId!: number;
  series: any;
  seriesGenres: string = ''; // Armazena os gêneros formatados
  cast: any[] = [];
  trailers: any[] = [];
  isFavorite: boolean = false;
  watchProviders: any[] = []; // Armazena os provedores de streaming
  seriesCertification: string = ''; // Armazena a classificação indicativa

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) { }

  ngOnInit() {
    this.seriesId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSeriesDetails();
    this.loadSeriesCredits();
    this.loadSeriesTrailers();
    this.loadWatchProviders();
    this.loadSeriesCertification(); // Carrega a classificação indicativa
  }

  loadSeriesDetails() {
    this.tmdbService.getSeriesDetails(this.seriesId).subscribe((response: any) => {
      this.series = response;
      this.seriesGenres = this.series.genres.map((genre: any) => genre.name).join(', ');
    });
  }

  loadSeriesCredits() {
    this.tmdbService.getSeriesCredits(this.seriesId).subscribe((response: any) => {
      this.cast = response.cast;
    });
  }

  loadSeriesTrailers() {
    this.tmdbService.getSeriesTrailers(this.seriesId).subscribe((response: any) => {
      this.trailers = response.results.filter((video: any) => video.type === 'Trailer');
    });
  }

  loadWatchProviders() {
    this.tmdbService.getSeriesWatchProviders(this.seriesId).subscribe((response: any) => {
      if (response.results.BR) {
        this.watchProviders = response.results.BR.flatrate || [];
      }
    });
  }

  loadSeriesCertification() {
    this.tmdbService.getSeriesCertification(this.seriesId).subscribe((response: any) => {
      const brCertification = response.results.find((cert: any) => cert.iso_3166_1 === 'BR');
      if (brCertification && brCertification.rating) {
        this.seriesCertification = brCertification.rating;
      } else {
        this.seriesCertification = 'Não disponível';
      }
    });
  }

  openTrailer(videoKey: string) {
    window.open(`https://www.youtube.com/watch?v=${videoKey}`, '_blank');
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  rateSeries(rating: 'like' | 'dislike') {
    console.log(`Usuário ${rating === 'like' ? 'gostou' : 'não gostou'} da série:`, this.series.name);
  }
}
