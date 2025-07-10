import AtizapClient from "./AtizapClient";
import { CommandConfig, CommandInstance } from "./Types";

export default abstract class Command implements CommandInstance {
    zap: AtizapClient;
    config: CommandConfig;
    amountTimes = 0;

    constructor(zap: AtizapClient, config: Required<CommandConfig>) {
        const requiresGroup = config.groupAdmPermission.bot || config.groupAdmPermission.user;
        if (requiresGroup && !config.groupOnly) {
            throw new Error(
                `O comando "${config.name}" exige permissões de admin (bot ou user), mas 'groupOnly' está como false.`
            );
        }

        this.zap = zap;
        this.config = config;
    }

    abstract execute(...args: any[]): Promise<void>;
}
