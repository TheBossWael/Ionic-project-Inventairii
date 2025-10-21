import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from "@ionic/angular";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule,RouterModule]
})

export class TabsPage {



  constructor( private router: Router,) { }
goToScan() {
  this.router.navigate(['/scan-item'])
}

}
