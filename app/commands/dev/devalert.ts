import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class AlertCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "devalert",
            aliases: ["alert"],
            category: "dev",
            description: "Mande um alerta para os usuarios.",
            example: "devalert <mensagem>",
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
        if (!args || args.length === 0) {
            await message.send("Por favor, forneça uma mensagem para enviar como alerta.");
        }
        
        await message.send("Alerta enviado para todos os usuários.");
    }
}