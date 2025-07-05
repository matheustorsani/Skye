import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class PingCommand extends Command {
    constructor(zap: any) {
        super(zap, {
            name: "ping",
            aliases: ["pong"],
            category: "utils",
            description: "Verifica se o bot está online.",
            example: "ping",
            groupOnly: false,
            groupAdmPermission: {
                bot: false,
                user: false
            },
            ownerOnly: false,
            isWorking: true
        });
    }

    async execute({ message, args }: CommandParams): Promise<void> {
        const start = Date.now();
        await message.send("Ping... ⚾", { delete: true });
        message.send(`🏓 Pong! A latência é de ${Date.now() - start}ms`, { reply: true })
    }
}