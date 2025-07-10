import path from "path";
import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class ReloadCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "reload",
            aliases: ["r"],
            category: "dev",
            description: "Reinicia um comando sem precisar reiniciar o bot",
            example: "reload <comando>",
            groupOnly: false,
            groupAdmPermission: {
                bot: false,
                user: false
            },
            ownerOnly: true,
            isWorking: true
        });
    }

    async execute({ message, args }: CommandParams): Promise<void> {
        if (!args?.[0]) {
            return void message.send("Por favor informe o comando que deseja reiniciar!", { reply: true });
        }

        const cmdName = args[0].toLowerCase();
        const existing = this.zap.commands.get(cmdName) || this.zap.aliases.get(cmdName);
        if (!existing) {
            return void message.send(`Comando "${cmdName}" não encontrado.`, { reply: true });
        }

        try {
            const commandPath = path.resolve(__dirname, '..', existing.config.category, `${existing.config.name}.ts`);

            delete require.cache[require.resolve(commandPath)];

            this.zap.commands.delete(existing.config.name);

            const ReloadedCommand = require(commandPath).default as { new(zap: AtizapClient): Command };
            const reloadedInstance = new ReloadedCommand(this.zap);
            this.zap.commands.set(reloadedInstance.config.name, reloadedInstance);

            await message.send(`Comando "${reloadedInstance.config.name}" reiniciado com sucesso!`, { reply: true });
        } catch (error) {
            console.error("Erro ao reiniciar comando:", error);
            await message.send(`Erro ao reiniciar comando: ${(error as Error).message}`, { reply: true });
        }
    }
}
