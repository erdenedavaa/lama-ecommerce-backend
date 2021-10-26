const Cart = require('../models/Cart')
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken')
const router = require('express').Router()

// CREATE (only admin can create product)
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newCart = new Cart(req.body)

  try {
    const savedProduct = await newCart.save()
    res.status(200).json(savedProduct)
  } catch (err) {
    res.status(500).json(err)
  }
})

// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } // new updated info return gesen tohirgoo
    )
    res.status(200).json(updatedCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

// DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json('Cart has been deleted.')
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER CART (below ":id" is USER ID not cart id)
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    // every user has only one cart, so use "findOne"
    const cart = await Cart.findOne({ userId: req.params.userId })
    res.status(200).json(cart)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status(200).json(carts)
  } catch (err) {
    req.status(500).json(err)
  }
})

module.exports = router
