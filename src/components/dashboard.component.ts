import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Vehicle } from '../services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col overflow-hidden">
      
      <!-- Header Section -->
      <div class="shrink-0 mb-4 sm:mb-6">
        <div class="flex flex-col gap-3 sm:gap-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1">
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 animate-fade-in-up" style="animation-delay: 100ms;">
                Inteligência de Mercado
              </h2>
              <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 animate-fade-in-up" style="animation-delay: 200ms;">
                Olá, {{ dataService.currentUser()?.name }}. O mercado está <span class="text-emerald-500 font-bold">aquecido</span> hoje.
              </p>
            </div>
            
            <!-- Activity Button -->
            <button 
              (click)="showActivities.set(!showActivities())"
              class="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-800/60 shadow-lg shadow-slate-200/60 dark:shadow-black/30 text-slate-500 hover:text-primary-500 transition-all hover:-translate-y-0.5 active:scale-95">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
          </div>
          
          <!-- Activities Panel -->
          @if (showActivities()) {
            <!-- Backdrop for mobile -->
            <div class="fixed inset-0 bg-black/30 z-40 md:hidden" (click)="showActivities.set(false)"></div>
            
            <div class="fixed inset-x-4 top-20 md:inset-auto md:absolute md:top-20 md:right-4 md:w-96 glass-card rounded-2xl shadow-2xl z-50 max-h-[70vh] md:max-h-96 overflow-hidden flex flex-col animate-fade-in-up">
              <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 class="font-bold text-slate-900 dark:text-white">Atividades Recentes</h3>
                <button 
                  (click)="showActivities.set(false)"
                  class="md:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div class="flex-1 overflow-y-auto">
                @if (recentActivity().length === 0) {
                  <div class="p-8 text-center text-slate-500 dark:text-slate-400">
                    Nenhuma atividade recente
                  </div>
                } @else {
                  @for (activity of recentActivity(); track activity.time.getTime()) {
                    <div class="flex items-start gap-3 p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div [class]="getActivityIconClass(activity.type)" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getActivityIcon(activity.type)"></path></svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-slate-900 dark:text-white text-sm">{{ activity.message }}</h4>
                        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {{ activity.platform }} • {{ getTimeAgo(activity.time) }}
                        </p>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          }
          
          <!-- Trending Ticker (Hidden on small screens) -->
          <div class="hidden md:flex items-center gap-4 sm:gap-6 bg-slate-900 text-slate-300 text-xs px-3 sm:px-4 py-2 rounded-full border border-slate-700 shadow-sm overflow-hidden animate-fade-in-up w-fit" style="animation-delay: 300ms;">
            <span class="font-bold text-white uppercase tracking-wider text-[10px] sm:text-xs">Em Alta:</span>
            <div class="flex items-center gap-3 sm:gap-4 whitespace-nowrap">
              <span class="flex items-center gap-1 text-emerald-400">Compass <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> +2.4%</span>
              <span class="flex items-center gap-1 text-emerald-400">Nivus <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> +1.8%</span>
              <span class="flex items-center gap-1 text-red-400">HB20 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg> -0.5%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto pr-1 sm:pr-2 pb-20 md:pb-4 space-y-4 sm:space-y-6 lg:space-y-8">
        
        <!-- Metrics Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          
          <button (click)="navigate.emit('opportunities')" class="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left" style="animation-delay: 100ms;">
            <div class="absolute -right-4 sm:-right-6 -top-4 sm:-top-6 w-16 sm:w-24 h-16 sm:h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-700"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-1">
                <p class="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Potencial Lucro</p>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <h3 class="text-lg sm:text-xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                R$ {{ metrics().potentialProfit | number:'1.0-0' }}
              </h3>
              <div class="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2 text-emerald-500 text-[10px] sm:text-xs lg:text-sm font-medium">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                <span>{{ metrics().activeOpportunities }} opps</span>
              </div>
            </div>
          </button>

          <button (click)="navigate.emit('inventory')" class="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left" style="animation-delay: 200ms;">
            <div class="absolute -right-4 sm:-right-6 -top-4 sm:-top-6 w-16 sm:w-24 h-16 sm:h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-1">
                <p class="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estoque</p>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <h3 class="text-lg sm:text-xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                R$ {{ metrics().inventoryValue | number:'1.0-0' }}
              </h3>
              <div class="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs lg:text-sm">
                <span>{{ dataService.inventory().length }} veículos</span>
              </div>
            </div>
          </button>

          <button (click)="navigate.emit('opportunities')" class="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left" style="animation-delay: 300ms;">
            <div class="absolute -right-4 sm:-right-6 -top-4 sm:-top-6 w-16 sm:w-24 h-16 sm:h-24 bg-accent-500/10 rounded-full blur-2xl group-hover:bg-accent-500/20 transition-all duration-700"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-1">
                <p class="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Margem Média</p>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-accent-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <h3 class="text-lg sm:text-xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                {{ metrics().averageMargin | number:'1.1-1' }}%
              </h3>
              <div class="mt-2 sm:mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div class="bg-accent-500 h-full rounded-full animate-grow" [style.--w.%]="75" style="width: 0%"></div>
              </div>
            </div>
          </button>

          <button (click)="navigate.emit('inventory')" class="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left" 
               style="animation-delay: 400ms;"
               [class.border-l-4]="metrics().stagnantStockCount > 0" 
               [class.border-l-orange-500]="metrics().stagnantStockCount > 0">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-1">
                <p class="text-[10px] sm:text-xs lg:text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">Alerta Giro</p>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <h3 class="text-lg sm:text-xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                {{ metrics().stagnantStockCount }}
              </h3>
              <p class="mt-1 sm:mt-2 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs lg:text-sm">Sem giro (>60d)</p>
            </div>
          </button>
        </div>

        <!-- Second Row Metrics -->
        <div class="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          
          <button (click)="navigate.emit('opportunities')" class="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left" style="animation-delay: 500ms;">
            <div class="absolute -right-4 sm:-right-6 -top-4 sm:-top-6 w-16 sm:w-24 h-16 sm:h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-700"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-1">
                <p class="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fraudes Detectadas</p>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <h3 class="text-lg sm:text-xl lg:text-3xl font-bold text-red-600 dark:text-red-400 mt-1 sm:mt-2">
                {{ metrics().fraudSuspectsCount }}
              </h3>
              <div class="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2 text-red-500 text-[10px] sm:text-xs lg:text-sm font-medium">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span>Bloqueados</span>
              </div>
            </div>
          </button>

          <button (click)="navigate.emit('opportunities')" class="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left" style="animation-delay: 600ms;">
            <div class="absolute -right-4 sm:-right-6 -top-4 sm:-top-6 w-16 sm:w-24 h-16 sm:h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-1">
                <p class="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alta Margem</p>
                <svg class="w-4 h-4 text-slate-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <h3 class="text-lg sm:text-xl lg:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 sm:mt-2">
                {{ metrics().highMarginCount }}
              </h3>
              <div class="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2 text-yellow-500 text-[10px] sm:text-xs lg:text-sm font-medium">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                <span>>{{ dataService.settings().alertProfitMargin }}%</span>
              </div>
            </div>
          </button>
        </div>

        <!-- Top Opportunities & Regional Analysis Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          <!-- Top Opportunities -->
          <div class="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in-up" style="animation-delay: 700ms;">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Top Oportunidades
            </h3>
            <div class="space-y-2 sm:space-y-3">
              @for (opp of getTopOpportunities(5); track opp.id; let i = $index) {
                <button (click)="viewDetails.emit(opp)" class="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer text-left group">
                  <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ opp.brand }} {{ opp.model }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ opp.year }} • {{ opp.km | number }} km</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{{ opp.profitMarginPercent | number:'1.1-1' }}%</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">R$ {{ opp.projectedProfit | number:'1.0-0' }}</p>
                  </div>
                  <svg class="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              }
            </div>
          </div>

          <!-- Regional Analysis -->
          <div class="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in-up" style="animation-delay: 800ms;">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Análise Regional
            </h3>
            <div class="space-y-3">
              @for (region of getRegionalAnalysis(); track region.region) {
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ region.region }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ region.count }} oportunidades</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-primary-600 dark:text-primary-400">{{ region.avgMargin | number:'1.1-1' }}%</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">R$ {{ region.totalProfit | number:'1.0-0' }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Market Trends Chart Section -->
        <div class="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 animate-fade-in-up" style="animation-delay: 1300ms;">
          <div class="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-6">
              <div>
                <h3 class="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                  Tendências de Mercado
                </h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Selecione um modelo para ver a evolução dos preços.</p>
              </div>
              
              <div class="relative w-full sm:w-56 lg:w-72 group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <select 
                  [ngModel]="selectedModel()" 
                  (ngModelChange)="onModelChange($event)"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm">
                  <option value="Honda Civic">Honda Civic</option>
                  <option value="Toyota Corolla">Toyota Corolla</option>
                  <option value="Jeep Compass">Jeep Compass</option>
                  <option value="VW Nivus">VW Nivus</option>
                  <option value="BMW 320i">BMW 320i</option>
                  <option value="Fiat Pulse">Fiat Pulse</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div class="lg:col-span-2 h-48 sm:h-56 lg:h-72 w-full transition-opacity duration-500" #trendChartContainer></div>

            <div class="space-y-3 sm:space-y-4 lg:space-y-6">
               <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-300">
                 <span class="text-[10px] sm:text-xs uppercase font-bold text-slate-500">Liquidez</span>
                 <div class="flex items-center gap-2 mt-1 sm:mt-2">
                   <div class="flex gap-0.5 sm:gap-1">
                     <div class="w-2 sm:w-3 h-6 sm:h-8 bg-emerald-500 rounded-sm"></div>
                     <div class="w-2 sm:w-3 h-6 sm:h-8 bg-emerald-500 rounded-sm"></div>
                     <div class="w-2 sm:w-3 h-6 sm:h-8 bg-emerald-500 rounded-sm"></div>
                     <div class="w-2 sm:w-3 h-6 sm:h-8 bg-emerald-500/30 rounded-sm"></div>
                     <div class="w-2 sm:w-3 h-6 sm:h-8 bg-emerald-500/30 rounded-sm"></div>
                   </div>
                   <span class="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white">Alta</span>
                 </div>
                 <p class="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">Giro médio de 18 dias.</p>
               </div>

               <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 lg:p-5 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-300">
                 <span class="text-[10px] sm:text-xs uppercase font-bold text-slate-500">Volatilidade</span>
                 <div class="flex items-center justify-between mt-1 sm:mt-2">
                    <span class="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white">Baixa (2.1%)</span>
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                 </div>
                 <p class="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">Preços estáveis nos últimos 30 dias.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements AfterViewInit {
  dataService = inject(DataService);
  metrics = this.dataService.metrics;
  navigate = output<'opportunities' | 'inventory' | 'saved'>();
  viewDetails = output<Vehicle>();
  
  selectedModel = signal('Honda Civic');
  showActivities = signal(false);
  
  recentActivity = computed(() => this.dataService.getRecentActivity());
  
  @ViewChild('trendChartContainer') chartContainer!: ElementRef;

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.renderChart(this.selectedModel());
      });
    });
  }

  onModelChange(model: string) {
    this.selectedModel.set(model);
    const el = this.chartContainer.nativeElement;
    el.style.opacity = '0';
    setTimeout(() => {
      this.renderChart(model);
      el.style.opacity = '1';
    }, 200);
  }

  getTopOpportunities(limit: number = 5) {
    return this.dataService.getTopOpportunities(limit);
  }

  getRegionalAnalysis() {
    return this.dataService.getRegionalAnalysis();
  }


  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${Math.floor(diffHours / 24)}d atrás`;
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      'collection': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      'processing': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      'validation': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'fraud': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      'opportunity': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    };
    return icons[type] || icons['collection'];
  }

  getActivityIconClass(type: string): string {
    const classes: Record<string, string> = {
      'collection': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'processing': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'validation': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      'fraud': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      'opportunity': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    };
    return classes[type] || classes['collection'];
  }

  renderChart(model: string) {
    const element = this.chartContainer.nativeElement;
    
    if (!element || element.clientWidth === 0 || element.clientHeight === 0) {
      requestAnimationFrame(() => this.renderChart(model));
      return;
    }
    
    const margin = { top: 15, right: 15, bottom: 25, left: 45 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = element.clientHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) {
      requestAnimationFrame(() => this.renderChart(model));
      return;
    }

    d3.select(element).select('svg').remove();

    const svg = d3.select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${element.clientWidth} ${element.clientHeight}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = this.dataService.getMarketTrends(model);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.price) * 0.9, d3.max(data, d => d.price) * 1.1])
      .range([height, 0]);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "trend-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.5);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0);

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).ticks(4).tickFormat((d:any) => d3.timeFormat('%b/%y')(d)))
       .attr('class', 'text-slate-400')
       .selectAll('text')
       .style('font-size', '10px')
       .select('.domain').remove();

    svg.append("g")
       .call(d3.axisLeft(y).ticks(4).tickFormat(d => `R$${(d as number)/1000}k`))
       .attr('class', 'text-slate-400')
       .selectAll('text')
       .style('font-size', '10px')
       .select('.domain').remove();

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat(() => "")
        )
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", "0.1")
        .select(".domain").remove();

    const area = d3.area<{date: Date, price: number}>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.price))
      .curve(d3.curveMonotoneX);

    const line = d3.line<{date: Date, price: number}>()
      .x(d => x(d.date))
      .y(d => y(d.price))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path")
       .datum(data)
       .attr("fill", "url(#trend-gradient)")
       .attr("d", area)
       .attr("opacity", 0);

    path.transition().duration(1000).attr("opacity", 1);

    const linePath = svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#3b82f6")
       .attr("stroke-width", 2)
       .attr("d", line);

    const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
    linePath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);


    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.date))
       .attr("cy", d => y(d.price))
       .attr("r", 0)
       .attr("fill", "#1e293b")
       .attr("stroke", "#3b82f6")
       .attr("stroke-width", 2)
       .attr("class", "hover:r-6 transition-all")
       .transition()
       .delay((d, i) => i * 100 + 500)
       .duration(500)
       .attr("r", 4);
  }
}
