const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    // door bga user ni whatever you want
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json('Token is not valid!')
      // req.body, req.header gedeg shig req.user iig zohion oruulj bn
      req.user = user // hoino bga user ni deer bga err.user
      next() // Leave this function, and go to user router
    })
  } else {
    // 401 - not authenticated
    return res.status(401).json('You are not authenticated!')
  }
}

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next() // return to next router
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
}
