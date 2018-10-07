import all from 'p-all'
import delay from 'delay'

const batch = 5

export default async ({collection, populate,}, callback,) => {
  const actions = []
  const count = await collection.countDocuments({})

  for (let i = 0; i < count; i = i + batch) {
    actions.push(async () => {
      const query = collection.find({})
      .limit(batch)
      .skip(i)

      if (populate) {
        query.populate(populate)
      }

      const results = await query

      await delay(50)
      return Promise.all(results.map(callback))
    })
  }

  return all(actions, {
    'concurrency': 1,
  })
}
