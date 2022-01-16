import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filesize' })
export class FileSizePipe implements PipeTransform {
	
	transform(size: number, format: string = 'MB'): string {

		// comes in as MB
		var value: number = 0;

		if (format === 'GB') {
			value = size / 1024;
		}
		if (format === 'TB') {
			value = size / Math.pow(1024, 2);
		}
		else if (format === 'MB') {
			value = size;
		}
		var resp: string = `${Math.round(value * 100) / 100}`;

		return resp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}
}