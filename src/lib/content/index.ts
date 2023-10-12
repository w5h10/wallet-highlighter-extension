import {
	clearCounter,
	getRiskDetails,
	validateWallet,
	populateRiskCount,
	getUserId
} from '$lib/content/utils';
import { SiteManagerService } from '$lib/service/SiteManagerService';
import { API_HOST, HIGH_RISK_COLOR } from '$lib/constants';
import { initTooltip, Tooltip } from '$lib/content/risk/tooltip';
import { getRiskDetailUI } from '$lib/content/risk/main';
import {
	StoreName,
	type RiskCounter,
	type RiskDetailsMapping,
	type Wallet,
	type Wallets,
	PluginStatus,
	HighlightingPreference
} from '$lib/types';
import { getStoreValueFromLocalStorage } from '$lib/stores';
import browser from 'webextension-polyfill';
import { getScamReportHash } from '$lib/utils';

let scanning = false;
const wallets: Wallets = {};
const riskDetails: RiskDetailsMapping = {};
let referredElement: HTMLElement | null = null;
let openedAddr: string | null = null;

/**
 * Single scan of the page
 */
async function scan(_highlightOnlyHigh: boolean) {
	if (scanning) {
		return;
	}

	scanning = true;
	scanInputs();
	scanText();

	try {
		await highlightWallets(_highlightOnlyHigh);
		await SiteManagerService.updateSite(window.location.href, riskLevelCount);
	} catch (error) {
		console.error(error);
	}

	scanning = false;
}

let lastInputs: HTMLInputElement[] = [];
let riskLevelCount: RiskCounter = { high: 0, medium: 0, low: 0 };

const scanInputs = () => {
	const inputs = [...document.getElementsByTagName('input')];

	const inputsDifference = inputs.filter((input) => !lastInputs.includes(input));

	inputsDifference.forEach((input) => {
		if (!input || !input.value || input.value.length < MINIMUM_WALLET_LENGTH) {
			return;
		}

		const inputValue: string = input.value.trim();

		if (inputValue && validateWallet(inputValue)) {
			const nodesByWallet = wallets[inputValue] || [];
			wallets[inputValue] = [...nodesByWallet, input];
		}
	});

	lastInputs = inputs;
};

function deepText(node: HTMLElement | ChildNode | null) {
	let A: { node: ChildNode; parent: HTMLElement | null }[] = [];
	if (node) {
		node = node.firstChild;
		while (node != null) {
			if (node.nodeType == 3) A[A.length] = { node, parent: node.parentNode as HTMLElement | null };
			else if (node.nodeType == 1 && (node as HTMLElement).tagName.toLowerCase() === 'iframe') {
				const iframeElement = node as HTMLIFrameElement;
				if (!iframeElement) {
					continue;
				}
				iframeElement.onload = () => {
					runScrapper();
				};
				const iframeDoc = iframeElement.contentDocument;
				if (iframeDoc) {
					const iframeNodes = deepText(iframeDoc.body);
					A = A.concat(iframeNodes);
				}
			} else {
				A = A.concat(deepText(node));
			}
			node = node.nextSibling;
		}
	}

	return A;
}
const HIGHLIGHTED_CLASSNAME = 'whe-highlighted';
const VIEW_DETAILS_CLASSNAME = 'whe-view-details';
const ADDR_ATTRIBUTE = 'data-whe-address';
const MINIMUM_WALLET_LENGTH = 26;

const scanText = () => {
	const textNodes = deepText(document.body);

	const ElementAddressMapping: {
		element: HTMLElement;
		addressArr: string[];
	}[] = [];
	textNodes.forEach(({ node, parent }) => {
		if (!node || !node.textContent || !parent) {
			return;
		}

		const pieces = node.textContent
			.split(/[^\d\w]/g)
			.map((x) => x.trim())
			.filter((x) => x.length >= MINIMUM_WALLET_LENGTH)
			// filter duplicates and empty strings
			.filter((value, index, self) => self.indexOf(value) === index && value);

		pieces.forEach((x) => {
			const text = x.trim();
			if (validateWallet(text) && parent) {
				const index = ElementAddressMapping.findIndex((i) => i.element === parent);
				if (index > -1) {
					if (!ElementAddressMapping[index].addressArr.includes(text)) {
						ElementAddressMapping[index].addressArr.push(text);
					}
				} else {
					ElementAddressMapping.push({ element: parent, addressArr: [text] });
				}
			}
		});
	});

	ElementAddressMapping.forEach((addressItem) => {
		const parent = addressItem.element;
		if (!parent || parent.closest(`.${HIGHLIGHTED_CLASSNAME}`)) return;
		let parentInnerText = parent.innerText;
		const parentTextContent = parent.textContent;
		addressItem.addressArr.forEach((addressTxt) => {
			if (addressTxt && addressTxt.trim().length === parentTextContent?.trim().length) {
				if (!parent.closest(`.${HIGHLIGHTED_CLASSNAME}`)) {
					parent.classList.add(HIGHLIGHTED_CLASSNAME);
					parent.setAttribute('whe-address', addressTxt);
				}
			} else {
				parentInnerText = parentInnerText.replaceAll(
					addressTxt,
					`<span class="${HIGHLIGHTED_CLASSNAME}" whe-address="${addressTxt}">${addressTxt}</span>`
				);
			}
		});

		let walletNodes: HTMLElement[] = [parent];

		if (!parent.closest(`.${HIGHLIGHTED_CLASSNAME}`)) {
			parent.innerHTML = parentInnerText;

			const nodes = parent.querySelectorAll(`span.${HIGHLIGHTED_CLASSNAME}`);
			walletNodes = Array.from(nodes).map((node) => node as HTMLElement);
		}

		if (!walletNodes || walletNodes.length === 0) return;

		walletNodes.forEach((walletNode) => {
			const addressTxt = walletNode.getAttribute
				? walletNode.getAttribute('whe-address')
				: null;
			if (!addressTxt) return;
			const nodesByWallet = wallets[addressTxt] || [];
			if (!nodesByWallet.includes(walletNode)) {
				wallets[addressTxt] = [...nodesByWallet, walletNode];
			}
		});
	});
};

