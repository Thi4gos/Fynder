import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { FirebaseAuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  pass: string = '';
  

  constructor(private router: Router, private auth: FirebaseAuthService, private toast: ToastService) {}

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async loginWithEmailPass() {
    if (!this.validateEmail(this.email)) {
      this.toast.showToast('E-mail inválido. Por favor, corrija.', 'warning');
      return;
    }

    try {
      await this.auth.login(this.email, this.pass);
      this.toast.showToast('Login bem-sucedido!', 'success');
      this.router.navigate(['/search']);
    } catch (error: any) {
      const errorCode = error?.code || 'unknown';
      const errorMessage =
        errorCode === 'auth/invalid-email'
          ? 'E-mail inválido. Verifique o formato.'
          : errorCode === 'auth/user-not-found'
          ? 'Usuário não encontrado. Verifique seu e-mail.'
          : errorCode === 'auth/wrong-password'
          ? 'Senha incorreta. Tente novamente.'
          : 'Erro inesperado no login.';
      this.toast.showToast(errorMessage, 'danger');
    }
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  loginWithFacebook() {
    this.auth.loginWithFacebook();
  }

  goToPage(page: string) {
    this.router.navigate([page]);
  }
}
