import type { MessageType } from '$lib/constants';

export class Message {
	type: MessageType;
	value: boolean;
	attributes: { [key: string]: string };

	private defaultBool = false;

	constructor(type: MessageType, value?: boolean, attributes?: { [key: string]: string }) {
		this.type = type;
		this.value = this.defaultBool;
		this.attributes = {};
		if (attributes !== undefined) {
			this.attributes = attributes;
		}
		if (value !== undefined) {
			this.value = value;
		}
	}

	private toObject() {
		return {
			type: this.type,
			value: this.value,
			attributes: this.attributes
		};
	}

	serialize() {
		return JSON.stringify(this.toObject());
	}

	static fromSerialized(serialized: string) {
		const messageData: ReturnType<Message['toObject']> = JSON.parse(serialized);

		const message: Message = new Message(
			messageData.type,
			messageData.value,
			messageData.attributes
		);

		return message;
	}
}
