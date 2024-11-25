import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, User } from '@angular/fire/auth';
import { ConectDBService } from './conect-db.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private loggedInUser = new BehaviorSubject<string | null>(null);
  public loggedInUser$ = this.loggedInUser.asObservable();
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private firebaseDbService: ConectDBService
  ) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.loggedInUser.next(user?.email || null);
    });
  }

  // RETORNA USUÁRIO ATUAL SE LOGADO
  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  // LOGIN COM EMAIL/SENHA
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
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

  setLoggedInUser(email: string): void {
    this.loggedInUser.next(email);
  }

  async getLoggedInUser(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user?.email || null;
  }

  async getUserData(email: string): Promise<any> {
    const docRef = doc(this.firestore, `Usuarios/${email}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('Usuário não encontrado');
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }}
}