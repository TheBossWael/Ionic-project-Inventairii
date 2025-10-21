import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardTitle, IonCardHeader, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonCard, IonCardTitle, IonCardHeader, IonCardContent]
})
export class HistoryPage {
  // computed signal that auto-updates when auth.user() changes
  authorized = computed(() => this.auth.hasRole(['manager']));

  constructor(private auth: AuthService) {}


}

