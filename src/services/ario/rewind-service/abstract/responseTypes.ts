export interface ARNameDetail {
	name: string,
	startTimestamp: number,
	endTimestamp: number,
	type: string,
	processId: string,
	controllers: string[],
	owner: string,
	ttlSeconds: number
}
