export const TOKEN_ACTION_TAG_NAME = "Action"
export const TOKEN_RECIPIENT_TAG_NAME = "Recipient"
export const TOKEN_QUANTITY_TAG_NAME = "Quantity"
export const TOKEN_TARGET_TAG_NAME = "Target"
export const TOKEN_FROM_TAG_NAME = "From"
export const TOKEN_TO_TAG_NAME = "To"
export const TOKEN_LIMIT_TAG_NAME = "Limit"
export const TOKEN_CURSOR_TAG_NAME = "Cursor"
export const TOKEN_DENOMINATION_TAG_NAME = "Denomination"
export const TOKEN_NAME_TAG_NAME = "Name"
export const TOKEN_TICKER_TAG_NAME = "Ticker"
export const TOKEN_LOGO_TAG_NAME = "Logo"

export const TOKEN_TAGS = {
	ACTION: {
		BALANCE: () => ({ name: TOKEN_ACTION_TAG_NAME, value: "Balance" }),
		TRANSFER: () => ({ name: TOKEN_ACTION_TAG_NAME, value: "Transfer" }),
		MINT: () => ({ name: TOKEN_ACTION_TAG_NAME, value: "Mint" }),
		INFO: () => ({ name: TOKEN_ACTION_TAG_NAME, value: "Info" }),
		BALANCES: () => ({ name: TOKEN_ACTION_TAG_NAME, value: "Balances" }),
		GRANT: () => ({ name: TOKEN_ACTION_TAG_NAME, value: "Grant" }),
	},
	RECIPIENT: (address: string) => ({
		name: TOKEN_RECIPIENT_TAG_NAME,
		value: address
	}),
	QUANTITY: (amount: string) => ({
		name: TOKEN_QUANTITY_TAG_NAME,
		value: amount
	}),
	TARGET: (address: string) => ({
		name: TOKEN_TARGET_TAG_NAME,
		value: address
	}),
	FROM: (address: string) => ({
		name: TOKEN_FROM_TAG_NAME,
		value: address
	}),
	TO: (address: string) => ({
		name: TOKEN_TO_TAG_NAME,
		value: address
	}),
	LIMIT: (limit: number) => ({
		name: TOKEN_LIMIT_TAG_NAME,
		value: limit.toString()
	}),
	CURSOR: (cursor: string) => ({
		name: TOKEN_CURSOR_TAG_NAME,
		value: cursor
	}),
	DENOMINATION: (denomination: string) => ({
		name: TOKEN_DENOMINATION_TAG_NAME,
		value: denomination
	}),
	NAME: (name: string) => ({
		name: TOKEN_NAME_TAG_NAME,
		value: name
	}),
	TICKER: (ticker: string) => ({
		name: TOKEN_TICKER_TAG_NAME,
		value: ticker
	}),
	LOGO: (logo: string) => ({
		name: TOKEN_LOGO_TAG_NAME,
		value: logo
	}),
} as const
