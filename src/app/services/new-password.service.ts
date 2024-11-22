import { Injectable } from '@angular/core';
import { Auth, sendPasswordResetEmail, updatePassword, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NewPasswordService {
  constructor(private auth: Auth) { }

  // Método para enviar o email de redefinição de senha
  async sendPasswordResetEmail(email: string): Promise<string> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return "E-mail de recuperação enviado.";
    } catch (error) {
      throw "Erro ao enviar e-mail de recuperação: " + error;
    }
  }

  // Método para atualizar a senha
  async changePassword(newPassword: string): Promise<string> {
    const user = this.auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        return "Senha atualizada com sucesso.";
      } catch (error) {
        throw "Erro ao atualizar senha: " + error;
      }
    } else {
      throw "Nenhum usuário autenticado.";
    }
  }
}