<script lang="ts">
	import { excludedSites, includedSites } from '$lib/stores';
	import { onMount } from 'svelte';
	import { MessageType } from '$lib/constants';
	import { sendMessage } from '$lib/content/utils';
	import type { Writable } from 'svelte/store';

	let currentSite = '';
	$: inIncludedSites = $includedSites.includes(currentSite);
	$: inExcludedSites = $excludedSites.includes(currentSite);

	const removeFromStore = (store: Writable<string[]>, valueToRemove: string) => {
		store.update((value) => {
			return value.filter((item) => item !== valueToRemove);
		});
	};

	const handleInclude = async () => {
		if (inExcludedSites) {
			removeFromStore(excludedSites, currentSite);
		}
		if (inIncludedSites) {
			return;
		}
		includedSites.update((values) => [...values, currentSite]);
		await sendMessage(MessageType.RERUN_SCAN);
	};

	const handleExclude = async () => {
		if (inIncludedSites) {
			removeFromStore(includedSites, currentSite);
		}
		if (inExcludedSites) {
			return;
		}
		excludedSites.update((values) => [...values, currentSite]);
		await sendMessage(MessageType.RERUN_SCAN);
	};

	const removeFromList = async () => {
		removeFromStore(inExcludedSites ? excludedSites : includedSites, currentSite);
		await sendMessage(MessageType.RERUN_SCAN);
	};

	onMount(async () => {
		const currentTab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		const currentUrl = currentTab[0].url;
		if (currentUrl !== undefined) {
			currentSite = new URL(currentUrl).hostname;
		}
	});
</script>

<div class="current-site">
	<span class="section-title">Current Site</span>
	<span class="site-url text-base-100">{currentSite}</span>
	<div class="button-group">
		<button
			class:btn-disabled={inIncludedSites}
			class="button btn-primary"
			on:click={handleInclude}
			disabled={inIncludedSites}
		>
			Include this site
		</button>
		<button
			class:btn-disabled={inExcludedSites}
			class="button btn-primary"
			on:click={handleExclude}
			disabled={inExcludedSites}
		>
			Exclude this site
		</button>
	</div>
	{#if inExcludedSites || inIncludedSites}
		<span class="disclaimer">
			This site is in the
			{#if inIncludedSites}
				<a href="/sites">included</a>
			{:else if inExcludedSites}
				<a href="/sites?excluded">excluded</a>
			{/if}
			list.
			<span
				class="text-[#DF3333] cursor-pointer"
				on:click={removeFromList}
				on:keypress={removeFromList}>Remove</span
			>
		</span>
	{/if}
</div>

<style>
	.current-site {
		display: flex;
		flex-direction: column;
		margin: 0.5rem 0;
	}

	.current-site > .section-title {
		font-size: 0.75rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 400;
		line-height: 153%;
	}

	.current-site > .site-url {
		font-size: 1.3125rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 300;
		line-height: 153%;
		width: 18rem;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.current-site > .button-group {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		column-gap: 0.3rem;
		margin-top: 0.5rem;
	}
	.current-site > .disclaimer {
		color: #b4b4b4;
		font-size: 0.625rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 400;
		line-height: 153%;
		margin-top: 0.3rem;
	}
	.current-site > .disclaimer > a {
		color: #4277ff;
		border-bottom: 0.08rem solid #4277ff;
	}
</style>
