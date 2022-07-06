import {
	Component,
	OnInit,
	Output,
	Input,
	ViewChild,
	OnDestroy,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	HostBinding,
} from "@angular/core";
import { AuthenticationService } from "../../../../core/auth/authentication.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthNoticeService } from "../../../../core/auth/auth-notice.service";
import { NgForm } from "@angular/forms";
import * as objectPath from "object-path";
import { TranslateService } from "@ngx-translate/core";
import { SpinnerButtonOptions } from "../../../partials/content/general/spinner-button/button-options.interface";
import { StaffLoginDto } from "../../../../core/auth/staff-login";
import * as shajs from "sha.js";
@Component({
	selector: "m-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
	public model: any = { username: "admin", password: "123456" };
	@HostBinding("class") classes: string = "m-login__signin";
	@Output() actionChange = new Subject<string>();
	public loading = false;
	dealerDto: StaffLoginDto;
	checkSum: any;
	@Input() action: string;

	@ViewChild("f") f: NgForm;
	errors: any = [];

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: "primary",
		spinnerColor: "accent",
		fullWidth: false,
	};

	constructor(
		private authService: AuthenticationService,
		private router: Router,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef
	) {}

	generateCheckSum(...input) {
		var rawPass = "";
		for (const t of input) {
			rawPass += t;
		}
		const hashPass = shajs("sha256").update(rawPass).digest("hex");
		return hashPass;
	}
	submit() {
		this.spinner.active = true;
		if (this.validate(this.f)) {
			const checkSum = this.generateCheckSum(
				this.model.username,
				this.model.password,
				"29a49d844c009abb32bcb5094bd09abb32bcb509"
			);
			this.dealerDto = {
				checksum: checkSum,
				provider: "username",
				providerUserId: this.model.username,
				password: this.model.password,
				typeApp: "staff",
				language: 1,
				osSystem: 1,
				deviceToken: null,
			};
			this.authService.login(this.dealerDto).subscribe((response) => {
				if (typeof response !== "undefined") {
					this.router.navigate(["/"]);
				} else {
					this.authNoticeService.setNotice(
						this.translate.instant("AUTH.VALIDATION.INVALID_LOGIN"),
						"error"
					);
				}
				this.spinner.active = false;
				this.cdr.detectChanges();
			});
		}
	}

	ngOnInit(): void {
		// demo message to show
		// if (!this.authNoticeService.onNoticeChanged$.getValue()) {
		// 	const initialNotice = Use account
		// 	<strong>admin@demo.com</strong> and password
		// 	<strong>demo</strong> to continue.`;
		// 	this.authNoticeService.setNotice(initialNotice, "success");
		// }
	}

	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
	}

	validate(f: NgForm) {
		if (f.form.status === "VALID") {
			return true;
		}

		this.errors = [];
		if (objectPath.get(f, "form.controls.username.errors.required")) {
			this.errors.push(
				this.translate.instant("AUTH.VALIDATION.REQUIRED", {
					name: this.translate.instant("AUTH.INPUT.USERNAME"),
				})
			);
		}

		if (objectPath.get(f, "form.controls.password.errors.required")) {
			this.errors.push(
				this.translate.instant("AUTH.VALIDATION.INVALID", {
					name: this.translate.instant("AUTH.INPUT.PASSWORD"),
				})
			);
		}
		if (objectPath.get(f, "form.controls.password.errors.minlength")) {
			this.errors.push(
				this.translate.instant("AUTH.VALIDATION.MIN_LENGTH", {
					name: this.translate.instant("AUTH.INPUT.PASSWORD"),
				})
			);
		}

		if (this.errors.length > 0) {
			this.authNoticeService.setNotice(
				this.errors.join("<br/>"),
				"error"
			);
			this.spinner.active = false;
		}

		return false;
	}

	forgotPasswordPage(event: Event) {
		this.action = "forgot-password";
		this.actionChange.next(this.action);
	}

	register(event: Event) {
		this.action = "register";
		this.actionChange.next(this.action);
	}
}
