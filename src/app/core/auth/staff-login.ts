export interface StaffLoginDto {
	provider: string;
	providerUserId: string;
	password: string;
	typeApp: string;
	checksum: string;
	deviceToken: string;
	language: number;
	osSystem: number;
}
