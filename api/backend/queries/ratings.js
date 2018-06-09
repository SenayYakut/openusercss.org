import {ObjectID,} from 'mongodb'

export default async (root, {id,}, {Rating,}) => {
  const result = await Rating.find({
    'theme': new ObjectID(id),
  }, {
    'populate': true,
  })

  if (!result || result.length === 0) {
    throw new Error('no-such-rating')
  }

  return result
}
