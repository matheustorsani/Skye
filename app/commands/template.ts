// @ts-nocheck


// PARA TUTORIAL EM PORTUGUES, LINHA: 74!


/**
 * Command Template
 * 
 * To create a new command, place this file in `app/commands/<category>/<name>.ts`.
 * 
 * - The file name must match the command name.
 * - The class name must be the command name + "Command".
 * - The command name must be unique and use only lowercase letters, numbers, and dashes.
 * 
 * Use this file as a template to build your own commands.
 */

// Required imports
import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

/**
 * Class name must be: <CommandName>Command
 * Example: if the command is "ping", the class must be "PingCommand".
 */
export default class NameCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "command",                 // Main command name (must match the file name and be unique)
            aliases: ["alias1", "alias2"],  // Alternative names to trigger the command
            category: "category",           // Category name (should match the folder where this file is located)
            description: "Short description of what the command does",
            example: "command <arguments>", // Example usage
            groupOnly: false,               // If true, can only be used in groups
            groupAdmPermission: {
                bot: false,                 // If true, the bot must be a group admin to execute
                user: false                // If true, the user must be a group admin to execute
            },
            ownerOnly: true,                // If true, only bot owners (defined in config.json) can use it
            isWorking: true                 // Set to false if the command is under maintenance or not yet functional
        });
    }

    /**
     * This method is called when the command is executed.
     * You receive the following parameters:
     * - message: the message object
     * - args: the array of arguments passed by the user
     * - prefix: the current bot prefix
     */
    async execute({ message, args, prefix }: CommandParams): Promise<void> {
        // Example: sending a basic reply
        await message.send("Hello! This is a sample command.");

        // Handling arguments
        if (args && args.length > 0) {
            await message.send(`You provided the following arguments: ${args.join(", ")}`);
        } else {
            await message.send("You didn't provide any arguments.");
        }

        // Showing the current bot prefix
        await message.send(`The bot's prefix is: ${prefix}`);

        // Replying directly to the triggering message
        await message.send("This is a reply to your message.", { reply: true });

        // For more options (e.g., sending images/videos), check `messageMeths.ts`
    }
}

/**
 * Template de Comando
 * 
 * Para criar um novo comando, coloque este arquivo em: `app/commands/<categoria>/<nome>.ts`
 * 
 * Regras:
 * - O nome do arquivo deve ser o mesmo que o nome do comando.
 * - O nome da classe deve ser o nome do comando + "Command".
 * - O nome do comando deve ser único e conter apenas letras minúsculas e números.
 * 
 * Use este arquivo como base para criar seus próprios comandos.
 */

// Imports necessários
import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

/**
 * A classe deve seguir o padrão: <nomeDoComando>Command
 * Exemplo: se o comando for "ping", a classe deve ser "PingCommand"
 */
export default class NomeCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "comando",                // Nome principal do comando (deve ser único e igual ao nome do arquivo)
            aliases: ["apelido"],           // Outras formas de chamar o comando
            category: "categoria",          // Categoria (nome da pasta onde este arquivo está)
            description: "Descrição curta do que o comando faz",
            example: "comando <argumentos>",// Exemplo de uso
            groupOnly: false,               // Se true, só pode ser usado em grupos
            groupAdmPermission: {
                bot: false,                 // Se true, o bot precisa ser admin no grupo
                user: false                 // Se true, o usuário precisa ser admin no grupo
            },
            ownerOnly: true,                // Se true, apenas os donos definidos no config.json podem usar
            isWorking: true                 // Coloque false se o comando estiver em manutenção ou não implementado
        });
    }

    /**
     * Este método é executado quando o comando é chamado.
     * Parâmetros disponíveis:
     * - message: objeto da mensagem
     * - args: argumentos enviados pelo usuário
     * - prefix: prefixo atual do bot
     */
    async execute({ message, args, prefix }: CommandParams): Promise<void> {
        // Exemplo: enviando uma resposta simples
        await message.send("Olá! Este é um comando de exemplo.");

        // Verificando se foram passados argumentos
        if (args && args.length > 0) {
            await message.send(`Você passou os seguintes argumentos: ${args.join(", ")}`);
        } else {
            await message.send("Você não passou nenhum argumento.");
        }

        // Mostrando o prefixo atual
        await message.send(`O prefixo atual do bot é: ${prefix}`);

        // Respondendo diretamente à mensagem que acionou o comando
        await message.send("Esta é uma resposta direta à sua mensagem.", { reply: true });

        // Para mais opções (imagem, vídeo, edição, exclusão), veja `messageMeths.ts`
    }
}
