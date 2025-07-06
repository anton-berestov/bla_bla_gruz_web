import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.getAuthState());
  isAuth$ = this.authState.asObservable();

  private getAuthState(): boolean {
    try {
      return (
        typeof window !== 'undefined' && !!localStorage.getItem('accountId')
      );
    } catch (error) {
      console.warn('Ошибка при доступе к localStorage:', error);
      return false;
    }
  }

  updateAuthStatus(): void {
    this.authState.next(this.getAuthState());
  }
}
