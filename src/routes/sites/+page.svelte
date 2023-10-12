<script lang="ts">
	import TopBar from '../../components/TopBar.svelte';
	import lightBulb from '$lib/assets/light-bulb.svg';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
	import { excludedSites, includedSites } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { sendMessage } from '$lib/content/utils';
	import { MessageType } from '$lib/constants';

	enum Tab {
		Included,
		Excluded
	}

	let activeTab = Tab.Included;
	const switchTab = (tab: Tab) => (activeTab = tab);

	const removeFromIncluded = async (site: string) => {
		const index = $includedSites.indexOf(site);
		includedSites.update((value: string[]) => {
			value.splice(index, 1);
			return value;
		});
		await sendMessage(MessageType.RERUN_SCAN);
	};

	const removeFromExcluded = async (site: string) => {
		const index = $excludedSites.indexOf(site);
		excludedSites.update((value: string[]) => {
			value.splice(index, 1);
			return value;
		});
		await sendMessage(MessageType.RERUN_SCAN);
	};

	onMount(() => {
		if ($page.url.searchParams.has('excluded')) {
			activeTab = Tab.Excluded;
		}
	});
</script>

<TopBar />
<div class="px-4 py-2">
	<span class="title mb-4 text-base-100">Sites</span>
	<div class="tabs tabs-boxed flex justify-center">
		<a
			class="tab text-xs"
			class:tab-active={activeTab === Tab.Included}
			on:click={() => switchTab(Tab.Included)}>Included websites</a
		>
		<a
			class="tab text-xs"
			class:tab-active={activeTab === Tab.Excluded}
			on:click={() => switchTab(Tab.Excluded)}>Excluded websites</a
		>
	</div>
	<div class="flex flex-row items-center gap-3 mt-4 mb-2">
		<img src={lightBulb} alt="light-bulb" class="h-[0.8rem] w-auto" />
		<span class="text-sm text-base-100"
			>What is {activeTab === Tab.Included ? 'Included' : 'Excluded'} websites</span
		>
	</div>
	<span class="learn-more"
		>The list of of websites from which wallet addresses will be highlighted when the preference is
		set to {activeTab === Tab.Included ? 'Included sites' : 'All sites except excluded'}</span
	>
	{#if activeTab === Tab.Included}
		<div class="flex flex-col">
			{#each $includedSites as site}
				<div class="list-item">
					<div class="flex gap-2 items-center">
						<Fa icon={faGlobeAsia} />
						<span class="text-base-100">{site}</span>
					</div>
					<span
						class="text-[#DF3333] cursor-pointer"
						on:click={async () => await removeFromIncluded(site)}>Remove</span
					>
				</div>
			{:else}
				<span class="m-4 text-center">No websites in the included list so far.</span>
			{/each}
		</div>
	{:else if activeTab === Tab.Excluded}
		<div class="flex flex-col">
			{#each $excludedSites as site}
				<div class="list-item">
					<div class="flex gap-2 items-center">
						<Fa icon={faGlobeAsia} />
						<span class="text-base-100">{site}</span>
					</div>
					<span
						class="text-[#DF3333] cursor-pointer"
						on:click={async () => await removeFromExcluded(site)}>Remove</span
					>
				</div>
			{:else}
				<span class="m-4 text-center">No websites in the excluded list so far.</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.title {
		font-size: 1.3125rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		display: flex;
	}
	.learn-more {
		color: #6c6872;
		font-size: 0.56281rem;
		font-weight: 500;
	}
	.list-item {
		@apply contrast;
		display: flex;
		align-items: center;
		border-radius: 0.4375rem;
		border: 1px solid;
		padding: 0.5rem 0.8rem;
		-moz-column-gap: 0.5rem;
		column-gap: 0.5rem;
		justify-content: space-between;
	}
</style>
