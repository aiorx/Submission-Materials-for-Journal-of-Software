import asyncio
import datetime
import logging
import os
import random
from unidecode import unidecode

from surrealdb import Surreal

logger = logging.getLogger("NDBI040:surreal")
random.seed(25)

# region DATA
# fmt: off
# following data was Supported via standard programming aids
names = [
    "Adam", "Aiden", "Aleš", "Alice", "Amelia", "Benjamin", "Charlotte", "David", "Dominik", "Ella",
    "Eva", "Filip", "Hana", "Isabella", "Jakub", "Jan", "Jana", "Jiří", "John", "Kateřina",
    "Klára", "Liam", "Linda", "Lucie", "Markéta", "Martin", "Mia", "Michael", "Nina", "Oliver"
]
surnames = [
    "Anderson", "Baker", "Černý", "Davis", "Dvořák", "Fischer", "Garcia", "Hansen", "Havel", "Hernandez",
    "Holmes", "Horák", "Jackson", "Johnson", "Jones", "Kovář", "Kříž", "Lee", "Lopez", "Martin",
    "Meyer", "Novák", "Pospíšil", "Richter", "Smith", "Svoboda", "Taylor", "Thompson", "Veselý", "Wilson"
]

cities = [
    ("Praha", 50.0755, 14.4378),
    ("Brno", 49.1951, 16.6068),
    ("Ostrava", 49.8209, 18.2625),
    ("Bratislava", 48.1486, 17.1077),
    ("London", 51.5074, -0.1278),
    ("Paris", 48.8566, 2.3522),
    ("Berlin", 52.5200, 13.4050),
    ("Madrid", 40.4168, -3.7038),
    ("Rome", 41.9028, 12.4964),
    ("Vienna", 48.2082, 16.3738),
    ("Amsterdam", 52.3676, 4.9041),
    ("Barcelona", 41.3851, 2.1734),
    ("Munich", 48.1351, 11.5820),
    ("Hamburg", 53.5511, 9.9937),
    ("Milan", 45.4642, 9.1900),
    ("Zurich", 47.3769, 8.5417),
    ("Lisbon", 38.7223, -9.1393),
    ("Krakow", 50.0647, 19.9450),
    ("Athens", 37.9838, 23.7275),
    ("Dublin", 53.3498, -6.2603),
]

food_reviews = [
    ("Tasty and satisfying!", 4.5),
    ("Overpriced and underwhelming", 2.0),
    ("Delicious but greasy", 3.5),
    ("Disappointing portion size", 2.5),
    ("Mouthwatering flavors", 4.5),
    ("Undercooked and unappetizing", 1.5),
    ("Amazing service, so-so food", 3.5),
    ("Inventive and flavorful", 4.0),
    ("Lacking in seasoning", 2.0),
    ("A culinary masterpiece", 5.0),
    ("Bland and uninspired", 2.0),
    ("Satisfying but not exceptional", 3.0),
    ("Perfectly cooked and seasoned", 4.5),
    ("Terrible service ruins meal", 1.0),
    ("Delectable and satisfying", 4.0),
    ("Boring and unremarkable", 2.5),
    ("Elevated cuisine at a cost", 3.5),
    ("Poor quality ingredients", 2.0),
    ("A feast for the senses", 4.5),
    ("Not worth the hype", 2.5),
    ("Savory and comforting", 3.5),
    ("Unadventurous and dull", 2.5),
    ("Flavors clash, poor execution", 2.0),
    ("Exceptional value for money", 4.5),
    ("A total letdown", 1.5),
    ("Fresh and flavorful", 4.0),
    ("Overcooked and dry", 2.0),
    ("Unforgettable dining experience", 4.5),
    ("Lacks finesse and creativity", 3.0),
    ("Inconsistent quality", 2.5),
    ("Skvělé jídlo, příšerná obsluha", 3.5),
    ("Vynikající chuť, ale drahé", 4),
    ("Málo kořeněné, jinak dobré", 3),
    ("Nezajímavá prezentace, ale chutná", 3.5),
    ("Draze zaplacené podprůměrné jídlo", 2.5),
    ("Nadprůměrná kvalita, ale nic extra", 3.5),
    ("Vynikající ceny, dobré jídlo", 4),
    ("Slané jídlo, ale vynikající dezerty", 3.5),
    ("Přijatelná kvalita, ale drahé", 3),
    ("Skvělé jídlo, ale malé porce", 4),
    ("Chutné, ale podivná kombinace ingrediencí", 3),
    ("Překvapivá chuť, ale příliš drahé", 3),
    ("Vynikající kvalita, ale přemrštěné ceny", 4),
    ("Neobvyklé kombinace, ale výborné", 3.5),
    ("Drahé jídlo, nic extra", 2.5),
    ("Nadprůměrná kvalita, ale přemrštěné ceny", 3.5),
    ("Chutné jídlo, ale podprůměrné podávání", 3),
    ("Velké porce, ale podprůměrná chuť", 2.5),
    ("Kreativní jídlo, ale podivné", 3),
    ("Jemná chuť, ale málo kořeněné", 3.5),
    ("Výborné jídlo, ale dlouhé čekání", 4),
    ("Špatné jídlo, hrozné služby", 1.5),
    ("Podprůměrná kvalita, přemrštěné ceny", 2.5),
    ("Chutné jídlo, ale špatná prezentace", 2.5),
    ("Nezvyklá chuť, ale vynikající", 3.5),
    ("Hodně kořeněné, ale dobré", 3.5),
    ("Nepříjemná atmosféra, ale dobré jídlo", 3),
    ("Malé porce, ale skvělá chuť", 4),
    ("Nadprůměrné jídlo, ale drahé", 4),
    ("Podprůměrná kvalita, ale výborné ceny", 3.5),
    ("Vynikající dezerty, průměrné jídlo", 3),
]

