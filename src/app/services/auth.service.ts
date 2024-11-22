import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, User } from '@angular/fire/auth';
import { ConectDBService } from './conect-db.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private loggedInUser: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private firebaseDbService: ConectDBService
  ) {}

  // RETORNA USUÁRIO ATUAL SE LOGADO
  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  // LOGIN COM EMAIL/SENHA
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/preferences']);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  // ENVIA E-MAIL DE VERIFICAÇÃO PARA 2FA APÓS O LOGIN
  async sendVerificationEmail(): Promise<void> {
    const user = this.auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    } else {
      console.log('Usuário não autenticado ou e-mail já verificado.');
    }
  }

  // LOGIN COM PROVIDERS EXTERNOS
  async loginWithGoogle(): Promise<boolean> {
    return await this.signInWithProvider(new GoogleAuthProvider());
  }

  async loginWithFacebook(): Promise<boolean> {
    return await this.signInWithProvider(new FacebookAuthProvider());
  }

  // FUNÇÃO PRIVADA PARA AUTENTICAÇÃO COM PROVIDERS EXTERNOS
  private async signInWithProvider(provider: any): Promise<boolean> {
    try {
      await signInWithPopup(this.auth, provider);
      return true;
    } catch (error) {
      return false;
    }
  }

  // FUNÇÃO DE RECUPERAÇÃO DE SENHA: ENVIA E-MAIL PARA REDEFINIÇÃO DE SENHA
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('E-mail para redefinição de senha enviado.');
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
    }
  }

  setLoggedInUser(email: string) {
    this.loggedInUser = email;
  }

  getLoggedInUser(): string | null {
    return this.loggedInUser;
  }

  clearUser() {
    this.loggedInUser = null;
  }
}