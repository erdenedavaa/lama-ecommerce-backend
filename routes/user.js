const User = require('../models/User')
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken')
const router = require('express').Router()

// updating userInfo PUT
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  // before updating, need to check for password
  if (req.body.password) {
    // need to encript password
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // set new information to user
        $set: req.body,
      },
      { new: true } // new updated info return gesen tohirgoo
    )
    // update a user
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json(err)
  }
})

// DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted.')
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET ANOTER USER ONLY FROM ADMIN
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc

    res.status(200).json(others)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET ALL USER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  // Зөвхөн сүүлийн шинэ цөөн тооны хэрэглэгчдийн мэдээлэл харуулая гэвэл яах вэ?
  // users?new=true
  const query = req.query.new
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER STATS (total number of user per month)
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' }, // month variable in my createdAt date is assign to ehnii month
        },
      },
      {
        $group: {
          _id: '$month', // this month is deer bga hamgiin ehnii month shuu
          total: { $sum: 1 }, // 1 iin utga ni "every registered user"
        },
      },
    ])
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
