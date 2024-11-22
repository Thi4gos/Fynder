import { Component } from '@angular/core';
import { NewPasswordService } from 'src/app/services/new-password.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent {
  public newPassword: string = '';
  public confirmPassword: string = '';

  constructor(
    private newPass: NewPasswordService,
    private toastController: ToastService
  ) {}

  // Função para alterar a senha
  async onChangePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.toastController.showToast('As senhas não coincidem.', "danger");
      return;
    }

    try {
      await this.newPass.changePassword(this.newPassword);
      this.toastController.showToast('Senha alterada com sucesso!', "sucess");
    } catch (error) {
      this.toastController.showToast('Erro ao alterar a senha. Tente novamente.', "danger");
      console.error("Erro ao alterar a senha:", error);
    }
  }
}
