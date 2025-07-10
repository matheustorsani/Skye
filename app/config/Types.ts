import { proto } from "baileys";

export interface sendOptions {
    reply?: boolean;
    imageUrl?: string;
    videoUrl?: string;
    edit?: string;
    delete?: boolean;
    to?: string;
}

export interface Message extends proto.IWebMessageInfo{
    send: (message: string, args?: sendOptions) => Promise<proto.WebMessageInfo | undefined>;
    zapFail: (err: Error, commandName: string) => Promise<void>;
    isBotGroupAdmin: (botNumber: string) => Promise<boolean>;
    from: string
}

export interface CommandParams {
    message: Message;
    args?: string[];
    prefix?: string;
}


export type CommandConfig = {
  name: string
  aliases: string[]
  category: string
  description: string
  example: string
  groupOnly: boolean
  groupAdmPermission: {
    bot: boolean
    user: boolean
  }
  ownerOnly: boolean
  isWorking: boolean
}

export type CommandInstance = {
  config: CommandConfig
  amountTimes: number
  execute: (...args: any[]) => Promise<void>
}

export interface AtizapClientStartOptions {
  events: string
  commands: string
}