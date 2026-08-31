import os
import re
import uuid
import bcrypt
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()

# Initialize MongoDB connection
uri = os.getenv("MONGODB_URI")
if not uri:
    raise ValueError("MONGODB_URI environment variable not set")

try:
    client = MongoClient(uri, server_api=ServerApi("1"))
    db = client["library_management_system"]
    student_collection = db["student"]
    librarian_collection = db["librarian"]
    book_collection = db["book"]

    # Ping the MongoDB server to verify connection
    client.admin.command("ping")
    print("MongoDB connection established successfully!")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    raise


# Input Validation Functions
def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_password(password: str) -> bool:
    """Validate password complexity"""
    return (
        len(password) >= 8
        and re.search(r"[A-Z]", password)
        and re.search(r"[a-z]", password)
        and re.search(r"[0-9]", password)
        and re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
    )


def validate_phone_number(phone: str) -> bool:
    """Validate phone number"""
    cleaned_phone = re.sub(r"\D", "", phone)
    return len(cleaned_phone) >= 10 and len(cleaned_phone) <= 15


def validate_id(id: str) -> bool:
    """Validate ID"""
    return id.isdigit() and len(id) > 0


def validate_book_name(name: str) -> bool:
    """Validate book name"""
    return bool(name.strip())


def validate_author(author: str) -> bool:
    """Validate author name"""
    return bool(author.strip())


def validate_price(price: str) -> bool:
    """Validate book price"""
    try:
        price_val = float(price)
        return price_val >= 0
    except ValueError:
        return False


def validate_quantity(quantity: str) -> bool:
    """Validate book quantity"""
    try:
        quantity_val = int(quantity)
        return 0 <= quantity_val <= 1000
    except ValueError:
        return False


def validate_publication_date(date_str: str) -> bool:
    """Validate publication date"""
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        today = datetime.now().date()
        return date_obj <= today and date_obj >= today - timedelta(days=365 * 200)
    except ValueError:
        return False


# Authentication Routes
@app.route("/api/student/register", methods=["POST"])
def register_student():
    try:
        data = request.json

        # Validate required fields
        if not all(
            key in data
            for key in ["student_id", "username", "email", "password", "phone_num"]
        ):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        # Validate data format
        if not validate_id(data["student_id"]):
            return jsonify({"success": False, "message": "Invalid student ID"}), 400

        if not data["username"].strip():
            return (
                jsonify({"success": False, "message": "Username cannot be empty"}),
                400,
            )

        if not validate_email(data["email"]):
            return jsonify({"success": False, "message": "Invalid email format"}), 400

        if not validate_password(data["password"]):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Password does not meet complexity requirements",
                    }
                ),
                400,
            )

        if not validate_phone_number(data["phone_num"]):
            return jsonify({"success": False, "message": "Invalid phone number"}), 400

        # Check for existing email or ID
        if student_collection.find_one({"email": data["email"]}):
            return (
                jsonify({"success": False, "message": "Email already registered"}),
                400,
            )

        if student_collection.find_one({"student_id": data["student_id"]}):
            return (
                jsonify({"success": False, "message": "Student ID already registered"}),
                400,
            )

        # Hash password
        hashed_password = bcrypt.hashpw(
            data["password"].encode("utf-8"), bcrypt.gensalt()
        )

        # Prepare user data
        user_data = {
            "student_id": data["student_id"],
            "username": data["username"],
            "email": data["email"],
            "password": hashed_password,
            "phone_num": data["phone_num"],
            "created_at": datetime.now(timezone.utc),
        }

        # Insert user
        result = student_collection.insert_one(user_data)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Student registration successful",
                    "user_id": str(result.inserted_id),
                }
            ),
            201,
        )

    except Exception as e:
        print(f"Error in student registration: {e}")
        return jsonify({"success": False, "message": "Registration failed"}), 500