const clearDetailsBoxes = () => {
	document.querySelectorAll(`.${VIEW_DETAILS_CLASSNAME}`).forEach((el) => el.remove());
};

const highlightWallet = (node: Wallet, color: string, address: string) => {
	if (!color || !node) {
		return;
	}

	node.style.background = color;
	node.style.color = '#000';
	if (!node.classList.contains(HIGHLIGHTED_CLASSNAME)) {
		node.classList.add(HIGHLIGHTED_CLASSNAME);
	}
	node.setAttribute(ADDR_ATTRIBUTE, address);
};

const highlightWallets = async (_highlightOnlyHigh: boolean) => {
	if (!wallets) {
		return;
	}

	let keys = Object.keys(wallets);
	if (!keys.length) {
		return;
	}

	console.debug(`highlighting wallet `);

	// clear counters
	riskLevelCount = clearCounter(riskLevelCount);

	// highlight already fetched wallets
	Object.keys(riskDetails).forEach((addr) => {
		highlightAddr(addr, _highlightOnlyHigh);
	});

	// fetch and highlight new wallets from api if any
	keys = keys.filter((key) => !Object.keys(riskDetails).includes(key));
	if (keys.length > 0) {
		const newRiskDataGenerator = getRiskDetails(keys);
		for await (const newRiskData of newRiskDataGenerator) {
			Object.keys(newRiskData).forEach((newAddr) => {
				riskDetails[newAddr] = newRiskData[newAddr];
				highlightAddr(newAddr, _highlightOnlyHigh);
			});
		}
	}
};

const highlightAddr = (walletAddr: string, _highlightOnlyHigh: boolean) => {
	const highlightColor = riskDetails[walletAddr]?.color;
	if (highlightColor == null) {
		return;
	}

	riskLevelCount = populateRiskCount(highlightColor, riskLevelCount);

	wallets[walletAddr].forEach((node) => {
		if ((_highlightOnlyHigh && highlightColor === HIGH_RISK_COLOR) || !_highlightOnlyHigh) {
			highlightWallet(node, highlightColor, walletAddr);
		}
	});
};

const unhighlight = () => {
	const highlightedElements = [...document.getElementsByClassName(HIGHLIGHTED_CLASSNAME)];

	highlightedElements.forEach((element) => {
		element.removeAttribute('style');
		element.removeAttribute(ADDR_ATTRIBUTE);
	});
};

const shouldHighlightSite = async (currentSite: string): Promise<boolean> => {
	const isExtRun =
		(await getStoreValueFromLocalStorage(StoreName.pluginStatus, PluginStatus.Active)) ===
		PluginStatus.Active;
	if (!isExtRun) return false;

	// const { value: allSites } = await SiteManagerService.load();
	const highlightingPreference = (await getStoreValueFromLocalStorage(
		StoreName.highlightingPreference,
		HighlightingPreference.all
	)) as HighlightingPreference;

	// const site = SiteManagerService.getSiteByUrl(currentSite, allSites);
	// if (site !== undefined) {
	// 	return isSiteRun;
	// }

	const excludedSites: string[] = (await getStoreValueFromLocalStorage(
		StoreName.excludedSites,
		[]
	)) as string[];
	if (excludedSites.includes(currentSite)) {
		return false;
	}
	if (highlightingPreference == HighlightingPreference.included) {
		const includedSites: string[] = (await getStoreValueFromLocalStorage(
			StoreName.includedSites,
			[]
		)) as string[];
		return includedSites.includes(currentSite);
	}
	return true;
};

/**
 * Runs the scan on the page if available
 */
