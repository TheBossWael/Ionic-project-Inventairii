import { Injectable, signal } from '@angular/core';
import { ItemModel } from '../models/itemModel';
import { FirebaseService } from './item-firebase-service';

@Injectable({ providedIn: 'root' })
export class ItemSharedService {
  // shared items signal
  items = signal<ItemModel[]>([]);

  constructor(private firebaseService: FirebaseService) {}

  // Load all items initially
  async loadItems() {
    const allItems = await this.firebaseService.getAllItems();
    this.items.set(allItems);
  }

  // Add a new item and update signal
  async addItem(itemData: Omit<ItemModel, 'photo'>, base64Image: string) {
    await this.firebaseService.addItem(itemData, base64Image);
    // Push to signal
    this.items.update(prev => [{ ...itemData, photo: base64Image }, ...prev]);
  }

  // Delete item and update signal
  async deleteItem(barcode: string) {
    await this.firebaseService.deleteItemByBarcode(barcode);
    this.items.update(prev => prev.filter(i => i.barcode !== barcode));
  }
  
    // Update item and refresh signal
  async updateItem(barcode: string, updatedData: Partial<ItemModel>) {
    await this.firebaseService.updateItem(barcode, updatedData);
    this.items.update(prev =>
      prev.map(item =>
        item.barcode === barcode ? { ...item, ...updatedData } : item
      )
    );
  }

}
