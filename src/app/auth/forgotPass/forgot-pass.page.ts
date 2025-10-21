import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidation } from '../../services/form-validation';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ForgotPasswordPage {
  email = '';

  constructor(
    private modalCtrl: ModalController,
    public val: FormValidation,
    private authService: AuthService
  ) {}

  async sendResetLink() {
    if (!this.val.isEmailValid(this.email)) {
      this.val.showToast('Enter a valid email', 'danger');
      return;
    }

    try {
      await this.authService.sendPasswordReset(this.email);
      this.val.showToast(`Reset link sent to ${this.email}`, 'success');
      this.closeModal();
    } catch (error) {
      this.val.showToast('Failed to send reset link. Try again.', 'danger');
      console.error(error);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
