```python
def get(self, request):
    # 获取登录用户
    user = request.user

    # 从redis中获取用户的购物车记录信息
    conn = get_redis_connection('default')

    # 拼接key
    cart_key = 'cart_%d' % user.id

    # cart_1 : {'1':'2', '3':'1', '5':'2'}
    # hgetall(key) -> 返回是一个字典，字典键是商品id, 键对应值是添加的数目
    cart_dict = conn.hgetall(cart_key)

    total_count = 0
    total_amount = 0
    # 遍历获取购物车中商品的详细信息
    skus = []
    for sku_id, count in cart_dict.items():
        # 根据sku_id获取商品的信息
        sku = GoodsSKU.objects.get(id=sku_id)

        # 计算商品的小计
        amount = sku.price * int(count)

        # 给sku对象增加属性amout和count, 分别保存用户购物车中商品的小计和数量
        sku.count = count
        sku.amount = amount

        # 追加商品的信息
        skus.append(sku)

        # 累加计算用户购物车中商品的总数目和总价格
        total_count += int(count)
        total_amount += amount

    # 组织模板上下文
    context = {
        'total_count': total_count,
        'total_amount': total_amount,
        'skus': skus
    }

    # 使用模板
    return render(request, 'cart.html', context)
```