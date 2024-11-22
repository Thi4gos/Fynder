import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: any;

  constructor(private router: Router) {
    // Definindo um usuário fictício
    this.user = {
      name: 'Nome do Usuário',
      email: 'usuario@exemplo.com',
      photoUrl: 'assets/images/user.jpg', // Caminho da foto
      favorites: ['Filme 1', 'Filme 2', 'Série 1'],
      reviews: ['Ótimo filme!', 'Muito interessante!', 'Gostei bastante!']
    };
  }

  editPreferences() {
    // Redireciona para a página de preferências
    this.router.navigate(['/preferences']);
  }

  logout() {
    // Lógica para logout do usuário
    console.log('Logout chamado');
  }
}
