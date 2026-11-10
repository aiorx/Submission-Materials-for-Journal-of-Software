import json
import random
import unittest

from class_data import getclass_help
from online_shop import Item, Stock, Order, Customer, OnlineShop


class ModelEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__dict__'):
            # Serialize objects with a __dict__ attribute (custom classes)
            return obj.__dict__
        return super().default(obj)


class ModelDecoder(json.JSONDecoder):
    def __init__(self, *args, **kwargs):
        super().__init__(object_hook=self.object_hook, *args, **kwargs)

    def object_hook(self, dct):
        # Check if the dictionary contains a special key '__class__'
        if '__class__' in dct:
            class_name = dct.pop('__class__')
            module = dct.pop('__module__')

            # Import the module and retrieve the class
            module = __import__(module)
            class_ = getattr(module, class_name)

            # Create an instance of the class with the remaining dictionary items
            instance = class_.__new__(class_)
            instance.__dict__ = dct
            return instance
        return dct


# Crafted with standard coding tools
def def_create_test_data():
    items = {}

    item = Item("1", "iPhone", 1000, "A phone from Apple", "Apple", "Phone")
    items[item.get_id()] = item

    item = Item("2", "Hamburger", 5, "A hamburger from McDonalds", "McDonalds", "Food")
    items[item.get_id()] = item

    item = Item("3", "T-Shirt", 50, "A t-shirt from Armani", "Armani", "Clothes")
    items[item.get_id()] = item

    # Add 10 more items for the same categories
    item = Item("4", "Samsung Galaxy", 900, "A phone from Samsung", "Samsung", "Phone")
    items[item.get_id()] = item

    item = Item("5", "Pizza", 10, "A pizza from Domino's", "Domino's", "Food")
    items[item.get_id()] = item

    item = Item("6", "Jeans", 60, "Jeans from Levi's", "Levi's", "Clothes")
    items[item.get_id()] = item

    item = Item("7", "Google Pixel", 800, "A phone from Google", "Google", "Phone")
    items[item.get_id()] = item

    item = Item("8", "Sushi", 15, "Sushi from a local restaurant", "Local Sushi", "Food")
    items[item.get_id()] = item

    item = Item("9", "Dress Shirt", 70, "A dress shirt from Hugo Boss", "Hugo Boss", "Clothes")
    items[item.get_id()] = item

    item = Item("10", "OnePlus", 950, "A phone from OnePlus", "OnePlus", "Phone")
    items[item.get_id()] = item

    item = Item("11", "Burger King Burger", 6, "A burger from Burger King", "Burger King", "Food")
    items[item.get_id()] = item

    item = Item("12", "Sneakers", 80, "Sneakers from Nike", "Nike", "Clothes")
    items[item.get_id()] = item

    item = Item("13", "Sony Xperia", 850, "A phone from Sony", "Sony", "Phone")
    items[item.get_id()] = item

    item = Item("14", "Ice Cream", 4, "Ice cream from Ben & Jerry's", "Ben & Jerry's", "Food")
    items[item.get_id()] = item

    item = Item("15", "Suit", 120, "A suit from Calvin Klein", "Calvin Klein", "Clothes")
    items[item.get_id()] = item

    stock = Stock()
    for item in items.values():
        stock.add_item(item, random.randint(5, 100))

    # Create five customers using some fictional values
    customers = {}
    customer = Customer("1", "John Doe", {"street": "Main Street", "number": "1", "city": "New York"}, [])
    customers[customer.get_id()] = customer

    customer = Customer("2", "Donald Duck", {"street": "Duck Street", "number": "23", "city": "Duckburg"}, [])
    customers[customer.get_id()] = customer

    customer = Customer("3", "Sherlock Holmes", {"street": "Baker Street", "number": "221B", "city": "London"}, [])
    customers[customer.get_id()] = customer

    customer = Customer("4", "Jack Sparrow", {"street": "Port Royal", "number": "432", "city": "Caribbean Sea"}, [])
    customers[customer.get_id()] = customer

    customer = Customer("5", "Marty McFly", {"street": "Hill Valley", "number": "11", "city": "California"}, [])
    customers[customer.get_id()] = customer

    # Create orders for each customer
    orders = []

    # Customer 1: 10 orders with varying items and quantities
    for _ in range(10):
        order = Order(str(len(orders) + 1), "1")
        quantity = 1
        for item_id, item in list(items.items())[:10]:  # First 10 items
            quantity = quantity + 1
            order.add_item(item, quantity)
        orders.append(order)

    # Customer 2: 15 orders with varying items and quantities
    for _ in range(15):
        order = Order(str(len(orders) + 1), "2")
        quantity = 1
        for item_id, item in list(items.items())[10:20]:  # Next 10 items
            quantity = quantity + 1
            order.add_item(item, quantity)
        orders.append(order)

    # Customer 3: 1 order with varying items and quantities
    order = Order(str(len(orders) + 1), "3")
    quantity = 1
    for item_id, item in list(items.items())[20:30]:  # Last 5 items
        quantity = quantity + 1
        order.add_item(item, quantity)
    orders.append(order)

    # Customer 4: 3 orders with varying items and quantities
    for _ in range(3):
        order = Order(str(len(orders) + 1), "4")
        quantity = 1
        for item_id, item in list(items.items())[30:40]:  # Another 10 items
            quantity = quantity + 1
            order.add_item(item, quantity)
        orders.append(order)

    # Customer 5: No orders

    # Append the generated orders to the customers
    for order in orders:
        customer_id = order.get_customer_id()
        if customer_id in customers:
            customer = customers[customer_id]
            customer.add_order_to_history(order)

    # Create the online shop
    online_shop = OnlineShop(stock, list(customers.values()))
    return online_shop


class TestDataTest(unittest.TestCase):

    def test_get_test_data(self):
        online_shop = def_create_test_data()

        first_customer = None
        # Get the customer with the id 1
        for customer in online_shop.customers:
            if customer.get_id() == "1":
                first_customer = customer
                break

        # Verify that the customer has 10 orders
        assert len(first_customer.get_order_history()) == 10

        # Verify that the first item of the first order of the customer is an iPhone with a quantity of 2
        first_order = first_customer.get_order_history()[0]
        first_item = first_order.get_items()[list(first_order.get_items().keys())[0]]
        assert first_item[0].get_description() == "A phone from Apple"
        assert first_item[1] == 2


class TestClassHelp(unittest.TestCase):

    def test_get_class_help_for_online_shop(self):
        help_strings = []
        for clazz in Item, Stock, Order, Customer, OnlineShop:
            class_help = getclass_help(clazz)
            help_strings.append(class_help)
            print(class_help)

        assert len(help_strings) == 5
        assert "Item" in help_strings[0]