@app.route("/api/librarian/register", methods=["POST"])
def register_librarian():
    try:
        data = request.json

        # Validate required fields
        if not all(
            key in data
            for key in ["librarian_id", "username", "email", "password", "phone_num"]
        ):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        # Validate data format
        if not validate_id(data["librarian_id"]):
            return jsonify({"success": False, "message": "Invalid librarian ID"}), 400

        if not data["username"].strip():
            return (
                jsonify({"success": False, "message": "Username cannot be empty"}),
                400,
            )

        if not validate_email(data["email"]):
            return jsonify({"success": False, "message": "Invalid email format"}), 400

        if not validate_password(data["password"]):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Password does not meet complexity requirements",
                    }
                ),
                400,
            )

        if not validate_phone_number(data["phone_num"]):
            return jsonify({"success": False, "message": "Invalid phone number"}), 400

        # Check for existing email or ID
        if librarian_collection.find_one({"email": data["email"]}):
            return (
                jsonify({"success": False, "message": "Email already registered"}),
                400,
            )

        if librarian_collection.find_one({"librarian_id": data["librarian_id"]}):
            return (
                jsonify(
                    {"success": False, "message": "Librarian ID already registered"}
                ),
                400,
            )

        # Hash password
        hashed_password = bcrypt.hashpw(
            data["password"].encode("utf-8"), bcrypt.gensalt()
        )

        # Prepare user data
        user_data = {
            "librarian_id": data["librarian_id"],
            "username": data["username"],
            "email": data["email"],
            "password": hashed_password,
            "phone_num": data["phone_num"],
            "created_at": datetime.now(timezone.utc),
        }

        # Insert user
        result = librarian_collection.insert_one(user_data)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Librarian registration successful",
                    "user_id": str(result.inserted_id),
                }
            ),
            201,
        )

    except Exception as e:
        print(f"Error in librarian registration: {e}")
        return jsonify({"success": False, "message": "Registration failed"}), 500


@app.route("/api/student/login", methods=["POST"])
def login_student():
    try:
        data = request.json

        if not all(key in data for key in ["email", "password"]):
            return (
                jsonify({"success": False, "message": "Missing email or password"}),
                400,
            )

        user = student_collection.find_one({"email": data["email"]})

        if not user or not bcrypt.checkpw(
            data["password"].encode("utf-8"), user["password"]
        ):
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Remove password from user data before sending to client
        user_data = {key: value for key, value in user.items() if key != "password"}
        user_data["_id"] = str(user_data["_id"])  # Convert ObjectId to string

        return (
            jsonify(
                {"success": True, "message": "Login successful", "user": user_data}
            ),
            200,
        )

    except Exception as e:
        print(f"Error in student login: {e}")
        return jsonify({"success": False, "message": "Login failed"}), 500


@app.route("/api/librarian/login", methods=["POST"])
def login_librarian():
    try:
        data = request.json

        if not all(key in data for key in ["email", "password"]):
            return (
                jsonify({"success": False, "message": "Missing email or password"}),
                400,
            )

        user = librarian_collection.find_one({"email": data["email"]})

        if not user or not bcrypt.checkpw(
            data["password"].encode("utf-8"), user["password"]
        ):
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Remove password from user data before sending to client
        user_data = {key: value for key, value in user.items() if key != "password"}
        user_data["_id"] = str(user_data["_id"])  # Convert ObjectId to string

        return (
            jsonify(
                {"success": True, "message": "Login successful", "user": user_data}
            ),
            200,
        )

    except Exception as e:
        print(f"Error in librarian login: {e}")
        return jsonify({"success": False, "message": "Login failed"}), 500


