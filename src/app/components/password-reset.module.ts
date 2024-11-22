import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EmailEntryComponent } from './email-entry-component/email-entry-component.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';

@NgModule({
  declarations: [EmailEntryComponent, ConfirmPasswordComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [EmailEntryComponent, ConfirmPasswordComponent],
})
export class PasswordResetModule { }
