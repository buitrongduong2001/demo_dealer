import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import {
	MatDialog,
	MatPaginator,
	MatSort,
	MatTableDataSource,
} from "@angular/material";
import { City } from "../../../../../core/class/dealer/city";
import { Dealer } from "../../../../../core/class/dealer/dealer";
import { District } from "../../../../../core/class/dealer/district";
import { SearchDealer } from "../../../../../core/class/dealer/searchForm";
import { ResponseBE } from "../../../../../core/class/response/response";
import { SubheaderService } from "../../../../../core/services/layout/subheader.service";
import { DealerApiService } from "../../../../../core/services/page/dealer/dealerapi.service";
import { DealersCreateComponent } from "../dealers-create/dealers-create.component";
export interface StatusDealer {
	id: number;
	title: string;
}

@Component({
	selector: "m-dealer",
	templateUrl: "./dealers.component.html",
	styleUrls: ["./dealers.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealersComponent implements OnInit, OnChanges {
	public url = `api/be-agent/agent/get/all`;
	posts: any;
	dataSource: MatTableDataSource<Dealer> = new MatTableDataSource<Dealer>([]);
	dealers: Dealer[] = [];
	cities: City[] = [];
	districts: District[] = [];
	searchDealer: SearchDealer;
	response: ResponseBE;
	formData: FormGroup;
	optionStatus: StatusDealer[] = [
		{ id: 1, title: "Kích hoạt" },
		{ id: 2, title: "Chờ kích hoạt" },
		{ id: 3, title: "Tạm dừng" },
	];
	optionLevelDealer: StatusDealer[] = [
		{ id: 1, title: "Đại lý cấp 1" },
		{ id: 2, title: "Đại lý cấp 2" },
		{ id: 3, title: "Cộng tác viên" },
	];
	displayedColumns: string[] = [
		"stt",
		"name",
		"phone",
		"email",
		"taxCode",
		"city",
		"district",
		"levelDealer",
		"statusApp",
		"otp",
		"actions",
	];
	selectAllStatus: number = 0;
	selectAllLevel: number = 0;
	selectAllCity: number = 0;
	selectAllDistrict: number = 0;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild("alertSuccessForm") alertSuccess: ElementRef;
	@ViewChild("alertWarningLock") alertWarningLock: ElementRef;
	constructor(
		private _service: DealerApiService,
		public dialog: MatDialog,
		private subheaderService: SubheaderService
	) {
		this.subheaderService.setTitle("Quản lý đại lý");
		this.getAllDealer();
	}

	getAllDealer() {
		this._service.getAll(this.url).subscribe((res: any) => {
			this.posts = res.data;
			this.dataSource = new MatTableDataSource(this.posts);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}
	ngOnInit(): void {
		this.response = new ResponseBE();
		this.searchDealer = {
			inpString: "",
			status: 0,
			levelDealer: 0,
			cityId: 0,
			districtId: 0,
		};
		this.formData = new FormGroup({
			inpString: new FormControl(""),
			selStatus: new FormControl(this.selectAllStatus),
			selLevel: new FormControl(this.selectAllLevel),
			selCity: new FormControl(this.selectAllCity),
			selDistrict: new FormControl(this.selectAllDistrict),
		});
		this.getAllCities();
	}
	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
	}
	getStatusApp(status: any) {
		var strStatus = "";
		if (status == 1) {
			strStatus = "Đã kích hoạt";
		} else if (status == 2) {
			strStatus = "Chưa kích hoạt";
		} else if (status == 3) {
			strStatus = "Tạm dừng";
		}
		return strStatus;
	}
	getAllCities() {
		this._service.getCities().subscribe((res: any) => {
			this.cities = res.data;
		});
	}
	getAllDistrictByCity(cityId: any) {
		this._service.getDistrictsByCity(cityId).subscribe((res: any) => {
			this.districts = res.data;
			this.selectAllDistrict = 0;
		});
	}

	public myError = (controlName: string, errorName: string) => {
		return this.formData.controls[controlName].hasError(errorName);
	};

	//Submit form
	onSubmitForm() {
		this.searchDealer.inpString = this.formData.value.inpString;
		this.searchDealer.status = this.formData.value.selStatus;
		this.searchDealer.levelDealer = this.formData.value.selLevel;
		this.searchDealer.cityId = this.formData.value.selCity;
		this.searchDealer.districtId = this.formData.value.selDistrict;

		this._service.findDealer(this.searchDealer).subscribe((res: any) => {
			this.posts = res.data != null ? res.data : [];
			this.dataSource = new MatTableDataSource(this.posts);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	returnCode: number;
	// Dialog
	openDialog() {
		const dialogRef = this.dialog.open(DealersCreateComponent, {
			minWidth: "95vw",
			height: "94%",
		});
		dialogRef.afterClosed().subscribe((result) => {
			this.returnCode = result;
			if (this.returnCode == 1) {
				this.getAllDealer();
				this.response.msg = "Tạo mới đại lý thành công";
				this.alertSuccess.nativeElement.classList.add("show");
				this.alertSuccess.nativeElement.classList.remove("hide");
				this.alertSuccess.nativeElement.classList.add("showAlert");
				setTimeout(() => {
					this.alertSuccess.nativeElement.classList.remove("show");
					this.alertSuccess.nativeElement.classList.add("hide");
				}, 3000);
			}
		});
	}
	closeAlertSuccess() {
		this.alertSuccess.nativeElement.classList.remove("show");
		this.alertSuccess.nativeElement.classList.add("hide");
	}

	//Tạm dừng tài khoản
	lockDealer(idDealer: any, event: any) {
		this._service.lockDealer(idDealer).subscribe((res: any) => {
			this.response = res;
			if (this.response.code == 1) {
				this.alertSuccess.nativeElement.classList.add("show");
				this.alertSuccess.nativeElement.classList.remove("hide");
				this.alertSuccess.nativeElement.classList.add("showAlert");

				if (
					this.alertSuccess.nativeElement.querySelector(".msg")
						.innerHTML == ""
				) {
					var text = document.createTextNode(
						"Success: " + this.response.msg + "!"
					);
					this.alertSuccess.nativeElement
						.querySelector(".msg")
						.appendChild(text);
				} else {
					var text = document.createTextNode("");
					this.alertSuccess.nativeElement
						.querySelector(".msg")
						.appendChild(text);
				}

				setTimeout(() => {
					this.alertSuccess.nativeElement.classList.remove("show");
					this.alertSuccess.nativeElement.classList.add("hide");
				}, 3000);
				var statusElement =
					event.srcElement.parentElement.parentNode.parentNode.parentNode.querySelector(
						".mat-column-statusApp"
					);
				statusElement.textContent = "";
				var textStatusApp = document.createTextNode("Tạm dừng");
				statusElement.appendChild(textStatusApp);
			} else {
				this.alertWarningLock.nativeElement.classList.add("show");
				this.alertWarningLock.nativeElement.classList.remove("hide");
				this.alertWarningLock.nativeElement.classList.add("showAlert");
				if (
					this.alertWarningLock.nativeElement.querySelector(".msg")
						.innerHTML == ""
				) {
					var text = document.createTextNode(
						"Warning: " + this.response.msg + "!"
					);
					this.alertWarningLock.nativeElement
						.querySelector(".msg")
						.appendChild(text);
				} else {
					var text = document.createTextNode("");
					this.alertWarningLock.nativeElement
						.querySelector(".msg")
						.appendChild(text);
				}

				setTimeout(() => {
					this.alertWarningLock.nativeElement.classList.remove(
						"show"
					);
					this.alertWarningLock.nativeElement.classList.add("hide");
				}, 3000);
			}
		});
	}
	closeAlertWarning() {
		this.alertWarningLock.nativeElement.classList.remove("show");
		this.alertWarningLock.nativeElement.classList.add("hide");
	}
}
