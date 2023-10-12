import {
	HIGH_RISK_COLOR,
	LOW_RISK_COLOR,
	MED_RISK_COLOR,
	RISK_API_URL,
	MessageType
} from '$lib/constants';
import WAValidator from 'trezor-address-validator';
import { isAddress as isIotaAddress } from '@iota/validators';
import {
	StoreName,
	type RiskApiResponse,
	type RiskCounter,
	type RiskDetailsMapping
} from '$lib/types';
import { getStoreValueFromLocalStorage } from '$lib/stores';
import { Message } from '$lib/models/message';
// window.Buffer = {};
const coins = [
	// "AUR",
	// "BKX",
	// "BVC",
	// "BIO",
	'BTC',
	'BCH',
	// "BTG",
	// "BTCP",
	// "BTCZ",
	// "CLO",
	// "DASH",
	// "DCR",
	// "DGB",
	'DOGE',
	'ETH',
	// "ETC",
	// "ETZ",
	// "FRC",
	// "GRLC",
	// "HUSH",
	// "KMD",
	'LTC',
	// "MEC",
	'XMR',
	'NMC',
	// "NANO",
	// "NEO",
	// "GAS",
	'PPC',
	// "XPM",
	// "PTS",
	// "QTUM",
	// "XRB",
	// "XRP",
	// "SNG",
	// "VTC",
	// "VOT",
	// "ZEC",
	// "ZCL",
	// "ZEN",
	'XTZ'
];

export const validateWallet = (wallet: string): boolean => {
	if (!wallet) {
		return false;
	}

	if (isValidIotaAddress(wallet)) {
		return true;
	}

	return (
		WAValidator.validate(wallet.trim()) ||
		coins.some((coin) => WAValidator.validate(wallet.trim(), coin))
	);
};

const isValidIotaAddress = (address: string) =>
	isIotaAddress(address) || new RegExp('^(iota1|iot1|io1)[a-zA-Z0-9]{25,}').test(address);

export async function* getRiskDetails(
	wallets: string[]
): AsyncGenerator<RiskDetailsMapping, void, undefined> {
	const domainHashed = await getDomainHashed();

	for (let i = 0; i < wallets.length; i += 100) {
		const walletsSlice = wallets.slice(i, i + 100);
		const apiRespose = await getRiskDetailsFromApi(domainHashed, walletsSlice);
		if (!apiRespose) {
			continue;
		}
		const result: RiskDetailsMapping = {};
		Object.keys(apiRespose.colors).forEach((wallet) => {
			const color = apiRespose.colors[wallet];
			const detail = apiRespose.details[wallet];

			if (color != null && detail != null) {
				result[wallet] = {
					color,
					detail
				};
			} else {
				result[wallet] = null;
			}
		});
		yield result;
	}
}

const getDomainHashed = async () => {
	const domain = window.location.origin;
	const encoder = new TextEncoder();

	const domainUint8 = encoder.encode(domain); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest('SHA-256', domainUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
};

const getRiskDetailsFromApi = async (domainHash: string, wallets: string[]) => {
	if (!domainHash || !wallets || !wallets.length) {
		return null;
	}

	try {
		const siteUrl = window.location.href;
		const userID = await getUserId();
		if (userID === undefined) {
			throw Error('userID cannot be undefined');
		}
		const response = await fetch(RISK_API_URL, {
			method: 'POST',
			body: JSON.stringify({ domainHash, wallets, siteUrl, userID }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return (await response.json()) as RiskApiResponse;
	} catch (e) {
		console.error('Error getting colors', e);
	}
	return null;
};

export const populateRiskCount = (highlightColor: string, riskLevelCount: RiskCounter) => {
	switch (highlightColor) {
		case HIGH_RISK_COLOR:
			riskLevelCount.high += 1;
			break;
		case MED_RISK_COLOR:
			riskLevelCount.medium += 1;
			break;
		case LOW_RISK_COLOR:
			riskLevelCount.low += 1;
			break;
		default:
			break;
	}
	return riskLevelCount;
};

export const clearCounter = (riskLevelCount: RiskCounter) => {
	riskLevelCount = { high: 0, medium: 0, low: 0 };
	return riskLevelCount;
};

const getNewUserId = (): string => {
	const randomPool = new Uint8Array(32);
	crypto.getRandomValues(randomPool);
	let hex = '';
	for (let i = 0; i < randomPool.length; ++i) {
		hex += randomPool[i].toString(16);
	}
	return hex;
};

export const getUserId = async (): Promise<string> => {
	const stored = (await getStoreValueFromLocalStorage(StoreName.userId, getNewUserId())) as string;
	if (stored === undefined || stored.length === 0) {
		return getNewUserId();
	}
	return stored;
};

export const sendMessage = async (type: MessageType) => {
	const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
	const activeTab = tabs[0];

	if (!activeTab.id) throw Error('INVALID TAB');
	const message = new Message(type);
	const res = await chrome.tabs.sendMessage(activeTab.id, message.serialize());
	return res?.value;
};
