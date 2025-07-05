import { Collection } from '@discordjs/collection'
import * as glob from 'glob'
import path from 'path'
import Spinnies from 'spinnies'

type CommandConfig = {
  name: string
  aliases: string[]
  category: string
  description: string
  example: string
  groupOnly: boolean
  groupAdmPermission: {
    bot: boolean
    user: boolean
  }
  ownerOnly: boolean
  isWorking: boolean
  amountTimes: number
}

type CommandInstance = {
  config: CommandConfig
  execute: (...args: any[]) => Promise<void>
}

interface AtizapClientStartOptions {
  events: string
  commands: string
}

export default class AtizapClient {
  atizap: any
  commands: Collection<string, CommandInstance>
  aliases: Collection<string, string>
  spinnies: Spinnies

  constructor(atizap: any) {
    this.atizap = atizap
    this.commands = new Collection()
    this.aliases = new Collection()
    this.spinnies = new Spinnies({ color: 'red', succeedColor: 'blue' })
  }

  async start({ events, commands }: AtizapClientStartOptions): Promise<void> {
    this.spinnies.add('starting', { text: 'Iniciando o bot...' })

    try {
      this.spinnies.add('events', { text: 'Carregando eventos...' })
      const eventFiles = await glob.glob(events)
      for (const file of eventFiles) {
        const handlerModule = await import(path.resolve(file))
        const handler = handlerModule.default || handlerModule
        if (typeof handler === 'function') {
          handler(this)
          this.spinnies.update('events', { text: `Evento ${file} carregado!` })
        }
      }
      this.spinnies.succeed('events', { text: `${eventFiles.length} eventos carregados.` })

      this.spinnies.add('commands', { text: 'Carregando comandos...' })
      const cmdFiles = await glob.glob(commands)

      let loadedCount = 0
      for (const fileCmd of cmdFiles) {
        if (fileCmd.endsWith('template.ts')) continue

        const CmModule = await import(path.resolve(fileCmd))
        const Cm = CmModule.default || CmModule
        const cmd: CommandInstance = new Cm(this)

        this.commands.set(cmd.config.name, cmd)
        cmd.config.aliases.forEach(alias => {
          this.aliases.set(alias, cmd.config.name)
        })
        loadedCount++
      }

      this.spinnies.succeed('commands', { text: `${loadedCount} comandos carregados.` })
      this.spinnies.succeed('starting', { text: 'Bot está pronto.' })
    } catch (err) {
      this.spinnies.fail('starting', { text: String(err) })
      throw err
    }
  }
}