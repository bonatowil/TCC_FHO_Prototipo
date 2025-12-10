import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, User } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in-up pb-24 md:pb-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Gerenciamento de Usuários
          </h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Cadastre e gerencie usuários do sistema
          </p>
        </div>
        <button 
          (click)="showForm.set(true)" 
          class="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Novo Usuário
        </button>
      </div>

      @if (showForm()) {
        <div class="glass-card p-4 sm:p-6 rounded-2xl animate-fade-in-up">
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            {{ editingUser() ? 'Editar Usuário' : 'Novo Usuário' }}
          </h3>
          
          <form (ngSubmit)="saveUser()" class="space-y-4">
            @if (errorMessage()) {
              <div class="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ errorMessage() }}
              </div>
            }
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome Completo *
                </label>
                <input 
                  [(ngModel)]="formData.name"
                  name="name"
                  type="text" 
                  [class.border-red-500]="submitted() && !formData.name"
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  E-mail *
                </label>
                <input 
                  [(ngModel)]="formData.email"
                  name="email"
                  type="email" 
                  [class.border-red-500]="submitted() && !formData.email"
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Perfil de Acesso *
                </label>
                <select 
                  [(ngModel)]="formData.role"
                  name="role"
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base">
                  <option value="Admin">Admin - Acesso Total</option>
                  <option value="Gerente">Gerente - Gestão de Pátios</option>
                  <option value="Operador">Operador - Visualização</option>
                  <option value="Visualizador">Visualizador - Somente Leitura</option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center gap-4 pt-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.isActive"
                  name="isActive"
                  class="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500">
                <span class="text-sm text-slate-700 dark:text-slate-300">Usuário Ativo</span>
              </label>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <button 
                type="submit"
                class="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors text-sm sm:text-base">
                Salvar
              </button>
              <button 
                type="button"
                (click)="cancelForm()"
                class="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      <div class="glass-card p-6 rounded-2xl">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Nome</th>
                <th class="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">E-mail</th>
                <th class="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Perfil</th>
                <th class="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Status</th>
                <th class="text-left py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Último Acesso</th>
                <th class="text-right py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (user of dataService.users(); track user.id) {
                <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm sm:text-base leading-snug">
                  <td class="py-4 px-4 align-middle">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-base leading-[1] uppercase tracking-[0.02em] font-mono">
                        {{ (user.name | slice:0:1) | uppercase }}
                      </div>
                      <span class="font-semibold text-slate-900 dark:text-white leading-snug">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-sm text-slate-600 dark:text-slate-400 leading-snug">
                    <span class="block truncate max-w-[200px] sm:max-w-[260px]" [title]="user.email">{{ user.email }}</span>
                  </td>
                  <td class="py-4 px-4">
                    <span [class]="getRoleBadgeClass(user.role)" class="px-3 py-1 rounded-lg text-xs font-bold leading-snug">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    @if (user.isActive) {
                      <span class="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold leading-snug">
                        Ativo
                      </span>
                    } @else {
                      <span class="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold leading-snug">
                        Inativo
                      </span>
                    }
                  </td>
                  <td class="py-4 px-4 text-sm text-slate-600 dark:text-slate-400 leading-snug whitespace-nowrap">
                    {{ user.lastLogin ? (user.lastLogin | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        (click)="editUser(user)"
                        class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button 
                        (click)="toggleUserStatus(user)"
                        [class]="user.isActive ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'"
                        class="p-2 rounded-lg hover:opacity-80 transition-opacity">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent {
  dataService = inject(DataService);
  toast = inject(ToastService);
  showForm = signal(false);
  editingUser = signal<User | null>(null);
  errorMessage = signal('');
  submitted = signal(false);
  
  formData = {
    name: '',
    email: '',
    role: 'Operador' as User['role'],
    isActive: true
  };

  getRoleBadgeClass(role: User['role']): string {
    const classes = {
      'Admin': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'Gerente': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Operador': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Visualizador': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
    };
    return classes[role];
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
    this.showForm.set(true);
  }

  saveUser() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (!this.formData.name.trim()) {
      this.errorMessage.set('Preencha o nome do usuário');
      return;
    }
    if (!this.formData.email.trim()) {
      this.errorMessage.set('Preencha o e-mail do usuário');
      return;
    }
    if (!this.formData.email.includes('@')) {
      this.errorMessage.set('Informe um e-mail válido');
      return;
    }

    if (this.editingUser()) {
      this.dataService.updateUser(this.editingUser()!.id, this.formData);
      this.toast.add('Usuário atualizado');
    } else {
      this.dataService.addUser(this.formData);
      this.toast.add('Usuário criado');
    }
    this.cancelForm();
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingUser.set(null);
    this.errorMessage.set('');
    this.submitted.set(false);
    this.formData = {
      name: '',
      email: '',
      role: 'Operador',
      isActive: true
    };
  }

  toggleUserStatus(user: User) {
    this.dataService.updateUser(user.id, { isActive: !user.isActive });
    this.toast.add(user.isActive ? 'Usuário desativado' : 'Usuário ativado', 'info');
  }
}

