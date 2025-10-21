import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton]
})
export class AuthPage {

  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

}
