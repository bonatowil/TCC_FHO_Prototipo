
import { Component, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard.component';
import { OpportunityListComponent } from './components/opportunity-list.component';
import { VehicleAnalysisComponent } from './components/vehicle-analysis.component';
import { SavedListComponent } from './components/saved-list.component'; 
import { AuthComponent } from './components/auth.component';
import { ManualEntryComponent } from './components/manual-entry.component';
import { PatioManagementComponent } from './components/patio-management.component';
import { SettingsComponent } from './components/settings.component';
import { UserManagementComponent } from './components/user-management.component';
import { DataService, Vehicle } from './services/data.service';

type View = 'dashboard' | 'opportunities' | 'saved' | 'inventory' | 'settings' | 'patios' | 'users';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardComponent, OpportunityListComponent, VehicleAnalysisComponent, AuthComponent, SavedListComponent, ManualEntryComponent, PatioManagementComponent, SettingsComponent, UserManagementComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  currentView = signal<View>('dashboard');
  selectedVehicle = signal<Vehicle | null>(null);
  showManualEntry = signal(false);
  showNotifications = signal(false);
  darkMode = signal(true);
  selectedPatioFilter: string | null = null; 

  savedCount = computed(() => {
    return this.dataService.opportunities().filter(v => ['Salvo', 'Em Contato', 'Negociando'].includes(v.negotiationStatus)).length;
  });

  newCount = computed(() => {
    return this.dataService.opportunities().filter(v => v.negotiationStatus === 'Novo').length;
  });

  constructor(public dataService: DataService) {
    effect(() => {
      if (!this.dataService.currentUser()) {
        this.selectedVehicle.set(null);
        this.currentView.set('dashboard');
      }
    });
  }

  toggleTheme() {
    this.darkMode.update(v => !v);
  }

  navigateTo(view: View) {
    this.currentView.set(view);
    this.selectedVehicle.set(null);
  }

  showDetails(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
  }

  backToOpps() {
    this.selectedVehicle.set(null);
  }
  
  handleNotificationClick(notif: any) {
    this.dataService.markNotificationAsRead(notif.id);
    if (notif.vehicleId) {
      const vehicle = this.dataService.opportunities().find(v => v.id === notif.vehicleId) || 
                     this.dataService.inventory().find(v => v.id === notif.vehicleId);
      if (vehicle) {
        this.showDetails(vehicle);
        this.navigateTo('opportunities');
      }
    }
    this.showNotifications.set(false);
  }
  
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'high_margin': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'fraud_alert': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      'stagnant_stock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      'price_drop': 'M13 17h8m0 0V9m0 8l-8-8-4 4-6 6',
      'new_opportunity': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    };
    return icons[type] || icons['new_opportunity'];
  }
  
  getNotificationIconClass(type: string): string {
    const classes: Record<string, string> = {
      'high_margin': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      'fraud_alert': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      'stagnant_stock': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'price_drop': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'new_opportunity': 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
    };
    return classes[type] || classes['new_opportunity'];
  }
  
  getFilteredInventory(): Vehicle[] {
    if (!this.selectedPatioFilter || this.selectedPatioFilter === '') {
      return this.dataService.inventory();
    }
    return this.dataService.getInventoryByPatio(this.selectedPatioFilter);
  }
  
  onPatioFilterChange(value: string) {
    this.selectedPatioFilter = value === '' ? null : value;
  }
}
