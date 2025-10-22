// src/app/services/item-firebase.service.ts
import { Injectable } from '@angular/core';
import { db } from '../firebase-config.js';
import {collection, orderBy, getDocs, query, where, addDoc, serverTimestamp, deleteDoc, doc} from 'firebase/firestore';
import { ItemModel } from '../models/itemModel.js';
import { updateDoc } from 'firebase/firestore';
import { HistoryFirebaseService } from './history-service.js';
import { AuthService } from './auth-service.js';


@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private historyService: HistoryFirebaseService, private auth : AuthService) {}

  // 🔹 Get item by barcode
  async getItemByCode(code: string): Promise<any | null> {
    try {
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('barcode', '==', code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      }

      return null;
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  }

  // 🔹 Check if item exists
  async checkIfItemExists(barcode: string): Promise<boolean> {
    try {
      const existingItem = await this.getItemByCode(barcode);
      return !!existingItem;
    } catch (error) {
      console.error('Error checking item existence:', error);
      return false;
    }
  }

  // 🔹 Add a new item (with Base64 image)
  async addItem(itemData: Omit<ItemModel, 'photo'>, base64Image: string): Promise<void> {
    try {
      // Check for duplicate barcode
      const exists = await this.checkIfItemExists(itemData.barcode);
      if (exists) throw new Error('Item with this barcode already exists.');

      // Save item in Firestore, include Base64 image in `photo` field
      const itemsRef = collection(db, 'items');
      await addDoc(itemsRef, {
        ...itemData,
        photo: base64Image,      // Store image as Base64 directly
        createdAt: serverTimestamp(),
      });

      //log history
      const currentUser = await this.auth.user();
      await this.historyService.addHistoryElement({
        description: "added item",
        addedBy: currentUser?.Username ?? 'Unknown',
        action: 'added',
        ModifiedItem: itemData.name,
      });
      console.log('✅ Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

    // 🔹 Fetch all items
  async getAllItems(): Promise<ItemModel[]> {
    try {
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, orderBy('createdAt', 'desc')); // optional: order by creation
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as unknown as ItemModel) }));
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  }

  // 🔹 Delete item by barcode
  async deleteItemByBarcode(barcode: string): Promise<void> {
    try {
      const item = await this.getItemByCode(barcode);
      if (!item || !item.id) {
        console.log("⚠️ No item found");
        return;
      }
      await deleteDoc(doc(db, 'items', item.id));

      //log history
      const currentUser = await this.auth.user();
      await this.historyService.addHistoryElement({
        description: "deleted item",
        addedBy: currentUser?.Username ?? 'Unknown',
        action: 'deleted',
        ModifiedItem: item.name,
      });
      console.log("Item deleted successfully");
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

    // 🔹 Update an existing item by barcode
  async updateItem(barcode: string, updatedData: Partial<ItemModel>): Promise<void> {
    try {
      const item = await this.getItemByCode(barcode);
      if (!item || !item.id) {
        throw new Error('Item not found');
      }

      const itemRef = doc(db, 'items', item.id);
      await updateDoc(itemRef, {
        ...updatedData
        // to add optional field for tracking edits
      });

      //log history
      const currentUser = await this.auth.user();
      await this.historyService.addHistoryElement({
        description: "edited item",
        addedBy: currentUser?.Username ?? 'Unknown',
        action: 'edited',
        ModifiedItem: item.name,
      });
      console.log('✅ Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }
// Decrement item quantity by a given amount
async decrementItemQuantity(barcode: string, amount: number = 1): Promise<void> {
  try {
    if (amount <= 0) throw new Error('Amount to decrement must be positive');

    const item = await this.getItemByCode(barcode);
    if (!item || !item.id) throw new Error('Item not found');

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Item quantity is already zero');
    }

    const newQuantity = Math.max(item.quantity - amount, 0); // prevent negative
    const itemRef = doc(db, 'items', item.id);

    await updateDoc(itemRef, { quantity: newQuantity });

    // Log history
    const currentUser = await this.auth.user();
    await this.historyService.addHistoryElement({
      description: `Decreased quantity by ${amount}`,
      addedBy: currentUser?.Username ?? 'Unknown',
      action: 'decremented',
      ModifiedItem: item.name,
    });

    console.log(`✅ Quantity of "${item.name}" decremented by ${amount}. New quantity: ${newQuantity}`);
  } catch (error) {
    console.error('Error decrementing item quantity:', error);
    throw error;
  }
}


}