@app.route("/api/student/reset-password", methods=["POST"])
def reset_student_password():
    try:
        data = request.json

        if not all(
            key in data for key in ["email", "current_password", "new_password"]
        ):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        if not validate_password(data["new_password"]):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "New password does not meet complexity requirements",
                    }
                ),
                400,
            )

        user = student_collection.find_one({"email": data["email"]})

        if not user:
            return jsonify({"success": False, "message": "Email not found"}), 404

        if not bcrypt.checkpw(
            data["current_password"].encode("utf-8"), user["password"]
        ):
            return (
                jsonify({"success": False, "message": "Current password is incorrect"}),
                401,
            )

        # Hash new password
        new_hashed_password = bcrypt.hashpw(
            data["new_password"].encode("utf-8"), bcrypt.gensalt()
        )

        # Update password
        student_collection.update_one(
            {"email": data["email"]},
            {
                "$set": {
                    "password": new_hashed_password,
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )

        return jsonify({"success": True, "message": "Password reset successful"}), 200

    except Exception as e:
        print(f"Error in student password reset: {e}")
        return jsonify({"success": False, "message": "Password reset failed"}), 500


@app.route("/api/librarian/reset-password", methods=["POST"])
def reset_librarian_password():
    try:
        data = request.json

        if not all(
            key in data for key in ["email", "current_password", "new_password"]
        ):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        if not validate_password(data["new_password"]):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "New password does not meet complexity requirements",
                    }
                ),
                400,
            )

        user = librarian_collection.find_one({"email": data["email"]})

        if not user:
            return jsonify({"success": False, "message": "Email not found"}), 404

        if not bcrypt.checkpw(
            data["current_password"].encode("utf-8"), user["password"]
        ):
            return (
                jsonify({"success": False, "message": "Current password is incorrect"}),
                401,
            )

        # Hash new password
        new_hashed_password = bcrypt.hashpw(
            data["new_password"].encode("utf-8"), bcrypt.gensalt()
        )

        # Update password
        librarian_collection.update_one(
            {"email": data["email"]},
            {
                "$set": {
                    "password": new_hashed_password,
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )

        return jsonify({"success": True, "message": "Password reset successful"}), 200

    except Exception as e:
        print(f"Error in librarian password reset: {e}")
        return jsonify({"success": False, "message": "Password reset failed"}), 500


# Book Management Routes
@app.route("/api/books", methods=["GET"])
def get_all_books():
    try:
        books = list(book_collection.find())

        # Convert ObjectId to string for JSON serialization
        for book in books:
            book["_id"] = str(book["_id"])

        return jsonify({"success": True, "books": books}), 200

    except Exception as e:
        print(f"Error fetching books: {e}")
        return jsonify({"success": False, "message": "Failed to fetch books"}), 500


@app.route("/api/books/search", methods=["GET"])
def search_books():
    try:
        query = request.args.get("query", "")

        if not query:
            return (
                jsonify({"success": False, "message": "Search query is required"}),
                400,
            )

        books = list(
            book_collection.find(
                {
                    "$or": [
                        {"book_name": {"$regex": query, "$options": "i"}},
                        {"author": {"$regex": query, "$options": "i"}},
                    ]
                }
            )
        )

        # Convert ObjectId to string for JSON serialization
        for book in books:
            book["_id"] = str(book["_id"])

        return jsonify({"success": True, "books": books}), 200

    except Exception as e:
        print(f"Error searching books: {e}")
        return jsonify({"success": False, "message": "Search failed"}), 500


@app.route("/api/books/<book_id>", methods=["GET"])
def get_book(book_id):
    try:
        book = book_collection.find_one({"book_id": book_id})

        if not book:
            return jsonify({"success": False, "message": "Book not found"}), 404

        book["_id"] = str(book["_id"])  # Convert ObjectId to string

        return jsonify({"success": True, "book": book}), 200

    except Exception as e:
        print(f"Error fetching book: {e}")
        return jsonify({"success": False, "message": "Failed to fetch book"}), 500


@app.route("/api/books", methods=["POST"])
def add_book():
    try:
        data = request.json

        # Validate required fields
        required_fields = [
            "book_name",
            "author",
            "price",
            "quantity",
            "publication",
            "publication_date",
        ]
        if not all(key in data for key in required_fields):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        # Validate data format
        if not validate_book_name(data["book_name"]):
            return jsonify({"success": False, "message": "Invalid book name"}), 400

        if not validate_author(data["author"]):
            return jsonify({"success": False, "message": "Invalid author name"}), 400

        if not validate_price(str(data["price"])):
            return jsonify({"success": False, "message": "Invalid price"}), 400

        if not validate_quantity(str(data["quantity"])):
            return jsonify({"success": False, "message": "Invalid quantity"}), 400

        if not data["publication"].strip():
            return (
                jsonify({"success": False, "message": "Publication cannot be empty"}),
                400,
            )

        if not validate_publication_date(data["publication_date"]):
            return (
                jsonify({"success": False, "message": "Invalid publication date"}),
                400,
            )

        # Generate unique book ID
        book_id = str(uuid.uuid4())[:8]

        # Prepare book data
        book_data = {
            "book_id": book_id,
            "book_name": data["book_name"],
            "author": data["author"],
            "price": float(data["price"]),
            "quantity": int(data["quantity"]),
            "publication": data["publication"],
            "publication_date": data["publication_date"],
            "created_at": datetime.now(timezone.utc),
            "issued_to": [],  # Initialize empty issued list
        }

        # Insert book
        result = book_collection.insert_one(book_data)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Book added successfully",
                    "book_id": book_id,
                }
            ),
            201,
        )

    except Exception as e:
        print(f"Error adding book: {e}")
        return jsonify({"success": False, "message": "Failed to add book"}), 500


