```java
private static void printMethodInfo(MemberInfo methodInfo, ConstantPool constantPool) {
    ConstantUtf8 methodName = (ConstantUtf8) constantPool.cpInfo[methodInfo.nameIndex];
    ConstantUtf8 methodDesc = (ConstantUtf8) constantPool.cpInfo[methodInfo.descriptorIndex];
    System.out.print("method:" + methodName.value + ", ");
    System.out.print("desc:" + methodDesc.value + "\n");
    for (AttributeInfo attributeInfo : methodInfo.attributes) {
        if (attributeInfo instanceof CodeAttribute) {
            CodeAttribute codeAttribute = (CodeAttribute) attributeInfo;
            InstructionTable.printInstruction(codeAttribute.code);
        }
    }
    System.out.print("\n");
}
```