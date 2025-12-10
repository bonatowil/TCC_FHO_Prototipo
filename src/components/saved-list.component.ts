import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Vehicle } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-saved-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col space-y-4 sm:space-y-6 overflow-hidden">
      
      <div class="shrink-0 animate-fade-in-up">
        <div class="flex flex-col gap-3 sm:gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="p-1.5 sm:p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg sm:rounded-xl">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              </div>
              <div>
                <h2 class="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Pipeline
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                  Gerencie suas oportunidades
                </p>
              </div>
            </div>
            
            <div class="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
              <div class="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-[80px] shrink-0">
                <p class="text-base sm:text-xl font-bold text-cyan-600 dark:text-cyan-400">{{ getCountByStatus('Salvo') }}</p>
                <p class="text-[9px] sm:text-xs text-cyan-600/70 dark:text-cyan-400/70">Salvos</p>
              </div>
              <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-[80px] shrink-0">
                <p class="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400">{{ getCountByStatus('Em Contato') }}</p>
                <p class="text-[9px] sm:text-xs text-amber-600/70 dark:text-amber-400/70">Contato</p>
              </div>
              <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-[80px] shrink-0">
                <p class="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ getCountByStatus('Negociando') }}</p>
                <p class="text-[9px] sm:text-xs text-emerald-600/70 dark:text-emerald-400/70">Negociando</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shrink-0 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 animate-fade-in-up" style="animation-delay: 100ms;">
        <button 
          (click)="activeFilter.set('all')"
          [class]="activeFilter() === 'all' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0">
          Todos ({{ savedVehicles().length }})
        </button>
        <button 
          (click)="activeFilter.set('Salvo')"
          [class]="activeFilter() === 'Salvo' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" [class]="activeFilter() === 'Salvo' ? 'bg-white' : 'bg-cyan-400'"></span>
          Salvos
        </button>
        <button 
          (click)="activeFilter.set('Em Contato')"
          [class]="activeFilter() === 'Em Contato' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" [class]="activeFilter() === 'Em Contato' ? 'bg-white' : 'bg-amber-400'"></span>
          Contato
        </button>
        <button 
          (click)="activeFilter.set('Negociando')"
          [class]="activeFilter() === 'Negociando' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" [class]="activeFilter() === 'Negociando' ? 'bg-white' : 'bg-emerald-400'"></span>
          Negociando
        </button>
        <button 
          (click)="activeFilter.set('Ignorado')"
          [class]="activeFilter() === 'Ignorado' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" [class]="activeFilter() === 'Ignorado' ? 'bg-white' : 'bg-slate-400'"></span>
          Arquivados
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-1 sm:pr-2 pb-20 md:pb-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          @for (vehicle of filteredVehicles(); track vehicle.id; let i = $index) {
            <div class="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up" 
                  [style.animation-delay]="(i * 60) + 'ms'">
              
              <div class="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
                <span [class]="getStatusBadgeClass(vehicle.negotiationStatus)" class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1 sm:gap-1.5">
                  <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-current opacity-70"></span>
                  {{ vehicle.negotiationStatus }}
                </span>
              </div>
              
              <div class="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
                <div class="bg-emerald-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1">
                  <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  +{{ vehicle.profitMarginPercent | number:'1.0-0' }}%
                </div>
              </div>

              <div class="relative h-36 sm:h-48 overflow-hidden">
                <img [src]="vehicle.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                  <h3 class="text-white font-bold text-base sm:text-xl tracking-tight">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                  <div class="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs sm:text-sm text-slate-300">
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {{ vehicle.year }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      {{ vehicle.km | number:'1.0-0' }} km
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-3 sm:p-5 space-y-3 sm:space-y-5">
                
                <div class="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl">
                  <div>
                    <p class="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Preço</p>
                    <p class="text-base sm:text-xl font-bold text-slate-900 dark:text-white">R$ {{ vehicle.price | number:'1.0-0' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Lucro Est.</p>
                    <p class="text-base sm:text-xl font-bold text-emerald-500">R$ {{ vehicle.projectedProfit | number:'1.0-0' }}</p>
                  </div>
                </div>
                
                <div class="space-y-1.5 sm:space-y-2">
                  <label class="text-[9px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                  <div class="relative">
                    <select 
                      [ngModel]="vehicle.negotiationStatus" 
                      (ngModelChange)="dataService.updateStatus(vehicle.id, $event)"
                      class="w-full bg-slate-100 dark:bg-slate-900/80 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-slate-900">
                      <option value="Salvo">💾 Salvo</option>
                      <option value="Em Contato">📞 Em Contato</option>
                      <option value="Negociando">🤝 Negociando</option>
                      <option value="Ignorado">📦 Arquivar</option>
                    </select>
                    <div class="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div class="space-y-1.5 sm:space-y-2">
                   <label class="text-[9px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notas</label>
                   <textarea 
                     [ngModel]="vehicle.notes" 
                     (blur)="updateNotes(vehicle.id, $event)"
                     placeholder="Observações..."
                     class="w-full h-16 sm:h-20 bg-slate-100 dark:bg-slate-900/80 border-0 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none placeholder:text-slate-400 transition-all"
                   ></textarea>
                </div>

                <div class="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <button (click)="viewDetails.emit(vehicle)" class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm text-center hover:bg-slate-200 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-1.5 sm:gap-2">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span class="hidden sm:inline">Ver</span> Detalhes
                  </button>
                  @if (vehicle.negotiationStatus === 'Ignorado') {
                    <button (click)="unarchive(vehicle)" class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95">
                      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                      Restaurar
                    </button>
                  } @else {
                    <button (click)="buy(vehicle)" class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95">
                      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Comprado
                    </button>
                  }
                </div>

              </div>
            </div>
          }
          @empty {
            <div class="col-span-full flex flex-col items-center justify-center py-12 sm:py-20">
              <div class="relative">
                <div class="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
                <div class="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
                  <svg class="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </div>
              </div>
              <h3 class="text-base sm:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum anúncio salvo</h3>
              <p class="text-slate-500 dark:text-slate-400 text-center max-w-sm text-xs sm:text-sm px-4">
                Explore as oportunidades e salve para acompanhar suas negociações.
              </p>
            </div>
          }
        </div>
      </div>
    </div>

    @if (confirmBuyItem()) {
      <div class="fixed inset-0 z-[70] flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="cancelBuy()"></div>
        <div class="relative w-full max-w-md glass-card rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 animate-fade-in-up">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs uppercase font-bold text-slate-500">Confirmar aquisição</p>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white truncate">
                Mover {{ confirmBuyItem()?.brand }} {{ confirmBuyItem()?.model }} para estoque?
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                O anúncio sairá da lista de salvos e entrará no estoque.
              </p>
            </div>
            <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10" (click)="cancelBuy()">
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" (click)="cancelBuy()">
              Cancelar
            </button>
            <button class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors" (click)="confirmBuy()">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class SavedListComponent {
  dataService = inject(DataService);
  toast = inject(ToastService);
  activeFilter = signal<string>('all');
  viewDetails = output<Vehicle>();
  confirmBuyItem = signal<Vehicle | null>(null);

  savedVehicles = computed(() => {
    return this.dataService.opportunities().filter(v => 
      ['Salvo', 'Em Contato', 'Negociando'].includes(v.negotiationStatus)
    );
  });

  archivedVehicles = computed(() => {
    return this.dataService.opportunities().filter(v => v.negotiationStatus === 'Ignorado');
  });

  filteredVehicles = computed(() => {
    if (this.activeFilter() === 'all') {
      return this.savedVehicles();
    }
    if (this.activeFilter() === 'Ignorado') {
      return this.archivedVehicles();
    }
    return this.savedVehicles().filter(v => v.negotiationStatus === this.activeFilter());
  });

  getCountByStatus(status: string): number {
    if (status === 'Ignorado') {
      return this.archivedVehicles().length;
    }
    return this.savedVehicles().filter(v => v.negotiationStatus === status).length;
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'Salvo': 'bg-cyan-500 text-white',
      'Em Contato': 'bg-amber-500 text-white',
      'Negociando': 'bg-emerald-500 text-white',
      'Ignorado': 'bg-slate-500 text-white'
    };
    return classes[status] || 'bg-slate-500 text-white';
  }

  updateNotes(id: string, event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.dataService.updateNotes(id, val);
  }

  unarchive(vehicle: Vehicle) {
    this.dataService.updateStatus(vehicle.id, 'Salvo');
  }

  buy(vehicle: Vehicle) {
    this.confirmBuyItem.set(vehicle);
  }

  confirmBuy() {
    const v = this.confirmBuyItem();
    if (!v) return;
    this.dataService.addToInventory(v);
    this.confirmBuyItem.set(null);
    this.toast.add('Veículo movido para estoque');
  }

  cancelBuy() {
    this.confirmBuyItem.set(null);
  }
}
