export enum MessageType {
	RERUN_SCAN = 'RERUN_SCAN'
}

export const STATS = 'STATS';
export const GET_STATS = 'GET_STATS';

export const LIST_TYPE = 'LIST_TYPE';
export enum ListOptionTypes {
	HIGHLIGHT_LISTED = 'HIGH_LIGHT_LISTED',
	EXCLUDED_LISTED = 'EXCLUEDED_LISTED'
}

export const USER_ID = 'USER_ID';

// Default return color HEX
export const HIGH_RISK_COLOR = '#e74c3c';
export const MED_RISK_COLOR = '#f5b041';
export const LOW_RISK_COLOR = '#2ecc71';

export const API_HOST = 'https://api.wallethighlighter.com';
export const RISK_API_URL = `${API_HOST}/v1/analyze`;
