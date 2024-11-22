import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistryService } from '../../services/registry.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.page.html',
  styleUrls: ['./registry.page.scss'],
})
export class RegistryPage implements OnInit {
  registryForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private registryService: RegistryService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registryForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        tel: ['', Validators.required],
        birthDate: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        pass: ['', [Validators.required, Validators.minLength(6)]],
        confirmPass: ['', Validators.required],
        termsAccepted: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('pass')?.value;
    const confirmPass = group.get('confirmPass')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  async onRegister() {
    if (this.registryForm.invalid) return;

    this.isSubmitting = true;
    const userData = this.registryForm.value;

    try {
      await this.registryService.registerUser({
        ...userData,
        pass: userData.pass,
      });
      await this.toastService.showToast('Usuário registrado com sucesso!', 'success');
      this.registryForm.reset();
      this.router.navigate(['/preferences'], {
        state: { email: userData.email }, // Passa dados via rota
      });
    } catch (error) {
      await this.toastService.showToast(`Erro ao registrar: ${error}`, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registryForm.get(controlName);
    return control?.touched && control?.invalid || false;
  }

  isValid(controlName: string): boolean {
    const control = this.registryForm.get(controlName);
    return control?.touched && control?.valid || false;
  }

  isTouchedAndInvalid(controlName: string, errorKey: string): boolean {
    const control = this.registryForm.get(controlName);
    return control?.touched && control?.hasError(errorKey) || false;
  }
}
