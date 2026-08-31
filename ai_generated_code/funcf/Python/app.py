```python
def get_grouped_by_categories(items, all_categories, categories, exclude_negatives = False):
    # todo: calculate and return an array of {category: amount} objects
    # with first object with category = "all"
    print(f"filtering for {categories}, all items: ", items)

    if exclude_negatives:
        items = [item for item in items if item["amount"] > 0]

    results = []

    sum_by_category = {}
    # below is Assisted using common GitHub development utilities, will probably rewrite these later on
    if all_categories:
        # get all categories
        for item in items:
            if item["category"] in sum_by_category:
                sum_by_category[item["category"]] += Decimal(item["amount"])
            else:
                sum_by_category[item["category"]] = Decimal(item["amount"])
    elif len(categories) == 0:
        sum_by_category["all"] = 0
        for item in items:
            sum_by_category["all"] += Decimal(item["amount"])
    else:
        # get only categories in categories param
        for item in items:
            if item["category"] in categories:
                if item["category"] in sum_by_category:
                    sum_by_category[item["category"]] += Decimal(item["amount"])
                else:
                    sum_by_category[item["category"]] = Decimal(item["amount"])
    for category, amount in sum_by_category.items():
        results.append({
            "category": category,
            "amount": str(amount)
        })
    return results
```