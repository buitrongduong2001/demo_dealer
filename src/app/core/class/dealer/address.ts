import { City } from "./city";
import { District } from "./district";
import { Ward } from "./ward";

export class Address {
	id: number;
	apartment: string;
	cityDto: City;
	districtDto: District;
	wardDto: Ward;
}
