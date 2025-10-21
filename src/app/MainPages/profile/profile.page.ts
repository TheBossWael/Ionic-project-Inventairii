import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FormValidation } from '../../services/form-validation';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProfilePage  {

  email = '';
  oldPassword = '';
  newPassword = '';
  role: 'manager' | 'employee' | ""="";
  specialPassword = '';
  showOldPassword = false;
  showNewPassword = false;
  showSpecialPassword = true;

  constructor(private toastCtrl: ToastController, public val: FormValidation,   private authService: AuthService ,private router : Router) {}

async saveChanges() {

  try {
    await this.authService.updateProfileData(
      this.oldPassword,
      this.email,
      this.newPassword,
      this.role
    );

    this.val.showToast('Profile updated successfully ✅', 'success');

    //reset the form
    this.resetForm()

  } catch (error: any) {
    console.error('Error updating profile:', error);
    this.val.showToast(error.message || 'Failed to update profile ❌', 'danger');
  }
}

  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleSpecialPassword() {
    this.showSpecialPassword = !this.showSpecialPassword;
  }


  get isSaveDisabled(): boolean {
    if (!this.oldPassword) return true;
    if (!this.role) return true;
    if (this.role === 'manager' && !this.specialPassword || !this.val.isManagerKeyValid(this.role, this.specialPassword)) return true;
    if (!this.email) return false;
    if (!this.val.isEmailValid(this.email)) return true;
    return false;
  }

  ionViewWillLeave() {
    this.resetForm()
}

resetForm(){
    this.email = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.role=''
    this.specialPassword = '';
    this.showOldPassword = false;
    this.showNewPassword = false;
    this.showSpecialPassword = true;
}

async logout() {
  await this.authService.logout(); // wait for logout
  this.val.showToast('User Logged Out ✅', 'success');
  this.router.navigate(['/welcome']);
}


}
