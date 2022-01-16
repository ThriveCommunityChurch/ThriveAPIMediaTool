import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
	
	transform(duration: number, format: string = 's'): string {

		// comes in as seconds
		var value: number = duration;

		if (format === 'm') {
			value = duration / 60;
		}
		else if (format === 'h') {
			value = duration / (60 * 60);
		}
		else if (format === 'd') {
			value = duration / (60 * 60 * 24);
		}
		else if (format === 'y') {
			value = duration / (60 * 60 * 24 * 365); // 1y in seconds
		}
		else if (format === 's') {
			// just round
			value = duration;
		}
		var resp: string = `${Math.round(value * 100) / 100}`;

		return resp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}
}