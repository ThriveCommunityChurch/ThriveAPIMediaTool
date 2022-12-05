import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
	
	transform(dateString: string | undefined, format: string): string {

		if (dateString === '' || dateString === undefined) {
			return '';
		}
		
		return moment(Date.parse(dateString ?? '')).tz('UTC').format(format);
	}
}