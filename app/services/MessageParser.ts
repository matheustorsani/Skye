import { findBestMatch } from "string-similarity";
import config from "../../config.json";

export class MessageParser {
  private prefix = config.bot.prefix;

  parse(text: string) {
    const args = text.toLowerCase().slice(this.prefix.length).trim().split(/ +/);
    const cmd = args.shift()!.toLowerCase();
    return { cmd, args };
  }

  suggest(cmd: string, commands: string[]): string {
    const bestMatch = findBestMatch(cmd, commands);
    return bestMatch.bestMatch.rating >= 0.2
      ? `Opa! Comando não encontrado...\n\nVocê quis dizer: *${bestMatch.bestMatch.target}*?`
      : `Opa! Comando não encontrado...\n\nUse ${this.prefix}ajuda para ver os comandos disponíveis.`;
  }
}
