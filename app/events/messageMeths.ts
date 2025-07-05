import type AtizapClient from "../config/AtizapClient";
import { sendOptions, Message } from "../config/Types";

export function messageMeths(zap: AtizapClient, msg: Message): Message {
    const from = msg.key.remoteJid;

    msg.send = async (message: string, args: sendOptions = {}) => {
        try {
            if (args.reply) return await zap.atizap.sendMessage(from, { text: message }, { quoted: msg });
            if (args.imageUrl) return await zap.atizap.sendMessage(from, { image: { url: args.imageUrl }, caption: message });
            if (args.imagem64) return await zap.atizap.sendMessage(from, { image: { base64: args.imagem64 }, caption: message });
            if (args.videoUrl) return await zap.atizap.sendMessage(from, { video: { url: args.videoUrl }, caption: message });
            if (args.video64) return await zap.atizap.sendMessage(from, { video: { base64: args.video64 }, caption: message });
            if (args.edit) {
                const res = await zap.atizap.sendMessage(from, { text: message });
                return await zap.atizap.sendMessage(from, { text: args.edit, edit: res.key });
            }
            if (args.delete) {
                const res = await zap.atizap.sendMessage(from, { text: message });
                return await zap.atizap.sendMessage(from, { delete: res.key });
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

    return msg;
}
