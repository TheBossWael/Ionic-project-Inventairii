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

import { Component } from '@angular/core';
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

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService
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
        { text: 'Continue', icon: 'checkmark-circle-outline', handler: () => this.continue() },
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
/** Always open modal for testing */
async continue() {
  console.log('Opening modal...');

  const modal = await this.modalCtrl.create({
    component: NewItemPage,       // must be the standalone component
    componentProps: { barcode: this.scannedCode }
  });

  await modal.present();

  // Optional: handle dismissal
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


  goHome() {
    this.navCtrl.navigateRoot('/tabs/home');
  }
}
