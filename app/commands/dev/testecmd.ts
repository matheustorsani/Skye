import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class TestCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "test",
            aliases: ["tetete"],
            category: "dev",
            description: "232",
            example: "3",
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
        const usuario = await this.zap.mongo.usuarios.findById("message.from");

        console.log(usuario)
    }
}