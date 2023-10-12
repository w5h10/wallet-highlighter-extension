import { Site } from '$lib/models/site';
import { StatsData } from '$lib/models/statsData';
import { StoreName, type RiskCounter } from '$lib/types';
import { getStoreValueFromLocalStorage, setStoreValueToLocalStorage } from '$lib/stores';

export abstract class SiteManagerService {
	private static siteData: { [url: string]: Site } = {};
	public static total = 0;
	public static totalHighPercent = 0.0;
	public static totalMedPercent = 0.0;
	static excluded_list: string[];
	static highlight_list: string[];

	public static async addSite(
		siteId: string,
		siteUrl: string,
		isExcluded: boolean,
		riskLevelCount: RiskCounter
	) {
		siteUrl = this.processURL(siteUrl);
		const allSites = await this.load();
		this.populateList(allSites.value);
		const tmpSite = new Site(siteId, siteUrl, isExcluded);
		tmpSite.populateRisk(riskLevelCount);
		this.siteData[siteUrl] = tmpSite;
		this.save();
		return Promise.resolve({ value: this.getAllSitesFromSiteData() });
	}

	static processURL(siteUrl: string): string {
		const url = new URL(siteUrl);
		return url.hostname;
	}

	public static async deleteSite(siteURL: string): Promise<void | Promise<any>> {
		const allSites = await this.load();
		this.populateList(allSites.value);
		delete this.siteData[siteURL];
		this.save();
		return Promise.resolve({ value: this.getAllSitesFromSiteData() });
	}

	public static async updateSite(
		siteURL: string,
		riskLevelCount: RiskCounter
	): Promise<void | Promise<any>> {
		siteURL = this.processURL(siteURL);
		const allSites = await this.load();
		this.populateList(allSites.value);
		if (siteURL in this.siteData) {
			const tmpSite = this.siteData[siteURL];
			if (this.checkForChange(riskLevelCount, tmpSite)) {
				tmpSite.populateRisk(riskLevelCount);
				this.siteData[siteURL] = tmpSite;
				this.save();
			}
		}
		return Promise.resolve({ value: this.getAllSitesFromSiteData() });
	}
	static checkForChange(riskLevelCount: RiskCounter, tmpSite: Site) {
		if (
			riskLevelCount.high !== tmpSite.highRiskCount ||
			riskLevelCount.medium !== tmpSite.moderateRiskCount ||
			riskLevelCount.low !== tmpSite.lowRiskCount
		) {
			return true;
		} else {
			return false;
		}
	}

	private static getAllSitesFromSiteData(): any {
		const allSites: Site[] = [];
		for (const key in SiteManagerService.siteData) {
			const value: Site = SiteManagerService.siteData[key];
			allSites.push(value);
		}
		return allSites;
	}

	private static async save(): Promise<boolean> {
		const serializedData: string[] = [];
		if (SiteManagerService.siteData != null) {
			for (const key in SiteManagerService.siteData) {
				const value: Site = SiteManagerService.siteData[key];
				serializedData.push(value.serialize());
			}
			return setStoreValueToLocalStorage(StoreName.siteInfo, serializedData);
		} else {
			console.error('Save called for null data');
		}
		return false;
	}

	public static async load() {
		const serializedData: string[] = (await getStoreValueFromLocalStorage(
			StoreName.siteInfo,
			[]
		)) as string[];
		const allSites: Site[] = [];
		for (let i = 0; i < serializedData.length; i++) {
			const siteData: Site = Site.fromSerialized(serializedData[i] ?? '{}');
			allSites.push(siteData);
		}
		return Promise.resolve({ value: allSites });
	}

	private static populateList(allSites: Site[]) {
		const tmpSiteData: { [siteId: string]: Site } = {};
		const tmpHighlight_list: string[] = [];
		const tmpExcluded_list: string[] = [];
		allSites.forEach((site) => {
			tmpSiteData[site.siteURL] = site;
			if (site.isExcluded) {
				tmpHighlight_list.push(site.siteURL);
			} else {
				tmpExcluded_list.push(site.siteURL);
			}
		});
		this.siteData = tmpSiteData;
		this.excluded_list = tmpExcluded_list;
		this.highlight_list = tmpHighlight_list;
	}

	public static getStats(rawStats: string) {
		const stats: StatsData = StatsData.fromSerialized(rawStats);
		const total = stats.totalHighlighted;
		const high = stats.totalHighRisk;
		const med = stats.totalModerateRisk;

		return {
			totalCount: total,
			highPercent: total === 0 ? 0 : ((high / total) * 100).toFixed(0),
			medPercent: total === 0 ? 0 : ((med / total) * 100).toFixed(0)
		};
	}

	public static getSiteByUrl(url: string, allSites: Site[]): Site | undefined {
		this.populateList(allSites);
		if (url in this.siteData) {
			return this.siteData[url];
		}
		return undefined;
	}

	public static async updateStats(riskLevelCount: RiskCounter) {
		if (!(riskLevelCount.high === 0 && riskLevelCount.medium === 0 && riskLevelCount.low === 0)) {
			const serializedData: string = (await getStoreValueFromLocalStorage(
				StoreName.statsData,
				'{}'
			)) as string;
			const stats: StatsData = StatsData.fromSerialized(serializedData);
			stats.updateStatsCount(riskLevelCount);
			await setStoreValueToLocalStorage(StoreName.statsData, stats.serialize());
		}
	}

	static checkIfDefaultExcluded(currentSite: string): boolean {
		return [
			'https://api.wallethighlighter.com',
		].includes(currentSite);
	}
}
