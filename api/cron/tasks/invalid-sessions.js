import jwt from 'jsonwebtoken'
import Task from '../task'
import iterator from 'api/lib/db-iterator'
import log from 'chalk-console'

import {Session,} from 'api/db/schema/session'
import staticConfig from 'lib/config'

export default class InvalidSessions extends Task {
  constructor () {
    super()

    this.name = 'invalid-sessions'
    this.cron = '00 00 * * * *'
    this.ping = process.env.SESSIONS_PING
  }

  async run () {
    const config = await staticConfig()

    return iterator({
      'collection': Session,
      'populate':   null,
    }, async (session) => {
      try {
        jwt.verify(session.token, config.get('keypair.clientprivate'), {
          'issuer':     config.get('domain'),
          'algorithms': [
            'HS256',
          ],
        })

        log.info(`Session ${session.id} valid`)
        return true
      } catch (error) {
        log.info(`Session ${session.id} invalid, deleting`)
        return session.remove()
      }
    })
  }
}
