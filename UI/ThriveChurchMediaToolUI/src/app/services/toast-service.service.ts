import { Injectable } from '@angular/core';
import { ToastMessage } from '../Domain/ToastMessage';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ToastService {

	private toastsSubject: BehaviorSubject<ToastMessage[]> = new BehaviorSubject<ToastMessage[]>([]);
  	toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

	// Adds a new toast
	show(message: ToastMessage): void {
		const updatedToasts = [...this.toastsSubject.value, message];
		this.toastsSubject.next(updatedToasts);

		setTimeout(() => {
			this.remove(message);
		}, 5000);
	}

	// Removes a toast
	remove(toast: ToastMessage): void {
		const updatedToasts = this.toastsSubject.value.filter((t) => t !== toast);
		this.toastsSubject.next(updatedToasts);
	}
  
}