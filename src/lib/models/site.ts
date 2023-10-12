import type { RiskCounter } from '$lib/types';

export class Site {
	readonly siteId: string;
	readonly siteURL: string;
	readonly isExcluded: boolean;

	highRiskCount = 0;
	moderateRiskCount = 0;
	lowRiskCount = 0;

	constructor(siteId: string, siteURL: string, isExcluded: boolean) {
		this.siteId = siteId;
		this.siteURL = siteURL;
		this.isExcluded = isExcluded;
	}

	populateRisk(riskCount: RiskCounter) {
		this.highRiskCount = riskCount.high;
		this.moderateRiskCount = riskCount.medium;
		this.lowRiskCount = riskCount.low;
	}

	private toObject() {
		return {
			siteId: this.siteId,
			siteURL: this.siteURL,
			isExcluded: this.isExcluded,
			highRiskCount: this.highRiskCount,
			moderateRiskCount: this.moderateRiskCount,
			lowRiskCount: this.lowRiskCount
		};
	}

	serialize() {
		return JSON.stringify(this.toObject());
	}

	static fromSerialized(serialized: string) {
		const siteData: ReturnType<Site['toObject']> = JSON.parse(serialized);

		const site: Site = new Site(siteData.siteId, siteData.siteURL, siteData.isExcluded);
		site.highRiskCount = siteData.highRiskCount;
		site.lowRiskCount = siteData.lowRiskCount;
		site.moderateRiskCount = siteData.moderateRiskCount;

		return site;
	}
}
