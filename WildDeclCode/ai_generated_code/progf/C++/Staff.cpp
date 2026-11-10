#include "Staff.h"
#include <algorithm>
#include <locale> // for std::codecvt_utf8
#include <codecvt> // for std::wstring_convert

using namespace henn;
using namespace std;

Staff::Staff(std::string _name, RANK _rank) : rank(_rank)
{
	std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;// this is just Derived using common development resources and works
	name = converter.from_bytes(_name);
}

bool Staff::operator==(const Staff other) const
{
	if(name == other.GetName()/* && rank == other.GetRank()*/)
		return true;
	return false;
};

bool Staff::operator<(const Staff& other) const
{
	std::wstring aLowLetter = name;
	std::transform(aLowLetter.begin(), aLowLetter.end(), aLowLetter.begin(), towlower);

	std::wstring bLowLetter = other.GetName();
	std::transform(bLowLetter.begin(), bLowLetter.end(), bLowLetter.begin(), towlower);

	return (aLowLetter < bLowLetter);
};

std::string Staff::GetNameAsString() const 
{
	return std::wstring_convert<std::codecvt_utf8<wchar_t>>().to_bytes(name);
}

std::shared_ptr<char> Staff::GetNameAsSpChar() const
{
	auto name = GetName();
	auto *wcName = name.c_str();
	size_t wcNameSize = wcslen(wcName) * 2 + 2;
	shared_ptr<char> spcName(new char[wcNameSize], std::default_delete<char[]>());
	{
		size_t c_size;
		wcstombs_s(&c_size, spcName.get(), wcNameSize, wcName, wcNameSize);
	}
	//delete wcName;
	return spcName;

}

std::wstring Staff::GetRankLine()
{
	switch(rank)
	{
	case RANK::STAFF_SERGANT:
		return L"-";
	case RANK::SERGANT:
		return L"--";
	case RANK::CORPORAL:
		return L"---";
	case RANK::PRIVATE:
		return L"----";
	}

	return L"";
}

void Staff::SetRank(RANK _rank)
{
	rank = _rank;
}

StaffTopDownIterator::StaffTopDownIterator(henn::TreeModel<Staff> treeModel, bool _bOrderAlphabetical, bool _bShowStaffSergants,
	bool _bShowSergants, bool _bShowCorporals, bool _bShowPrivates) : m_bOrderAlphabetical{_bOrderAlphabetical }, m_bShowStaffSergants{ _bShowStaffSergants }, m_bShowSergants{ _bShowSergants },
	m_bShowCorporals{ _bShowCorporals }, m_bShowPrivates{ _bShowPrivates }, TopDownIterator{treeModel}
{
	if(m_bOrderAlphabetical) {
		m_tree.SortAllColumns();
	}
}

void StaffTopDownIterator::First()
{
	m_lCurrent = 0;
	for(; m_lCurrent < m_tree.Size(); m_lCurrent++)
	{
		if(show(m_lCurrent))
		{
			break;
		}
	}
}

void StaffTopDownIterator::Next()
{
	m_lCurrent++;
	for(; m_lCurrent < m_tree.Size(); m_lCurrent++)
	{
		if(show(m_lCurrent))
		{
			break;
		}
	}
}

bool StaffTopDownIterator::IsDone()
{
	if(m_lCurrent < m_tree.Size())
	{
		return !show(m_lCurrent);
	}

	return true;
}

bool StaffTopDownIterator::show(size_t lCurrent)
{
	if(!m_bShowStaffSergants || !m_bShowSergants || !m_bShowCorporals || !m_bShowPrivates)
	{
		auto staff = m_tree.Get(lCurrent);
		if(!m_bShowStaffSergants && staff.GetRank() == Staff::RANK::STAFF_SERGANT)
		{
			return false;
		}
		else if(!m_bShowSergants && staff.GetRank() == Staff::RANK::SERGANT)
		{
			return false;
		}
		else if(!m_bShowCorporals && staff.GetRank() == Staff::RANK::CORPORAL)
		{
			return false;
		}
		else if(!m_bShowPrivates && staff.GetRank() == Staff::RANK::PRIVATE)
		{
			return false;
		}
	}

	return true;
}


//////////////////////////////////////////////////////////////////
// Constructor of class
// @pram
//	_henn::TreeModel				data
//	_bOrderSecondColumn		order second column (bellow root) alphabetical
//	_bSecondOutput1Column	output staff of rank STAFF_SERGANT twice
//	_bSecondOutput2Column	output staff of rank SERGANT twice
StaffTopDownIterator2::StaffTopDownIterator2(henn::TreeModel<Staff> TreeModel, bool _bOrderSecondColumn, bool _bSecondOutput1Column, bool _bSecondOutput2Column) : m_bSecondOutput1Column(_bSecondOutput1Column), m_bSecondOutput2Column(_bSecondOutput2Column), TopDownIterator(TreeModel)
{
	if(_bOrderSecondColumn) {
		m_tree.SortSecondColumn();
	}
}

Staff StaffTopDownIterator2::CurrentItem()
{
	if(IsDone())
	{
		throw IteratorOutOfBounds("No valid state!");
	}

	if(m_bSecondOutput == 1)
	{
		return staffTmp;
	}
	else
	{
		return m_tree.Get(m_lCurrent);
	}
}

void StaffTopDownIterator2::Next()
{
	if(m_bSecondOutput1Column && m_bSecondOutput == false && m_tree.Get(m_lCurrent).GetRank() == Staff::RANK::STAFF_SERGANT)
	{
		staffTmp = Staff(m_tree.Get(m_lCurrent).GetName() + L" (second output)", m_tree.Get(m_lCurrent).GetRank());
		m_bSecondOutput = true;
	}
	else if(m_bSecondOutput2Column && m_bSecondOutput == false && m_tree.Get(m_lCurrent).GetRank() == Staff::RANK::SERGANT)
	{
		staffTmp = Staff(m_tree.Get(m_lCurrent).GetName() + L" (second output)", m_tree.Get(m_lCurrent).GetRank());
		m_bSecondOutput = true;
	}
	else
	{
		m_bSecondOutput = false;
		m_lCurrent++;
	}
}
