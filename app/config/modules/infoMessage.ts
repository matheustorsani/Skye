import { proto } from "baileys";

export type MessageInfo = {
    text?: string;
    type: string;
    isQuoted: boolean;
    quotedText?: string;
    sender: string
};

export function extractInfo(message: proto.IWebMessageInfo): MessageInfo {
    const msg = message.message || {};
    const types = Object.keys(msg);
    const type = types[0] || 'unknown';
    const sender = message.key?.participant ? message.key.participant : message.key?.remoteJid || '';
    let text: string | undefined | null;
    let quotedText: string | undefined | null;
    let isQuoted = false;
    
    switch (type) {
        case 'conversation':
            text = msg.conversation;
            break;

        case 'extendedTextMessage':
            text = msg.extendedTextMessage?.text;
            if (msg.extendedTextMessage?.contextInfo?.quotedMessage) {
                isQuoted = true;
                const quoted = msg.extendedTextMessage.contextInfo.quotedMessage;
                quotedText = extractTextFromQuoted(quoted);
            }
            break;

        case 'imageMessage':
            text = msg.imageMessage?.caption;
            break;

        case 'videoMessage':
            text = msg.videoMessage?.caption;
            break;

        case 'documentMessage':
            text = msg.documentMessage?.caption;
            break;

        case 'buttonsResponseMessage':
            text = msg.buttonsResponseMessage?.selectedButtonId;
            break;

        case 'listResponseMessage':
            text = msg.listResponseMessage?.singleSelectReply?.selectedRowId;
            break;

        case 'templateButtonReplyMessage':
            text = msg.templateButtonReplyMessage?.selectedId;
            break;

        default:
            break;
    }

    return {
        text: text ?? undefined,
        type,
        isQuoted,
        quotedText: quotedText ?? undefined,
        sender
    };
}

function extractTextFromQuoted(quoted: proto.IMessage): string | undefined | null {
    if ('conversation' in quoted) return quoted.conversation;
    if ('extendedTextMessage' in quoted) return quoted.extendedTextMessage?.text;
    if ('imageMessage' in quoted) return quoted.imageMessage?.caption;
    if ('videoMessage' in quoted) return quoted.videoMessage?.caption;
    if ('documentMessage' in quoted) return quoted.documentMessage?.caption;
    return undefined;
}
