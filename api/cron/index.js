import InvalidSessionsTask from './tasks/invalid-sessions'
import OrphanRatingsTask from './tasks/orphan-ratings'

const tasks = [
  new InvalidSessionsTask(),
  new OrphanRatingsTask(),
]

export default () => {
  return tasks.forEach((task) => task.schedule())
}
