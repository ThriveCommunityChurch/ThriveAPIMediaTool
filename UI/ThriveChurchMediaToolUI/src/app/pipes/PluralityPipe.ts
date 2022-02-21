import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'plurality' })
export class PluralityPipe implements PipeTransform {
	
	transform(number: number, itemName: string): string {

		var suffix: string = '';

		if (number > 1 || number === 0 ) {
			suffix = 's'
		}

		return `${number} ${itemName}${suffix}`;
	}
}