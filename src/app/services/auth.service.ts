// firebase-auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { ConectDBService } from './conect-db.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {

  private loggedInUser: string | null = null;
  
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseDbService: ConectDBService
  ) {}

  // RETORNA USUÁRIO ATUAL SE LOGADO
  async getCurrentUser(): Promise<firebase.default.User | null> {
    return this.afAuth.currentUser;
  }

  // LOGIN COM EMAIL/SENHA
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/preferences']);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  // ENVIA E-MAIL DE VERIFICAÇÃO PARA 2FA APÓS O LOGIN
  async sendVerificationEmail(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user && !user.emailVerified) {
      await user.sendEmailVerification();
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
      await this.afAuth.signInWithPopup(provider);
      return true;
    } catch (error) {
      return false;
    }
  }

  // FUNÇÃO DE RECUPERAÇÃO DE SENHA: ENVIA E-MAIL PARA REDIFINIÇÃO DE SENHA
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
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
