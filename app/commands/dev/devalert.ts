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
        if (!args || args.length === 0) return void message.send("Por favor, forneça uma mensagem para enviar como alerta.");
        const users = await this.zap.mongo.usuarios.find({});
        if (!users || users.length === 0) return void message.send("Nenhum usuário encontrado para enviar o alerta.");
        if (users.length > 50) return void message.send("Não é possível enviar alertas para mais de 50 usuários de uma vez. Uma alternativa é criar um grupo e adicionar os usuários lá.\n\nO envio de muitas mensagens em massa pode causar bloqueios temporários ou permanentes da conta, então use com cautela.");
    
        
        message.send("Enviando alerta para os usuários...");

        for (const user of users) {
            try {
                await message.send(`*❗ | Alerta de Desenvolvedor*\n\n_${args.join(" ")}_`, { to: user._id });
            } catch (error) {
                console.error(`Erro ao enviar alerta para o usuário ${user._id}:`, error);
            }
        }
    }
}