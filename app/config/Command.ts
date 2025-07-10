import AtizapClient from "./AtizapClient";
import { CommandConfig, CommandInstance } from "./Types";

export default abstract class Command implements CommandInstance {
    zap: AtizapClient;
    config: CommandConfig;
    amountTimes = 0;

    constructor(zap: AtizapClient, config: CommandConfig) {
        this.zap = zap;
        this.config = config;
    }

    abstract execute(...args: any[]): Promise<void>;
}