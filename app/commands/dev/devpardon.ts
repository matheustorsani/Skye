import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class DevpardonCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "devpardon",
            aliases: ["unban"],
            category: "dev",
            description: "Desbanir um usuário do bot.",
            example: "devpardon <numero>",
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

        if (!usuario.situation.ban) return void message.send("Este usuário não está banido!", { reply: true });

        usuario.situation.ban = true;
        usuario.situation.reason = undefined
        usuario.situation.dateban = undefined;

        await usuario.save()
            .then(() => {
                message.send(`Usuário ${user} desbanido com sucesso!`, { reply: true });
            })
            .catch((err) => {
                console.error("Erro ao desbanir usuário:", err);
                message.send("Ocorreu um erro ao tentar desbanir o usuário. Tente novamente", { reply: true });
            });
    }
}