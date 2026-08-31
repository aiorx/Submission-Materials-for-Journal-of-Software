```java
public StatementNode visitStmt(FileScriptParser.StmtContext ctx) {
    if (ctx.assign() != null) {
        return (StatementNode) ctx.assign().accept(this);
    } else if (ctx.if_() != null) {
        return (StatementNode) ctx.if_().accept(this);
    } else if (ctx.while_() != null) {
        return (StatementNode) ctx.while_().accept(this);
    } else if (ctx.fnCall() != null) {
        return (StatementNode) ctx.fnCall().accept(this);
    }
    return null;
}
```

```java
boolean hasElse = ctx.ELSE() != null;
int thenEnd = hasElse ? ctx.ELSE().getSymbol().getTokenIndex() : ctx.getStop().getTokenIndex();

for (FileScriptParser.StmtContext s : ctx.stmt()) {
    if (s.getStart().getTokenIndex() < thenEnd) {
        then.add((StatementNode) s.accept(this));
    } else {
        else_.add((StatementNode) s.accept(this));
    }
}
```

```java
private ExpressionNode buildBinExp(ParserRuleContext ctx, List<? extends ParserRuleContext> operands) {
    ExpressionNode left = (ExpressionNode) operands.get(0).accept(this);
    for (int i = 1; i < operands.size(); i++) {
        left = new BinExp(left, ctx.getChild(2 * i - 1).getText(), (ExpressionNode) operands.get(i).accept(this));
    }
    return left;
}
```