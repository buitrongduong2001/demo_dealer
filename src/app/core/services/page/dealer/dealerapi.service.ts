import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Response } from "../../../interfaces/response";
import { SearchDealer } from "../../../class/dealer/searchForm";
import { Dealer } from "../../../class/dealer/dealer";

@Injectable({
	providedIn: "root",
})
export class DealerApiService {
	public httpOptions: any;

	private baseUrl = "http://localhost:8004/agent-core";
	constructor(private _http: HttpClient) {
		//Http Headers Options
		this.httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json; charset=utf-8",
				Accept: "*/*",
				"X-Authorization":
					"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMzYyMDE1OTA3IiwidXNlcklkIjoiMSIsImxhbmd1YWdlIjoxLCJkZXZpY2VUb2tlbiI6ImZkcklMb1RYSzBLNnE2ajB3UF9PY206QVBBOTFiRUZySXJrczRWQzhpNzFEVEp3NFNVUnBJbXU4V1hiOHRTMjI0bW82aHBvS19BMWEzSEhYN0kyeWFlTEZHeVpEb2ZrUG8wX0JDYjJQU2R4b2twY0lLZEdyU0IxQV9wY0JDTUg3TXNpSFhUR0FPbG9JYUhfSUd0Z0xORWtSVFU5YVVzTm9KTzgwMDkiLCJwYXNzd29yZCI6IiQyYSQxMCRQdXJzL1NwOXdsdVpnQ0tnbDJZMjZ1Rm9YdDhkU3B2S0FqRWFpWVNsTE5qVUppMmJ1TVZIRyIsImFkZHJlc3MiOnsiaWQiOjEsImFwYXJ0bWVudCI6IlN0cmVzcyBvbiB0aGUgcm9hZCIsImNpdHlJZCI6MzQsImRpc3RyaWN0SWQiOjM0MSwid2FyZElkIjoxMjg0NywiY2l0eSI6eyJpZCI6MzQsIm5hbWUiOiJU4buJbmggVGjDoWkgQsOsbmgifSwiZGlzdHJpY3QiOnsiaWQiOjM0MSwibmFtZSI6Ikh1eeG7h24gVGjDoWkgVGjhu6V5In0sIndhcmQiOnsiaWQiOjEyODQ3LCJuYW1lIjoiWMOjIEFuIFTDom4ifX0sInRva2VuIjoiZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKemRXSWlPaUl3TXpZeU1ERTFPVEEzSWl3aWMyTnZjR1Z6SWpwYlhTd2lkWE5sY2tsa0lqb2lNU0lzSW01aGJXVWlPaUpDdzdscElGUnk0YnVOYm1jZ1JNYXd4cUZ1WnlJc0ltVnVZV0pzWldRaU9uUnlkV1VzSW5CaGMzTjNiM0prSWpvaUpESmhKREV3SkZCMWNuTXZVM0E1ZDJ4MVdtZERTMmRzTWxreU5uVkdiMWgwT0dSVGNIWkxRV3BGWVdsWlUyeE1UbXBWU21reVluVk5Wa2hISWl3aWJHRnVaM1ZoWjJVaU9qRXNJbUZrWkhKbGMzTWlPbnNpYVdRaU9qRXNJbUZ3WVhKMGJXVnVkQ0k2SWxOMGNtVnpjeUJ2YmlCMGFHVWdjbTloWkNJc0ltTnBkSGxKWkNJNk16UXNJbVJwYzNSeWFXTjBTV1FpT2pNME1Td2lkMkZ5WkVsa0lqb3hNamcwTnl3aVkybDBlU0k2ZXlKcFpDSTZNelFzSW01aGJXVWlPaUpVNGJ1SmJtZ2dWR2pEb1drZ1FzT3NibWdpZlN3aVpHbHpkSEpwWTNRaU9uc2lhV1FpT2pNME1Td2libUZ0WlNJNklraDFlZUc3aDI0Z1ZHakRvV2tnVkdqaHU2VjVJbjBzSW5kaGNtUWlPbnNpYVdRaU9qRXlPRFEzTENKdVlXMWxJam9pV01PaklFRnVJRlREb200aWZYMHNJbTl6YzNsMFpXMGlPakVzSW5SaGVFTnZaR1VpT2lKVVFVTlVRMDlFUlRFeU15SXNJbk4wWVhSMWMwRndjQ0k2TVN3aWJuVnRZbVZ5UW1GdWF5STZJakV5TXpVMk5EVXlJaXdpWVdSa2NtVnpjMEpoYm1zaU9pSk5ZaUJDWVc1cklpd2laR1YyYVdObFZHOXJaVzRpT2lKbVpISkpURzlVV0Vzd1N6WnhObW93ZDFCZlQyTnRPa0ZRUVRreFlrVkdja2x5YTNNMFZrTTRhVGN4UkZSS2R6UlRWVkp3U1cxMU9GZFlZamgwVXpJeU5HMXZObWh3YjB0ZlFURmhNMGhJV0RkSk1ubGhaVXhHUjNsYVJHOW1hMUJ2TUY5Q1EySXlVRk5rZUc5cmNHTkpTMlJIY2xOQ01VRmZjR05DUTAxSU4wMXphVWhZVkVkQlQyeHZTV0ZJWDBsSGRHZE1Ua1ZyVWxSVk9XRlZjMDV2U2s4NE1EQTVJaXdpWlhOMFlXSnNhWE5vWldSRVlYUmxJam94TlRjMU1qRTVOakF3TURBd0xDSnVkVzFpWlhKUVpYSnpiMjV1Wld3aU9qTXdMQ0p6WlhnaU9qRXNJbkJ5YjNacFpHVnlJam9pY0dodmJtVWlMQ0pwYzNNaU9pSmhaMlZ1ZENJc0ltbGhkQ0k2TVRZMU5EZ3pORGMyTnl3aVpYaHdJam94TmpVME9URTVNelkzZlEuaFRld3JvVThFcVlKSGIwWW5CNjBMZFpqb2dyd1pRQW1TN0Q4Nm85RUEwaUI3YVFBa3owRXg1VVVSdXBXeUZicEZmWngyMUlpVHc4TjNFbzZYcTRXSlEiLCJwcm92aWRlciI6InBob25lIiwic3RhdHVzIjoxLCJzdGF0dXNBcHAiOjEsIm51bWJlckJhbmsiOiIxMjM1NjQ1MiIsImFkZHJlc3NCYW5rIjoiTWIgQmFuayIsImVzdGFibGlzaGVkRGF0ZSI6MTU3NTIxOTYwMDAwMCwidGF4Q29kZSI6IlRBQ1RDT0RFMTIzIiwibnVtYmVyUGVyc29ubmVsIjozMCwiaXNzIjoiYWdlbnQiLCJqdGkiOiJlOTJiZGIwMS05Y2Y1LTRiNjctOGRiNC02NGI5NGRjMWVmZTUiLCJpYXQiOjE2NTQ4MzQ3NjcsImV4cCI6MTY1NTAwMzk2N30.FfIpMH4u5G6usdECbNv4xy8TizQpFHNhsEZE0kV3tS7QdIXeItlUKgNWlAoIlBPlhwDWmFgYHtV2sb88Y4L4RQ",
			}),
		};
	}

	//Get all dealer
	public getAll(url: string): Observable<any> {
		return this._http.get(`${this.baseUrl}/${url}`).pipe(
			map((data: Response) => {
				return data;
			}),
			catchError((error) => {
				return throwError("Somthing went wrong ", error);
			})
		);
	}

	//Lấy ra danh sách thành phố
	public getCities(): Observable<any> {
		return this._http.get(`${this.baseUrl}/api/be-agent/get/city`).pipe(
			map((data: Response) => {
				return data;
			}),
			catchError((error) => {
				return throwError(
					"Có lỗi xảy ra khi lấy danh sách thành phố ",
					error
				);
			})
		);
	}

	//Lấy ra danh sách quận huyện
	public getDistricts(): Observable<any> {
		return this._http
			.get(`${this.baseUrl}/api/be-agent/get-all/districts`)
			.pipe(
				map((data: Response) => {
					return data;
				}),
				catchError((error) => {
					return throwError(
						"Có lỗi xảy ra khi lấy danh sách quận huyện ",
						error
					);
				})
			);
	}

	//Lấy ra danh sách quận huyện bởi city
	public getDistrictsByCity(cityId: any): Observable<any> {
		return this._http
			.get(
				`${this.baseUrl}/api/be-agent/get/districts/by-city?cityId=${cityId}`
			)
			.pipe(
				map((data: Response) => {
					return data;
				}),
				catchError((error) => {
					return throwError(
						"Có lỗi xảy ra khi lấy danh sách quận huyện ",
						error
					);
				})
			);
	}

	//Tìm kiếm dealer
	public findDealer(searchDealer: SearchDealer): Observable<any> {
		return this._http.post<any>(
			`${this.baseUrl}/api/be-agent/search/dealer`,
			JSON.stringify(searchDealer),
			this.httpOptions
		);
	}

	// Tạo mới dealer
	public saveDealer(dealer: Dealer): Observable<any> {
		return this._http.post<any>(
			`${this.baseUrl}/api/be-agent/save-dealer`,
			JSON.stringify(dealer),
			this.httpOptions
		);
	}

	//Tạm dừng tài khoản
	public lockDealer(idDealer: any): Observable<any> {
		return this._http.put<any>(
			`${this.baseUrl}/api/be-agent/lock/account/${idDealer}`,
			this.httpOptions
		);
	}
}
