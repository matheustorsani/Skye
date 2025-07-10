import { Collection } from '@discordjs/collection'
import { WASocket } from 'baileys'
import * as glob from 'glob'
import path from 'path'
import Spinnies from 'spinnies'
import { Database } from './modules/db/database'
import config from '../../config.json';
import { CommandInstance, AtizapClientStartOptions } from './Types'

export default class AtizapClient {
  atizap: WASocket
  commands: Collection<string, CommandInstance>
  mongo = new Database(config.keys.mongouri)
  aliases: Collection<string, CommandInstance>
  spinnies: Spinnies

  constructor(atizap: WASocket) {
    this.atizap = atizap
    this.commands = new Collection()
    this.aliases = new Collection<string, CommandInstance>()
    this.spinnies = new Spinnies({ color: 'gray', succeedColor: 'blue' })
  }

  async start({ events, commands }: AtizapClientStartOptions): Promise<void> {
    this.spinnies.add('starting', { text: 'Loading...' })

    try {
      this.spinnies.add('events', { text: 'Loading events...' })
      const eventFiles = await glob.glob(events)
      this.spinnies.succeed('events', { text: `${eventFiles.length} loaded events.` })

      this.spinnies.add('commands', { text: 'Loading commands...' })
      const cmdFiles = await glob.glob(commands)

      for (const fileCmd of cmdFiles) {
        if (fileCmd.endsWith('template.ts')) continue

        const CmModule = await import(path.resolve(fileCmd))
        const Cm = CmModule.default || CmModule
        const cmd: CommandInstance = new Cm(this)

        this.commands.set(cmd.config.name, cmd)
        cmd.config.aliases.forEach(alias => {
          this.aliases.set(alias, cmd)
        })
      }
      this.commands.delete('template')
      // Para não contar o template como comando
      this.spinnies.succeed('commands', { text: `${cmdFiles.length - 1} loaded commands.` })
      this.spinnies.succeed('starting', { text: 'Bot is ready! :D' })
    } catch (err) {
      this.spinnies.fail('starting', { text: String(err) })
      throw err
    }
  }
}