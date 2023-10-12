import browser from 'webextension-polyfill';
import { API_HOST } from './constants';
import { getUserId } from './content/utils';
const init = async () => {
	browser.runtime.setUninstallURL(`${API_HOST}/v1/uninstall?clientId=${await getUserId()}`);
};

init();
