import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class DevbanCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "devban",
            aliases: ["ban"],
            category: "dev",
            description: "Banir um usuário do bot.",
            example: "devban <numero> [motivo]",
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
        if (!args || args.length === 0) return void message.send("Por favor informe o numero do usuario que deseja banir!", { reply: true });
        let user = args[0].replace(/[^0-9]/g, "");
        if (!user) return void message.send("Por favor informe o numero do usuario que deseja banir!", { reply: true });
        if (!user.includes("@s.whatsapp.net")) user += "@s.whatsapp.net";

        const usuario = await this.zap.mongo.usuarios.findById(user);
        if (!usuario) return void message.send("Usuário não encontrado no banco de dados!", { reply: true });

        if (usuario.situation.ban) return void message.send("Este usuário já está banido!", { reply: true });

        usuario.situation.ban = true;
        usuario.situation.reason = args.slice(1).join(" ") || "Nenhum motivo informado";
        usuario.situation.dateban = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

        await usuario.save()
            .then(() => {
                message.send(`Usuário ${user} banido com sucesso!`, { reply: true });
            })
            .catch((err) => {
                console.error("Erro ao banir usuário:", err);
                message.send("Ocorreu um erro ao tentar banir o usuário. Tente novamente", { reply: true });
            });
    }
}