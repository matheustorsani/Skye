import { proto } from "baileys";
import type AtizapClient from "../config/AtizapClient";
import { sendOptions, Message } from "../config/Types";

export function messageMeths(zap: AtizapClient, baileysMsg: proto.IWebMessageInfo): Message {
    const from = baileysMsg.key.remoteJid;
    if (!from) throw new Error("from está indefinido.");

    const msg = baileysMsg as Message;
    msg.from = from;

    msg.send = async (message: string, args: sendOptions = {}) => {
        try {
            if (args.to) return await zap.atizap.sendMessage(args.to, { text: message });
            if (args.reply) return await zap.atizap.sendMessage(from, { text: message }, { quoted: msg });
            if (args.imageUrl) return await zap.atizap.sendMessage(from, { image: { url: args.imageUrl }, caption: message }, { quoted: msg });
            if (args.videoUrl) return await zap.atizap.sendMessage(from, { video: { url: args.videoUrl }, caption: message }, { quoted: msg });
            if (args.edit) {
                const res = await zap.atizap.sendMessage(from, { text: message });
                return await zap.atizap.sendMessage(from, { text: args.edit, edit: res!.key });
            }
            if (args.delete) {
                const res = await zap.atizap.sendMessage(from, { text: message });
                return await zap.atizap.sendMessage(from, { delete: res!.key });
            }
            if (args.sticker) return zap.atizap.sendMessage(from, { sticker: args.sticker }, { quoted: msg });

            return await zap.atizap.sendMessage(from, { text: message });
        } catch (e) {
            console.error("Erro ao enviar mensagem:", e);
        }
    };

    msg.sendSticker = async (sticker: Buffer<ArrayBufferLike>) => {
        try {
            return await zap.atizap.sendMessage(from, { sticker }, { quoted: msg });
        } catch (e) {
            console.error("Erro ao enviar figurinha:", e);
        }
    };
    // reaction is a emoji.
    msg.reactMsg = async (reaction: string) => {
        try {
            return await zap.atizap.sendMessage(from, { react: { text: reaction, key: msg.key } });
        } catch (e) {
            console.error("Falha ao reagir à mensagem! (Você colocou um EMOJI válido?)", e);
        }
    }

    msg.zapFail = async (err: unknown, commandName = "desconhecido") => {
        const errorObj: Error = err instanceof Error ? err : new Error(String(err));
        await msg.send("Ops! Algo deu errado... :(\n\n```" + errorObj + "```", { reply: true });
        msg.reactMsg("❌");
        console.error(`Opa, erro no comando ${commandName}!\n${errorObj}`);
    };

    msg.isBotGroupAdmin = async (botNumber: string): Promise<boolean> => {
        if (!from.endsWith("@g.us")) return false;
        const groupMetadata = await zap.atizap.groupMetadata(from);
        return groupMetadata.participants.some((participant) => {
            return participant.id === botNumber && participant.admin === "admin";
        });
    }

    return msg;
}
