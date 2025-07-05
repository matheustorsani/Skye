import makeWASocket, {
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    fetchLatestBaileysVersion,
    WASocket,
    proto
} from "baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import * as path from "path";
import * as qrcode from "qrcode-terminal";
import AtizapClient from "./config/AtizapClient";
//import pm2 from "./config/pm2";
import config from "../config.json";

//if (config.bot.pm2.enable === true) pm2.start(config.bot.pm2.restartTime);
let zap: AtizapClient;
const start = async (client: WASocket) => {
    zap = new AtizapClient(client);
    await zap.start({
        events: './app/events/**/*.ts',
        commands: './app/commands/**/*.ts'
    });
};

const initialize = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../auth'));
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys)
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) qrcode.generate(qr, { small: true });

        if (connection === 'close') {
            const reason = new Boom((lastDisconnect?.error as any)?.message)?.output?.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.error("Deslogado! Delete a pasta 'auth' e tente novamente.");
            } else {
                console.log("Conexão perdida, tentando reconectar...", reason);
                initialize();
            }
        } else if (connection === 'open') {
            console.log("Conexão estabelecida com sucesso!");
            start(sock);
        }
    });
};

initialize().catch((err) => {
    console.error("Erro ao iniciar o cliente:", err);
    process.exit(1);
});

export { zap, config };