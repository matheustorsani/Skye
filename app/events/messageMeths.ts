import type AtizapClient from "../config/AtizapClient";
import { sendOptions, Message } from "../config/Types";

export function messageMeths(zap: AtizapClient, msg: Message) {
    if (typeof msg.send === "function" && typeof msg.zapFail === "function" && typeof msg.isBotGroupAdmin === "function") return msg;
    const from: string = msg.key.remoteJid!;

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

            return await zap.atizap.sendMessage(from, { text: message });
        } catch (e) {
            console.error("Erro ao enviar mensagem:", e);
        }
    };

    msg.zapFail = async (err: unknown, commandName = "desconhecido") => {
        const errorObj: Error = err instanceof Error ? err : new Error(String(err));
        await msg.send("Ops! Algo deu errado... :(\n\n```" + errorObj + "```", { reply: true });
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
