<script lang="ts">
	import { MessageType } from '$lib/constants';
	import { sendMessage } from '$lib/content/utils';
	import { highlightingPreference } from '$lib/stores';
	import { HighlightingPreference } from '$lib/types';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';

	let preference: HighlightingPreference;

	let modal: HTMLDialogElement;

	const updatePreference = async () => {
		highlightingPreference.set(preference);
		await sendMessage(MessageType.RERUN_SCAN);
	};

	highlightingPreference.subscribe((value) => {
		preference = value;
	});

	onMount(() => {
		preference = $highlightingPreference;
	});
</script>

<div class="preferences">
	<span class="section-title">Highlighting Preference</span>
	<div class="sub-section">
		<span class="preference-title bg-base-300 text-base-100"
			>{preference == HighlightingPreference.all
				? 'All Sites except excluded'
				: 'Only Included Sites'}</span
		>
		<span class="change" on:click={() => modal.showModal()} on:keydown={() => modal.showModal()}>
			Change
		</span>
	</div>
	<dialog bind:this={modal} class="bg-neutral text-base-100">
		<div class="preferences-modal">
			<div class="modal-header">
				<div>
					<span class="modal-title">Highlighting Preference</span>
					<span class="modal-subtitle">Select which sites you want to highlight</span>
				</div>
				<span on:click={() => modal.close()} on:keydown={() => modal.close()}>
					<Fa icon={faXmark} />
				</span>
			</div>

			<div class="modal-body">
				<label>
					All sites except excluded
					<input
						type="radio"
						name="radio-1"
						class="radio radio-xs checked:bg-blue-500"
						bind:group={preference}
						on:change={async () => await updatePreference()}
						value={HighlightingPreference.all}
					/>
				</label>
				<label>
					Only Included sites
					<input
						type="radio"
						name="radio-1"
						class="radio radio-xs checked:bg-blue-500"
						bind:group={preference}
						on:change={async () => await updatePreference()}
						value={HighlightingPreference.included}
					/>
				</label>
			</div>
		</div>
	</dialog>
</div>

<style>
	dialog {
		width: 65vw;
		border: none;
		border-radius: 0.5rem;
	}
	.preferences {
		margin: 0.8rem 0;
	}

	.preferences > .section-title {
		font-size: 0.75rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 400;
	}

	.preferences > .sub-section {
		display: flex;
		flex-direction: row;
		column-gap: 0.75rem;
		align-items: center;
		margin-top: 0.3rem;
	}

	.preferences > .sub-section > .preference-title {
		display: flex;
		flex-direction: column;
		font-size: 0.625rem;
		font-weight: 500;
		line-height: 153%;
		border-radius: 0.375rem;
		border: 1px solid #d9d9d9;
		box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.08);
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		padding: 0.3rem 0.6rem;
	}

	.preferences > .sub-section > .change {
		color: #4277ff;
		font-size: 0.625rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 600;
		line-height: 153%;
		cursor: pointer;
	}
	.preferences-modal > .modal-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.preferences-modal > .modal-header > div {
		display: flex;
		flex-direction: column;
	}

	.preferences-modal > .modal-header > div > .modal-title {
		leading-trim: both;
		text-edge: cap;
		font-size: 0.625rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 600;
		line-height: 153%;
	}

	.preferences-modal > .modal-header > div > .modal-subtitle {
		color: #6c6872;
		font-size: 0.6rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 400;
		line-height: 160%;
	}
	.preferences-modal > .modal-header > span {
		height: fit-content;
		border-radius: 50%;
		cursor: pointer;
		font-size: 0.7rem;
	}

	.preferences-modal > .modal-body {
		display: flex;
		flex-direction: column;
		margin-top: 0.5rem;
	}
	.preferences-modal > .modal-body > label {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0.5rem 0;
		font-size: 0.6rem;
	}
</style>
