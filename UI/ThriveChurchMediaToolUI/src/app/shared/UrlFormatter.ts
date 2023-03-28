import { Injectable } from '@angular/core';

@Injectable()
export class UrlFormatter {

	constructor() {

	}


	static formatQueryParams(params: { [key: string]: any }): string {
		const queryString = Object.entries(params)
			.filter(([, value]) => value != null && value !== '') // Exclude null, undefined, and empty string values
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join('&');

		return queryString ? `?${queryString}` : '';
	}

}