import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _counter = 0;
  toasts = signal<ToastMessage[]>([]);

  add(message: string, type: ToastType = 'success', durationMs: number = 3500) {
    const id = ++this._counter;
    this.toasts.update(list => [...list, { id, message, type }]);
    if (durationMs > 0) {
      setTimeout(() => this.remove(id), durationMs);
    }
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}

