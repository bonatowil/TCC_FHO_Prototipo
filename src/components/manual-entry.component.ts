
import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-manual-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="cancel.emit()"></div>
      
      <div class="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-fade-in-up">

        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </span>
            Nova Entrada Manual
          </h2>
          <button (click)="cancel.emit()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-6 space-y-4">

          @if (errorMessage) {
            <div class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ errorMessage }}
            </div>
          }
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase">Marca *</label>
              <input [(ngModel)]="brand" type="text" placeholder="Ex: Honda" [class.border-red-500]="submitted && !brand" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white">
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase">Modelo *</label>
              <input [(ngModel)]="model" type="text" placeholder="Ex: Civic" [class.border-red-500]="submitted && !model" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Versão</label>
            <input [(ngModel)]="version" type="text" placeholder="Ex: Touring 1.5 Turbo" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white">
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase">Ano</label>
              <input [(ngModel)]="year" type="number" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white">
            </div>
            <div class="space-y-1 col-span-2">
              <label class="text-xs font-bold text-slate-500 uppercase">Quilometragem</label>
              <input [(ngModel)]="km" type="number" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Imagem do Veículo</label>
            <div class="flex items-center gap-4">
              @if (imagePreview) {
                <div class="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img [src]="imagePreview" class="w-full h-full object-cover">
                  <button (click)="removeImage()" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              }
              <label class="flex-1 cursor-pointer">
                <div class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-sm text-slate-600 dark:text-slate-400">{{ imagePreview ? 'Trocar imagem' : 'Selecionar imagem' }}</span>
                </div>
                <input type="file" accept="image/*" (change)="onImageSelected($event)" class="hidden">
              </label>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
             <div class="space-y-1">
                <label class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Valor Pago (Custo)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-slate-400 font-bold">R$</span>
                  <input 
                    [value]="priceFormatted" 
                    (input)="onPriceInput($event)"
                    type="text" 
                    placeholder="0,00"
                    [class.border-red-500]="submitted && price <= 0"
                    class="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold text-slate-900 dark:text-white">
                </div>
             </div>
          </div>

        </div>
  
        <div class="p-6 pt-0 flex gap-3">
          <button (click)="cancel.emit()" class="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancelar
          </button>
          <button (click)="submit()" class="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95">
            Registrar Veículo
          </button>
        </div>

      </div>
    </div>
  `
})
export class ManualEntryComponent {
  cancel = output<void>();
  save = output<void>();
  
  dataService = inject(DataService);

  brand = '';
  model = '';
  version = '';
  year = new Date().getFullYear();
  km = 0;
  price = 0;
  priceFormatted = '';
  imagePreview: string | null = null;
  errorMessage = '';
  submitted = false;

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value === '') {
      this.price = 0;
      this.priceFormatted = '';
      return;
    }
    
    const numericValue = parseInt(value, 10);
    this.price = numericValue / 100;
    
    this.priceFormatted = (numericValue / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
  }

  submit() {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.brand.trim()) {
      this.errorMessage = 'Preencha a marca do veículo';
      return;
    }
    if (!this.model.trim()) {
      this.errorMessage = 'Preencha o modelo do veículo';
      return;
    }
    if (this.price <= 0) {
      this.errorMessage = 'Informe o valor pago pelo veículo';
      return;
    }

    this.dataService.addManualInventoryItem({
      brand: this.brand,
      model: this.model,
      version: this.version || 'Versão Base',
      year: this.year,
      km: this.km,
      price: this.price,
      image: this.imagePreview
    });
    this.save.emit();
  }
}