@app.route("/api/books/<book_id>", methods=["PUT"])
def update_book(book_id):
    try:
        data = request.json

        # Check if book exists
        book = book_collection.find_one({"book_id": book_id})
        if not book:
            return jsonify({"success": False, "message": "Book not found"}), 404

        # Prepare update data
        update_data = {}

        if "book_name" in data and validate_book_name(data["book_name"]):
            update_data["book_name"] = data["book_name"]

        if "author" in data and validate_author(data["author"]):
            update_data["author"] = data["author"]

        if "price" in data and validate_price(str(data["price"])):
            update_data["price"] = float(data["price"])

        if "quantity" in data and validate_quantity(str(data["quantity"])):
            update_data["quantity"] = int(data["quantity"])

        if "publication" in data and data["publication"].strip():
            update_data["publication"] = data["publication"]

        if "publication_date" in data and validate_publication_date(
            data["publication_date"]
        ):
            update_data["publication_date"] = data["publication_date"]

        if not update_data:
            return (
                jsonify({"success": False, "message": "No valid fields to update"}),
                400,
            )

        # Add update timestamp
        update_data["updated_at"] = datetime.now(timezone.utc)

        # Update book
        book_collection.update_one({"book_id": book_id}, {"$set": update_data})

        return jsonify({"success": True, "message": "Book updated successfully"}), 200

    except Exception as e:
        print(f"Error updating book: {e}")
        return jsonify({"success": False, "message": "Failed to update book"}), 500


@app.route("/api/books/<book_id>", methods=["DELETE"])
def remove_book(book_id):
    try:
        # Check if book exists
        book = book_collection.find_one({"book_id": book_id})
        if not book:
            return jsonify({"success": False, "message": "Book not found"}), 404

        # Check if book is issued
        if book.get("issued_to") and len(book["issued_to"]) > 0:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Cannot remove book as it is currently issued to students",
                    }
                ),
                400,
            )

        # Remove book
        book_collection.delete_one({"book_id": book_id})

        return jsonify({"success": True, "message": "Book removed successfully"}), 200

    except Exception as e:
        print(f"Error removing book: {e}")
        return jsonify({"success": False, "message": "Failed to remove book"}), 500