const runScrapper = async () => {
	const onlyHighlightHighRisk = false; // TODO
	const currentSite = SiteManagerService.processURL(window.location.href);
	if (SiteManagerService.checkIfDefaultExcluded(currentSite)) {
		return;
	}

	const highlightSite: boolean = await shouldHighlightSite(currentSite);

	unhighlight();
	if (!highlightSite) {
		return;
	}
	await scan(onlyHighlightHighRisk);
};

/**
 * Case: when user visit site first time - highlight should work (if extension turned on)
 */
window.onload = myMain;

function myMain() {
	initTooltip();
	runScrapper().then(() => {
		SiteManagerService.updateStats(riskLevelCount);
	});
}
/**
 * Observe the page for url changes
 */
const config = { subtree: true, childList: true };

let prevUrl = window.location.href;
const observer = new MutationObserver(function (mutations) {
	if (window.location.href !== prevUrl) {
		prevUrl = window.location.href;
		runScrapper();
	} else if (
		// check if iframe changed
		mutations.some(
			(i) =>
				i.type === 'childList' &&
				[...i.target.childNodes].some((j) => j.nodeName.toLowerCase() === 'iframe')
		)
	) {
		runScrapper();
	}
});

observer.observe(document, config);

const saveReportedAddress = async (address: string, ticker: string, websiteUrl: string) => {
	const hashHex = await getScamReportHash(address, ticker, websiteUrl);
	console.log({ hashHex });

	await chrome.storage.local.set({ [hashHex]: true });
};

const isAlreadyReported = async (
	address: string,
	ticker: string,
	websiteUrl: string
): Promise<boolean> => {
	const hashHex = await getScamReportHash(address, ticker, websiteUrl);
	const entry = await chrome.storage.local.get(hashHex);
	return entry[hashHex] !== undefined;
};

const report = async (address: string, ticker: string, websiteUrl: string) => {
	const userId = await getUserId();
	return fetch(`${API_HOST}/v1/report-scam`, {
		method: 'POST',
		body: JSON.stringify({ address, ticker, clientId: userId, websiteUrl }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

const loadReportScamButton = async (address: string) => {
	const currentUrl = window.location.href;
	if (await isAlreadyReported(address, 'ETH', currentUrl)) {
		// TODO: handle the ticker
		return;
	}
	const reportScamButton = document.getElementById('report-scam');
	if (reportScamButton != null) {
		reportScamButton.onclick = async () => {
			reportScamButton.disabled = true;
			reportScamButton.textContent = 'Reporting...';
			try {
				const response = await report(address, 'ETH', currentUrl); // TODO: handle the ticker
				if (response.status === 200) {
					await saveReportedAddress(address, 'ETH', currentUrl);
					reportScamButton.textContent = 'Reported as Scam';
				} else {
					reportScamButton.textContent = 'Failed to report';
				}
			} catch (err) {
				console.error(err);
				reportScamButton.textContent = 'Failed to report';
			}
		};
	}
};

/**
 * Event listeners
 */
browser.runtime.onMessage.addListener(async (__: string, _) => {
	// const msg: Message = Message.fromSerialized(msgData);
	await runScrapper();
});

/**
 * Add Risk UI
 */
initTooltip();
document.addEventListener(
	'mousemove',
	async (event) => {
		const target = event?.target as HTMLElement;
		if (!target || !target?.getAttribute) {
			clearDetailsBoxes();
			return;
		}
		// mouse on this element
		if (target.closest(`.${VIEW_DETAILS_CLASSNAME}`)) return;
		if (target.closest('#whe-tooltip')) return;

		const address = target.getAttribute(ADDR_ATTRIBUTE);

		// mouse on different element
		if (openedAddr && (!address || referredElement !== target)) {
			openedAddr = null;
			referredElement = null;
			clearDetailsBoxes();
			return;
		}

		if (!address) return;

		// mouse on same element
		if (openedAddr === address && referredElement === target) return;

		// mouse moved from one addr to another element with addr
		if (openedAddr && address !== openedAddr) clearDetailsBoxes();

		// if address has no info then omit
		const riskData = riskDetails[address]?.detail;
		if (riskData == null) return;

		openedAddr = address;
		referredElement = target;
		const domRect = referredElement.getBoundingClientRect();
		const top = domRect.top + window.scrollY;
		const left = domRect.left - 35 >= 0 ? domRect.left - 35 : 0;
		const scamReportStatus = await isAlreadyReported(address, 'ETH', window.location.href); // handle ticker
		document.body.insertAdjacentHTML(
			'beforeend',
			`<span 
      class="${VIEW_DETAILS_CLASSNAME}" 
      style="
          top: ${top}px;
          left: ${left}px;
        "
      >
      ${getRiskDetailUI(riskData, scamReportStatus)}
    </span>`
		);
		document
			.getElementById('whe-risk-tags-container-id')
			?.style.setProperty(
				'max-width',
				`${document.getElementById('whe-risk-details-table-id')?.offsetWidth}px`,
				'important'
			);
		await loadReportScamButton(address);
		Tooltip.bindEvents();
	},
	{ passive: true }
);
