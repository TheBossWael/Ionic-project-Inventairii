// src/app/services/history-service.ts
import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, orderBy, query, getFirestore, Timestamp,onSnapshot } from 'firebase/firestore';
import { HistoryElementModel } from '../models/historyElementModel';

@Injectable({
  providedIn: 'root'
})
export class HistoryFirebaseService {
  private db = getFirestore();

  constructor() {}

  // 🔹 Add a history element
  async addHistoryElement(element: Omit<HistoryElementModel, 'time'>): Promise<void> {
    try {
      const historyRef = collection(this.db, 'history');
      await addDoc(historyRef, {
        ...element,
        time: Timestamp.now() // server timestamp
      });
      console.log('✅ History element added:', element);
    } catch (error) {
      console.error('❌ Error adding history element:', error);
      throw error;
    }
  }

  // 🔹 Get all history elements (ordered by time descending)
  async getAllHistory(): Promise<HistoryElementModel[]> {
    try {
      const historyRef = collection(this.db, 'history');
      const q = query(historyRef, orderBy('time', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data() as HistoryElementModel;
        return {
          ...data,
          time: (data.time as any)?.toDate?.() ?? new Date()
        };
      });
    } catch (error) {
      console.error('❌ Error fetching history:', error);
      return [];
    }
  }


  subscribeToHistory(callback: (data: HistoryElementModel[]) => void) {
    const historyRef = collection(this.db, 'history');
    const q = query(historyRef, orderBy('time', 'desc'));

    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data() as HistoryElementModel;
        return { ...d, time: (d.time as any)?.toDate?.() ?? new Date() };
      });
      callback(data);
    });
  }

}
