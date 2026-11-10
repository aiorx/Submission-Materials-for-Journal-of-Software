// Logic Adapted from standard coding samples
#include <iostream>
using namespace std;

int main() 
{
    int startHour, startMinute, endHour, endMinute;
    cin >> startHour >> startMinute >> endHour >> endMinute;

    if(startHour == endHour && startMinute == endMinute)
    {
        cout << "O JOGO DUROU 24 HORA(S) E 0 MINUTO(S)" << endl;
    }
    else
    {
        int totalStartMinutes = startHour * 60 + startMinute;
        int totalEndMinutes = endHour * 60 + endMinute;

        int duration = (totalEndMinutes - totalStartMinutes + 1440) % 1440;

        int hours = duration / 60;
        int minutes = duration % 60;

        cout << "O JOGO DUROU " << hours << " HORA(S) E " << minutes << " MINUTO(S)" << endl;
    }

    return 0;
}
