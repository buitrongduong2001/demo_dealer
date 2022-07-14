import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Response } from "../../../interfaces/response";
import { SearchDealer } from "../../../class/dealer/searchForm";
import { Dealer } from "../../../class/dealer/dealer";
import { TokenStorage } from "../../../auth/token-storage.service";
import { AuthenticationService } from "../../../auth/authentication.service";

@Injectable({
	providedIn: "root",
})
export class DealerApiService {
	public httpOptions: any;
	token: any;
	private baseUrl = "http://localhost:8098/agent-api";
	constructor(
		private _http: HttpClient,
		private _storage: TokenStorage,
		private authService: AuthenticationService
	) {
		//Http Headers Options
		this.authService.getAccessToken().subscribe((data: any) => {
			this.token = data;
		});
		this.httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json; charset=utf-8",
				Accept: "*/*",
				"X-Authorization": this.token,
			}),
		};
	}

	//Get all dealer
	public getAll(url: string): Observable<any> {
		return this._http
			.get<Response>(`${this.baseUrl}/${url}`, {
				headers: new HttpHeaders({
					"Content-Type": "application/json; charset=utf-8",
					Accept: "*/*",
					"X-Authorization": this.token,
				}),
			})
			.pipe(
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
		return this._http
			.get(`${this.baseUrl}/api/be-agent/get/city`, {
				headers: new HttpHeaders({
					"Content-Type": "application/json; charset=utf-8",
					Accept: "*/*",
					"X-Authorization": this.token,
				}),
			})
			.pipe(
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
			.get(`${this.baseUrl}/api/be-agent/get-all/districts`, {
				headers: new HttpHeaders({
					"Content-Type": "application/json; charset=utf-8",
					Accept: "*/*",
					"X-Authorization": this.token,
				}),
			})
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
				`${this.baseUrl}/api/be-agent/get/districts/by-city?cityId=${cityId}`,
				{
					headers: new HttpHeaders({
						"Content-Type": "application/json; charset=utf-8",
						Accept: "*/*",
						"X-Authorization": this.token,
					}),
				}
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
	public findDealer(searchDealer: SearchDealer, url: any): Observable<any> {
		return this._http.post<any>(
			`${this.baseUrl}/${url}`,
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
