import { proto } from "baileys";

export interface sendOptions {
    reply?: boolean;
    imageUrl?: string;
    imagem64?: string;
    videoUrl?: string;
    video64?: string;
    edit?: string;
    delete?: boolean;
}

export interface Message extends proto.IWebMessageInfo{
    send: (message: string, args?: sendOptions) => Promise<void>;
    zapFail: (err: Error, commandName: string) => Promise<void>;
}

export interface CommandParams {
    message: Message;
    args?: string[];
    prefix?: string;
}
