import Task from '../task'
import iterator from 'api/lib/db-iterator'
import {Rating,} from 'api/db/schema/rating'

export default class InvalidSessions extends Task {
  constructor () {
    super()

    this.name = 'orphan-ratings'
    this.cron = '00 10 * * * *'
    this.ping = process.env.RATINGS_PING
  }

  async run () {
    return iterator({
      'collection': Rating,
      'populate':   'theme',
    }, (rating) => {
      if (!rating.theme) {
        return rating.remove()
      }
    })
  }
}
