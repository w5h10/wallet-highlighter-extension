// declare namespace module {}
export enum StoreName {
	excludedSites = 'excludedSites',
	includedSites = 'includedSites',
	highlightingPreference = 'highlightingPreference',
	theme = 'theme',
	pluginStatus = 'pluginStatus',
	userId = 'userId',
	siteInfo = 'siteInfo',
	statsData = 'stats'
}
export enum PluginStatus {
	Active = 'Active',
	Inactive = 'Inactive'
}
export enum HighlightingPreference {
	all = 'all',
	included = 'included'
}

export enum ThemePreference {
	Light = 'wh-light',
	Dark = 'wh-dark'
}

export interface RiskDetailsMapping {
	[k: string]: {
		color: string;
		detail: RiskDetailItem;
	} | null;
}

export interface RiskDetailItem {
	combinedRisk: string;
	fraudRisk: string;
	lendingRisk: string;
	reputationRisk: string;
	tags: Array<RiskTag>;
}

export interface RiskTag {
	tag: string;
	desc: string;
}

export interface RiskCounter {
	high: number;
	low: number;
	medium: number;
}

export type Wallet = HTMLInputElement | HTMLSpanElement | null;

export interface Wallets {
	[k: string]: Wallet[];
}
export interface Obj {
	[k: string]: string | Obj;
}
export declare const Ext: any;

export interface RiskApiResponse {
	colors: Record<string, string | null>;
	details: Record<string, RiskDetailItem | null>;
}

export interface KnowRiskScoreResponseModel {
	status: 'OK' | 'ERROR';
	error?: string;
}
