// Samplce access data
// tslint:disable-next-line:max-line-length

import { Staff } from "../class/staff/Staff";

// {"id":1,"username":"admin","password":"demo","email":"admin@demo.com","accessToken":"access-token-0.022563452858263444","refreshToken":"access-token-0.9348573301432961","roles":["ADMIN"],"pic":"./assets/app/media/img/users/user4.jpg","fullname":"Mark Andre"}
export interface AccessData {
	token: string;
	refreshToken: string;
	user: Staff;
}
