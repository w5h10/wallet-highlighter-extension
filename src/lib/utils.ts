import IOTA from '@iota/validators';
import WAValidator from 'trezor-address-validator';
import { getUserId } from './content/utils';
import { API_HOST } from './constants';
import type { KnowRiskScoreResponseModel } from './types';

class RiskScoreError extends Error {}
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

const isValidIotaAddress = (address: string) =>
	IOTA.isAddress(address) || new RegExp('^(iota1|iot1|io1)[a-zA-Z0-9]{25,}').test(address);

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

export const validateEmail = (email: string): boolean => {
	return new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).test(email);
};

export const sendApiRequest = async (email: string, wallet: string): Promise<void> => {
	if (!email || !wallet) {
		throw new RiskScoreError('missing email or wallet address');
	}

	const userID = await getUserId();
	console.log({ userID });

	let result = null;
	try {
		const response = await fetch(`${API_HOST}/v1/knowriskscore`, {
			method: 'POST',
			body: JSON.stringify({ email, wallet, userID, source: 'WEB_EXTENSION' }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		result = (await response.json()) as KnowRiskScoreResponseModel;
	} catch (e) {
		throw new RiskScoreError(
			'An Error occured while connecting to server. Please check your connection.'
		);
	}
	if (result.status.toUpperCase() === 'ERROR') {
		throw new RiskScoreError(result.error ?? 'An error has occured');
	}
};

export const getScamReportHash = async (address: string, ticker: string, websiteUrl: string) => {
	const hashable = [address, ticker, websiteUrl].join('_');
	const hashBuffer = await crypto.subtle.digest('SHA-256', Buffer.from(hashable));
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
};
