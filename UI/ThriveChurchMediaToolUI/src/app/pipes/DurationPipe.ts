import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

@Pipe({
    name: 'duration',
    standalone: false
})
export class DurationPipe implements PipeTransform {
	
	transform(duration: number, format: string = 's[s]'): string {

		if (duration === 0) {
			return "N/A";
		}

		// comes in as seconds
		var resp = moment.duration(duration, "seconds").format(format);
		return resp;
	}
}