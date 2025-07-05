import AtizapClient from "../../config/AtizapClient";
import Command from "../../config/Command";
import { CommandParams } from "../../config/Types";

export default class HelpCommand extends Command {
    constructor(zap: AtizapClient) {
        super(zap, {
            name: "help",
            aliases: ["ajuda", "comandos", "commands"],
            category: "utils",
            description: "Lista todos os comandos disponíveis do bot.",
            example: "help <comando>",
            groupOnly: false,
            groupAdmPermission: {
                bot: false,
                user: false
            },
            ownerOnly: false,
            isWorking: true
        });
    }

    async execute({ message, args, prefix }: CommandParams): Promise<void> {
        let helpText = '*Menu de ajuda da Skye*!!\n\n';
        let foundMatch = false;
        const categoriasListadas = new Set<string>();
        const param = args?.[0]?.toLowerCase();

        // Caso seja chamado sem argumentos
        if (!param) {
            helpText += 'Categorias disponíveis:\n\n';
        }

        this.zap.commands.forEach(cmd => {
            if (!cmd.config.isWorking || cmd.config.category === 'dev' || cmd.config.ownerOnly) return;

            // !help
            if (!param) {
                if (!categoriasListadas.has(cmd.config.category)) {
                    helpText += `${prefix}ajuda *${cmd.config.category}*\n`;
                    categoriasListadas.add(cmd.config.category);
                }
                return;
            }

            // !help geral
            if (param === 'geral' || param === 'all') {
                if (!categoriasListadas.has(cmd.config.category)) {
                    helpText += `===============\n*Comandos da categoria: ${cmd.config.category}*\n===============\n`;
                    categoriasListadas.add(cmd.config.category);
                }
                helpText += `-> *${prefix}${cmd.config.aliases[0]}*\n`;
                foundMatch = true;
                return;
            }

            // !help <categoria>
            if (param === cmd.config.category) {
                helpText += `-> *${prefix}${cmd.config.name}*\n`;
                foundMatch = true;
                return;
            }

            // !help <comando>
            if (param === cmd.config.name || cmd.config.aliases.includes(param)) {
                helpText += `=========================
Comando: *${cmd.config.name}*

Descrição: *${cmd.config.description}*

Exemplo de uso: *${prefix}${cmd.config.example}*

Funciona somente para grupo: ${cmd.config.groupOnly ? '*Sim*' : '*Não*'}

O bot precisa de ADM: ${cmd.config.groupAdmPermission.bot ? '*Sim*' : '*Não*'}
E o usuário, precisa de ADM: ${cmd.config.groupAdmPermission.user ? '*Sim*' : '*Não*'}

Outras formas de chamar o comando:
*${cmd.config.name + ', ' + cmd.config.aliases.join(', ')}*
=========================\n`;
                foundMatch = true;
                return;
            }
        });

        if (param && !foundMatch) {
            helpText += `*⚠️ Nenhum resultado encontrado para:* _${param}_\n`;
        }

        helpText += `\nUse *${prefix}ajuda <nome do comando>* para mais detalhes sobre ele.`;
        helpText += `\nPara visualizar todos os comandos, use *${prefix}ajuda geral*\n`;

        await message.send(helpText, { reply: true });
    }

}