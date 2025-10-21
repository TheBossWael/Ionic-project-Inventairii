import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, IonicModule, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormValidation } from '../services/form-validation';
import { AuthService } from '../services/auth-service';
import { ItemModel } from '../models/itemModel';
import { Router, RouterModule } from '@angular/router';
import { ItemSharedService } from '../services/item-shared-service';


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.page.html',
  styleUrls: ['./new-item.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule],
})
export class NewItemPage {
  @Input() barcode!: string;
  itemForm: FormGroup;
  selectedFile: string | null = null; // Base64 image

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private validator: FormValidation,
    private ItemSharedService: ItemSharedService,
    private authService: AuthService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [, [Validators.required, Validators.min(0)]],
      quantity: [, [Validators.required, Validators.min(0)]],
      barcode: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.barcode) this.itemForm.patchValue({ barcode: this.barcode });
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.selectedFile = image.dataUrl ?? null;
    } catch (err) {
      console.log('Camera canceled or failed', err);
      await this.validator.showToast('Camera canceled or failed');
    }
  }

  async submitItem() {
    if (this.itemForm.invalid) {
      await this.validator.showToast('Please fill all required fields');
      return;
    }

    if (!this.selectedFile) {
      await this.validator.showToast('Please take a photo of the item');
      return;
    }

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      await this.validator.showToast('You must be logged in', 'warning');
      this.modalCtrl.dismiss();
      this.router.navigate(['/login']);
      return;
    }

    const itemData: Omit<ItemModel, 'photo'> = {
      ...this.itemForm.value,
      addedBy: currentUser.Username || currentUser.email || 'Unknown User',
    };

    try {
      // Add item via shared service — updates HomePage automatically
      await this.ItemSharedService.addItem(itemData, this.selectedFile);
      await this.validator.showToast('Item added successfully!', 'success');
      this.modalCtrl.dismiss();
      this.router.navigate(['/tabs/home'])
    } catch (error: any) {
      await this.validator.showToast(error.message || 'Failed to add item');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  cancel() {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateRoot('/tabs/home');
  }
}
