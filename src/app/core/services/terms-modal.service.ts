import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsModalService {
  private readonly open$ = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.open$.asObservable();

  get isOpen(): boolean {
    return this.open$.value;
  }

  open(): void {
    if (this.open$.value) {
      return;
    }
    this.open$.next(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  close(): void {
    if (!this.open$.value) {
      return;
    }
    this.open$.next(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
