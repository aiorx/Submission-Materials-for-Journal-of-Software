#include <iostream>
#include <fstream>
#include <string>

using namespace std;
int currentYear = 2023;


// this code was Assisted with basic coding tools
// it was modified to suit our case
const int daysInMonth[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

int getDaysInMonth(int year, int month)
{

    // Adjust February for leap years
    if (month == 2)
    {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
        {
            return 29; // Leap year
        }
        else
        {
            return 28; // Non-leap year
        }
    }

    return daysInMonth[month];
}

void generateSalesCosts(int startYear, int startMonth, int startDay, int ID)
{
    // string filePath = to_string(ID) + "salesCosts.csv";
    string filePath = "Data/salesCosts/" + to_string(ID) + "salesCosts.csv";
    
    ofstream outputFile(filePath);
    outputFile << "year,month,day,sales1,sales2,sales3,sales4,sales5,rent, employeePayment, electricity, gaz, vegetables, meats, otherIngredients, publicity" << endl;

    for (int year = startYear; year <= currentYear; ++year)
    {

        for (int month = (year == startYear) ? startMonth : 1; month <= 12; ++month)
        {
            double rent = rand() % 100000;
            while (rent < 40000)
                rent  = rent*2+10;
            double dailyRent = rent / getDaysInMonth(year, month);
            for (int day = (year == startYear && month == startMonth) ? startDay : 1; day <= getDaysInMonth(year, month); ++day)
            {
                // Generate random sales and costs data for each day (you can replace this with your own logic)
                double sales[5];
                for (int i = 0; i < 5; ++i)
                {
                    sales[i] = rand() % 100000 + 1; // Random sales between 1 and 1000
                }
                double publicityCosts = rand() % 50000 + 1;
                while (publicityCosts < 1000)
                    publicityCosts = publicityCosts *2+10;

                double employeePayment = rand() % 5000;
                while (employeePayment < 500)
                    employeePayment = employeePayment*2+10;

                double electricity = rand() % 5000;
                while (electricity < 1000)
                    electricity = electricity*2+10;

                double gaz = rand() % 5000;
                while (gaz < 1000)
                    gaz = gaz*2+10;

                double vegetables = rand() % 10000;
                while (vegetables < 5000)
                    vegetables = vegetables*2+10;

                double meats = rand() % 100000;
                while (meats < 10000)
                    meats = meats*2+10;

                double ingredients = rand() % 50000;
                while (ingredients < 10000)
                    ingredients = ingredients*2+10;

                // Write data to the CSV file
                outputFile << year << "," << month << "," << day << ","
                           << sales[0] << "," << sales[1] << "," << sales[2] << "," << sales[3] << "," << sales[4] << "," << dailyRent << ","
                           << employeePayment << "," << electricity << "," << gaz << "," << vegetables << "," << meats << "," << ingredients << "," << publicityCosts << std::endl;
            }
        }
    }
}