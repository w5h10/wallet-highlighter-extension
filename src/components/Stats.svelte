<script lang="ts">
	import { StatsData } from '$lib/models/statsData';
	import { statsData } from '$lib/stores';
	import { onMount } from 'svelte';

	let { highRiskPercentage, totalHighlighted, moderatePercentage } =
		StatsData.initializeWithEmtpy();

	onMount(() => {
		statsData.subscribe((value) => {
			const data = StatsData.fromSerialized(value);
			highRiskPercentage = data.highRiskPercentage;
			totalHighlighted = data.totalHighlighted;
			moderatePercentage = data.moderatePercentage;
		});
	});
</script>

<div class="flex justify-between mt-2 gap-2">
	<div class="stats-section shadow-lg">
		<div class="stats-item">
			<span class="stats-value">
				{StatsData.humanReadableFormat(totalHighlighted)}
			</span>
			<span class="stats-label">Total wallets highlighted</span>
		</div>
	</div>
	<div class="stats-section shadow-md">
		<div class="stats-item">
			<span class="stats-value error">
				{highRiskPercentage}%
			</span>
			<span class="stats-label">High risk wallets</span>
		</div>
	</div>
	<div class="stats-section shadow-md">
		<div class="stats-item">
			<span class="stats-value warning">
				{moderatePercentage}%
			</span>
			<span class="stats-label">Moderate risk wallets</span>
		</div>
	</div>
</div>

<style lang="postcss">
	.stats-section {
		display: flex;
		column-gap: 0.9rem;
		border-radius: 0.375rem;
	}
	.stats-item {
		@apply bg-base-300;
		border-radius: 0.375rem;
		padding: 0.25rem 0.88rem;
		width: 5.5rem;
		display: flex;
		flex-direction: column;
	}

	.stats-label {
		@apply text-base-100;
		font-size: 0.56281rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 500;
		line-height: 160%;
		margin-bottom: 0.5rem;
	}

	.stats-value {
		@apply text-secondary;
		font-size: 1.25281rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 900;
		line-height: 165.1%;
		margin: 0.3rem 0;
	}
	.error {
		@apply text-[#FF6565];
	}

	.warning {
		@apply text-[#F99521];
	}
</style>