restaurant_names = [
    "The Hungry Tiger",
    "Bella Italia",
    "Spice of India",
    "Cafe Fiesta",
    "The Golden Spoon",
    "Thai Orchid",
    "Mamma Mia",
    "The Sizzling Grill",
    "La Petite Boulangerie",
    "Rice and Noodle",
    "The Secret Garden",
    "Sushi Paradise",
    "Pasta Bella",
    "The Olive Tree",
    "Taco Loco",
    "Cafe de Paris",
    "The Cheesy Bites",
    "Chopsticks Palace",
    "The Smoking BBQ",
    "Burger Joint",
    "The Lemon Tree",
    "La Dolce Vita",
    "Curry House",
    "The Cozy Corner",
    "Pizza Perfection",
    "The Peking Duck",
    "Seafood Sensations",
    "Cafe Arabica",
    "The Sweet Tooth",
    "Steakhouse Supreme",
    "Green Leaf Cafe",
    "The Wholesome Bowl",
    "Flavors of Mexico",
    "The Pasta Place",
    "Taste of Thailand",
    "The Roasted Bean",
    "Fusion Delights",
    "The Rustic Tavern",
    "Oriental Express",
    "The Waffle House",
    "Delicious Delights",
    "The French Connection",
    "Sizzle and Spice",
    "The BBQ Pit",
    "The Vegan Garden",
    "Taste of Greece",
    "The Tandoori Oven",
    "Hot Pot Heaven",
    "The Gourmet Burger",
    "Sushi Station",
]

food_ingredients = [
    "salt",
    "pepper",
    "olive oil",
    "garlic",
    "onion",
    "tomato",
    "chicken",
    "beef",
    "rice",
    "pasta",
    "butter",
    "milk",
    "eggs",
    "flour",
    "sugar",
    "cheese",
    "yogurt",
    "lemon",
    "ginger",
    "basil",
    "saffron",
    "star fruit",
    "dragon fruit",
    "jackfruit",
    "tamarind",
    "truffle",
    "kale",
    "quinoa",
    "wasabi",
    "goji berries"
]

