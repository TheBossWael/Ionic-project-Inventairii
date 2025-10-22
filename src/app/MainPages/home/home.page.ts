import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonIcon, IonButton, IonHeader, IonToolbar, IonContent, IonCard } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/item-firebase-service';
import { AuthService } from 'src/app/services/auth-service';
import { signal } from '@angular/core';
import { ItemModel } from 'src/app/models/itemModel';
import { trashBinOutline } from 'ionicons/icons';
import { IonSearchbar, } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular/standalone';
import { ItemSharedService } from 'src/app/services/item-shared-service';
import { Router } from '@angular/router';
import { HistoryFirebaseService } from 'src/app/services/history-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonIcon, IonButton, IonSearchbar, IonHeader, IonToolbar, IonContent, IonCard]
})
export class HomePage implements OnInit {
  trashBinIcon = trashBinOutline;
  items = this.ItemSharedService.items;
  authorized = computed(() => {
    const u = this.auth.user();
    return !!u && u.role === 'manager';
  });
  searchQuery = signal(''); // search input

  constructor(
    private ItemSharedService : ItemSharedService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.ItemSharedService.loadItems();
  }

    // 🔹 Filter items by name
  get filteredItems() {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(item => item.name.toLowerCase().includes(q));
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.detail.value || '');
  }

  async confirmDelete(barcode: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            await this.ItemSharedService.deleteItem(barcode);
          },
        },
      ],
    });

    await alert.present();
  }
  openItemDetails(barcode: string) {
  this.router.navigate(['/item', barcode]);
  }
  
}
