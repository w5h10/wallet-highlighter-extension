import type { RiskCounter } from '$lib/types';

export class StatsData {
	highRiskPercentage: number;
	moderatePercentage: number;

	constructor(public totalHighlighted = 0, public totalHighRisk = 0, public totalModerateRisk = 0) {
		this.highRiskPercentage =
			totalHighlighted === 0
				? 0
				: Math.round((this.totalHighRisk * 10000) / totalHighlighted) / 100;
		this.moderatePercentage =
			totalHighlighted === 0
				? 0
				: Math.round((this.totalModerateRisk * 10000) / totalHighlighted) / 100;
	}

	private toObject() {
		return {
			totalHighlighted: this.totalHighlighted,
			totalHighRisk: this.totalHighRisk,
			totalModerateRisk: this.totalModerateRisk
		};
	}

	serialize() {
		return JSON.stringify(this.toObject());
	}

	static fromSerialized(serialized: string) {
		const statsData: ReturnType<StatsData['toObject']> = JSON.parse(serialized);

		const stats: StatsData = new StatsData(
			statsData.totalHighlighted,
			statsData.totalHighRisk,
			statsData.totalModerateRisk
		);

		return stats;
	}

	static initializeWithEmtpy(): StatsData {
		return new StatsData();
	}

	public updateStatsCount(riskCount: RiskCounter) {
		const tmpTotal = this.totalHighlighted + riskCount.high + riskCount.low + riskCount.medium;
		const tmpTotalHigh = this.totalHighRisk + riskCount.high;
		const tmpTotalMod = this.totalModerateRisk + riskCount.medium;
		this.totalHighlighted = tmpTotal;
		this.totalHighRisk = tmpTotalHigh;
		this.totalModerateRisk = tmpTotalMod;
	}

	static humanReadableFormat(totalCount: number): string {
		const decPlaces = Math.pow(10, 2);

		// Enumerate number abbreviations
		const abbrev = ['k', 'm', 'b', 't'];
		let val = totalCount.toString();
		for (let i = abbrev.length - 1; i >= 0; i--) {
			const size = Math.pow(10, (i + 1) * 3);
			if (size <= totalCount) {
				totalCount = Math.round((totalCount * decPlaces) / size) / decPlaces;
				val = totalCount.toString();
				if (totalCount == 1000 && i < abbrev.length - 1) {
					totalCount = 1;
					i++;
				}
				val += abbrev[i];
				break;
			}
		}
		return val;
	}
}
