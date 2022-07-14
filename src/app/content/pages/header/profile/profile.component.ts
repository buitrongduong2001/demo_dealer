import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { TokenStorage } from "../../../../core/auth/token-storage.service";

@Component({
	selector: "m-profile",
	templateUrl: "./profile.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
	constructor(private _storage: TokenStorage) {}
	user: any;
	ngOnInit() {
		this._storage.getUserLogin().subscribe((data: any) => {
			this.user = data;
		});
	}
}
