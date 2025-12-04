import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Vehicle } from '../services/data.service';

@Component({
  selector: 'app-saved-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col space-y-6 overflow-hidden">
      
      <div class="shrink-0 animate-fade-in-up">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              </div>
              Pipeline de Negociações
            </h2>
            <p class="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Acompanhe e gerencie suas oportunidades em andamento
            </p>
          </div>
          
          <div class="flex gap-2">
            <div class="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/50 rounded-xl px-4 py-2 text-center min-w-[80px]">
              <p class="text-xl font-bold text-cyan-600 dark:text-cyan-400">{{ getCountByStatus('Salvo') }}</p>
              <p class="text-xs text-cyan-600/70 dark:text-cyan-400/70">Salvos</p>
            </div>
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-2 text-center min-w-[80px]">
              <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ getCountByStatus('Em Contato') }}</p>
              <p class="text-xs text-amber-600/70 dark:text-amber-400/70">Em Contato</p>
            </div>
            <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-4 py-2 text-center min-w-[80px]">
              <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ getCountByStatus('Negociando') }}</p>
              <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70">Negociando</p>
            </div>
          </div>
        </div>
      </div>

      <div class="shrink-0 flex flex-wrap gap-2 animate-fade-in-up" style="animation-delay: 100ms;">
        <button 
          (click)="activeFilter.set('all')"
          [class]="activeFilter() === 'all' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all">
          Todos ({{ savedVehicles().length }})
        </button>
        <button 
          (click)="activeFilter.set('Salvo')"
          [class]="activeFilter() === 'Salvo' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" [class]="activeFilter() === 'Salvo' ? 'bg-white' : 'bg-cyan-400'"></span>
          Salvos
        </button>
        <button 
          (click)="activeFilter.set('Em Contato')"
          [class]="activeFilter() === 'Em Contato' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" [class]="activeFilter() === 'Em Contato' ? 'bg-white' : 'bg-amber-400'"></span>
          Em Contato
        </button>
        <button 
          (click)="activeFilter.set('Negociando')"
          [class]="activeFilter() === 'Negociando' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" [class]="activeFilter() === 'Negociando' ? 'bg-white' : 'bg-emerald-400'"></span>
          Negociando
        </button>
        <button 
          (click)="activeFilter.set('Ignorado')"
          [class]="activeFilter() === 'Ignorado' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" [class]="activeFilter() === 'Ignorado' ? 'bg-white' : 'bg-slate-400'"></span>
          Arquivados ({{ getCountByStatus('Ignorado') }})
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 pb-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          @for (vehicle of filteredVehicles(); track vehicle.id; let i = $index) {
            <div class="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-black/30 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up" 
                  [style.animation-delay]="(i * 80) + 'ms'">
              
              <div class="absolute top-4 left-4 z-20">
                <span [class]="getStatusBadgeClass(vehicle.negotiationStatus)" class="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                  {{ vehicle.negotiationStatus }}
                </span>
              </div>
              
              <div class="absolute top-4 right-4 z-20">
                <div class="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  +{{ vehicle.profitMarginPercent | number:'1.0-0' }}%
                </div>
              </div>

              <div class="relative h-48 overflow-hidden">
                <img [src]="vehicle.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-5">
                  <h3 class="text-white font-bold text-xl tracking-tight">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                  <div class="flex items-center gap-3 mt-2 text-sm text-slate-300">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {{ vehicle.year }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      {{ vehicle.km | number:'1.0-0' }} km
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-5 space-y-5">
                
                <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Preço Anunciado</p>
                    <p class="text-xl font-bold text-slate-900 dark:text-white">R$ {{ vehicle.price | number:'1.0-0' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Lucro Estimado</p>
                    <p class="text-xl font-bold text-emerald-500">R$ {{ vehicle.projectedProfit | number:'1.0-0' }}</p>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status da Negociação</label>
                  <div class="relative">
                    <select 
                      [ngModel]="vehicle.negotiationStatus" 
                      (ngModelChange)="dataService.updateStatus(vehicle.id, $event)"
                      class="w-full bg-slate-100 dark:bg-slate-900/80 border-0 rounded-xl p-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-slate-900">
                      <option value="Salvo">💾 Salvo</option>
                      <option value="Em Contato">📞 Em Contato</option>
                      <option value="Negociando">🤝 Negociando</option>
                      <option value="Ignorado">📦 Arquivar</option>
                    </select>
                    <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                   <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Anotações</label>
                   <textarea 
                     [ngModel]="vehicle.notes" 
                     (blur)="updateNotes(vehicle.id, $event)"
                     placeholder="Adicione observações sobre a negociação..."
                     class="w-full h-20 bg-slate-100 dark:bg-slate-900/80 border-0 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none placeholder:text-slate-400 transition-all hover:bg-slate-200 dark:hover:bg-slate-900"
                   ></textarea>
                </div>

                <div class="flex gap-3 pt-2">
                  <button (click)="viewDetails.emit(vehicle)" class="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold text-sm text-center hover:bg-slate-200 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    Ver Detalhes
                  </button>
                  @if (vehicle.negotiationStatus === 'Ignorado') {
                    <button (click)="unarchive(vehicle)" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                      Desarquivar
                    </button>
                  } @else {
                    <button (click)="buy(vehicle)" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Comprado
                    </button>
                  }
                </div>

              </div>
            </div>
          }
          @empty {
            <div class="col-span-full flex flex-col items-center justify-center py-20">
              <div class="relative">
                <div class="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
                <div class="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                  <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </div>
              </div>
              <h3 class="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum anúncio salvo</h3>
              <p class="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                Explore as oportunidades e marque como "Salvo" ou "Em Contato" para acompanhar suas negociações aqui.
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SavedListComponent {
  dataService = inject(DataService);
  activeFilter = signal<string>('all');
  viewDetails = output<Vehicle>();

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
     if(confirm('Confirmar aquisição para estoque?')) {
      this.dataService.addToInventory(vehicle);
    }
  }
}