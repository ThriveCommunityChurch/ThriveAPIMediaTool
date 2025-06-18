import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SermonSeriesSummary } from '../DTO/SermonSeriesSummary';

@Injectable()
export class SeriesDataService {

	private seriesSummarySubject: BehaviorSubject<SermonSeriesSummary[]> = new BehaviorSubject<SermonSeriesSummary[]>([]);
	seriesSummary$: Observable<SermonSeriesSummary[]> = this.seriesSummarySubject.asObservable();

	// Adds a new toast
	add(summary: SermonSeriesSummary): void {
		const updatedSummaries = [...this.seriesSummarySubject.value, summary];
		this.seriesSummarySubject.next(updatedSummaries);
	}

	// Removes a toast
	remove(summary: SermonSeriesSummary): void {
		const updatedSummaries = this.seriesSummarySubject.value.filter((t) => t.Id !== summary.Id);
		this.seriesSummarySubject.next(updatedSummaries);
	}  
}