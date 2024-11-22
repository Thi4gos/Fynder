import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class NewPasswordService {
  constructor(private afAuth: AngularFireAuth) { }

  // Método para enviar o email de redefinição de senha
  async sendPasswordResetEmail(email: string): Promise<string> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      return "E-mail de recuperação enviado.";
    } catch (error) {
      throw "Erro ao enviar e-mail de recuperação: " + error;
    }
  }

  // Método para atualizar a senha
  async changePassword(newPassword: string): Promise<string> {
    const user = await this.afAuth.currentUser;

    if (user) {
      try {
        await user.updatePassword(newPassword);
        return "Senha atualizada com sucesso.";
      } catch (error) {
        throw "Erro ao atualizar senha: " + error;
      }
    } else {
      throw "Nenhum usuário autenticado.";
    }
  }
}
