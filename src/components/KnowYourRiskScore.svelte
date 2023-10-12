<script lang="ts">
	import knowYourScoreLogo from '$lib/assets/know_your_score.svg';
	import knowYourScoreLogoDark from '$lib/assets/know_your_score_dark.svg';
	import { theme } from '$lib/stores';
	import { ThemePreference } from '$lib/types';
</script>

<div class="know-your-score">
	<div class="logo-section">
		{#if $theme === ThemePreference.Dark}
			<img src={knowYourScoreLogoDark} alt="" />
		{:else}
			<img src={knowYourScoreLogo} alt="" />
		{/if}
	</div>

	<div class="sub-section">
		<span class="section-title text-base-100">Time to Test your Risk Score</span>
		<span class="section-subtitle text-secondary">
			Getting your score is easy. Just enter your wallet address and email
		</span>
		<a href="/risk-score">
			<button class="button btn-primary">Know your score</button>
		</a>
	</div>
</div>

<style>
	.know-your-score {
		display: flex;
		justify-content: space-between;
		column-gap: 0.9rem;
		margin-top: 0.5rem;
		padding: 0.5rem 0;
	}
	.know-your-score > .logo-section {
		display: flex;
		width: 100%;
		height: auto;
	}
	.know-your-score > .logo-section > img {
		width: 100%;
	}

	.know-your-score > .sub-section {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 0.4rem;
		width: 100%;
		padding-right: 1rem;
	}

	.know-your-score > .sub-section > a {
		color: #fff;
		text-decoration: none;
	}

	.know-your-score > .sub-section > .section-title {
		font-size: 0.9375rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 500;
		line-height: 98.1%;
		letter-spacing: -0.01875rem;
	}
	.know-your-score > .sub-section > .section-subtitle {
		color: #6c6872;
		font-size: 0.6rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 500;
		line-height: 160%;
		padding: 0.5rem 0;
	}
</style>
