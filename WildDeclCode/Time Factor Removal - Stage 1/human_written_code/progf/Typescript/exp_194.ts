var object = require('../index').object;
var oneOf = require('../index').oneOf;
var toNumber = require('../index').toNumber;
var pipe = require('../index').pipe;
var lift = require('../index').lift;

class Currency {
  amount : number
  currency : string

  constructor(
    amount : number,
    currency : string
  ) {
    this.amount = amount
    this.currency = currency
  }

  format() {
    return this.currency === 'USD'
      ? "$" + (this.amount) + ""
      : "" + (this.amount) + " kr"
  }
}

const amount = object({
  amount: toNumber,
  currency: oneOf('USD', 'SEK')
})

const currency = pipe(
  amount,
  lift(
    function ({ amount, currency }) { return new Currency(amount, currency).format(); },
    function currency {
      if (currency.startsWith('$')) {
        return { currency: 'USD', amount: parseFloat(currency.substring(1)) }
      } else {
        return { currency: 'SEK', amount: parseFloat(currency.substring(0, currency.length - 3)) }
      }
    })
)
