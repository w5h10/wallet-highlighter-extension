<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import Fa from 'svelte-fa/src/fa.svelte';
	import Line from './Line.svelte';
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { theme } from '$lib/stores';
	import { ThemePreference } from '$lib/types';

	const switchTheme = () => {
		const nextTheme =
			$theme === ThemePreference.Dark ? ThemePreference.Light : ThemePreference.Dark;
		theme.set(nextTheme);
	};
</script>

<div class="flex justify-between pt-3 mx-2 pb-2">
	<div class="flex items-center">
		<img src={logo} class="h-8" alt="logo" />
		<span class="text-base-100 font-bold ml-2">Wallet Highlighter</span>
	</div>
	<div
		class="flex items-center text-[1rem] pr-2 cursor-pointer text-base-100"
		on:click={switchTheme}
	>
		{#if $theme === 'wh-light'}
			<Fa icon={faSun} />
		{:else}
			<Fa icon={faMoon} />
		{/if}
	</div>
</div>
<Line />
