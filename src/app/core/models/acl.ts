import { ConfigModel } from "../interfaces/config";

export interface AclInterface {
	permissions: any;
	currentUserRoles: any;
}

export class AclModel implements AclInterface, ConfigModel {
	public config: any;

	// default permissions
	public permissions: any = {
		ROLE_ADMIN: ["canDoAnything"],
		ROLE_SALE: ["canDoLimitedThings"],
	};

	// store an object of current user roles
	public currentUserRoles: any = {};

	constructor() {}
}
