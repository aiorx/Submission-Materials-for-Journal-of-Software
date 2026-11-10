# pragma once

#include "item.h"
#include <vector>
namespace JaneZ {
class ItemStructDecl : public Item {
public:
    std::string identifier;
    std::vector<ItemStructVariant> item_struct;

    //Start Aided with basic GitHub coding tools.
    ItemStructDecl(std::string _identifier, 
                    std::vector<ItemStructVariant> _item_struct) 
        : identifier(std::move(_identifier)), item_struct(std::move(_item_struct)) {}
    //End Aided with basic GitHub coding tools.

    ~ItemStructDecl() = default;

    void accept(ASTVisitor &visitor) override {
        visitor.visit(*this);
    }
};
}