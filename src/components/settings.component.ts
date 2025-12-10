import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col overflow-hidden animate-fade-in-up">
      
      <div class="shrink-0 mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          Configurações
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure parâmetros e regras de negócio
        </p>
      </div>
      
      <div class="flex-1 overflow-y-auto pr-1 sm:pr-2 pb-20 md:pb-6 space-y-4 sm:space-y-6">

        <div class="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Margens de Lucro
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                Margem Alvo (%)
              </label>
              <input 
                [(ngModel)]="settings().targetProfitMargin"
                type="number" 
                min="0"
                max="100"
                step="0.1"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Margem ideal desejada</p>
            </div>
            
            <div>
              <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                Margem Mín. Oportunidade (%)
              </label>
              <input 
                [(ngModel)]="settings().minimumProfitMargin"
                type="number" 
                min="0"
                max="100"
                step="0.1"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Mínimo para oportunidade</p>
            </div>
            
            <div>
              <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                Margem Alerta (%)
              </label>
              <input 
                [(ngModel)]="settings().alertProfitMargin"
                type="number" 
                min="0"
                max="100"
                step="0.1"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Dispara alerta ao exceder</p>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
            Marcas de Interesse
          </h3>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="flex flex-wrap gap-1.5 sm:gap-2">
              @for (brand of settings().interestedBrands; track brand) {
                <span class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  {{ brand }}
                  <button 
                    (click)="removeBrand(brand)"
                    class="hover:text-primary-900 dark:hover:text-primary-100">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </span>
              }
            </div>
            
            <div class="flex flex-col sm:flex-row gap-2">
              <input 
                [(ngModel)]="newBrand"
                type="text" 
                placeholder="Adicionar marca..."
                (keyup.enter)="addBrand()"
                class="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <button 
                (click)="addBrand()"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg sm:rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors text-sm">
                Adicionar
              </button>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            Alertas e Notificações
          </h3>
          
          <div class="space-y-2 sm:space-y-4">
            <label class="flex items-start sm:items-center gap-3 cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input 
                type="checkbox" 
                [(ngModel)]="settings().alertEmailEnabled"
                class="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500 mt-0.5 sm:mt-0">
              <div class="flex-1">
                <span class="font-medium text-slate-900 dark:text-white text-sm sm:text-base">Alertas por e-mail</span>
                <p class="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400">Receba notificações por e-mail</p>
              </div>
            </label>
            
            <label class="flex items-start sm:items-center gap-3 cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input 
                type="checkbox" 
                [(ngModel)]="settings().alertNotificationEnabled"
                class="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500 mt-0.5 sm:mt-0">
              <div class="flex-1">
                <span class="font-medium text-slate-900 dark:text-white text-sm sm:text-base">Notificações no sistema</span>
                <p class="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400">Exibir alertas na interface</p>
              </div>
            </label>
          </div>
        </div>

        <div class="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Regras de Negócio
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                Dias Alerta Giro
              </label>
              <input 
                [(ngModel)]="settings().stagnantDaysThreshold"
                type="number" 
                min="1"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Dias sem giro para alerta</p>
            </div>
            
            <div>
              <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                Suspeita Fraude (%)
              </label>
              <input 
                [(ngModel)]="settings().fraudSuspicionThreshold"
                type="number" 
                min="0"
                max="100"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Preço abaixo da FIPE</p>
            </div>
            
            <div>
              <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                Discrepância KM
              </label>
              <input 
                [(ngModel)]="settings().kmDiscrepancyThreshold"
                type="number" 
                min="0"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">KM mínimo por ano</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center sm:justify-end pt-2 sm:pt-4">
          <button 
            (click)="saveSettings()"
            class="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors text-sm sm:text-base">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  dataService = inject(DataService);
  settings = this.dataService.settings;
  newBrand = '';
  toast = inject(ToastService);

  addBrand() {
    if (this.newBrand.trim() && !this.settings().interestedBrands.includes(this.newBrand.trim())) {
      const updatedBrands = [...this.settings().interestedBrands, this.newBrand.trim()];
      this.dataService.updateSettings({ interestedBrands: updatedBrands });
      this.newBrand = '';
      this.toast.add('Marca adicionada');
    }
  }

  removeBrand(brand: string) {
    const updatedBrands = this.settings().interestedBrands.filter(b => b !== brand);
    this.dataService.updateSettings({ interestedBrands: updatedBrands });
    this.toast.add('Marca removida', 'info');
  }

  saveSettings() {
    this.dataService.updateSettings(this.settings());
    this.toast.add('Configurações salvas');
  }
}
