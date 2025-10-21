import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormValidation } from '../services/form-validation';
import { ItemSharedService } from '../services/item-shared-service';
import { ItemModel } from '../models/itemModel';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class EditItemPage implements OnInit {
  @Input() item!: ItemModel;
  itemForm: FormGroup;
  selectedFile: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private validator: FormValidation,
    private ItemSharedService: ItemSharedService
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
  if (this.item) {
    this.itemForm.patchValue(this.item);
    this.selectedFile = this.item.photo || null;

    // Disable barcode control so it can't be edited
    this.itemForm.get('barcode')?.disable();
  }
  }

  async submitItem() {
    if (this.itemForm.invalid) {
      await this.validator.showToast('Please fill all required fields');
      return;
    }

    const updatedItemData: Partial<ItemModel> = {
      ...this.itemForm.getRawValue(), // includes disabled barcode
      photo: this.selectedFile || this.item.photo,
    };

    try {
      console.log('Updating item with barcode:', this.item.barcode);
      await this.ItemSharedService.updateItem(this.item.barcode, updatedItemData);
      await this.validator.showToast('Item updated successfully!', 'success');
      this.modalCtrl.dismiss({ updatedItem: updatedItemData });
    } catch (error: any) {
      await this.validator.showToast(error.message || 'Failed to update item');
    }
  }


  closeModal() {
    this.modalCtrl.dismiss();
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

}
