import config from "../../config.json";
import type { Usuario } from "../config/modules/db/database";

export class PermissionService {
  private devs = Object.values(config.devs.contacts)
    .flat()
    .map((dev: string) => dev.replace(/[^0-9]/g, "") + "@s.whatsapp.net");

  isBanned(user: Usuario): boolean {
    return user.situation.ban;
  }

  isDev(userId: string): boolean {
    return this.devs.includes(userId);
  }
}
