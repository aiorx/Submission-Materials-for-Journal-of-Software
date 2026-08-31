async function fetchCoupon(couponCode) {
  try {
    await dbConnect();
  } catch (error) {
    return null;
  }

  try {
    const coupon = await DiscountCoupon.findOne({
      code: couponCode,
    }).lean();

    if (!coupon) {
      return null;
    }

    // this logic was Composed with basic coding tools
    const orders = await Order.aggregate([
      {
        $match: {
          $or: [
            { coupon: couponCode }, // Match orders where the whole order coupon is FREE100
            { "items.coupon": couponCode }, // Match orders where any item uses FREE100 coupon
          ],
        },
      },
      {
        $project: {
          _id: 1, // Keep the order ID
          no_of_products_which_used_this_coupon: {
            // Start by counting products in the items array where the coupon is FREE100
            $add: [
              {
                $size: {
                  $filter: {
                    input: "$items",
                    as: "item",
                    cond: { $eq: ["$$item.coupon", couponCode] },
                  },
                },
              },
              {
                // If the whole order coupon matches, increment by 1
                $cond: {
                  if: { $eq: ["$coupon", couponCode] },
                  then: 1,
                  else: 0,
                },
              },
            ],
          },
          total_deducted_amount: {
            // Start by summing the discountAmount for items where coupon is FREE100
            $add: [
              {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$items",
                        as: "item",
                        cond: { $eq: ["$$item.coupon", couponCode] },
                      },
                    },
                    as: "item",
                    in: "$$item.discountAmount",
                  },
                },
              },
              {
                // Add the order discountAmount if the whole order coupon matches
                $cond: {
                  if: { $eq: ["$coupon", couponCode] },
                  then: "$discountAmount",
                  else: 0,
                },
              },
            ],
          },
        },
      },
    ]);
    coupon.orders = orders;
    return deepCopy(coupon);
  } catch (error) {
    return null;
  }
}