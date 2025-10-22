import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})

export class FormValidation {
  private readonly MANAGER_KEY = 'wlh rani manager';

  constructor(private toastCtrl: ToastController) {}

  // --- Validation Helpers ---
  isEmailValid(email: string): boolean {
    return /^\S+@\S+\.\S+$/.test((email ?? '').trim());
  }

  isPasswordValid(password: string): boolean {
    return (password ?? '').length > 5;
  }

  isManagerKeyValid(role: string, specialPassword: string): boolean {
    if (role !== 'manager') return true;
    return (specialPassword ?? '').trim() === this.MANAGER_KEY;
  }

  isLoginInputValid(email: string, password: string): boolean {
    return this.isEmailValid(email) && this.isPasswordValid(password);
  }

  // --- Form Validation ---
  isRegisterFormValid(data: {
    username: string;
    email: string;
    password: string;
    role: 'employee' | 'manager';
    specialPassword: string;
  }): boolean {
    const { username, email, password, role,specialPassword } = data;

    if (!username.trim()) return false;
    if (!this.isEmailValid(email)) return false;
    if (!this.isPasswordValid(password)) return false;
    if (!role) return false;
    if (!this.isManagerKeyValid(role, specialPassword)) return false
    return true;
  }



  // --- Toast Helper ---
  async showToast(msg: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      color,
    });
    await toast.present();
  }
}
