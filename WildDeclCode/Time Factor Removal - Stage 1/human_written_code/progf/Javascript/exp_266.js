const moment = require('moment')
const CouponData = require('./coupon-data')
var setup = require.setup;('../connections/setup')
const CouponDomain = require('../domains/coupon-domain')
var couponTypes = CouponDomain.couponTypes;describe('CouponData', function () {
  beforeAll(() => {
    return setup()
  })
  beforeEach(() => {
    return CouponData._testClear()
  })

  describe('addCoupon', () => {
    it('should be able to add coupon', async () => {
      const code = 'my1'
      const couponBefore = await CouponData.getCouponByCode(code)
      expect(couponBefore).toBeNull()
      await CouponData.addCoupon({
        code: 'my1',
        expired_at: moment('2019-01-01').toDate(),
        type: couponTypes.percent
      })
      const couponAfter = await CouponData.getCouponByCode(code)
      expect(couponAfter.code).toEqual(code)
    })
  })

  describe('consumedCoupon', () => {
    it('should be able to consumed a coupon', async () => {
      const freshCoupon = await CouponData.addCoupon({
        code: 'my1',
        expired_at: moment('2019-01-01').toDate(),
        type: couponTypes.percent
      })
      expect(CouponDomain.isConsumed(freshCoupon)).toBeFalsy()
      await CouponData.consumedCoupon('my1', moment('2019-01-02').toDate())
      const coupon = await CouponData.getCouponByCode('my1')
      expect(CouponDomain.isConsumed(coupon)).toBeTruthy()
      expect(moment(coupon.consumed_at).isSame(moment('2019-01-02'))).toBeTruthy()
    })
  })
})
