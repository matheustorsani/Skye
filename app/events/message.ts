import type AtizapClient from "../config/AtizapClient";
import { extractInfo } from "../config/modules/infoMessage";
import { findBestMatch } from "string-similarity";
import { messageMeths } from "./messageMeths";
import config from "../../config.json";
import { Usuario } from "../config/modules/db/database";

export default function handler(zap: AtizapClient) {
    const prefix = config.bot.prefix;
    const botNumber = zap.atizap.user?.id.replace(/:\d+/, "");
    if (!botNumber) return console.error("Bot number not found. Please check if the bot is connected properly.");
    const userCache = new Map<string, Usuario>();
    zap.atizap.ev.on("messages.upsert", async ({ messages, type }: { messages: any[]; type: string }) => {
        if (type !== "notify") return;
        for (const msg of messages) {
            const { text, type, isQuoted, quotedText, sender } = extractInfo(msg);
            if (!text || msg.key.fromMe) continue;
            const from = msg.key.remoteJid
            const user = msg.key.participant || from;
            const message = messageMeths(zap, msg);

            let usuario: Usuario | undefined | null = userCache.get(user);

            if (!usuario) {
                usuario = await zap.mongo.usuarios.findById(user);
                if (!usuario) {
                    usuario = await zap.mongo.newUserDoc(user).save();
                    console.log("Usuário salvo no banco de dados:", user);
                }
                userCache.set(user, usuario);
            }
            
            if (usuario.situation.ban)
                return await message.send(`🚨 | Você está *banido* de me usar! D:\n\n_Motivo_: *${usuario.situation.reason}*\n_Data do banimento: ${usuario.situation.dateban}_`, { reply: true });

            if (!text.toLowerCase().startsWith(prefix)) {
                if (!from.endsWith("@g.us") || text === `@${botNumber}`) {
                    return await zap.atizap.sendMessage(from, { text: "Ola" });
                };
                return;
            };

            const args = text.toLowerCase().slice(prefix.length).trim().split(/ +/)
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

            const devs = Object.values(config.devs.contacts).map((dev) => dev.replace(/[^0-9]/g, "") + "@s.whatsapp.net");

            const alias = zap.aliases.get(cmd);
            const file = zap.commands.get(cmd) || (alias ? zap.commands.get(alias.config.name) : undefined);
            if (file) {
                if (file.config.groupOnly && !from.endsWith("@g.us")) return await message.send("Este comando só pode ser usado em grupos!", { reply: true });
                if (file.config.ownerOnly && !devs.includes(user)) return await message.send("Você não tem permissão para usar esse comando.", { reply: true });
                if (!file.config.isWorking && !devs.includes(user)) return await message.send("Comando desabilitado para reformas, por favor aguarde!", { reply: true });
                if (file.config.groupAdmPermission.bot && from.endsWith("@g.us") && !(await message.isBotGroupAdmin(botNumber))) return await message.send("O bot precisa ser admin para usar este comando!", { reply: true });

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