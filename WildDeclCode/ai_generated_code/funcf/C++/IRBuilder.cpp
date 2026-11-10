void IRBuilder::visitForStmtNode(ASTForStmtNode *node)
{
    //this 4 auto were surprisingly formed Assisted using common GitHub development aids
    auto cond = new IRSuiteNode("__for.cond" + std::to_string(counter["for.cond"]++));
    currentFunction->blocks.push_back(cond);

    auto body = new IRSuiteNode("__for.body" + std::to_string(counter["for.body"]++));
    currentFunction->blocks.push_back(body);

    auto step = new IRSuiteNode("__for.step" + std::to_string(counter["for.step"]++));
    currentFunction->blocks.push_back(step);

    auto end = new IRSuiteNode("__for.end" + std::to_string(counter["for.end"]++));
    currentFunction->blocks.push_back(end);

    if (node->init) visit(node->init);
    currentBlock->stmts.push_back(new IRBrStmtNode(cond->label));
    currentBlock = cond;

    if (!node->cond) cond->stmts.push_back(new IRBrStmtNode(body->label));
    else
    {
        visit(node->cond);
        auto condVar = setVariable(turnIRType(&(node->cond->type)), ast2value[node->cond]);//auto condVar = setVariable(&int1Type, ast2value[node->cond]);
        setCondition(condVar, body, end);
    }

    currentBlock = body;
    auto nextBlockCopy = nextBlock, endBlockCopy = endBlock;
    nextBlock = step, endBlock = end;
    visit(node->block);
    currentBlock->stmts.push_back(new IRBrStmtNode(step->label));
    nextBlock = nextBlockCopy, endBlock = endBlockCopy;

    currentBlock = step;
    if (node->step) visit(node->step);
    currentBlock->stmts.push_back(new IRBrStmtNode(cond->label));
    currentBlock = end;
}