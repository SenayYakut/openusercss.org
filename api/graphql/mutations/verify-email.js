import staticConfig from 'lib/config'
import jwt from 'jsonwebtoken'
import pify from 'pify'

const resolver = async (root, {token,}, {User,}) => {
  const config = await staticConfig()
  const decoded = await pify(jwt.verify)(token, config.get('keypair.clientprivate'))
  let result = false

  if (decoded.email) {
    let user = null

    const existingEmailUser = await User.findOne({
      'email': decoded.email,
    })

    user = existingEmailUser || await User.findOne({
      'pendingEmail': decoded.email,
    })

    if (!user) {
      // Just in case we made an error by sending a verification link
      // to an address that we weren't meant to send one to.
      // This should never happen
      throw new Error('verification-link-target-mismatch')
    }

    if (user.pendingEmail && user.pendingEmail !== '') {
      user.email = user.pendingEmail
      user.pendingEmail = ''
    }

    user.emailVerified = true
    await user.save()

    result = true
  }

  return result
}

export default {
  'name': 'verifyEmail',

  resolver,
}
