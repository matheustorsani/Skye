import AtizapClient from "./AtizapClient";

interface options {
    name: string;
    aliases: string[];
    category: string;
    description: string;
    example: string;
    groupOnly: boolean;
    groupAdmPermission: {
        bot: boolean;
        user: boolean;
    };
    ownerOnly: boolean;
    isWorking: boolean;
}

export default class Command {
    zap: AtizapClient;
    config: Required<options>;
    amountTimes: number;

    constructor(zap: AtizapClient, options: options) {
        this.zap = zap;

        this.config = {
            name: options.name,
            aliases: options.aliases,
            category: options.category,
            description: options.description,
            example: options.example,
            groupOnly: options.groupOnly,
            groupAdmPermission: {
                bot: options.groupAdmPermission.bot,
                user: options.groupAdmPermission.user
            },
            ownerOnly: options.ownerOnly,
            isWorking: options.isWorking
        };
        this.amountTimes = 0;
    }


    getAllChats(): any {
        this.zap.atizap.ev.on('chats.upsert', (chats) => {
            return chats.map(chat => chat.id);
        })
    }
}