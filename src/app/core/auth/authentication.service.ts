import { BehaviorSubject, Observable, Subject, from, throwError } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";

import { Injectable } from "@angular/core";
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from "@angular/common/http";
import { AuthService } from "ngx-auth";

import { TokenStorage } from "./token-storage.service";
import { UtilsService } from "../services/utils.service";
import { AccessData } from "./access-data";
import { Credential } from "./credential";
import { StaffLoginDto } from "./staff-login";
import { RefreshData } from "./refresh-data";
import * as shajs from "sha.js";

@Injectable()
export class AuthenticationService implements AuthService {
	API_URL = "http://localhost:8098/agent-api/api/auth";
	API_ENDPOINT_LOGIN = "/login";
	API_ENDPOINT_REFRESH = "/token";
	API_ENDPOINT_REGISTER = "/register";

	public onCredentialUpdated$: Subject<AccessData>;
	httpOption: any;
	constructor(
		private http: HttpClient,
		private tokenStorage: TokenStorage,
		private util: UtilsService
	) {
		this.onCredentialUpdated$ = new Subject();
		this.httpOption = {
			headers: new HttpHeaders({
				"Content-Type": "application/json; charset=utf-8",
			}),
		};
	}

	/**
	 * Check, if user already authorized.
	 * @description Should return Observable with true or false values
	 * @returns {Observable<boolean>}
	 * @memberOf AuthService
	 */
	public isAuthorized(): Observable<boolean> {
		return this.tokenStorage.getAccessToken().pipe(map((token) => !!token));
	}
	// public isAuthenticated(): boolean {
	// 	const token = localStorage.getItem('accessToken');
	// 	// Check whether the token is expired and return
	// 	// true or false
	// 	return !this.jwtHelper.isTokenExpired(token);
	//   }
	/**
	 * Get access token
	 * @description Should return access token in Observable from e.g. localStorage
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}

	/**
	 * Get user roles
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		return this.tokenStorage.getUserRoles();
	}

	/**
	 * Function, that should perform refresh token verifyTokenRequest
	 * @description Should be successfully completed so interceptor
	 * can execute pending requests or retry original one
	 * @returns {Observable<RefreshData>}
	 */
	generateCheckSum(...input) {
		var rawPass = "";
		for (const t of input) {
			rawPass += t;
		}
		const hashPass = shajs("sha256").update(rawPass).digest("hex");
		return hashPass;
	}
	public refreshToken(): Observable<any> {
		const urlRefresh = this.API_URL + this.API_ENDPOINT_REFRESH;

		var token: any = "";
		this.tokenStorage.getAccessToken().subscribe((res: any) => {
			token = res;
		});
		const checkSum = this.generateCheckSum(
			token,
			"29a49d844c009abb32bcb5094bd09abb32bcb509"
		);
		const refreshData: RefreshData = {
			checksum: checkSum,
			refreshToken: token,
		};

		return this.http.post<StaffLoginDto>(urlRefresh, refreshData).pipe(
			map((result: any) => {
				if (result instanceof Array) {
					return result.pop();
				}
				location.reload();
				return result;
			}),
			tap(this.saveAccessData.bind(this)),
			catchError((err) => {
				this.logout();
				return throwError(err);
			})
		);
	}

	/**
	 * Function, checks response of failed request to determine,
	 * whether token be refreshed or not.
	 * @description Essentialy checks status
	 * @param {Response} response
	 * @returns {boolean}
	 */
	public refreshShouldHappen(response: HttpErrorResponse): boolean {
		return response.status === 401;
	}

	/**
	 * Verify that outgoing request is refresh-token,
	 * so interceptor won't intercept this request
	 * @param {string} url
	 * @returns {boolean}
	 */
	public verifyTokenRequest(url: string): boolean {
		return url.endsWith(this.API_ENDPOINT_REFRESH);
	}

	/**
	 * Submit login request
	 * @param {DealerLoginDto} infoDealer
	 * @returns {Observable<any>}
	 */
	public login(infoDealer: StaffLoginDto): Observable<any> {
		// Expecting response from API
		// tslint:disable-next-line:max-line-length
		// {"id":1,"username":"admin","password":"demo","email":"admin@demo.com","accessToken":"access-token-0.022563452858263444","refreshToken":"access-token-0.9348573301432961","roles":["ADMIN"],"pic":"./assets/app/media/img/users/user4.jpg","fullname":"Mark Andre"}
		const urlLogin = this.API_URL + this.API_ENDPOINT_LOGIN;
		return this.http.post<StaffLoginDto>(urlLogin, infoDealer).pipe(
			map((result: any) => {
				if (result instanceof Array) {
					return result.pop();
				}
				return result;
			}),
			tap(this.saveAccessData.bind(this)),
			catchError(this.handleError("login", []))
		);
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return from(result);
		};
	}

	/**
	 * Logout
	 */
	public logout(refresh?: boolean): void {
		this.tokenStorage.clear();
		if (refresh) {
			// location.reload();
			location.reload();
		}
	}

	/**
	 * Save access data in the storage
	 * @private
	 * @param {AccessData} data
	 */
	private saveAccessData(accessData: AccessData) {
		if (typeof accessData !== "undefined") {
			this.tokenStorage
				.setAccessToken(accessData.token)
				.setUserRoles(accessData.user.keycodeArr)
				.setUserLogin(accessData.user);
			this.onCredentialUpdated$.next(accessData);
		}
	}

	// private saveRefreshToken(accessData: AccessData) {
	// 	if (typeof accessData !== "undefined") {
	// 		this.tokenStorage.setRefreshToken(accessData.token);
	// 		this.onCredentialUpdated$.next(accessData);
	// 	}
	// }

	/**
	 * Submit registration request
	 * @param {Credential} credential
	 * @returns {Observable<any>}
	 */
	public register(credential: Credential): Observable<any> {
		// dummy token creation
		credential = Object.assign({}, credential, {
			accessToken: "access-token-" + Math.random(),
			roles: ["USER"],
		});
		return this.http
			.post(this.API_URL + this.API_ENDPOINT_REGISTER, credential)
			.pipe(catchError(this.handleError("register", [])));
	}

	/**
	 * Submit forgot password request
	 * @param {Credential} credential
	 * @returns {Observable<any>}
	 */
	public requestPassword(credential: Credential): Observable<any> {
		return this.http
			.get(
				this.API_URL +
					this.API_ENDPOINT_LOGIN +
					"?" +
					this.util.urlParam(credential)
			)
			.pipe(catchError(this.handleError("forgot-password", [])));
	}
}
