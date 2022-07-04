import { DepartmentDealer } from "../department_dealer/departmentDealer";
import { DepartmentStaffDealer } from "../department_dealer/departmentStaffDealer";
import { Address } from "./address";

export class Dealer {
	id: number;
	status: number;
	createdDate: Date;
	name: string;
	email: string;
	phone: string;
	password: string;
	representative: string;
	sex: number;
	language: number;
	taxCode: string;
	provider: string;
	providerUserId: string;
	statusApp: number;
	numberBank: string;
	otpCode: string;
	addressBank: string;
	description: string;
	establishedDate: Date;
	numberPersonnel: number;
	addressId: number;
	addressDto: Address;
	levelDealer: any;
	apartment: string;
	idCity: number;
	idDistrict: number;
	departmentDealerDtos: DepartmentDealer[];
	departmentStaffDealerDtos: DepartmentStaffDealer[];
}
