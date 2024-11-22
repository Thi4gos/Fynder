import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor() { }

  ngOnInit() { }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    // Lógica para alterar a senha (exemplo):
    console.log('Senha atual:', this.currentPassword);
    console.log('Nova senha:', this.newPassword);

    // Aqui você pode adicionar a lógica para atualizar a senha no backend

    alert('Senha alterada com sucesso!');
    // Redirecionar para a página de perfil ou outra página
  }
}
