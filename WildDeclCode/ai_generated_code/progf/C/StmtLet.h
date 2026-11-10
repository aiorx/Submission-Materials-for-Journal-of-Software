# pragma once

#include "StmtExpr.h"
#include "statement.h"
#include <memory>

namespace JaneZ {
class Pattern;
class Type;
class Expression;
class StmtLet : public Statement {
public:
    std::shared_ptr<Pattern> PatternNoTopAlt;
    std::shared_ptr<ASTNode> type;
    std::shared_ptr<Expression> expression;

    //Start Aided with basic GitHub coding tools.
    StmtLet(std::shared_ptr<Pattern> patternNoTopAlt, std::shared_ptr<ASTNode> type, std::shared_ptr<Expression> expression)
        : PatternNoTopAlt(std::move(patternNoTopAlt)), type(std::move(type)), expression(std::move(expression)) {}
    //End Aided with basic GitHub coding tools.

    ~StmtLet() = default;

    void accept(ASTVisitor &visitor) override {
        visitor.visit(*this);
    }
};
}