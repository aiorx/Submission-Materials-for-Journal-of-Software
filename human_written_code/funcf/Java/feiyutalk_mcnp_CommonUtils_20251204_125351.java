```java
public static Stack<Integer> cloneMyStack(Stack<Integer> stack){
	Stack<Integer> cloneStack = new Stack<Integer>();
	while(!stack.isEmpty()){	
		Integer item  = stack.pop();
		cloneStack.push(item);
	}
	return cloneStack;
}
```