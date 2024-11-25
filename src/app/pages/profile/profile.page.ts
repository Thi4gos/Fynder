import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(private router: Router, private auth: FirebaseAuthService) {
    // Definindo um usuário fictício
    this.user = {
      name: 'Nome do Usuário',
      email: 'usuario@exemplo.com',
      photoUrl: 'assets/images/user.jpg', // Caminho da foto
      favorites: ['Filme 1', 'Filme 2', 'Série 1'],
      reviews: ['Ótimo filme!', 'Muito interessante!', 'Gostei bastante!']
    };
  }
   
  async ngOnInit() {
    const loggedInUser = await this.auth.getCurrentUser();
    if (loggedInUser) {
      this.user = await this.auth.getUserData(loggedInUser.email!);
    }
  }

  editPreferences() {
    // Redireciona para a página de preferências
    this.router.navigate(['/preferences']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
