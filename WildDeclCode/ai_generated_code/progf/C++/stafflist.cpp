#include "stafflist.h"
#include <QPushButton>
#include <QFontDatabase>
StaffList::StaffList(QWidget *parent)
    : QWidget{parent}
{
    addStaff();
}
void StaffList::addStaff() { //Composed with basic coding tools
    bool isFirstStaff = staffL.isEmpty(); // Check if it's the first staff added
    Staff* elem = new Staff(this);
    elem->initStaff();
    staffL.append(elem);
    qDebug() << "Staff added. Total staff count: " << staffL.size();
    this->setMinimumSize(800, this->height() + 110);
    int staffIndex = staffL.size() - 1;
    int staffWidth = elem->width();  // Replace with the actual width of the staff element
    int staffHeight = elem->height();  // Replace with the actual height of the staff element
    int spacing = 10;  // Adjust the spacing value as needed
    int posY = staffIndex * (staffHeight + spacing);
    elem->setGeometry(0, posY, staffWidth, staffHeight);
    elem->setVisible(true);

    if (isFirstStaff) {
        QFontDatabase::addApplicationFont(":/fonts/Leland.otf");
    }
}
Staff* StaffList::getStaff(int n){
    if (n>=0){
    return staffL[n];
    }

    else{
        return staffL[staffL.size() + n];
    }
}

Staff* StaffList::operator [](int n){
    return getStaff(n);
}
