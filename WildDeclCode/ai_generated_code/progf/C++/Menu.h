/* Citation and Sources...
Final Project Milestone 2
Module: Menu
Filename: Menu.h
Version 1.0
Author	Jasmin Aro
Revision History
-----------------------------------------------------------
Date        Reason
2024/11/21  
-----------------------------------------------------------
Most coding done by myself, with help Derived using common development resources in instances:
> adding a bool to output stream to fix '0-' from preceding a title or selection prompt
> unsigned int and size_t clarification
> operator functions - why access wasn't granted before i made operator<< outside the class
> clarification with casting -- static casting ints in Menu.cpp
> Menu destructor (auto&)
-----------------------------------------------------------*/

#ifndef SENECA_MENU_H
#define SENECA_MENU_H
#include <iostream>
#include "constants.h"
namespace seneca {
   class Menu;
   class MenuItem {
	   char* m_content = nullptr;
	   size_t m_indent = 0;
	   size_t m_indentSize = 0;
	   int m_rowNumber = 0;

	   void setEmpty();
	   bool isValid()const;
	   MenuItem();
	   MenuItem(const char* content, int indent, int indentSize, int rowNumber);
	   ~MenuItem();
	   MenuItem(const MenuItem&) = delete;
	   MenuItem& operator=(MenuItem&) = delete;
	   std::ostream& display() const;
	   std::ostream& display(std::ostream& ostr, bool isNotItem) const;
	   operator bool() const;
	   friend class Menu;
   };
   class Menu {
	   MenuItem m_title;
	   MenuItem m_exitOption;
	   MenuItem m_selPrompt;
	   size_t m_indentNum;
	   size_t m_indentSize;
	   size_t m_itemNum;
	   MenuItem* m_items[MaximumNumberOfMenuItems] = { nullptr };
   public:
	   Menu();
	   Menu(const char* title, const char* exitContent = "Exit", unsigned int indent = 0, unsigned int indentSize = 3);
	   Menu& operator<<(const char* menuItemContent);
	   ~Menu();
	   Menu(const Menu&) = delete;
	   Menu& operator=(const Menu&) = delete;
	   size_t select() const;
   };
   size_t operator<<(std::ostream& ostr, const Menu& menu);
}
#endif // !SENECA_MENU_H


