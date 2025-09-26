import { downloadMediaMessage, proto } from "baileys";
import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
export default class StickerCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "sticker",
            aliases: ["s", "fig", "figura", "stiker", "stik", "figurinha"],
            category: "utils",
            description: "Faça uma figurinha a partir de uma imagem ou vídeo.",
            example: "sticker <marque uma imagem ou vídeo>",
            groupOnly: false,
            groupAdmPermission: {
                bot: false,
                user: false
            },
            ownerOnly: false,
            isWorking: true
        });
    }

    async execute({ message }: CommandParams): Promise<void> {
        if (!message.message) {
            message.send("Envie alguma mídia ou o mencione para que eu possa criar uma figurinha!", { reply: true });
            return;
        }

        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        let fakeMsg: proto.IWebMessageInfo;
        if (quoted) {
            fakeMsg = {
                key: { remoteJid: message.from, fromMe: false, id: 'id' },
                message: quoted
            }
            const stickerBuffer = await sticker(fakeMsg, StickerTypes.DEFAULT);
            await this.zap.atizap.sendMessage(message.from, { sticker: stickerBuffer }, { quoted: message });
        }
    }
}

async function sticker(msg: proto.IWebMessageInfo, type: StickerTypes): Promise<Buffer<ArrayBufferLike>> {
    const s = await downloadMediaMessage(msg, "buffer", {}).then(async (media) => {
        const sticker = new Sticker(media, {
            pack: "Skye!",
            author: "demetriuskiun",
            type: type,
            background: "transparent"
        });
        return await sticker.build();
    });

    return s;
}