import {
	Component,
	ElementRef,
	OnInit,
	QueryList,
	Renderer2,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	Validators,
} from "@angular/forms";
import { ErrorStateMatcher, MatDialogRef } from "@angular/material";

import { Address } from "../../../../../core/class/dealer/address";
import { City } from "../../../../../core/class/dealer/city";
import { Dealer } from "../../../../../core/class/dealer/dealer";
import { District } from "../../../../../core/class/dealer/district";
import { DepartmentStaffDealer } from "../../../../../core/class/department_dealer/departmentStaffDealer";
import { ResponseBE } from "../../../../../core/class/response/response";
import { DealerApiService } from "../../../../../core/services/page/dealer/dealerapi.service";
import { AddMemberComponent } from "./add-member/add-member.component";

export interface StatusDealer {
	id: number;
	title: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
/** MyErrorStateMatcher nó sẽ thực hiện validate sau khi submot form */
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(
		control: FormControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && isSubmitted);
	}
}

@Component({
	selector: "m-dealers-create",
	templateUrl: "./dealers-create.component.html",
	styleUrls: ["./dealers-create.component.scss"],
})
export class DealersCreateComponent implements OnInit {
	cities: City[] = [];
	districts: District[] = [];
	address: Address;
	response: ResponseBE;
	city: City;
	district: District;
	dealer: Dealer;
	formData: FormGroup;
	validatorForm: boolean = false;
	@ViewChildren(AddMemberComponent)
	viewChildren!: QueryList<AddMemberComponent>;

	@ViewChild("alertErrorForm") alertError: ElementRef;
	@ViewChild("formCreateDealer") formCreateDealer: ElementRef;
	@ViewChild("alertWarningForm") alertWarning: ElementRef;

	matcher = new MyErrorStateMatcher();
	listDepartmentMember: DepartmentStaffDealer[] = [];
	listMemberForm: number[] = [];
	levelDealerOption: StatusDealer[] = [
		{ id: 1, title: "Đại lý cấp 1" },
		{ id: 2, title: "Đại lý cấp 2" },
		{ id: 3, title: "Cộng tác viên" },
	];
	constructor(
		private _service: DealerApiService,
		public dialogRef: MatDialogRef<DealersCreateComponent>
	) {}

	ngAfterViewInit() {}

	ngOnInit() {
		this.dealer = new Dealer();
		this.response = new ResponseBE();
		// this.response.code = 0;
		this.formData = new FormGroup({
			levelDealer: new FormControl(null),
			nameDealer: new FormControl(null, Validators.required),
			phoneDealer: new FormControl(null, [
				Validators.required,
				Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})"),
			]),
			emailDealer: new FormControl(null, [Validators.email]),
			apartmentDealer: new FormControl(null),
			cityDealer: new FormControl(null),
			districtDealer: new FormControl(null),
			taxCode: new FormControl(null),
			numberBank: new FormControl(null),
			addressBank: new FormControl(null),
			representative: new FormControl(null),
			description: new FormControl(null),
		});
		this.getAllCities();
	}

	getAllCities() {
		this._service.getCities().subscribe((res: any) => {
			this.cities = res.data;
		});
	}
	getAllDistrictByCity(cityId: any) {
		this._service.getDistrictsByCity(cityId).subscribe((res: any) => {
			this.districts = res.data;
		});
	}

	addNewMember() {
		if (
			typeof this.listMemberForm[this.listMemberForm.length - 1] !==
			"undefined"
		) {
			this.listMemberForm.push(
				this.listMemberForm[this.listMemberForm.length - 1] + 1
			);
		} else {
			this.listMemberForm.push(1);
		}
		//https://stackblitz.com/edit/angular-m8rqq3-tyg9ev?file=src%2Fapp%2Fdialog-content-example.html,src%2Fapp%2Fdialog-content-example.ts,src%2Fapp%2Fdialog-content-example-dialog.html,src%2Fapp%2Fmaterial-module.ts
	}

	deleteMember(item: number) {
		this.listMemberForm = this.listMemberForm.filter((x) => x !== item);
		let member: AddMemberComponent[] = this.viewChildren.toArray();
		member = member.filter((x) => x.item !== item);
		this.listDepartmentMember = [];
		member.forEach((p) => {
			this.listDepartmentMember.push(p.formData.value);
		});
	}

	//Hàm xử lý submit form
	onSubmitForm() {
		if (this.formData.invalid) {
			// this.formData.setErrors({
			// 	...this.formData.errors,
			// 	myErrorName: true,
			// });
			for (const key of Object.keys(this.formData.controls)) {
				if (this.formData.controls[key].invalid) {
					const invalidControl =
						this.formCreateDealer.nativeElement.querySelector(
							'[formcontrolname="' + key + '"]'
						);
					invalidControl.focus();
					break;
				}
			}
		} else {
			this.dealer.levelDealer = this.formData.value.levelDealer;
			this.dealer.name = this.formData.value.nameDealer;
			this.dealer.phone = this.formData.value.phoneDealer;
			this.dealer.email = this.formData.value.emailDealer;
			this.dealer.apartment = this.formData.value.apartmentDealer;
			this.dealer.idCity = this.formData.value.cityDealer;
			this.dealer.idDistrict = this.formData.value.districtDealer;
			this.dealer.taxCode = this.formData.value.taxCode;
			this.dealer.numberBank = this.formData.value.numberBank;
			this.dealer.addressBank = this.formData.value.addressBank;
			this.dealer.representative = this.formData.value.representative;
			this.dealer.description = this.formData.value.description;
			let member: AddMemberComponent[] = this.viewChildren.toArray();

			let checkError = false;
			for (const x of member) {
				if (x.formData.invalid) {
					this.alertError.nativeElement.classList.add("show");
					this.alertError.nativeElement.classList.remove("hide");
					this.alertError.nativeElement.classList.add("showAlert");
					setTimeout(() => {
						this.alertError.nativeElement.classList.remove("show");
						this.alertError.nativeElement.classList.add("hide");
					}, 3000);
					checkError = true;
					return;
				}
				this.listDepartmentMember.push(x.formData.value);
			}

			this.dealer.departmentStaffDealerDtos = this.listDepartmentMember;
			if (!checkError) {
				this._service.saveDealer(this.dealer).subscribe((res: any) => {
					this.response.code = res.code;
					this.response.data = res.data;
					this.response.msg = res.msg;
					this.response.status = res.status;

					this.alertWarning.nativeElement.classList.add("show");
					this.alertWarning.nativeElement.classList.remove("hide");
					this.alertWarning.nativeElement.classList.add("showAlert");
					setTimeout(() => {
						this.alertWarning.nativeElement.classList.remove(
							"show"
						);
						this.alertWarning.nativeElement.classList.add("hide");
					}, 3000);
					if (this.response.code == 1) {
						this.dialogRef.close(1);
					} else {
						this.listDepartmentMember = [];
					}
				});
			}
		}
	}

	closeAlert() {
		this.alertError.nativeElement.classList.remove("show");
		this.alertError.nativeElement.classList.add("hide");
	}
	closeAlertWarning() {
		this.alertWarning.nativeElement.classList.remove("show");
		this.alertWarning.nativeElement.classList.add("hide");
	}
}
