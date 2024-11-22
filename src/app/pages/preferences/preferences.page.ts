import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { ConectDBService } from 'src/app/services/conect-db.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {
  userPreferences = {
    genres: [],
    notifications: false,
  };

  genres = [
    { id: 28, name: 'Ação' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animação' },
    { id: 35, name: 'Comédia' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentário' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Família' },
    { id: 14, name: 'Fantasia' },
    { id: 36, name: 'História' },
    { id: 27, name: 'Terror' },
    { id: 10402, name: 'Música' },
    { id: 9648, name: 'Mistério' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ficção Científica' },
    { id: 10770, name: 'Filme de TV' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'Guerra' },
    { id: 37, name: 'Faroeste' },
  ];

  email!: string; // Email recebido do registro

  constructor(private router: Router, private toastservice: ToastService, private dbService: ConectDBService) {}

  ngOnInit() {
    // Recupera o email do estado da rota
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras.state?.['email'] || '';
  }

  savePreferences() {
    const data = {
      genres: this.userPreferences.genres,
      notifications: this.userPreferences.notifications,
    };
  
    this.dbService.updateDocument('users', this.email, { preferences: data })
      .then(() => {
        this.toastservice.showToast('Preferências salvas com sucesso!', 'success');
        this.router.navigate(['search']);
      })
      .catch((error) => {
        this.toastservice.showToast('Erro ao salvar preferências.', 'danger');
        console.error('Erro ao salvar preferências:', error);
      });
  }
}
