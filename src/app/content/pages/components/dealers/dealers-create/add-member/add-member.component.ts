import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { Subject } from "rxjs";

import { DepartmentStaffDealer } from "../../../../../../core/class/department_dealer/departmentStaffDealer";
import { MyErrorStateMatcher } from "../dealers-create.component";

export class CustomDataForm {
	idMember: number;
	formData: any;
}
@Component({
	selector: "m-add-member",
	templateUrl: "./add-member.component.html",
	styleUrls: ["./add-member.component.scss"],
})
export class AddMemberComponent implements OnInit {
	formData: FormGroup;
	date = new FormControl(new Date());
	serializedDate = new FormControl(new Date().toISOString());
	customForm: CustomDataForm;
	departmentStaffDealer: DepartmentStaffDealer;
	matcher = new MyErrorStateMatcher();
	@Input() item: number;
	@Input()
	parentSubject: Subject<any>;

	@Output() delete: EventEmitter<number> = new EventEmitter();
	@Output() newItemEvent = new EventEmitter<string>();
	constructor(private _formBuilder: FormBuilder) {}
	ngOnInit() {
		this.departmentStaffDealer = new DepartmentStaffDealer();

		this.formData = this._formBuilder.group({
			nameDepartment: new FormControl(null, Validators.required),
			roleStaff: new FormControl(null, Validators.required),
			name: new FormControl(null, Validators.required),
			phone: new FormControl(null, [
				Validators.required,
				Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})"),
			]),
			birthDate: new FormControl(new Date().toISOString(), [
				Validators.required,
			]),
			addressStr: new FormControl(null, Validators.required),
			sex: new FormControl(null, Validators.required),
		});
	}
	deleteMe() {
		this.delete.emit(this.item);
	}
}
