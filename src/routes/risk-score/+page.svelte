<script lang="ts">
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Line from '../../components/Line.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import knowYourScoreLogo from '$lib/assets/know_your_score.svg';
	import knowYourScoreLogoDark from '$lib/assets/know_your_score_dark.svg';
	import { sendApiRequest, validateEmail } from '$lib/utils';
	import { validateWallet } from '$lib/content/utils';
	import { theme } from '$lib/stores';
	import { ThemePreference } from '$lib/types';

	let email: string = '';
	let address: string = '';
	let statusError = false;
	let statusMessage: string = '';
	let loading = false;

	const status = (message: string, error: boolean = true) => {
		statusMessage = message;
		statusError = error;
	};

	const handleSubmit = async () => {
		status('');
		if (loading) {
			return;
		}
		loading = true;

		if (email.length === 0 || !validateEmail(email)) {
			status('Invalid Email');
		} else if (address.length === 0 || !validateWallet(address)) {
			status('Invalid Wallet Address');
		} else {
			try {
				await sendApiRequest(email, address);
				status('Check your inbox for the risk score', false);
			} catch (err) {
				status((err as Error).message);
			}
		}
		loading = false;
	};
</script>

<div class="top-panel">
	<a href="/">
		<span class="flex back-button w-fit">
			<Fa icon={faArrowLeft} />
		</span>
	</a>
</div>
<Line />
<div class="logo-section">
	{#if $theme === ThemePreference.Dark}
		<img src={knowYourScoreLogoDark} alt="" />
	{:else}
		<img src={knowYourScoreLogo} alt="" />
	{/if}
</div>
<div class="title-section">
	<span class="title">Know your Risk Score</span>
	<span class="message">
		Getting your score is easy. Just enter your wallet address and email
	</span>
</div>
<Line />
<div class="form-section">
	<div class="form-item">
		<span>Wallet Address</span>
		<input type="text" bind:value={address} />
	</div>
	<div class="form-item">
		<span>Email</span>
		<input type="text" bind:value={email} />
	</div>
	<button class="button btn-primary btn-wide" on:click={async () => await handleSubmit()}>
		{#if loading}
			<span class="loading loading-spinner" />
		{/if}
		Submit</button
	>
	<div class="form-item">
		<span class="status" class:text-success={!statusError} class:text-error={statusError}
			>{statusMessage}</span
		>
	</div>
</div>

<style>
	.text-error {
		@apply text-[#FF7B69];
	}
	.text-success {
		@apply text-[#28CF6B];
	}
	.top-panel {
		width: 100%;
		height: auto;
		padding: 0.5rem 0.3rem 0.8rem;
	}
	.logo-section {
		display: flex;
		justify-content: center;
		margin: 0.2rem 0 1rem;
	}
	.back-button {
		background: #efefef;
		border-radius: 50%;
		padding: 0.3rem 0.4rem;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.risk-score-icon {
		background-image: url(../assets/know_your_score.svg);
	}

	.title-section {
		display: flex;
		flex-direction: column;
	}

	.title-section > .title {
		text-align: center;
		font-size: 1rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 600;
		line-height: 98.1%;
		letter-spacing: -0.01875rem;
	}

	.title-section > .message {
		text-align: center;
		padding: 0 3rem;
		margin: 1rem 0 1rem;
	}

	.form-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 1rem;
		margin-top: 1rem;
	}

	.form-section > .form-item {
		display: flex;
		flex-direction: column;
	}

	.form-section > .form-item > span {
		font-size: 0.66281rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 500;
		line-height: 160%;
	}

	.form-section > .form-item > input {
		border-radius: 0.5625rem;
		border: 0.5px solid #9b9b9b;
		background: rgba(217, 217, 217, 0.04);
		height: 2rem;
		width: 16rem;
		padding: 0.2rem 0.5rem;
	}

	.form-section > .form-item > span.status {
		word-break: break-word;
		padding: 0 4rem;
	}
</style>
