<script lang="ts">
	import TopBar from '../../components/TopBar.svelte';
	import powerIcon from '$lib/assets/power.svg';
	import { pluginStatus, theme } from '$lib/stores';
	import { PluginStatus, ThemePreference } from '$lib/types';
	import { sendMessage } from '$lib/content/utils';
	import { MessageType } from '$lib/constants';

	const switchPluginStatus = async () => {
		pluginStatus.set(
			$pluginStatus === PluginStatus.Active ? PluginStatus.Inactive : PluginStatus.Active
		);
		await sendMessage(MessageType.RERUN_SCAN);
	};
</script>

<TopBar />

<div class="px-4 py-2">
	<span class="title mb-4 text-base-100">Settings</span>

	<div class="bg-neutral rounded-xl p-2 power-button-section">
		<span class="text-xs font-semibold text-base-100 w-[100%]">Plugin Status</span>

		<div
			class="rounded-[8rem] bg-neutral border-[#FF7B69] border-2 w-32 h-32 p-4 power-button m-[2rem]"
			on:click={switchPluginStatus}
			class:plugin-active={$pluginStatus === PluginStatus.Active}
		>
			<img src={powerIcon} alt="power" class="flex w-16 h-16" />
		</div>
		<span class="text-base-100 font-semibold"
			>Status : {$pluginStatus === PluginStatus.Active ? 'Active' : 'Inactive'}</span
		>
		<span>(You can change your status whenever needed)</span>
	</div>

	<div class="flex flex-col mt-6">
		<span class="text-base-100 font-semibold">Change your theme</span>
		<label class="text-base-100">
			Light
			<input
				type="radio"
				name="radio-1"
				class="radio radio-xs checked:bg-blue-500"
				bind:group={$theme}
				value={ThemePreference.Light}
			/>
		</label>
		<label class="text-base-100">
			Dark
			<input
				type="radio"
				name="radio-1"
				class="radio radio-xs checked:bg-blue-500"
				bind:group={$theme}
				value={ThemePreference.Dark}
			/>
		</label>
	</div>
</div>

<style lang="postcss">
	.title {
		font-size: 1.3125rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		display: flex;
	}
	.plugin-active {
		@apply border-[#28CF6B];
	}
	.power-button-section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.power-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-width: 0.2rem;
	}
	label {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0.5rem 0;
	}
</style>
