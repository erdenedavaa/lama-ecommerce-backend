const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)

router.post('/payment', (req, res) => {
  // console.log(req.body)
  // stripeNew = stripe(process.env.STRIPE_KEY)
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr)
      } else {
        // if successful
        res.status(200).json(stripeRes)
      }
    }
  )
})

module.exports = router
