import { get, writable } from 'svelte/store';
import { HighlightingPreference, PluginStatus, StoreName, ThemePreference } from '$lib/types';

const getStore = <T>(name: StoreName, defaultValue: T) => {
	const store = writable<T>(defaultValue);
	const customStore = {
		set: (value: T) => {
			store.set(value);
			chrome.storage.local.set({ [name]: value }).catch(console.error);
		},
		update: (cb: (value: T) => T) => {
			const newVal = cb(get(store));
			store.set(newVal);
			chrome.storage.local.set({ [name]: newVal }).catch(console.error);
		},
		subscribe: store.subscribe
	};

	return customStore;
};

export const excludedSites = getStore(StoreName.excludedSites, [] as string[]);
export const includedSites = getStore(StoreName.includedSites, [] as string[]);
export const highlightingPreference = getStore(
	StoreName.highlightingPreference,
	HighlightingPreference.all
);
export const theme = getStore(StoreName.theme, ThemePreference.Dark);
export const pluginStatus = getStore(StoreName.pluginStatus, PluginStatus.Active);
export const userId = getStore(StoreName.userId, '');
export const siteInfo = getStore(StoreName.siteInfo, [] as string[]);
export const statsData = getStore(StoreName.statsData, '{}');

const storeConfig = [
	{ name: StoreName.excludedSites, store: excludedSites, defaultValue: [] as string[] },
	{ name: StoreName.includedSites, store: includedSites, defaultValue: [] as string[] },
	{
		name: StoreName.highlightingPreference,
		store: highlightingPreference,
		defaultValue: HighlightingPreference.all
	},
	{ name: StoreName.theme, store: theme, defaultValue: ThemePreference.Light },
	{ name: StoreName.pluginStatus, store: pluginStatus, defaultValue: PluginStatus.Active },
	{ name: StoreName.userId, store: userId, defaultValue: '' },
	{ name: StoreName.siteInfo, store: siteInfo, defaultValue: [] as string[] },
	{ name: StoreName.statsData, store: statsData, defaultValue: '{}' }
];

export const loadStores = async () => {
	for (const { name, store, defaultValue } of storeConfig) {
		const entry = await chrome.storage.local.get(name);
		const value = entry[name] !== undefined ? entry[name] : defaultValue;
		store.set(value);
	}
};

export const getStoreValueFromLocalStorage = async (
	storeName: StoreName,
	defaultValue: unknown
): Promise<unknown> => {
	const entry = await chrome.storage.local.get(storeName);
	const value: unknown = entry[storeName] !== undefined ? entry[storeName] : undefined;
	const storeConfigEntry = storeConfig.find(({ name }) => storeName === name);
	if (storeConfigEntry === undefined) {
		throw Error('Store not found in local storage');
	}
	storeConfigEntry.store.set(value);
	return value ?? defaultValue;
};

export const setStoreValueToLocalStorage = async (
	storeName: StoreName,
	value: unknown
): Promise<boolean> => {
	const storeConfigEntry = storeConfig.find(({ name }) => storeName === name);
	if (storeConfigEntry === undefined) {
		throw Error('Store not found in local storage');
	}
	storeConfigEntry.store.set(value);
	try {
		await chrome.storage.local.set({ [storeName]: value });
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
