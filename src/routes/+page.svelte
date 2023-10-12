<script lang="ts">
	import Line from '../components/Line.svelte';
	import Stats from '../components/Stats.svelte';
	import KnowYourRiskScore from '../components/KnowYourRiskScore.svelte';
	import HighlightingPreferences from '../components/HighlightingPreferences.svelte';
	import CurrentSite from '../components/CurrentSite.svelte';
	import TopBar from '../components/TopBar.svelte';
</script>

<div>
	<TopBar />
	<div class="px-4">
		<Stats />
		<KnowYourRiskScore />
		<Line />
		<HighlightingPreferences />
		<Line />
		<CurrentSite />
	</div>
</div>
