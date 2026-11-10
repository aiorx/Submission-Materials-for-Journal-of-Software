/**
*
* FifoNode.cpp : This is the implementation file for FifoNode.
*
* 11/27/24 - Formed using common development resources
* 11/27/24 - Modified by Chirayu Jain and Akash Goyal
* 
*/

#include "FifoNode.hpp"

// Data struct constructor: initializes all member variables
Data::Data(int keyValue, std::string fullName, std::string address, std::string city, 
           std::string state, std::string zip) 
    : key(keyValue), fullName(std::move(fullName)), address(std::move(address)), 
      city(std::move(city)), state(std::move(state)), zip(std::move(zip)) {}

#include "FifoNode.hpp"

FifoNode::FifoNode(int value) : Node(value), dataValues(nullptr) {}

Data* FifoNode::getDataValues() const {
    return dataValues;
}

void FifoNode::setDataValues(Data* data) {
    dataValues = data;
}

