import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormValidation } from '../../services/form-validation';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule, CommonModule],
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';
  role: 'manager' | 'employee' = 'employee';
  specialPassword = '';
  showPassword = false;
  showSpecialPassword = true;

  constructor(public val: FormValidation,private router: Router, private auth: AuthService) {}

  async register() {
      // Validate the registration form
      const isValid = !this.isRegisterDisabled;

      if (!isValid) {
        await this.val.showToast('Please fill all required fields correctly', 'warning');
        return; // 🚫 Stop execution if validation fails
      }
        try {
        const user = await this.auth.register(this.email, this.password, this.username, this.role);
        this.val.showToast('Registration successful','success');
        this.goToLogin()
      } catch (error) {
        this.val.showToast(`Registration Failed ${error}`,'danger');
        console.error('Erreur register :', error);
      }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleSpecialPassword() {
    this.showSpecialPassword = !this.showSpecialPassword;
  }

  goToLogin() {

    this.router.navigate(['/login'])
  }

  //disable submit btn when form is not valid
  get isRegisterDisabled(): boolean {
    return !this.val.isRegisterFormValid({
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      specialPassword: this.specialPassword
    });
  }


}
