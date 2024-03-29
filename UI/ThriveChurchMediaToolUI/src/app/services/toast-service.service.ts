import { Injectable } from '@angular/core';
import { ToastMessage } from '../Domain/ToastMessage';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastMessageType } from '../Domain/ToastMessageType';

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

	showStandardToast(text: string, httpCode: number): void {

		const newToast: ToastMessage = {
		  Message: text,
		  Type: httpCode === 200 ? ToastMessageType.Info : ToastMessageType.Error
		};
	
		this.show(newToast);
	  }
  
}