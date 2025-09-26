import type AtizapClient from "../config/AtizapClient";
import { extractInfo } from "../config/modules/infoMessage";
import { messageMeths } from "./messageMeths";
import config from "../../config.json";
import { UserService } from "../services/UserService";
import { PermissionService } from "../services/PermissionService";
import { MessageParser } from "../services/MessageParser";

export default function handler(zap: AtizapClient) {
  const botNumber = zap.atizap.user?.id.replace(/:\d+/, "");
  if (!botNumber) return console.error("Bot number not found.");

  const userService = new UserService(zap);
  const permService = new PermissionService();
  const parser = new MessageParser();

  zap.atizap.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      const { text } = extractInfo(msg);
      if (!text || msg.key.fromMe) continue;

      const from = msg.key.remoteJid ?? "";
      const user = msg.key.participant || from;
      if (typeof user !== "string") return;
      const message = messageMeths(zap, msg);

      const usuario = await userService.getUser(user);

      if (permService.isBanned(usuario)) {
        return message.send(
          `🚨 | Você está *banido* de me usar! D:\n\n_Motivo_: *${usuario.situation.reason}*\n_Data do banimento: ${usuario.situation.dateban}_`,
          { reply: true }
        );
      }

      if (!text.toLowerCase().startsWith(config.bot.prefix)) {
        if (!from.endsWith("@g.us") || text === `@${botNumber}`) {
          return zap.atizap.sendMessage(from, { text: "Ola" });
        }
        return;
      }

      const { cmd, args } = parser.parse(text);

      const alias = zap.aliases.get(cmd);
      const file =
        zap.commands.get(cmd) ||
        (alias ? zap.commands.get(alias.config.name) : undefined);

      if (!file) {
        const allcmds: string[] = [];
        zap.commands.forEach((command) => {
          if (command.config.category !== "dev") {
            allcmds.push(command.config.name, ...command.config.aliases);
          }
        });
        return message.send(parser.suggest(cmd, allcmds), { reply: true });
      }

      if (file.config.groupOnly && !from.endsWith("@g.us")) {
        return message.send("Este comando só pode ser usado em grupos!", { reply: true });
      }
      if (file.config.ownerOnly && !permService.isDev(user)) {
        return message.send("Você não tem permissão para usar esse comando.", { reply: true });
      }
      if (!file.config.isWorking && !permService.isDev(user)) {
        return message.send("Comando desabilitado para reformas, por favor aguarde!", { reply: true });
      }
      if (file.config.groupAdmPermission.bot && from.endsWith("@g.us") && !(await message.isBotGroupAdmin(botNumber))) {
        return message.send("O bot precisa ser admin para usar este comando!", { reply: true });
      }

      file.amountTimes++;
      try {
        await file.execute({ message, args, prefix: config.bot.prefix });
      } catch (err: unknown) {
        const errorObj: Error = err instanceof Error ? err : new Error(String(err));
        await message.zapFail(errorObj, file.config.name);
      }
    }
  });
}