meal_names = [
    "Spaghetti Bolognese",
    "Chicken Tikka Masala",
    "Beef Stroganoff",
    "Sushi Rolls",
    "Mushroom Risotto",
    "Pad Thai",
    "BBQ Ribs",
    "Tandoori Chicken",
    "Fish Tacos",
    "Lobster Bisque",
    "Greek Salad",
    "Peking Duck",
    "Hawaiian Pizza",
    "Steak Fajitas",
    "Chicken Parmesan",
    "Shrimp Scampi",
    "Vegetable StirFry",
    "Roast Beef Sandwich",
    "Butter Chicken",
    "Eggplant Parmesan",
    "Lentil Soup",
    "Crispy Tofu",
    "Teriyaki Salmon",
    "Beef and Broccoli",
    "Clam Chowder",
    "Caesar Salad",
    "Chicken Noodle Soup",
    "Spinach Lasagna",
    "Samosas",
    "Lemon Herb Roasted Chicken",
    "Fettuccine Alfredo",
    "Taco Salad",
    "Miso Soup",
    "Grilled Salmon",
    "Lamb Kebabs",
    "Gnocchi with Pesto",
    "Beef Tacos",
    "Chicken and Waffles",
    "Crispy Fried Chicken",
    "Caprese Salad",
    "Tomato Soup",
    "Chicken Shawarma",
    "Crab Cakes",
    "Shrimp and Grits",
    "Pho",
    "Pancakes with Maple Syrup",
    "Beef Burritos",
    "Mongolian Beef",
    "Cobb Salad",
    "Chicken Caesar Wrap"
]
# fmt: on
# endregion


async def main():
    async with Surreal("ws://localhost:8000") as db:
        await db.signin({"user": "root", "pass": "root"})
        await db.use("NDBI040", "reviews")

        logger.info("recreating database")
        await db.query("REMOVE DB reviews; DEFINE DB reviews; USE DB reviews;")

        logger.info("creating structures")
        with open(os.path.join(os.path.dirname(__file__), ".", "init.surql")) as f:
            await db.query(f.read())

        logger.info("inserting users")
        users = {}
        for _ in range(1000):
            name = random.choice(names)
            surname = random.choice(surnames)
            num = random.randint(1, 999999999)
            username = unidecode(f"{name[:3]}{surname[:3]}{num}".lower())
            email = f"{username}@example.com"
            users[username] = {
                "name": name,
                "surname": surname,
                "email": email,
            }

        for id, obj in users.items():
            await db.create(f"user:{id}", obj)

        logger.info("inserting cities")
        for name, lat, long in cities:
            await db.create(
                f"city:{name.lower()}",
                {"name": name, "center": {"type": "Point", "coordinates": [lat, long]}},
            )

            await db.query(
                f"""
                UPDATE city:{name.lower()} 
                SET restaurant_count = <future> {{ array::len(<-located_in<-restaurant) }}
                """
            )

        logger.info("inserting restaurants")
        for name in restaurant_names:
            city, lat, long = random.choice(cities)
            lat += random.uniform(-0.5, 0.5)  # 1 lat or long is +- 111 km
            long += random.uniform(-0.5, 0.5)

            key = f"{name.lower().replace(' ', '_')}"

            await db.create(
                f"restaurant:{key}",
                {
                    "name": name,
                    "location": {"type": "Point", "coordinates": [lat, long]},
                },
            )

            await db.query(
                f"""
                RELATE restaurant:{key}->located_in->city:{city.lower()};
                """
            )

        logger.info("inserting food")
        meals = {}
        for name in meal_names:
            key = name.lower().replace(" ", "_")

            ingredients = random.sample(food_ingredients, k=random.randint(2, 5))

            await db.create(
                f"food:{key}",
                {
                    "name": name,
                    "ingredients": ingredients,
                },
            )

            for _ in range(1, random.randint(3, 5)):
                restaurant = (
                    f"{random.choice(restaurant_names).lower().replace(' ', '_')}"
                )

                if not key in meals:
                    meals[key] = [restaurant]
                else:
                    meals[key].append(restaurant)

                await db.query(
                    f"""
                    RELATE food:{key}->served_at->restaurant:{restaurant};
                    """
                )

        logger.info("inserting reviews")
        user_ids = list(users.keys())
        meal_ids = list(meals.keys())
        for _ in range(10000):
            user = random.choice(user_ids)
            food = random.choice(meal_ids)
            text, stars = random.choice(food_reviews)

            now = datetime.datetime.now()
            random_time = datetime.datetime.fromtimestamp(
                random.uniform(
                    (now - datetime.timedelta(days=365 * 5)).timestamp(),
                    now.timestamp(),
                )
            )
            await db.query(
                f"""
                RELATE user:{user}->reviewed->food:{food} CONTENT {{
                    text: '{text}',
                    stars: {stars},
                    created_at: '{random_time.isoformat()}',
                    restaurant: restaurant:{random.choice(meals[food])},
                }};
                """
            )


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
    )
    asyncio.run(main())
