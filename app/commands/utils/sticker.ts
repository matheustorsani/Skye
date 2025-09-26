import { downloadMediaMessage, proto } from "baileys";
import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
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
        const hasMedia = message.message?.imageMessage || message.message?.videoMessage;
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasQuotedMedia = quoted?.imageMessage || quoted?.videoMessage;
        if (!hasMedia && !hasQuotedMedia) {
            message.send("Envie alguma mídia ou o mencione para que eu possa criar uma figurinha!", { reply: true });
            return;
        }

        const media: proto.IWebMessageInfo = quoted ? { message: quoted, key: message.key } : message;
        if (!media) { message.send("Não consegui processar a mídia. Tente novamente.", { reply: true }); message.reactMsg("❌"); return; }

        const mediaDownloaded = await downloadMediaMessage(media, "buffer", {});
        if (!mediaDownloaded) { message.send("Não consegui baixar a mídia. Tente novamente.", { reply: true }); message.reactMsg("❌"); return; }
        this.zap.atizap.sendMessage(message.from, { text: "Criando sua figurinha..." }, { quoted: message });
        const sticker = new Sticker(mediaDownloaded, {
            pack: "Skye!",
            author: this.zap.atizap.user?.id.replace(/:\d+/, "") || "Skye",
            type: StickerTypes.FULL,
            quality: 100
        })

        const stickerMsg = await sticker.toMessage();
        message.sendSticker(stickerMsg.sticker);
        message.reactMsg("✅");
    }
}
