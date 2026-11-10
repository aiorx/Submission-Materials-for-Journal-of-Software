package com.example.expensermanager;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;
import android.util.Pair;
import android.widget.Toast;

import com.github.mikephil.charting.data.BarEntry;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {
    private Context context;
    //table expense_manager
    private static final String DB_NAME = "expenser_manager.db";
    private static final int DB_VERSION = 1;
    private static final String TABLE_NAME = "expense_manager";
    private static final String COLUMN_ID = "_id";
    private static final String COLUMN_CATEGORY = "category";
    private static final String COLUMN_DESCRIPTION = "description";
    private static final String COLUMN_AMOUNT = "amount";
    private static final String COLUMN_DATE = "date";
    private static final String COLUMN_IMAGE_PATH = "image_path";

    //table categories
    private static final String TABLE2_NAME = "category_table";
    private static final String COLUMN_ID_CATEGORY_TABLE = "id";
    private static final String COLUMN_CATEGORY_CATEGORY_TABLE = "category";
    private static final String COLUMN_COLOR_CATEGORY_TABLE = "color";

    // Table for user information (username and password) (sign_up and login)
    private static final String TABLE3_NAME = "user_information_table";
    private static final String COLUMN_ID_USER = "id";
    private static final String COLUMN_USERNAME = "username";
    private static final String COLUMN_PASSWORD = "password";

    //static queries for deleting database
    private static final String SQL_DELETE_ENTRIES =
            "DROP TABLE IF EXISTS " + TABLE_NAME;
    private static final String SQL_DELETE_ENTRIES_CATEGORY_TABLE =
            "DROP TABLE IF EXISTS " + TABLE2_NAME;
    private static final String SQL_DELETE_ENTRIES_USER_INFORMATION =
            "DROP TABLE IF EXISTS " + TABLE3_NAME;


    public DatabaseHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
        this.context = context;
    }

    @Override
    public void onCreate(SQLiteDatabase db) { // creates the tables

        String queryCreate = String.format("CREATE TABLE %s (%s INTEGER PRIMARY KEY AUTOINCREMENT, %s TEXT NOT NULL, %s TEXT, %s REAL NOT NULL, %s TEXT, %s TEXT);",
                TABLE_NAME, COLUMN_ID, COLUMN_CATEGORY, COLUMN_DESCRIPTION, COLUMN_AMOUNT, COLUMN_DATE, COLUMN_IMAGE_PATH);        //
        String queryCreateCategoryTable = String.format("CREATE TABLE %s (%s INTEGER PRIMARY KEY AUTOINCREMENT, %s TEXT NOT NULL, %s TEXT);", TABLE2_NAME, COLUMN_ID_CATEGORY_TABLE, COLUMN_CATEGORY_CATEGORY_TABLE, COLUMN_COLOR_CATEGORY_TABLE);

        // user information
        String queryCreateUsernameInformationTable = String.format("CREATE TABLE %s (%s INTEGER PRIMARY KEY AUTOINCREMENT, %s TEXT NOT NULL, %s TEXT NOT NULL);", TABLE3_NAME, COLUMN_ID_USER, COLUMN_USERNAME, COLUMN_PASSWORD);

        db.execSQL(queryCreate); //executing the query - create database
        db.execSQL(queryCreateCategoryTable);
        db.execSQL(queryCreateUsernameInformationTable);

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL(SQL_DELETE_ENTRIES);
        //if it is required to upgrade the database --> rebuild the database
        //updating: add column or row
        onCreate(db);
    }


    public void insertData(DatabaseHelper dbHelper, String category, String description, double amount, String date, String tableName, String imagePath) {

        //data repository gets in write mode
        SQLiteDatabase db = this.getWritableDatabase();

        //Create map of values - column names are the keys of the map elements
        ContentValues values = new ContentValues();
        values.put(COLUMN_CATEGORY, category);
        values.put(COLUMN_DESCRIPTION, description);
        values.put(String.valueOf(COLUMN_AMOUNT), amount);
        values.put(COLUMN_DATE, date);
        values.put(COLUMN_IMAGE_PATH, imagePath);


        //null if the ContentnValues map is empty - no insertion
        long newRowId = db.insert(tableName, null, values);

        //db.insert() returns -1 if the insertion has failed
        if (newRowId == -1) {
            Toast.makeText(context, "insertion failed", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(context, "Successfully Added!", Toast.LENGTH_SHORT).show();

        }
    }

    public void insertCategory(DatabaseHelper dbHelper, String categoryName, String color, String tableName) {

        //data repository gets in write mode
        SQLiteDatabase db = dbHelper.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put(COLUMN_CATEGORY_CATEGORY_TABLE, categoryName);
        values.put(COLUMN_COLOR_CATEGORY_TABLE, color);

        long newRowId = db.insert(tableName, null, values);
        if (newRowId == -1) {
            Toast.makeText(context, "insertion failed", Toast.LENGTH_SHORT);
        } else {
            Toast.makeText(context, "Successfully Added!", Toast.LENGTH_SHORT);
        }
    }

    public boolean insertUserData(String username, String password) {
        SQLiteDatabase db = this.getWritableDatabase();

        if (isUsernameExists(username)) {
            return false; // Username already exists
        } else {
            ContentValues values = new ContentValues();
            values.put(COLUMN_USERNAME, username);
            values.put(COLUMN_PASSWORD, password);

            long newRowId = db.insert(TABLE3_NAME, null, values);
            return newRowId != -1; // Return true if insertion is successful, false otherwise
        }
    }


    public void deleteData(DatabaseHelper dbHelper, String id, String tableName) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        String query = "DELETE FROM " + tableName + " WHERE _id=" + id; // SQL Query - deleting row via id
        db.execSQL(query);
    }


    public void updateData(String id, String description, String amount, String date, String imagePath, String tableName) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_DESCRIPTION, description);
        values.put(COLUMN_AMOUNT, amount);
        values.put(COLUMN_DATE, date);
        values.put(COLUMN_IMAGE_PATH, imagePath);
        db.update(tableName, values, "_id = ?", new String[]{id});
    }



    public Cursor filterDatabaseCategory(String filter){
        SQLiteDatabase db =  this.getReadableDatabase();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_CATEGORY + " = ?";
        return db.rawQuery(query, new String[]{filter});
    }


    Cursor readAllData(String tableName) {
        String query = "SELECT * FROM " + tableName;
        SQLiteDatabase db = this.getReadableDatabase();

        Cursor cursor = null;
        if (db != null) {
            cursor = db.rawQuery(query, null); //execute query
        }
        return cursor; //cursor contains all database data
    }


    //method Aided using common development resources
    public ArrayList<String> getAllCategories() {
        ArrayList<String> categories = new ArrayList<>();

        SQLiteDatabase db = this.getReadableDatabase();
        String query = "SELECT " + COLUMN_CATEGORY_CATEGORY_TABLE + " FROM " + TABLE2_NAME;

        Cursor cursor = db.rawQuery(query, null);
        if (cursor != null && cursor.moveToFirst()) {
            do {
                String category = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_CATEGORY_CATEGORY_TABLE));
                categories.add(category);
            } while (cursor.moveToNext());

            cursor.close();
        }
        return categories;
    }


    //calculate sum of each category
    public double totalAmountCategory(String category){
        SQLiteDatabase db = this.getReadableDatabase();

        String query = "SELECT SUM(" + COLUMN_AMOUNT + ") AS total_amount FROM " + TABLE_NAME + " WHERE " + COLUMN_CATEGORY + " = ?";
        Cursor cursor = db.rawQuery(query, new String[]{category});
        double total = 0;

        if(cursor != null){
            if(cursor.moveToFirst()){
                total = cursor.getDouble(cursor.getColumnIndexOrThrow("total_amount"));
            }
            cursor.close();
        }
        return total;
    }

    //calculate sum of all entries
    public double calculateTotal(){
        SQLiteDatabase db = this.getReadableDatabase();

        String query = "SELECT SUM(" + COLUMN_AMOUNT + ") AS total_amount FROM " + TABLE_NAME;
        Cursor cursor = db.rawQuery(query, null);
        double total = 0;

        if(cursor != null){
            if(cursor.moveToFirst()){
                total = cursor.getDouble(cursor.getColumnIndexOrThrow("total_amount"));
            }
            cursor.close();
        }
        return total;
    }


    // methode to validate user
    public boolean isUsernameExists(String username) {
        SQLiteDatabase db = this.getReadableDatabase();
        String query = "SELECT * FROM " + TABLE3_NAME + " WHERE " + COLUMN_USERNAME + " = ?";
        Cursor cursor = db.rawQuery(query, new String[]{username});
        boolean result = cursor.getCount() > 0;
        cursor.close();
        return result;
    }

    // methode to validate if password is correct
    public boolean isPasswordCorrect(String username, String password) {
        SQLiteDatabase db = this.getReadableDatabase();
        String query = "SELECT * FROM " + TABLE3_NAME + " WHERE " + COLUMN_USERNAME + " = ? AND " + COLUMN_PASSWORD + " = ?";
        Cursor cursor = db.rawQuery(query, new String[]{username, password});
        boolean result = cursor.getCount() > 0;
        cursor.close();
        return result;
    }


    // methode to get sum of bar entries as well as the category
    public Pair<List<BarEntry>, List<String>> getBarEntries() {
        List<BarEntry> barEntries = new ArrayList<>();
        List<String> categories = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        String query = "SELECT category, SUM(amount) as total_amount FROM " + TABLE_NAME + " GROUP BY category";

        Cursor cursor = db.rawQuery(query, null);
        if (cursor != null && cursor.moveToFirst()) {
            int index = 0;  // x-Achsenwert
            do {
                String category = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_CATEGORY));
                float totalAmount = cursor.getFloat(cursor.getColumnIndexOrThrow("total_amount"));
                barEntries.add(new BarEntry(index++, totalAmount));
                categories.add(category);
            } while (cursor.moveToNext());

            cursor.close();
        }
        return new Pair<>(barEntries, categories);
    }

    public ArrayList<String> getDates() {
        ArrayList<String> dates = new ArrayList<>();

        SQLiteDatabase db = this.getReadableDatabase();
        String query = "SELECT " + COLUMN_DATE + " FROM " + TABLE_NAME;

        Cursor cursor = db.rawQuery(query, null);
        if (cursor != null && cursor.moveToFirst()) {
            do {
                String date = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_DATE));
                dates.add(date);
            } while (cursor.moveToNext());

            cursor.close();
        }

        return dates;
    }
}
