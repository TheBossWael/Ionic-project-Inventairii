import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonList, IonItem, IonLabel, IonSpinner, IonContent, IonAvatar, IonIcon, IonHeader, IonToolbar, IonTitle, IonSearchbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service';
import { HistoryElementModel } from 'src/app/models/historyElementModel';
import { HistoryFirebaseService } from 'src/app/services/history-service';


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonSpinner, IonList, IonItem, IonLabel, IonContent, IonAvatar, IonIcon, IonHeader, IonToolbar, IonTitle, IonSearchbar],
})
export class HistoryPage implements OnInit {
  authorized = signal(false); // writable signal
  historyElements = signal<HistoryElementModel[]>([]);
  loading = signal(true);
  searchQuery = signal(''); // search input

  constructor(private auth: AuthService, private firebase: HistoryFirebaseService) {}

async ngOnInit() {
  this.loading.set(true);

  try {
    // wait 2 seconds before checking authorization
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = await this.auth.user(); // make sure this returns a Promise
    const isManager = !!user && user.role === 'manager';
    this.authorized.set(isManager);

    if (isManager) {
      // Subscribe to changes in the history collection
      this.firebase.subscribeToHistory((data) => {
        this.historyElements.set(data);
      });
    }
  } catch (err) {
    console.error('Error fetching user or history:', err);
  } finally {
    this.loading.set(false);
  }
}

  getIcon(action: string): string {
  switch (action) {
    case 'added': return 'add-circle-outline';
    case 'edited': return 'create-outline';
    case 'deleted': return 'trash-outline';
    case 'decremented': return 'remove-circle-outline';
    default: return 'information-circle-outline';
  }
}

getColor(action: string): string {
  switch (action) {
    case 'added': return '#28a745';     // Green
    case 'edited': return '#ffc107';    // Yellow
    case 'deleted': return '#dc3545';   // Red
    case 'decremented': return '#17a2b8'; // Blue
    default: return 'gray';
  }
}

getActionText(action: string): string {
  switch (action) {
    case 'added': return 'has added the item';
    case 'edited': return 'has edited the item';
    case 'deleted': return 'has deleted the item';
    case 'decremented': return 'has decreased the quantity of';
    default: return 'performed an action on';
  }
}

  // Computed: filtered entries based on search
  get filteredEntries() {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.historyElements();
    return this.historyElements().filter(entry =>
      entry.ModifiedItem.toLowerCase().includes(q) ||
      entry.addedBy.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q)
    );
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.detail.value || '');
  }

}