@app.route("/api/books/<book_id>/issue", methods=["POST"])
def issue_book(book_id):
    try:
        data = request.json

        # Validate required fields
        if not all(key in data for key in ["student_id", "username", "return_date"]):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        # Check if book exists and is available
        book = book_collection.find_one({"book_id": book_id})
        if not book:
            return jsonify({"success": False, "message": "Book not found"}), 404

        if book["quantity"] <= 0:
            return jsonify({"success": False, "message": "Book is not available"}), 400

        # Check if student exists
        student = student_collection.find_one(
            {"student_id": data["student_id"], "username": data["username"]}
        )
        if not student:
            return (
                jsonify({"success": False, "message": "Invalid student credentials"}),
                400,
            )

        # Check if book is already issued to this student
        for issue in book.get("issued_to", []):
            if issue["student_id"] == data["student_id"]:
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": "Book already issued to this student",
                        }
                    ),
                    400,
                )

        # Validate return date
        if not validate_publication_date(data["return_date"]):
            return jsonify({"success": False, "message": "Invalid return date"}), 400

        # Get current date
        issue_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        # Issue book
        book_collection.update_one(
            {"book_id": book_id},
            {
                "$inc": {"quantity": -1},
                "$push": {
                    "issued_to": {
                        "student_id": data["student_id"],
                        "username": data["username"],
                        "issue_date": issue_date,
                        "return_date": data["return_date"],
                    }
                },
            },
        )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Book issued successfully",
                    "issue_date": issue_date,
                    "return_date": data["return_date"],
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Error issuing book: {e}")
        return jsonify({"success": False, "message": "Failed to issue book"}), 500


@app.route("/api/books/<book_id>/return", methods=["POST"])
def return_book(book_id):
    try:
        data = request.json

        # Validate required fields
        if not all(key in data for key in ["student_id", "username"]):
            return (
                jsonify({"success": False, "message": "Missing required fields"}),
                400,
            )

        # Check if book exists
        book = book_collection.find_one(
            {
                "book_id": book_id,
                "issued_to.student_id": data["student_id"],
                "issued_to.username": data["username"],
            }
        )
        if not book:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "No issued record found for this book and student",
                    }
                ),
                404,
            )

        # Return book
        book_collection.update_one(
            {"book_id": book_id},
            {
                "$inc": {"quantity": 1},
                "$pull": {
                    "issued_to": {
                        "student_id": data["student_id"],
                        "username": data["username"],
                    }
                },
            },
        )

        return jsonify({"success": True, "message": "Book returned successfully"}), 200

    except Exception as e:
        print(f"Error returning book: {e}")
        return jsonify({"success": False, "message": "Failed to return book"}), 500


@app.route("/api/books/issued", methods=["GET"])
def get_all_issued_books():
    try:
        # Find all books with at least one entry in issued_to array
        issued_books = list(
            book_collection.find({"issued_to": {"$exists": True, "$ne": []}})
        )

        # Convert ObjectId to string for JSON serialization
        for book in issued_books:
            book["_id"] = str(book["_id"])

        return jsonify({"success": True, "books": issued_books}), 200

    except Exception as e:
        print(f"Error fetching issued books: {e}")
        return (
            jsonify({"success": False, "message": "Failed to fetch issued books"}),
            500,
        )


@app.route("/api/students/<student_id>/issued-books", methods=["GET"])
def get_student_issued_books(student_id):
    try:
        # Find books issued to this student
        books = list(book_collection.find({"issued_to.student_id": student_id}))

        issued_books = []
        for book in books:
            book["_id"] = str(book["_id"])

            # Get issue record for this student
            issue_record = next(
                (
                    issue
                    for issue in book["issued_to"]
                    if issue["student_id"] == student_id
                ),
                None,
            )

            if issue_record:
                # Create a simplified record with book and issue details
                issued_book = {
                    "book_id": book["book_id"],
                    "book_name": book["book_name"],
                    "author": book["author"],
                    "issue_date": issue_record["issue_date"],
                    "return_date": issue_record["return_date"],
                }
                issued_books.append(issued_book)

        return jsonify({"success": True, "books": issued_books}), 200

    except Exception as e:
        print(f"Error fetching student's issued books: {e}")
        return (
            jsonify({"success": False, "message": "Failed to fetch issued books"}),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True)
# Supported via standard GitHub programming aids
