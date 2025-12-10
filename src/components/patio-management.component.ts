import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Patio } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-patio-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col overflow-hidden animate-fade-in-up">
      
      <!-- Header -->
      <div class="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Pátios
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastre e gerencie os pátios
          </p>
        </div>
        <button 
          (click)="showForm.set(true)" 
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-sm">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Novo Pátio
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto pr-1 sm:pr-2 pb-20 md:pb-4 space-y-4 sm:space-y-6">

        <!-- Form Modal/Card -->
        @if (showForm()) {
          <div class="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-fade-in-up">
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              {{ editingPatio() ? 'Editar Pátio' : 'Novo Pátio' }}
            </h3>
            
            <form (ngSubmit)="savePatio()" class="space-y-4">
              @if (errorMessage()) {
                <div class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ errorMessage() }}
                </div>
              }
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Nome do Pátio *
                  </label>
                  <input 
                    [(ngModel)]="formData.name"
                    name="name"
                    type="text" 
                    [class.border-red-500]="submitted() && !formData.name"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                </div>
                
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Cidade *
                  </label>
                  <input 
                    [(ngModel)]="formData.city"
                    name="city"
                    type="text" 
                    [class.border-red-500]="submitted() && !formData.city"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                </div>
                
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Estado *
                  </label>
                  <input 
                    [(ngModel)]="formData.state"
                    name="state"
                    type="text" 
                    maxlength="2"
                    placeholder="SP"
                    [class.border-red-500]="submitted() && !formData.state"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm uppercase">
                </div>
                
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Endereço *
                  </label>
                  <input 
                    [(ngModel)]="formData.address"
                    name="address"
                    type="text" 
                    [class.border-red-500]="submitted() && !formData.address"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                </div>
              </div>
              
              <div class="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="formData.isActive"
                    name="isActive"
                    class="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500">
                  <span class="text-xs sm:text-sm text-slate-700 dark:text-slate-300">Pátio Ativo</span>
                </label>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button 
                  type="submit"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors text-sm">
                  Salvar
                </button>
                <button 
                  type="button"
                  (click)="cancelForm()"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        }

        <!-- Patio Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          @for (patio of dataService.patios(); track patio.id) {
            <div class="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:scale-[1.02] transition-transform duration-300" [class.opacity-50]="!patio.isActive">
              <div class="flex items-start justify-between mb-3 sm:mb-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">{{ patio.name }}</h3>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">{{ patio.city }}, {{ patio.state }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0 ml-2">
                  @if (patio.isActive) {
                    <span class="px-2 py-0.5 sm:py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-xs font-bold">
                      Ativo
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 sm:py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] sm:text-xs font-bold">
                      Inativo
                    </span>
                  }
                </div>
              </div>
              
              <div class="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span class="truncate">{{ patio.address }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {{ patio.createdAt | date:'dd/MM/yyyy' }}
                </div>
                <div class="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  {{ getVehicleCount(patio.id) }} veículos
                </div>
              </div>
              
              <div class="flex gap-2 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                <button 
                  (click)="editPatio(patio)"
                  class="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs sm:text-sm">
                  Editar
                </button>
                <button 
                  (click)="togglePatioStatus(patio)"
                  [class]="patio.isActive ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'"
                  class="flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity text-xs sm:text-sm">
                  {{ patio.isActive ? 'Desativar' : 'Ativar' }}
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class PatioManagementComponent {
  dataService = inject(DataService);
  toast = inject(ToastService);
  showForm = signal(false);
  editingPatio = signal<Patio | null>(null);
  errorMessage = signal('');
  submitted = signal(false);
  
  formData = {
    name: '',
    address: '',
    city: '',
    state: '',
    isActive: true
  };

  getVehicleCount(patioId: string): number {
    return this.dataService.getInventoryByPatio(patioId).length;
  }

  editPatio(patio: Patio) {
    this.editingPatio.set(patio);
    this.formData = {
      name: patio.name,
      address: patio.address,
      city: patio.city,
      state: patio.state,
      isActive: patio.isActive
    };
    this.showForm.set(true);
  }

  savePatio() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (!this.formData.name.trim()) {
      this.errorMessage.set('Preencha o nome do pátio');
      return;
    }
    if (!this.formData.city.trim()) {
      this.errorMessage.set('Preencha a cidade');
      return;
    }
    if (!this.formData.state.trim()) {
      this.errorMessage.set('Preencha o estado');
      return;
    }
    if (!this.formData.address.trim()) {
      this.errorMessage.set('Preencha o endereço');
      return;
    }

    if (this.editingPatio()) {
      this.dataService.updatePatio(this.editingPatio()!.id, this.formData);
      this.toast.add('Pátio atualizado');
    } else {
      this.dataService.addPatio(this.formData);
      this.toast.add('Pátio criado');
    }
    this.cancelForm();
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingPatio.set(null);
    this.errorMessage.set('');
    this.submitted.set(false);
    this.formData = {
      name: '',
      address: '',
      city: '',
      state: '',
      isActive: true
    };
  }

  togglePatioStatus(patio: Patio) {
    this.dataService.updatePatio(patio.id, { isActive: !patio.isActive });
    this.toast.add(patio.isActive ? 'Pátio desativado' : 'Pátio ativado', 'info');
  }
}
