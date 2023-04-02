import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
	
	transform(duration: number, format: string = 's'): string {

		// comes in as seconds
		var value: number = duration;

		switch (format) 
		{
			case 'd h': 
				var days = Math.floor(duration / (24*60*60));
				var dayss = duration % (24*60*60);
				var hours = Math.floor(dayss / (60*60));
				//var hourss = duration % (60*60);
				// var minutes = Math.floor(hourss / (60));
				// var minutess = duration % (60);
				// var seconds = Math.floor(minutess / 1000);

				var result = "";

				if (days != 0) {
					result += `${days}d `;
				}
				if (hours != 0) {
					result += `${hours}h `;
				}
				// if (minutes != 0) {
				// 	result += `${minutes}m `;
				// }
				// if (seconds != 0) {
				// 	result += `${seconds}s `;
				// }

				return result.trim();

			case 'h m s': 
				var hours  = Math.floor(duration / 3600);
				var minutes = Math.floor(duration / 60);
				var seconds = duration % 60;

				var result = "";

				if (hours != 0) {
					result += `${hours}h `;
				}
				if (minutes != 0) {
					result += `${minutes}m `;
				}
				if (seconds != 0) {
					result += `${seconds}s `;
				}

				return result;

			case 'm s': 
				var minutes = Math.floor(duration / 60);
				var seconds = duration % 60;

				return `${minutes}m ${Math.round(seconds)}s`;

			case 'm': 
				value = duration / 60;
				break;
				
			case 'h': 
				value = duration / (60 * 60);
				break;

			case 'd': 
				value = duration / (60 * 60 * 24);
				break;

			case 'y': 
				value = duration / (60 * 60 * 24 * 365); // 1y in seconds
				break;

			default:
				// just round
				value = duration;
				break;
		}


		var resp: string = `${Math.round(value * 100) / 100}`;

		return resp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}
}