# this shit was Drafted using common development resources cus i couldn't be bothered

from django.core.management.base import BaseCommand
from catalog.models import Book, Author, BookGenre, BookInstance
from faker import Faker
import random
from django.db.utils import IntegrityError
from django.db.models.functions import Lower

class Command(BaseCommand):
    help = 'Seed the database with initial books data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database with books...')

        faker = Faker()

        # Create some genres if they don't exist
        genre_names = ['Fiction', 'Fantasy', 'Science Fiction', 'Mystery']
        genres = []
        for name in genre_names:
            try:
                genre, created = BookGenre.objects.get_or_create(name=name)
                genres.append(genre)
            except IntegrityError:
                genre = BookGenre.objects.get(name__iexact=name)
                genres.append(genre)

        # Create some authors
        authors = []
        for _ in range(10):
            first_name = faker.first_name()
            last_name = faker.last_name()
            author, created = Author.objects.get_or_create(
                first_name=first_name,
                last_name=last_name,
                defaults={
                    'date_of_birth': faker.date_of_birth(),
                    'date_of_death': faker.date_of_birth(minimum_age=40, maximum_age=100)
                }
            )
            authors.append(author)

        # Create some books
        for _ in range(20):
            author = faker.random_element(authors)
            book, created = Book.objects.get_or_create(
                title=faker.sentence(nb_words=4),
                author=author,
                summary=faker.text(max_nb_chars=300),
                isbn=faker.isbn13(),
                language=faker.language_name(),
            )
            # Assign genres to books
            book.genre.add(*faker.random_elements(genres, unique=True, length=2))

        # Create some book instances
        for book in Book.objects.all():
            for _ in range(random.randint(1, 5)):
                BookInstance.objects.create(
                    book=book,
                    imprint=faker.company(),
                    due_date=faker.date_this_year(),
                    status=random.choice(['M', 'O', 'A', 'R'])
                )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))

