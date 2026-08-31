```js
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
```