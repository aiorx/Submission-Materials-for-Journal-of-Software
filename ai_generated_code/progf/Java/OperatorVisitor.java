package de.uni_passau.fim.se2.sa.readability.utils;

import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.expr.*;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

import java.util.HashMap;
import java.util.Map;

public class OperatorVisitor extends VoidVisitorAdapter<Void> {

    public enum OperatorType {
        ASSIGNMENT,         // x=y
        BINARY,             // x+y
        UNARY,              // -x, ++x
        CONDITIONAL,        // ?
        TYPE_COMPARISON,    // instanceof
    }

    /**
     * Maps operator types to the number of their occurrences in the given code snippet.
     */
    private final Map<OperatorType, Integer> operatorsPerMethod;

    public OperatorVisitor() {
        operatorsPerMethod = new HashMap<>();
    }

    public Map<OperatorType, Integer> getOperatorsPerMethod() {
        return operatorsPerMethod;
    }

    public int getNumberOfUniqueOperators() {
        return operatorsPerMethod.size();
    }

    public int getTotalNumberOfOperators() {
        return operatorsPerMethod.values()
                .stream()
                .mapToInt(Integer::intValue)
                .sum();
    }

    @Override
    public void visit(final FieldDeclaration n, final Void arg) {
        addOperator(OperatorType.ASSIGNMENT);
        super.visit(n, arg);
    }

    @Override
    public void visit(final VariableDeclarationExpr n, final Void arg) {
        addOperator(OperatorType.ASSIGNMENT);
        super.visit(n, arg);
    }

    // This part of the code is Assisted with basic coding tools.
    // Please refer to LLM/halstead_volume_feature.txt

    @Override
    public void visit(final AssignExpr n, final Void arg) {
        addOperator(OperatorType.ASSIGNMENT);
        super.visit(n, arg);
    }

    @Override
    public void visit(final BinaryExpr n, final Void arg) {
        addOperator(OperatorType.BINARY);
        super.visit(n, arg);
    }

    @Override
    public void visit(final UnaryExpr n, final Void arg) {
        addOperator(OperatorType.UNARY);
        super.visit(n, arg);
    }

    @Override
    public void visit(final ConditionalExpr n, final Void arg) {
        addOperator(OperatorType.CONDITIONAL);
        super.visit(n, arg);
    }

    @Override
    public void visit(final InstanceOfExpr n, final Void arg) {
        addOperator(OperatorType.TYPE_COMPARISON);
        super.visit(n, arg);
    }

    private void addOperator(OperatorType operatorType) {
        operatorsPerMethod.merge(operatorType, 1, Integer::sum);
    }
}
