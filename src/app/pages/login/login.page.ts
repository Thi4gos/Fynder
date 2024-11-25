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
  email: string = ''
  pass: string = ''

  constructor(private router: Router, private  auth: FirebaseAuthService, private toast: ToastService) {}

  loginWithGoogle() {
    this.auth.loginWithGoogle()
  }

  loginWithFacebook() {
    this.auth.loginWithFacebook()
  }
  
  async loginWithEmailPass() {
    this.auth.login(this.email, this.pass)
    .then(
      () => {
        this.toast.showToast("Login bem sucedido!", "sucess")
        this.router.navigate(['/search'])
    })
    .catch((error) => {
      this.toast.showToast("Error ao logar:", error)
    })
  }

  goBackToHome() {
    this.router.navigate(['/search']);
  }
}
