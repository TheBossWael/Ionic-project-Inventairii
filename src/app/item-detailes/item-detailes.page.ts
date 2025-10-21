import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController,ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/item-firebase-service';
import { ActivatedRoute } from '@angular/router';
import { ItemModel } from '../models/itemModel';

import { AuthService } from '../services/auth-service';
import { EditItemPage } from '../edit-item/edit-item.page'; // New modal page


@Component({

  selector: 'app-item-detailes',
  templateUrl: './item-detailes.page.html',
  styleUrls: ['./item-detailes.page.scss'],

  imports: [CommonModule, IonicModule],
})

export class ItemDetailesPage implements OnInit {
  item!: ItemModel;
  loading = true;
  authorized = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    const barcode = this.route.snapshot.paramMap.get('barcode');
    if (!barcode) {
      console.error('No barcode provided');
      this.navCtrl.back();
      return;
    }

    try {
      const fetchedItem = await this.firebaseService.getItemByCode(barcode);
      if (!fetchedItem) {
        console.error('Item not found');
        this.navCtrl.back();
        return;
      }
      this.item = fetchedItem;
      // Check authorization
      const user = this.authService.currentUser;
      this.authorized = !!user && user.role === 'manager';
    } catch (error) {
      console.error('Error fetching item', error);
      this.navCtrl.back();
    } finally {
      this.loading = false;
    }
  }

  back() {
    this.navCtrl.back();
  }

  async editItem() {
    if (!this.authorized) return;

    const modal = await this.modalCtrl.create({
      component: EditItemPage,
      componentProps: { item: this.item },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data?.updatedItem) {
        // Refresh item details after editing
        this.item = result.data.updatedItem;
      }
    });

    await modal.present();
  }
  
}
