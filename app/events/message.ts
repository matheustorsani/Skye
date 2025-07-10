import type AtizapClient from "../config/AtizapClient";
import { extractInfo } from "../config/modules/infoMessage";
import { findBestMatch } from "string-similarity";
import { messageMeths } from "./messageMeths";
import config from "../../config.json";

export default function handler(zap: AtizapClient) {
    const prefix = config.bot.prefix;
    const botNumber = zap.atizap.user?.id.split(":")[0];
    zap.atizap.ev.on("messages.upsert", async ({ messages, type }: { messages: any[]; type: string }) => {
        if (type !== "notify") return;
        for (const msg of messages) {
            const { text, type, isQuoted, quotedText, sender } = extractInfo(msg);
            if (!text || msg.key.fromMe) continue;
            const from = msg.key.remoteJid
            const user = msg.key.participant || from;
            const message = messageMeths(zap, msg);

            const usuario = await zap.mongo.usuarios.findById(user);

            if (!usuario) await zap.mongo.newUserDoc(user).save()
                .then(() => console.log("Usuário salvo no banco de dados:", user))
                .catch((err) => console.error("Erro ao salvar usuário no banco de dados:", err));
            else if (usuario.situation.ban)
                return await message.send(`🚨 | Você está *banido* de me usar! D:\n\n_Motivo_: *${usuario.situation.reason}*\n_Data do banimento: ${usuario.situation.dateban}_`, { reply: true });



            if (!text.toLowerCase().startsWith(prefix)) {
                if (!from.endsWith("@g.us") || text === `@${botNumber}`) {
                    return await zap.atizap.sendMessage(from, { text: "Ola" });
                };
                return;
            };

            const args = text.slice(prefix.length).trim().split(/ +/)
            const cmd = args.shift()!.toLowerCase()

            if (!zap.commands.has(cmd) && !zap.aliases.has(cmd)) {
                const allcmds: string[] = [];
                zap.commands.forEach((command) => {
                    if (command.config.category !== "dev") {
                        allcmds.push(command.config.name)
                        command.config.aliases.forEach((alias: string) => allcmds.push(alias))
                    }
                });
                const bestMatch = findBestMatch(cmd, allcmds);
                const suggestion = bestMatch.bestMatch.rating >= 0.2
                    ? `Opa! Comando não encontrado...\n\nVocê quis dizer: *${bestMatch.bestMatch.target}*?`
                    : `Opa! Comando não encontrado...\n\nUse ${prefix}ajuda para ver os comandos disponíveis.`;
                return await message.send(suggestion, { reply: true });
            }

            const alias = zap.aliases.get(cmd);
            const file = zap.commands.get(cmd) || (alias ? zap.commands.get(alias.config.name) : undefined);
            if (file) {
                file.amountTimes++;
                try {
                    await file.execute({ message, args, prefix });
                } catch (err: unknown) {
                    const errorObj: Error = err instanceof Error ? err : new Error(String(err));
                    await message.zapFail(errorObj, file.config.name);
                }
            }
        };
    });
};