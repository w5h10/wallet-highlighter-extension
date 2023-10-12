<script lang="ts">
	import '../app.css';
	import BottomNav from '../components/BottomNav.svelte';
	import { onMount } from 'svelte';
	import { loadStores, theme } from '$lib/stores';
	onMount(async () => {
		await loadStores();
		document.documentElement.setAttribute('data-theme', $theme);
		theme.subscribe((value) => {
			document.documentElement.setAttribute('data-theme', value);
		});
	});
</script>

<div class="w-[20rem] h-[35rem] font-sans bg-neutral">
	<slot />
	<BottomNav />
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
