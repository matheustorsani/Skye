import type AtizapClient from "../config/AtizapClient";
import { extractInfo } from "../config/modules/infoMessage";
import { findBestMatch } from "string-similarity";
import { messageMeths } from "./messageMeths";
import { Message } from "../config/Types";
import config from "../../config.json";

export default function handler(zap: AtizapClient) {
    const prefix = config.bot.prefix;
    const botNumber = zap.atizap.user.id.split(":")[0];
    zap.atizap.ev.on("messages.upsert", async ({ messages, type }: { messages: any[]; type: string }) => {
        if (type !== "notify") return;
        for (const msg of messages) {
            const { text, type, isQuoted, quotedText, sender } = extractInfo(msg);
            if (!msg.message || msg.key.fromMe) continue;
            msg.message = text;
            msg.quoted = quotedText;
            const from = msg.key.remoteJid
            const message = messageMeths(zap, msg as Message);

            if (!msg.message.toLowerCase().startsWith(prefix) || msg.message.length === prefix.length) {
                if (!from.endsWith("@g.us") || msg.message === `@${botNumber}`) {
                    return await zap.atizap.sendMessage(from, { text: "Olá!" });
                };
            };
            const args = msg.message.slice(prefix.length).trim().split(/ +/)
            const cmd = args.shift().toLowerCase()

            if (!zap.commands.has(cmd) && !zap.aliases.has(cmd)) {
                const allCmdsNames: string[] = [];
                zap.commands.forEach((command) => {
                    if (command.config.category !== "dev") {
                        allCmdsNames.push(cmd.config.name)
                        cmd.config.aliases.forEach((alias: string) => allCmdsNames.push(alias))
                    }
                });

                const bestMatch = findBestMatch(cmd, allCmdsNames);
                const suggestion = bestMatch.bestMatch.rating >= 0.6
                    ? `Você quis dizer: ${bestMatch.bestMatch.target}?`
                    : "Comando não encontrado!";
                return await zap.atizap.sendMessage(from, { text: suggestion });

            }


            const alias = zap.aliases.get(cmd);
            const file = zap.commands.get(cmd) || (alias ? zap.commands.get(alias) : undefined);
            if (file) {
                //if (cleaning) return await msg.reply(t('commands:cleaning'))
                //if (config.discord.enable) catchcommand(msg)
                //if (file.config.ownerOnly && !devsNumbers.includes(msg.getSenderNumber())) return msg.send(t('commands:nodev'))
                //if (!file.config.isWorking && !devsNumbers.includes(msg.getSenderNumber())) return msg.send(t('commands:notworking'))
                if (file.config.groupOnly && !from.includes('@g.us')) return await message.send("Este comando só pode ser usado em grupos!");
                // if (file.config.groupAdmPermission.bot && !await msg.verifyAdm(0)) return await msg.send(t('commands:missingbotperm'))
                // if (file.config.groupAdmPermission.user && !await msg.verifyAdm(1) && !devsNumbers.includes(msg.getSenderNumber())) return await msg.send(t('commands:missinguserperm'))
                file.config.amountTimes++
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