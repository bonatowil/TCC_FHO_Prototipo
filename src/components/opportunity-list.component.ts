
import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Vehicle } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full gap-4 md:gap-6 overflow-hidden pb-4">
      
      <div class="shrink-0 flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/20 dark:border-white/5 z-20 animate-fade-in-up shadow-sm">
          <div class="flex-1 min-w-0">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recomendações</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ filteredVehicles().length }} veículos validados e seguros.
            </p>
          </div>
          
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button 
              (click)="showMobileFilters.set(!showMobileFilters())"
              class="lg:hidden flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Filtros
              @if (hasActiveFilters()) {
                <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
              }
            </button>
            
            <div class="relative flex-1 sm:flex-none group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                (input)="updateSearch($event)"
                placeholder="Buscar..." 
                class="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full sm:w-40 transition-all shadow-sm"
              >
            </div>

            <button (click)="toggleSort()" class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
              <span class="hidden sm:inline">{{ sortOrder === 'margin' ? 'Margem' : 'Recentes' }}</span>
            </button>
          </div>
        </div>

  @if (confirmRemove()) {
    <div class="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="cancelRemove()"></div>
      <div class="relative w-full max-w-md glass-card rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 animate-fade-in-up">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"></path></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs uppercase font-bold text-slate-500">Remover anúncio</p>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Não verá mais este anúncio nas oportunidades.
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Confirma remover {{ confirmRemove()?.brand }} {{ confirmRemove()?.model }}?
            </p>
          </div>
          <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10" (click)="cancelRemove()">
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" (click)="cancelRemove()">
            Cancelar
          </button>
          <button class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors" (click)="confirmRemoveNow()">
            Remover anúncio
          </button>
        </div>
      </div>
    </div>
  }
      </div>

      <div class="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-6 overflow-hidden min-h-0">
        
        @if (showMobileFilters()) {
          <div class="lg:hidden fixed inset-0 z-50 flex flex-col">
            <div class="absolute inset-0 bg-black/50" (click)="showMobileFilters.set(false)"></div>
            
            <div class="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white dark:bg-slate-900 rounded-t-3xl overflow-hidden animate-slide-up safe-area-bottom">
              <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">Filtros</h3>
                <div class="flex items-center gap-2">
                  <button (click)="resetFilters()" class="text-sm font-bold text-primary-500 hover:text-primary-400">Limpar</button>
                  <button (click)="showMobileFilters.set(false)" class="p-2 text-slate-400 hover:text-slate-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
              
              <div class="overflow-y-auto p-4 space-y-6 max-h-[calc(80vh-60px)]">
                <div class="space-y-4">
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Marca</p>
                  <div class="flex flex-wrap gap-2">
                    @for (brand of commonBrands; track brand) {
                      <button 
                        (click)="toggleBrand(brand)"
                        [class.bg-primary-500]="filters.selectedBrand === brand"
                        [class.text-white]="filters.selectedBrand === brand"
                        [class.bg-slate-100]="filters.selectedBrand !== brand"
                        [class.dark:bg-slate-800]="filters.selectedBrand !== brand"
                        [class.text-slate-600]="filters.selectedBrand !== brand"
                        [class.dark:text-slate-400]="filters.selectedBrand !== brand"
                        class="px-3 py-2 text-sm rounded-xl font-semibold transition-colors">
                        {{ brand }}
                      </button>
                    }
                  </div>
                </div>

                <div class="space-y-4">
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Modelo</p>
                  <input 
                    type="text" 
                    [(ngModel)]="filters.model"
                    placeholder="Ex: Civic, Corolla..."
                    class="w-full px-4 py-3 text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>

                <div class="space-y-4">
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ano</p>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="flex justify-between mb-2">
                        <span class="text-sm text-slate-500">Mínimo</span>
                        <span class="text-sm font-bold text-slate-900 dark:text-white">{{ filters.minYear }}</span>
                      </div>
                      <input type="range" min="2015" max="2025" step="1" [(ngModel)]="filters.minYear" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                    </div>
                    <div>
                      <div class="flex justify-between mb-2">
                        <span class="text-sm text-slate-500">Máximo</span>
                        <span class="text-sm font-bold text-slate-900 dark:text-white">{{ filters.maxYear || 2025 }}</span>
                      </div>
                      <input type="range" min="2015" max="2025" step="1" [(ngModel)]="filters.maxYear" [value]="filters.maxYear || 2025" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Margem Mínima</p>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-slate-500">Margem</span>
                    <span class="text-sm font-bold text-emerald-500">{{ filters.minMargin }}%</span>
                  </div>
                  <input type="range" min="0" max="30" step="1" [(ngModel)]="filters.minMargin" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                </div>

                <div class="space-y-4">
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Preço Máximo</p>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-slate-500">Até</span>
                    <span class="text-sm font-bold text-slate-900 dark:text-white">R$ {{ (filters.maxPrice || 500000) / 1000 }}k</span>
                  </div>
                  <input type="range" min="0" max="500000" step="10000" [(ngModel)]="filters.maxPrice" [value]="filters.maxPrice || 500000" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                </div>

                <button 
                  (click)="showMobileFilters.set(false)"
                  class="w-full py-4 bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        }

        <aside class="hidden lg:flex shrink-0 w-72 flex-col h-full min-h-0">
          <div class="glass-card rounded-2xl p-5 flex flex-col h-full overflow-y-auto animate-fade-in-up">
            
            <div class="flex items-center justify-between mb-6 shrink-0">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                Filtros
              </h3>
              <button (click)="resetFilters()" class="text-xs font-bold text-primary-500 hover:text-primary-400">Limpar</button>
            </div>

            <div class="space-y-6">
              
              <div class="space-y-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Veículo</p>
                
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Marca</label>
                  <div class="flex flex-wrap gap-2">
                    @for (brand of commonBrands; track brand) {
                      <button 
                        (click)="toggleBrand(brand)"
                        [class.bg-primary-500]="filters.selectedBrand === brand"
                        [class.text-white]="filters.selectedBrand === brand"
                        [class.bg-slate-100]="filters.selectedBrand !== brand"
                        [class.dark:bg-slate-800]="filters.selectedBrand !== brand"
                        [class.text-slate-600]="filters.selectedBrand !== brand"
                        [class.dark:text-slate-400]="filters.selectedBrand !== brand"
                        class="px-2.5 py-1 text-xs rounded-full font-semibold transition-colors hover:bg-primary-500 hover:text-white">
                        {{ brand }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Modelo</label>
                  <input 
                    type="text" 
                    [(ngModel)]="filters.model"
                    placeholder="Ex: Civic, Corolla..."
                    class="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <div class="flex justify-between mb-1">
                      <span class="text-xs text-slate-500">Ano Min.</span>
                      <span class="text-xs font-bold text-slate-900 dark:text-white">{{ filters.minYear }}</span>
                    </div>
                    <input type="range" min="2015" max="2025" step="1" [(ngModel)]="filters.minYear" class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                  </div>
                  <div>
                    <div class="flex justify-between mb-1">
                      <span class="text-xs text-slate-500">Ano Max.</span>
                      <span class="text-xs font-bold text-slate-900 dark:text-white">{{ filters.maxYear || 2025 }}</span>
                    </div>
                    <input type="range" min="2015" max="2025" step="1" [(ngModel)]="filters.maxYear" [value]="filters.maxYear || 2025" class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <div class="flex justify-between mb-1">
                      <span class="text-xs text-slate-500">Km Min.</span>
                      <span class="text-xs font-bold text-slate-900 dark:text-white">{{ (filters.minKm || 0) / 1000 }}k</span>
                    </div>
                    <input type="range" min="0" max="150000" step="5000" [(ngModel)]="filters.minKm" [value]="filters.minKm || 0" class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                  </div>
                  <div>
                    <div class="flex justify-between mb-1">
                      <span class="text-xs text-slate-500">Km Max.</span>
                      <span class="text-xs font-bold text-slate-900 dark:text-white">{{ filters.maxKm / 1000 }}k</span>
                    </div>
                    <input type="range" min="0" max="150000" step="5000" [(ngModel)]="filters.maxKm" class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                  </div>
                </div>
              </div>

              <div class="space-y-3 pb-4 border-b border-slate-100 dark:border-white/5">
                 <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Financeiro</p>
                 
                 <div>
                   <div class="flex justify-between mb-1">
                     <span class="text-xs text-slate-500">Margem Min.</span>
                     <span class="text-xs font-bold text-emerald-500">{{ filters.minMargin }}%</span>
                   </div>
                   <input type="range" min="0" max="30" step="1" [(ngModel)]="filters.minMargin" class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                </div>
                
                <div>
                   <div class="flex justify-between mb-1">
                     <span class="text-xs text-slate-500">Preço Máx.</span>
                     <span class="text-xs font-bold text-slate-900 dark:text-white">R$ {{ (filters.maxPrice || 500000) / 1000 }}k</span>
                   </div>
                   <input type="range" min="0" max="500000" step="10000" [(ngModel)]="filters.maxPrice" [value]="filters.maxPrice || 500000" class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
                </div>
              </div>

              <div class="space-y-3">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Geolocalização</p>
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Estado</label>
                  <select 
                    [(ngModel)]="filters.location"
                    class="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Todos os Estados</option>
                    @for (state of ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'GO', 'PE', 'CE', 'DF']; track state) {
                      <option [value]="state">{{ state }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">Cidade</label>
                  <input 
                    type="text" 
                    [(ngModel)]="filters.city"
                    placeholder="Ex: São Paulo..."
                    class="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>
              </div>
              
            </div>
          </div>
        </aside>

        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div class="flex-1 overflow-y-auto pr-1 md:pr-2 pb-20 md:pb-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              @for (vehicle of filteredVehicles(); track vehicle.id; let i = $index) {
                <div class="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30 transition-all duration-300 flex flex-col hover:-translate-y-1 animate-fade-in-up opacity-0" 
                     [style.animation-delay]="(i * 80) + 'ms'" 
                     style="animation-fill-mode: forwards;">
                  
                  <div class="relative h-40 sm:h-48 overflow-hidden shrink-0">
                    <img [src]="vehicle.image" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    
                    <div class="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-2">
                      <span class="px-2 py-1 rounded-md bg-white/20 backdrop-blur text-[10px] sm:text-xs font-medium text-white border border-white/10">
                        {{ vehicle.source }}
                      </span>
                      @if (vehicle.negotiationStatus !== 'Novo') {
                         <span class="px-2 py-1 rounded-md bg-accent-500 text-white text-[10px] sm:text-xs font-bold shadow-sm animate-pulse">
                           {{ vehicle.negotiationStatus }}
                         </span>
                      }
                    </div>

                    <div class="absolute top-2 sm:top-3 right-2 sm:right-3">
                       <div class="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500 text-white text-[10px] sm:text-xs font-bold shadow-lg shadow-emerald-500/20">
                         <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                         {{ vehicle.profitMarginPercent | number:'1.0-0' }}%
                       </div>
                    </div>

                    <div class="absolute bottom-2 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 class="text-white font-bold text-base sm:text-lg leading-tight">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                      <p class="text-slate-300 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{{ vehicle.version }} • {{ vehicle.year }}</p>
                    </div>
                  </div>

                  <div class="p-3 sm:p-5 flex-1 flex flex-col">
                    <div class="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div class="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <p class="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Preço</p>
                        <p class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">R$ {{ vehicle.price | number:'1.0-0' }}</p>
                      </div>
                      <div class="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                        <p class="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">Lucro Est.</p>
                        <p class="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300">R$ {{ vehicle.projectedProfit | number:'1.0-0' }}</p>
                      </div>
                    </div>

                    <div class="hidden sm:flex flex-wrap gap-2 mb-4 sm:mb-6">
                      @for (tag of vehicle.highlights.slice(0, 2); track tag) {
                        <span class="px-2 py-1 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {{ tag }}
                        </span>
                      }
                    </div>

                    <div class="mt-auto pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-2 sm:gap-3">
                      <div class="flex items-center gap-1.5">
                        <button (click)="setStatus(vehicle.id, 'Salvo')" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                        </button>
                        <button (click)="requestRemove(vehicle)" class="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>

                      <button (click)="viewDetails.emit(vehicle)" class="flex-1 py-2.5 sm:py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-lg">
                        Ver Análise
                      </button>
                    </div>
                  </div>
                </div>
              }
              
              @empty {
                <div class="col-span-full flex flex-col items-center justify-center py-12 sm:py-20">
                  <div class="relative">
                    <div class="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
                    <div class="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
                      <svg class="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                  </div>
                  <h3 class="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum veículo encontrado</h3>
                  <p class="text-slate-500 dark:text-slate-400 text-center max-w-sm text-sm">
                    Tente ajustar os filtros para encontrar mais oportunidades.
                  </p>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class OpportunityListComponent {
  dataService = inject(DataService);
  toast = inject(ToastService);
  viewDetails = output<Vehicle>();
  searchTerm = signal('');
  showMobileFilters = signal(false);
  confirmRemove = signal<Vehicle | null>(null);
  
  commonBrands = ['Fiat', 'VW', 'Chevrolet', 'Toyota', 'Jeep', 'Honda', 'Hyundai', 'BMW'];

  filters = {
    minYear: 2018,
    maxYear: 2025,
    minKm: 0,
    maxKm: 150000,
    minMargin: 10,
    maxPrice: 500000,
    selectedBrand: '',
    model: '',
    location: '',
    city: ''
  };

  sortOrder: 'margin' | 'date' = 'margin';

  hasActiveFilters(): boolean {
    return this.filters.selectedBrand !== '' || 
           this.filters.model !== '' || 
           this.filters.minYear !== 2018 ||
           this.filters.minMargin !== 10 ||
           this.filters.location !== '';
  }

  toggleSort() {
    this.sortOrder = this.sortOrder === 'margin' ? 'date' : 'margin';
  }

  setStatus(id: string, status: Vehicle['negotiationStatus']) {
    this.dataService.updateStatus(id, status);
    this.toast.add(status === 'Salvo' ? 'Anúncio salvo' : 'Status atualizado');
  }

  requestRemove(vehicle: Vehicle) {
    this.confirmRemove.set(vehicle);
  }

  confirmRemoveNow() {
    const v = this.confirmRemove();
    if (!v) return;
    this.dataService.updateStatus(v.id, 'Ignorado');
    this.confirmRemove.set(null);
    this.toast.add('Anúncio removido das oportunidades', 'info');
  }

  cancelRemove() {
    this.confirmRemove.set(null);
  }

  toggleBrand(brand: string) {
    this.filters.selectedBrand = this.filters.selectedBrand === brand ? '' : brand;
  }

  toggleLoc(loc: string) {
    this.filters.location = loc;
  }

  resetFilters() {
    this.filters = { 
      minYear: 2015, 
      maxYear: 2025,
      minKm: 0,
      maxKm: 150000, 
      minMargin: 0,
      maxPrice: 500000,
      selectedBrand: '', 
      model: '',
      location: '',
      city: ''
    };
  }

  filteredVehicles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let list = this.dataService.opportunities().filter(v => {
      const matchesSearch = v.model.toLowerCase().includes(term) || 
                           v.brand.toLowerCase().includes(term) ||
                           v.version.toLowerCase().includes(term);
      const matchesYear = v.year >= this.filters.minYear && 
                         v.year <= (this.filters.maxYear || 2025);
      const matchesKm = v.km >= (this.filters.minKm || 0) && 
                       v.km <= this.filters.maxKm;
      const matchesMargin = v.profitMarginPercent >= this.filters.minMargin;
      const matchesPrice = v.price <= (this.filters.maxPrice || 500000);
      const matchesStatus = v.negotiationStatus === 'Novo';
      
      return matchesSearch && matchesYear && matchesKm && matchesMargin && matchesPrice && matchesStatus;
    });

    if (this.filters.selectedBrand) {
      list = list.filter(v => v.brand === this.filters.selectedBrand);
    }
    if (this.filters.model) {
      const modelTerm = this.filters.model.toLowerCase();
      list = list.filter(v => v.model.toLowerCase().includes(modelTerm));
    }
    if (this.filters.location) {
      list = list.filter(v => v.location === this.filters.location);
    }
    if (this.filters.city) {
      const cityTerm = this.filters.city.toLowerCase();
      list = list.filter(v => v.location.toLowerCase().includes(cityTerm));
    }

    if (this.sortOrder === 'margin') {
      list.sort((a, b) => b.profitMarginPercent - a.profitMarginPercent);
    } else {
      list.sort((a, b) => b.dateFound.getTime() - a.dateFound.getTime());
    }

    return list;
  });

  updateSearch(e: Event) {
    this.searchTerm.set((e.target as HTMLInputElement).value);
  }
}
