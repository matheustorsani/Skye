import type AtizapClient from "../config/AtizapClient";
import { Usuario } from "../config/modules/db/database";

export class UserService {
  private userCache = new Map<string, Usuario | null>();

  constructor(private zap: AtizapClient) {}

  async getUser(userId: string): Promise<Usuario> {
    let usuario = this.userCache.get(userId);
    if (!usuario) {
      usuario = await this.zap.mongo.usuarios.findById(userId);
      if (!usuario) {
        usuario = await this.zap.mongo.newUserDoc(userId).save();
        console.log("Usuário salvo no banco de dados:", userId);
      }
      this.userCache.set(userId, usuario);
    }
    return usuario;
  }
}
