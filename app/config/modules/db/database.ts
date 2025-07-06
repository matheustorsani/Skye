import mongoose, { Document, Model, Schema } from 'mongoose';

interface Grupo extends Document {
    _id: string;
    prefix: string;
}

interface Usuario extends Document {
    _id: string;
    prefix: string;
}

export class Database {
    public grupos: Model<Grupo>;
    public usuarios: Model<Usuario>;

    constructor(key: string) {
        mongoose.connect(key)
            .then(() => {
                console.log("O bot está conectado ao banco de dados.");
            })
            .catch((err) => {
                console.error("Erro ao conectar ao banco de dados:", err);
            });

        const grupoSchema = new Schema<Grupo>({
            _id: { type: String, required: true },
            prefix: { type: String, default: '!' },
        });

        const usuarioSchema = new Schema<Usuario>({
            _id: { type: String, required: true },
            prefix: { type: String, default: '!' },
        });

        this.grupos = mongoose.model<Grupo>('groups', grupoSchema);
        this.usuarios = mongoose.model<Usuario>('users', usuarioSchema);
    }

    newGroupDoc(id: string): Grupo {
        return new this.grupos({
            _id: id,
            prefix: '!'
        });
    }

    newUserDoc(id: string): Usuario {
        return new this.usuarios({
            _id: id,
            prefix: '!'
        });
    }
}
