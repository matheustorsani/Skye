import AtizapClient from "../config/AtizapClient";
import config from "../../config.json";

export default function groupEvent(zap: AtizapClient) {
    zap.atizap.ev.on("groups.upsert", async (group) => {
        for (const g of group) {
            const grupo = await zap.mongo.grupos.findById(g.id)
            if (!grupo) await zap.mongo.newGroupDoc(g.id).save()
                .then(() => console.log("Grupo salvo no banco de dados:", g.id))
                .catch((err) => console.error("Erro ao salvar grupo no banco de dados:", err));

            return zap.atizap.sendMessage(g.id, { text: `Olá! Muito obrigada por me adicionar :3\n\nUse ${config.bot.prefix}ajuda para ver os comandos disponíveis.` });
        }
    })
}
