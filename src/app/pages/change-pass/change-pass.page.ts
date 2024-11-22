import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service'; 
import { NewPasswordService } from 'src/app/services/new-password.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.page.html',
  styleUrls: ['./change-pass.page.scss'],
})
export class ChangePassPage {
  public email: string = '';
  public resetEmailSent: boolean = false;

  constructor(private toastController: ToastService, private newPass: NewPasswordService) {}

  // Função chamada no primeiro componente (EmailEntryComponent) para enviar o e-mail
  async sendResetEmail() {
    try {
      await this.newPass.sendPasswordResetEmail(this.email);
      this.resetEmailSent = true;  // Altera o estado para exibir o componente de confirmação
      this.toastController.showToast('E-mail de recuperação enviado com sucesso.', 'success');
    } catch (error) {
      this.resetEmailSent = false;
      this.toastController.showToast('Erro ao enviar o e-mail. Por favor, tente novamente.', 'danger');
    }
  }
}
