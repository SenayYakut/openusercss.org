import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token, title, description, content, version, id, screenshots}, {Session, Theme, User}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await User.findOne({
    '_id': session.user._id
  })
  let newTheme = null

  if (id) {
    newTheme = await Theme.findOne({
      '_id': id
    })
    const userOwnsTheme = session.user._id.equals(newTheme.user._id)

    if (!newTheme || !userOwnsTheme) {
      throw new Error('No theme found')
    }

    newTheme.title = title
    newTheme.description = description
    newTheme.version = version
    newTheme.content = decodeURIComponent(content)
    newTheme.screenshots = screenshots
  } else {
    newTheme = Theme.create({
      'user':    session.user,
      'content': decodeURIComponent(content),
      title,
      description,
      version,
      screenshots
    })
  }

  const savedTheme = await newTheme.save()

  user.themes.forEach((theme, index) => {
    if (!theme) {
      user.themes.splice(index, 1)
    }
  })

  user.themes.push(newTheme)
  await user.save()

  return savedTheme
}
