

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 font-sans">
      
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none animate-blob"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>

      <div class="w-full max-w-md bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up animate-float">
        
        <div class="p-8 text-center border-b border-slate-100 dark:border-white/5">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/30 transform transition-transform hover:rotate-6 duration-500">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Car<span class="text-primary-500">Rev</span></h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Inteligência Artificial para Revenda de Veículos
          </p>
        </div>

        <div class="p-8 space-y-6">
          
          <div class="flex gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            <button (click)="isLogin.set(true)" 
              [class]="isLogin() ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm scale-100' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 scale-95'"
              class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300">
              Login
            </button>
            <button (click)="isLogin.set(false)" 
              [class]="!isLogin() ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm scale-100' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 scale-95'"
              class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300">
              Nova Empresa
            </button>
          </div>

          <form (submit)="onSubmit()">
            
            <div class="space-y-4 min-h-[160px]">
              @if(!isLogin()) {
                <div class="space-y-2 animate-fade-in-up" style="animation-duration: 0.3s;">
                  <label class="text-xs font-bold text-slate-500 uppercase">Nome da Empresa</label>
                  <div class="relative group">
                    <span class="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </span>
                    <input [(ngModel)]="name" name="name" type="text" placeholder="Ex: Silva Automóveis Ltda" class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                  </div>
                </div>
              }

              <div class="space-y-2 animate-fade-in-up" [style.animation-delay]="isLogin() ? '0ms' : '100ms'">
                <label class="text-xs font-bold text-slate-500 uppercase">E-mail Corporativo</label>
                <div class="relative group">
                  <span class="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </span>
                  <input [(ngModel)]="email" name="email" type="email" placeholder="contato@revenda.com" class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2 animate-fade-in-up" [style.animation-delay]="isLogin() ? '100ms' : '200ms'">
                <label class="text-xs font-bold text-slate-500 uppercase">Senha</label>
                <div class="relative group">
                  <span class="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </span>
                  <input type="password" placeholder="••••••••" class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                </div>
              </div>
            </div>

            <div class="mt-8">
              <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transform transition-all active:scale-[0.98] hover:shadow-primary-500/50">
                {{ isLogin() ? 'Acessar Plataforma' : 'Cadastrar Empresa' }}
              </button>
            </div>

          </form>

          <p class="text-center text-xs text-slate-400 mt-6">
            Ao acessar, você concorda com nossos termos de uso e política de dados.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  dataService = inject(DataService);
  isLogin = signal(true);
  
  name = '';
  email = '';

  onSubmit() {
    const finalName = this.isLogin() ? 'Usuário Demo' : this.name;
    const finalEmail = this.email || 'demo@carrev.com';
    
    if (finalName && finalEmail) {
      this.dataService.login(finalName, finalEmail);
    }
  }
}