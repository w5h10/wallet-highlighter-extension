import type { MessageType } from '$lib/constants';
import { Message } from '$lib/models/message';

export const sendMessage = async (type: MessageType) => {
	const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
	const activeTab = tabs[0];

	console.log({ activeTab });

	if (!activeTab.id) throw Error('INVALID TAB');
	const message = new Message(type);
	const res = await chrome.tabs.sendMessage(activeTab.id, message.serialize());
	return res?.value;
};
