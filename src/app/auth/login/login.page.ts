import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormValidation } from '../../services/form-validation';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordPage } from '../forgotPass/forgot-pass.page';
import { AuthService } from '../../services/auth-service'; // <-- added

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule, CommonModule],
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(
    public val: FormValidation,
    private modalCtrl: ModalController,
    private router: Router,
    private auth: AuthService
  ) {}

  async login() {

    try {
      const user = await this.auth.login(this.email, this.password);
      await this.val.showToast(`Welcome ${user.Username}`, 'success');
      this.goToHome()
    } catch (err: any) {
      await this.val.showToast(`Login Failed ${err}`,'danger');
      console.error('Erreur register :', err);
    }
  }



  async forgotPassword() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordPage,
    });
    await modal.present();
  }

  async signUp() {
    this.router.navigate(['/register']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Disable button if inputs are not valid
  get isLoginDisabled() {
    return !this.val.isLoginInputValid(this.email, this.password);
  }

  goToHome(){
    this.router.navigate(['/tabs/home'])
  }

}
