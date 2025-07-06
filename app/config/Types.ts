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
    from: string
}

export interface CommandParams {
    message: Message;
    args?: string[];
    prefix?: string;
}
