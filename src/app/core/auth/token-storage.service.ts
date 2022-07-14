import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Dealer } from "../class/dealer/dealer";

@Injectable()
export class TokenStorage {
	/**
	 * Get access token
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		const token: string = <string>localStorage.getItem("accessToken");
		return of(token);
	}

	/**
	 * Get access token
	 * @returns {Observable<any>}
	 */
	public getUserLogin(): Observable<any> {
		const user: any = localStorage.getItem("user");
		try {
			return of(JSON.parse(user));
		} catch (e) {}
	}

	/**
	 * Get refresh token
	 * @returns {Observable<string>}
	 */
	public getRefreshToken(): Observable<string> {
		const token: string = <string>localStorage.getItem("refreshToken");
		return of(token);
	}

	/**
	 * Get user roles in JSON string
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		const roles: any = localStorage.getItem("userRoles");
		try {
			return of(JSON.parse(roles));
		} catch (e) {}
	}

	/**
	 * Set access token
	 * @returns {TokenStorage}
	 */
	public setAccessToken(token: string): TokenStorage {
		localStorage.setItem("accessToken", token);
		return this;
	}

	/**
	 * Set user logged
	 * @returns {TokenStorage}
	 */
	public setUserLogin(user: any): TokenStorage {
		localStorage.setItem("user", JSON.stringify(user));

		return this;
	}

	/**
	 * Set refresh token
	 * @returns {TokenStorage}
	 */
	public setRefreshToken(token: string): TokenStorage {
		localStorage.setItem("refreshToken", token);
		return this;
	}

	/**
	 * Set user roles
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setUserRoles(roles: any): any {
		if (roles != null) {
			localStorage.setItem("userRoles", JSON.stringify(roles));
		}
		return this;
	}

	/**
	 * Remove tokens
	 */
	public clear() {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userRoles");
		localStorage.removeItem("user");
	}
}
