#include "Project.h"
#include <sys/stat.h>
#include "OpenXLSX.hpp"
#include "../controller/Analysis/Project/ProjectTool.h"
// Assisted with basic coding tools
void splitComma(string& str, vector<string>& vect) {
    stringstream ss(str);
    std::string s;
    while (!ss.eof()) {
        std::string s;
        if (std::getline(ss, s, ',')) {
            // Remove leading and trailing whitespace from the extracted string
            size_t start = s.find_first_not_of(' ');
            size_t end = s.find_last_not_of(' ');
            if (start != std::string::npos && end != std::string::npos) {
                vect.push_back(s.substr(start, end - start + 1));
            }
        }
    }
}


void processDependenciesStr(const XLCell& cell, vector<string>& dependencies) {
    if (cell.value().typeAsString() == "double") {
        auto strValue = to_string(cell.value().get<double>());
        strValue.empty() ? strValue = "EMPTY" : strValue = strValue;
        dependencies.push_back(strValue);
    } else if (cell.value().typeAsString() == "integer") {
        auto strValue = to_string(cell.value().get<int>());
        strValue.empty() ? strValue = "EMPTY" : strValue = strValue;
        dependencies.push_back(strValue);
    } else if (cell.value().typeAsString() == "string"){
        auto strValue = cell.value().get<string>();
        strValue.empty() ? strValue = "EMPTY" : strValue = strValue;
        dependencies.push_back(strValue);
    } else {
        auto strValue = cell.value().get<string>();
        strValue.empty() ? strValue = "EMPTY" : strValue = strValue;
        dependencies.push_back(strValue);
    }
}

string processName(const XLCell& cell) {
    auto value = cell.value().get<string>();
    if (value.empty()) {
        throw logic_error("Not valid taskName");
    }
    return value;
}


 double processDouble(const XLCell& cell) {
    if (cell.value().typeAsString() == "double") {
        return cell.value().get<double>();
    } else if (cell.value().typeAsString() == "integer") {
        return (double) cell.value().get<int>();
    } else {
        throw logic_error("Error with numerical input");
    }
}

Project::Project() {
    this->name = "";
    this->ECT = 0;
}

Project::Project(std::string name) {
    this->name = name;
    this->ECT = 0;
}

shared_ptr<Task> Project::findTask(std::string taskName) {
    for (auto element: input) {
        if (element->getName() == taskName) {
            return element;
        }
    }
    return nullptr;
}

void Project::addDependecies(vector<string>& dependencies) {
    for (int i = 0; i < input.size(); i++) {
        vector<string> currDependency;
        splitComma(dependencies[i], currDependency);
        for (const auto& subStr: currDependency) {
            if (subStr == "EMPTY") continue;
            auto dependentTask = findTask(subStr);
            if (dependentTask) {
                input[i]->addParentNode(dependentTask);
            }
        }
    }
}


int Project::loadExcelFiles(string path) {
    try {
        XLDocument doc = XLDocument(path);
        auto wb = doc.workbook();
        int16_t index = 1;
        auto name = wb.sheet(index).name();
        auto currSheet = wb.worksheet(name);
        auto rowCount = currSheet.rowCount();
        vector<string> dependenciesArr;

        while (index <= wb.sheetCount() ) {

            int subIndex = 2;
            while (subIndex <= rowCount) {
                string taskName = processName(currSheet.cell("A"+ to_string(subIndex)));
                auto duration = processDouble(currSheet.cell("B" + to_string(subIndex)));
                auto cost = processDouble(currSheet.cell("C" + to_string(subIndex)));
                processDependenciesStr(currSheet.cell("D" + to_string(subIndex)), dependenciesArr);
                shared_ptr<Task> newTask (new Task(duration, cost, taskName, vector< shared_ptr<Task> >()));
                input.push_back(newTask);
                subIndex++;
            }
            index++;
            addDependecies(dependenciesArr);
            dependenciesArr.clear();
        }
        doc.close();

    } catch (exception& e) {
        throw logic_error("Unable To Load File");
    }
}


void Project::loadProjectHelper(string pathname) {
    struct stat fileInfo{};
    if(stat(pathname.c_str(), &fileInfo) == 0) {
        if(S_ISREG(fileInfo.st_mode)) {
            loadExcelFiles(pathname);
        }
    } else {
        throw logic_error("NOT VALID FILE");
    }
}

const vector<shared_ptr<Task>> &Project::getInput() const {
    return input;
}

void Project::performAnalysis() {
    shared_ptr<ProjectTool> projectTool(new ProjectTool(input));
    auto analysis = projectTool->getAnalysis();
    ECT = analysis->ECT;
    criticalPath = analysis->criticalPath;
    bfsGraph = analysis->bfsMatrix;
}

