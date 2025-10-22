/* import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  Platform,
  NavController,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { FirebaseService } from '../services/firebase-service';

@Component({
  selector: 'app-scan-item',
  templateUrl: './scan-item.page.html',
  styleUrls: ['./scan-item.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule,
    IonButton
],
  providers: [BarcodeScanner],
})
export class ScanItemPage {
  scannedCode = '';
  isCodeConfirmed = false;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private platform: Platform,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => this.startScanning());
  }

  /** Start the barcode scanner */
  /*
  startScanning() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        if (!barcodeData.cancelled) {
          this.scannedCode = barcodeData.text;
          this.isCodeConfirmed = true;
        } else {
          this.goHome();
        }
      })
      .catch((err) => {
        console.error('Scan failed:', err);
        this.goHome();
      });
  }

  /** Let user manually edit the scanned code */
  /*
  async editCode() {
    const alert = await this.alertCtrl.create({
      header: 'Edit Code',
      inputs: [
        {
          name: 'code',
          type: 'text',
          value: this.scannedCode,
          placeholder: 'Enter new code',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            this.scannedCode = data.code;
          },
        },
      ],
    });
    await alert.present();
  }

  /** Retry scanning */
  /*
  retry() {
    this.scannedCode = '';
    this.isCodeConfirmed = false;
    this.startScanning();
  }

  /** Continue after scanning to check the database */
  /*
  async continue() {
    const toast = await this.toastCtrl.create({
      message: 'Checking item in database...',
      duration: 1500,
    });
    await toast.present();

    try {
      const item = await this.firebaseService.getItemByCode(this.scannedCode);

      if (item) {
        // Item found → go to details
        this.navCtrl.navigateForward(`/item-details/${item.id}`);
      } else {
        // Item not found → go to create new item
        this.navCtrl.navigateForward(`/create-item?code=${this.scannedCode}`);
      }
    } catch (error) {
      console.error('Error checking item:', error);
      const errorToast = await this.toastCtrl.create({
        message: 'Error connecting to database',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }

  /** Go back home */
  /*
  goHome() {
    this.navCtrl.navigateRoot('/tabs/home');
  }
}
 */

import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  NavController,
  AlertController,
  ToastController,
  ActionSheetController,
  ModalController
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/item-firebase-service';
import { NewItemPage } from '../new-item/new-item.page';
import { ItemSharedService } from '../services/item-shared-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EditItemPage } from '../edit-item/edit-item.page';

@Component({
  selector: 'app-scan-item',
  templateUrl: './scan-item.page.html',
  styleUrls: ['./scan-item.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    CommonModule,
    FormsModule,
  ],
})
export class ScanItemPage {
  scannedCode = '';
  authorized = computed(() => {
    const u = this.auth.user(); // make sure user() returns current user
    return !!u && u.role === 'manager';
  });
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService,
    private ItemSharedService:ItemSharedService,
    private router : Router,
    private auth : AuthService
  ) {}

  async simulateScan() {
    const alert = await this.alertCtrl.create({
      header: 'Enter Test Barcode',
      inputs: [{ name: 'code', type: 'text', placeholder: '1234567890123' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'OK',
          handler: (data) => {
            if (data.code && data.code.trim() !== '') {
              this.scannedCode = data.code.trim();
              this.showActionOptions();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async showActionOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Scanned Code: ${this.scannedCode}`,
      buttons: [
        { text: 'Continue', icon: 'checkmark-circle-outline', handler: () => this.continue(this.scannedCode) },
        { text: 'Edit Code', icon: 'create-outline', handler: () => this.editCode() },
        { text: 'Retry', icon: 'refresh-outline', handler: () => this.retry() },
        { text: 'Cancel', icon: 'close-outline', role: 'cancel' },
      ],
    });
    await actionSheet.present();
  }

  async editCode() {
    const alert = await this.alertCtrl.create({
      header: 'Edit Code',
      inputs: [{ name: 'code', type: 'text', value: this.scannedCode, placeholder: 'Enter new code' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', handler: (data) => { if (data.code) { this.scannedCode = data.code.trim(); this.showActionOptions(); } } },
      ],
    });
    await alert.present();
  }

  retry() {
    this.scannedCode = '';
    this.simulateScan();
  }

async continue(barcode: string) {
  const existingItem = await this.ItemSharedService.getItemByBarcode(barcode);

  if (existingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Item Already Exists',
      subHeader: existingItem.name,
      message: `<img src="${existingItem.photo}" style="width:100px;height:100px;object-fit:cover;margin-bottom:10px;">`,
      inputs: [
        {
          name: 'decrementAmount',
          type: 'number',
          placeholder: 'Amount to decrement',
          min: 1
        }
      ],
      buttons: [
        {
          text: 'Decrement',
          handler: async (data) => {
            const amount = Number(data.decrementAmount);
            // Validate input
            if (!data.decrementAmount || isNaN(amount) || amount <= 0) {
              // show a warning toast
              const toast = await this.toastCtrl.create({
                message: 'Please enter a valid amount greater than 0',
                duration: 1000,
                color: 'warning'
              });
              await toast.present();

              return false; // keep the alert open
            }
            await this.ItemSharedService.decrementItem(existingItem.barcode, amount);
            await this.ItemSharedService.loadItems();
            return true; // close alert
          }
        },
        ...(this.authorized() ? [{
          text: 'Edit',
          handler: async () => {
            // navigate to home first so modal back goes to home
            await this.router.navigate(['/tabs/home'], { replaceUrl: true });
            const modal = await this.modalCtrl.create({
              component: EditItemPage,
              componentProps: { item: existingItem }
            });

            modal.onDidDismiss().then(async (result) => {
              if (result.data?.updatedItem) {
                // Refresh item details after editing
                await this.ItemSharedService.loadItems();
              }
            });

            await modal.present();
            return true;
          }
        }] : []),
        { text: 'Cancel', role: 'cancel' }
      ]
    });

    await alert.present();
  } else {
    // navigate to home first so modal back goes to home
    await this.router.navigate(['/tabs/home'], { replaceUrl: true });
    // item does not exist: go to new item page
    const modal = await this.modalCtrl.create({
      component: NewItemPage,
      componentProps: { barcode: this.scannedCode }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      const successToast = await this.toastCtrl.create({
        message: 'New item saved successfully!',
        duration: 1500,
        color: 'success'
      });
      await successToast.present();
    }
  }
}



  goHome() {
    this.navCtrl.navigateRoot('/tabs/home');
  }
}
