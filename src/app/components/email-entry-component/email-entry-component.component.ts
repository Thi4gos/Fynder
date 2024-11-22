import { Component, Output, EventEmitter } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-email-entry',
  templateUrl: './email-entry-component.component.html',
  styleUrls: ['./email-entry-component.component.scss'],
})
export class EmailEntryComponent {
  public email: string = '';

  @Output() sendEmail = new EventEmitter<string>();

  constructor(private toastController: ToastService) {}

  // Emite o evento para o componente pai com validação de e-mail
  async onSendEmail() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.toastController.showToast('Por favor, insira um e-mail válido.', "danger");
      return;
    }

    this.sendEmail.emit(this.email);
    this.toastController.showToast('E-mail enviado com sucesso!', "sucess");
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
