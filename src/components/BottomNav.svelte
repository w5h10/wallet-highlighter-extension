<script lang="ts">
	import home from '$lib/assets/home.svg';
	import globe from '$lib/assets/globe.svg';
	import gear from '$lib/assets/gear.svg';
	import { page } from '$app/stores';
</script>

<div class="bottom-nav" class:hide={$page.url.pathname == '/risk-score'}>
	<a href="/">
		<div class="home" class:active={$page.url.pathname === '/'}>
			<img src={home} alt="home" />
			<span>Home</span>
		</div>
	</a>
	<a href="/sites">
		<div class="sites" class:active={$page.url.pathname === '/sites'}>
			<img src={globe} alt="sites" />
			<span>Sites</span>
		</div>
	</a>
	<a href="/settings">
		<div class="settings" class:active={$page.url.pathname === '/settings'}>
			<img src={gear} alt="settings" />
			<span>Settings</span>
		</div>
	</a>
</div>

<style>
	.bottom-nav {
		@apply bg-base-300;
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		width: 100%;
		box-shadow: 0px -2px 41px 0px rgba(0, 0, 0, 0.13);
	}

	.bottom-nav.hide {
		display: none;
	}
	.bottom-nav > a {
		width: 100%;
		color: #000;
		text-decoration: none;
	}

	.bottom-nav > a > div {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0.6rem 0px 0.5rem;
		cursor: pointer;
	}
	.bottom-nav > a > div {
		@apply text-base-100;
	}
	.bottom-nav > a > div > img {
		@apply h-[1.2rem];
	}
	.bottom-nav > a > div > span {
		@apply text-base-100;
		font-size: 0.625rem;
		font-family: Inter;
		font-style: normal;
		font-weight: 500;
		line-height: 165.1%;
		text-align: center;
	}

	.bottom-nav > a > .active {
		@apply border-primary;
		border-top-width: 0.1rem;
		border-top-style: solid;
	}
</style>
