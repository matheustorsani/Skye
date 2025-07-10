import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class TestCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "testecmd",
            aliases: ["tetete", "test", "t"],
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
        message.send("doksdokp")
    }
}