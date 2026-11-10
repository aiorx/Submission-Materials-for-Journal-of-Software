package day16.GenericsFunctionalInterfacesOverview;

public class Generics_overview {
	
	/*
	 * Review of 11.1 -11.8
	 */
	/*
		11.1 Introducing Generics

	 */
	
	/*
	 	11.2 Generic Types and Parameterized Types
	 We first introduce the basic terminology and concepts relating to generics in Java. 
	 Note that the discussion here on generic and parameterized types also applies to enum types (§5.13, p. 287) 
	 and record classes (§5.14, p. 299).
	 
	 ** Generic Types **
	 
	 Generic Type
		A generic type is a type that can operate on objects of various types while providing compile-time type safety.
		It is defined with one or more type parameters.
	
	Reference Type
		A reference type in Java is any type that is not a primitive type (like int, char, etc.). 
		Reference types include classes, interfaces, arrays, and enums.
	
	Formal Type Parameters (Type Variables)
		Formal type parameters (also known as type variables) are placeholders for the actual types that will be 
		specified when the generic type is used. These are defined within angle brackets (<>).
	
	Putting It All Together
		When you define a generic type, you specify one or more type parameters. 
		These type parameters must be provided with actual types when you use the generic type. 
		This allows the generic type to be flexible and reusable for different types.
	
	1. Defining a Generic Class
	// In this example:
	//	Box<T> is a generic type.
	//	T is a formal type parameter (type variable).
		
		public class Box<T> {
		    private T content;
		
		    public Box(T content) {
		        this.content = content;
		    }
		
		    public T getContent() {
		        return content;
		    }
		
		    public void setContent(T content) {
		        this.content = content;
		    }
		}
	2. Using the Generic Class
	//In this usage:
	//Box<Integer> specifies that the type parameter T is Integer.
	//Box<String> specifies that the type parameter T is String.
	
		public class Main {
		    public static void main(String[] args) {
		        // Providing the actual type Integer for the type parameter T
		        Box<Integer> integerBox = new Box<>(123);
		        System.out.println("Integer Box contains: " + integerBox.getContent());
		
		        // Providing the actual type String for the type parameter T
		        Box<String> stringBox = new Box<>("Hello Generics");
		        System.out.println("String Box contains: " + stringBox.getContent());
		    }
		}

	ADDITIONALLY:
	
	class Node<E> {
		...
		}
	1.  is a generic class called Node<E>
	2. allows nodes of specific types to be maintained. 
	3. It has only one formal type parameter, E
	4. The formal type parameter E does not explicitly specify a type, but serves as a 
	placeholder for a type to be defined in an invocation of the generic type.
	5.  A type parameter is an unqualified identifier. If a generic class has several formal type parameters, 
	these are specified as a comma-separated list, <T1, T2, ..., Tn>. 
	6. For example, E is used for the type of elements in a collection, K and V are used for the type of the 
	keys and the type of the values in a map, and T is used to represent an arbitrary type.
	*/
	
	 
	public static void main(String[] args) {
		LegacyNode node1 = new LegacyNode(4, null);       // 4 --> null
		LegacyNode node2 = new LegacyNode("July", node1); // "July" --> 4 --> null
		
		//System.out.println(node1);
		//System.out.println(node2.getData());
		
		//Node<Integer> a = new Node<>(5, null);
		Node<String> b = new Node<>("5", null);
		Node<String> c = new Node<>("8", b);
		
		System.out.println(c);
	}

}

//EXAMPLE 11.1
//The class LegacyNode can be used to create a linked list with arbitrary objects:
class LegacyNode {
	  private Object    data;    // The value in the node
	  private LegacyNode next;   // The reference to the next node.
	  LegacyNode(Object data, LegacyNode next) {
	    this.data = data;
	    this.next = next;
	  }
	  public void       setData(Object obj)      { this.data = obj; }
	  public Object     getData()                { return this.data; }
	  public void       setNext(LegacyNode next) { this.next = next; }
	  public LegacyNode getNext()                { return this.next; }
	  @Override public String toString() {
	    return this.data + (this.next == null? "" : ", " + this.next);
	  }
	}

// In Example 11.2, the declaration of the generic class Node<E> uses E in all the places where the type Object 
// was used in the declaration of the class LegacyNode in Example 11.1. 
//From the declaration of the class Node<E>, we can see that the formal type E is used like a reference type in 
//the class body:

class Node<E> {
	  private E            data;    // Data                           (1)
	  private Node<E>      next;    // Reference to next node         (2)
	  Node(E data, Node<E> next) {                                 // (3)
	    this.data = data;
	    this.next = next;
	  }
	  public void    setData(E data)       { this.data = data; }   // (4)
	  public E       getData()             { return this.data; }   // (5)
	  public void    setNext(Node<E> next) { this.next = next; }   // (6)
	  public Node<E> getNext()             { return this.next; }   // (7)
	  @Override public String toString() {                         // (8)
	    return this.data.toString() +
	           (this.next == null ? "" : ", " + this.next.toString());
	  } 
	    /*
	     * Explanation of toString()
	     -> The original method ensures that each node’s data is converted to a string and that the entire 
	     linked list is represented as a concatenated string of node data values.
	     
		1. this.data.toString():
			This calls the toString method on the data object, converting it to a string.
		2. this.next == null ? "" : ", " + this.next.toString():
			This is a ternary operator that checks if next is null.
			If next is null, it returns an empty string ("").
			If next is not null, it calls the toString method on the next node and concatenates it with a 
			comma and space (", ").
		3. Recursion in toString:
			-> The toString method is called on the instances to recursively build a string representation of the
			entire linked list. Each node’s toString method includes its own data and the string representation 
			of the next node, if it exists.
			->  However, it will not result in infinite recursion as long as the linked list is properly 
			terminated with a null reference. The recursion stops when this.next is null.
		4. What Would Happen If We Just Said this.data and this.next?
			-> this.data:
				If data is not a string, it will implicitly call toString on data, which might work but is less 
				explicit.
			-> this.next:
			This would not call the toString method on the next node. Instead, it would concatenate the next 
			node’s reference, resulting in a string like Node@1a2b3c4d (the default toString implementation for 
			objects).
	     */
	  
}

/*
 	EXPLANATION:
 	-> formal type E is used like a reference type in the class body: as a field type at (1), as a return type at (5),
 	 and as a parameter type in the methods at (4) to (8)
 	 -> Use of the class name in the generic class declaration is parameterized by the type parameter ((2), (6), (7)),
 	 with one notable exception: The formal type parameter is not specified after the class name in the constructor 
 	 declaration at (3). 
 	 -> Which actual reference type the formal type parameter E represents is not known in the generic class Node<E>.
 	 
 	 SCOPE of Type parameter E:
 	 The scope of the type parameter E of the generic type includes any non-static inner classes, but 
 	 excludes any static member types—the parameter E cannot be accessed in static context. 
 	 It also excludes any nested generic declarations where the same name is redeclared as a formal type parameter. 
 	 Shadowing of type parameter names should be avoided.
 	 

 */

/*
	 Some Restrictions on the Use of Type Parameters in a Generic Type
		-> A constructor declaration in a generic class cannot specify the formal type parameters of the 
		generic class in its constructor header after the class name:
		
		class Node<E> {
		  ...
		  Node<E>() { ... }                        // Compile-time error!
		  ...
		}
		
		
		-> A formal type parameter cannot be used to create a new instance, as it is not known which concrete type
		it represents. The following code in the declaration of the Node<E> class would be illegal:

		E ref = new E();                           // Compile-time error!
		
		-> A formal type parameter is a non-static type. It cannot be used in a static context, for much the same 
		reason as an instance variable cannot be used in a static context: It is associated with objects. 
		The compiler will report errors at (1), (2), and (3) in the code below:

		Click here to view code image
		
		class Node<E> {
		  private static E e1;                          // (1) Compile-time error!
		  public  static E oneStaticMethod(E e2) {      // (2) Compile-time error!
		    E e3;                                       // (3) Compile-time error!
		    System.out.println(e3);
		  }
		  // ...
		}
		
		*** Parameterized Types ***
		-> A parameterized type (also called a type instance) is an invocation or instantiation of a generic type 
		that is a specific usage of the generic type where the formal type parameters are replaced by actual 
		type parameters.
		-> Analogy with method declarations and method invocations can be helpful in understanding the relationship
		between generic types and parameterized types. We pass actual parameters in a method invocation to execute 
		a method. In the case of a generic type invocation, we pass actual type parameters in order to instantiate 
		a generic type.
		-> We can declare references and create objects of parameterized types, and call methods on these objects,
		in much the same way as we use non-generic classes.

				
		Node<Integer> intNode = new Node<Integer>(2020, null);
		-> The actual type parameter Integer, explicitly specified in the declaration statement above, 
		binds to the formal type parameter E. 
		-> The compiler treats the parameterized type Node<Integer> as a new type.
		-> The reference intNode can only refer to a Node of Integer. The node created can only be used to store an 
		object of this concrete type.

		Methods can be called on objects of parameterized types:
		
				
		Integer iRef = intNode.getData();            // Integer object with int value 2020
		-> In the method call above, the actual type parameter is determined from the type of the reference used 
		to make the call. The type of the intNode reference is Node<Integer>; therefore, the actual type parameter
		 is Integer. The method header is Integer getData(), meaning that the method will return a value of type 
		 Integer. 
		 
		 EXAMPLES: Here are some more examples of calling methods of parameterized types:
		
		intNode.setData(2020);                             // Ok.
		intNode.setData("TwentyTwenty");                   // (1) Compile-time error!
		intNode.setNext(new Node<Integer>(2019, null));    // (2020, (2019, null))
		intNode.setNext(new Node<String>("Hi", null));     // (2) Compile-time error!
		
		EXPLANATION:
		-> In the method calls shown above, the compiler determines that the actual type parameter is Integer. 
		-> The method signatures are setData(Integer) and setNext(Node<Integer>). 
		-> As expected, we get a compile-time error when we try to pass an argument that is not compatible with the 
		parameter type in the method declarations; for example, at (1) and (2). 
		-> The parameterized types Node<Integer> and Node<String> are two unrelated types.
		
		-> The compiler reports any inconsistent use of a parameterized type so that errors can be caught earlier 
		at compile time and the use of explicit casts in the source code is minimized, as evident from (3) and (4),
		respectively.
		
		Node<String> strNode = new Node<String>("Hi", null);
		intNode = strNode;                         // (3) Compile-time error!
		String str = strNode.getData();            // (4) No explicit cast necessary.
		
		
		*** The Diamond Operator (<>) ***
		-> In the object creation expression of the new operator, the actual type parameter was explicitly specified 
		after the class name—in contrast to the constructor declaration.
		Node<String> lst = new Node<String>("Hi", null); // Explicit actual type parameter
		
		The actual type parameters can be omitted, but not the angle brackets (<>), if the compiler can infer 
		the actual type parameters from the context of the object creation expression. 
		
		The angle brackets with no actual parameters (<>) are commonly referred to as the diamond operator.
		
		Node<String> lst = new Node<>("Hi", null); // Actual type parameter inferred.
		
		In the object creation expression above, the compiler performs automatic type inference to infer that the 
		actual type parameter in the expression must be String. The compiler is able to infer the actual type 
		parameter from the type information of the constructor call arguments.

		new Node<>(null, null);  // Actual type parameter: Object.
		
		EXAMPLE:
		-> In the code below, the compiler uses the type information of the variable on the left-hand side to 
		infer the actual type parameter of the object creation expression, thereby ensuring compatibility with the
		target type on the left-hand side of the assignment.
		
		Node<String>  strNode = new Node<>(null, null); // Actual type parameter: String.
		Node<Integer> intNode = new Node<>(null, null); // Actual type parameter: Integer.
		Node<Number>  numNode = new Node<>(null, null); // Actual type parameter: Number.
		Node<Number>  lstNode = new Node<>(2021, null); // Actual type parameter: Number.
		
		-> In the last declaration, the int value 2021 is boxed into an Integer object that can be assigned to a 
		reference of its superclass Number. 
		-> In other words, the signature of the constructor call is Node<Number>(Number, Node<Number>).
		
		EXAMPLE:
		// (1) Method declaration with parameterized type as formal parameter.
		void find(Node<String> node) { // }
		...
		// (2) Method call where actual argument uses diamond operator.
		find(new Node<>(null,null));  // Actual type parameter: Object or String?
		
		-> The compiler takes the target type (Node<String>) in the method declaration into consideration, 
		correctly inferring the actual type parameter to be String, in order for the actual and the formal 
		parameters in the call to be assignment compatible.
		
		EXAMPLE:
		-> A single diamond operator must replace the entire actual type parameter list in the object creation 
		expression. 
		
		HashMap<String, List<Integer>> map = new HashMap<>();
		HashMap<String, List<Integer>> map = new HashMap<String,<>>(); // Error!
		
		-> In the first declaration above, the compiler infers that the actual type parameter list is 
		<String, List<Integer>>.
		
		If the actual type parameters are not specified and the diamond operator is omitted, the 
		compiler issues an unchecked conversion warning—that is, the code will compile, but all
		bets are off at runtime. 
		
		
		-> Below, the reference type Node in the object creation expression is interpreted as a raw type.
		Implications of interoperability between generic types and raw types are discussed on p. 575.
		
		Node<String> rawNode = new Node("Hi", null); // Unchecked conversion warning!
		
		Raw Types in Java
		-> A raw type is a name for a generic class or interface without any type arguments.
		-> When you use this class without specifying the type parameter, you are using a raw type:

			
		Node rawNode = new Node("Hi", null); // Raw type usage
		
		Issues with Raw Types
		-> Unchecked Conversion Warning:
			The compiler issues an unchecked conversion warning because it cannot ensure type safety. 
			This means that while the code compiles, it might cause runtime errors.
		-> Loss of Type Safety:
		Raw types bypass generic type checks, which can lead to ClassCastException at runtime. 
		For example, if you mistakenly add an object of the wrong type, the compiler won’t catch it.
		
		Example with Raw Type and Warning
		Java
		
		Node<String> rawNode = new Node("Hi", null); // Unchecked conversion warning
		Standard coding segments. Review and use carefully. More info on FAQ.
		In this example:
		
		Node<String> rawNode expects a Node<String>, but new Node("Hi", null) is interpreted as a raw type Node.
		The compiler issues a warning because it cannot ensure that the types are consistent.
		
		-> The diamond operator can be used to instantiate an anonymous class (see p. 633).

		new Node<>("Hi", null) {//}; // Parameterized type: Node<String>
		new Node("Hi", null)   {//}; // Raw type: Node
 */
		
	/*
	 Parameterized Local Variable Type Inference
		
		CODE EXAMPLE:
		// Parameterized local variable declarations:
		Node<String> node1 = new Node<String>(null, null); // (1) Node of String
		Node<String> node2 = new Node<>(null, null);       // (2) Node of String
		var node3 = new Node<String>(null, null);          // (3) Node of String
		var node4 = new Node<>(null, null);                // (4) Node of Object
		
		EXPLANATION:
		i) The first three declarations are equivalent, as they create a Node<String> object whose data and next 
		fields are null. 
		-> In declaration (1), since the type String is explicitly specified in the object creation expression, 
		the actual type parameter is deduced to be String. 
		-> In declaration (2), the diamond operator is specified in the object creation expression, 
		but the compiler is able to infer that the actual type parameter is String from the left-hand side of the
		declaration—that is, the compiler considers the context of the whole declaration. 
		-> In the case of the parameterized local variable declarations with var, both the actual type parameters 
		and the parameterized type denoted by var are inferred from the object creation expression (i.e. the right-hand
		side of the assignment operation)
		-> In declaration (3), as String is explicitly specified in the object creation expression, 
		the actual type parameter is inferred to be String and the parameterized type of node3 denoted by var is 
		inferred to be Node<String>.
		-> However, in declaration (4), the diamond operator is used in the object creation expression. 
		In this case, the actual type parameter is inferred to be Object and the parameterized type of node4 denoted 
		by var is inferred to be Node<Object>. Adequate type information should be provided in the object creation 
		expression when declaring parameterized local variables with var in order to avoid unexpected types being 
		inferred for the actual parameter types and the parameterized type denoted by var.
	 */

	/*
	 	Generic Interfaces
		-> Generic types also include generic interfaces, which are declared analogous to generic classes. 
		-> The specification of formal type parameters in a generic interface is the same as in a generic class.
		
		 Example 11.3:
		 -> declares a generic interface that defines the reference type IMonoLink<E> for objects that 
		 store a data value of type E.

		
		interface IMonoLink<E> {
			  void         setData(E data);
			  E            getData();
			  void         setNext(IMonoLink<E> next);
			  IMonoLink<E> getNext();
			}
			
		class MonoNode<E> implements IMonoLink<E> {
			  private E            data;    // Data
			  private IMonoLink<E> next;    // Reference to next node                   (1)
			
			  MonoNode(E data, IMonoLink<E> next) {                                  // (2)
			    this.data = data;
			    this.next = next;
			  }
			
			  @Override public void setData(E data) { this.data = data; }
			  @Override public E    getData()       { return this.data; }
			  @Override public void setNext(IMonoLink<E> next) { this.next = next; } // (3)
			  @Override public IMonoLink<E> getNext()          { return this.next; } // (4)
			  @Override public String toString() {
			    return this.data.toString() + (this.next == null? "" : ", " + this.next);
			  }
		}
		
		1. A generic interface can be implemented by a generic (or a non-generic) class:
		
		-> A generic interface can be parameterized in the same way as a generic class. 
		-> In the code below, the reference strNode has the parameterized type IMonoLink<String>. 
		-> It is assigned the reference value of a node of inferred type MonoNode<String>.
		The assignment is legal, since the parameterized type MonoNode<String> is a subtype of the parameterized
		type IMonoLink<String>:


		IMonoLink<String> strNode2 = new MonoNode<>("Bye", null);
		System.out.println(strNode2.getData());                    // Prints: Bye
		
		2. As with non-generic interfaces, generic interfaces cannot be instantiated either:
		
		IMonoLink<String> strNode3 = new IMonoLink<>("Bye", null); // Compile-time error!
		
		Example 11.4 A Non-Generic Class Implementing a Generic Interface
		// File: LymphNode.java
		class Lymph { // }
		
		public class LymphNode implements IMonoLink<Lymph> {
		  private Lymph            body;
		  private IMonoLink<Lymph> location;
		  @Override public void  setData(Lymph obj) { body = obj; }
		  @Override public Lymph getData()          { return body; }
		  @Override public void  setNext(IMonoLink<Lymph> loc) { this.location = loc; }
		  @Override public IMonoLink<Lymph> getNext()          { return this.location; }
		}
		
		EXPLANATION:
		-> The generic interface IMonoLink<E> is parameterized by a concrete type, namely, Lymph. 
		-> The type LymphNode is a subtype of the parameterized type IMonoLink<Lymph>, as it implements the methods 
		of the generic interface IMonoLink<E> in accordance with the concrete type parameter Lymph.
		
		-> The Java standard library contains many examples of generic interfaces. 
		-> E.g. java.lang.Comparable<E> and java.util.Comparator<E> 
		-> The Java Collections Framework also includes many examples of generic interfaces, such as Collection<E>,
		List<E>, Set<E>, and Map<K,V>
*/

	/*
	 Extending Generic Types
		-> A non-final generic type can be extended.
	
	Example 11.5:
	shows that the generic interface IBiLink<E> extends the generic interface IMonoLink<E>, 
	and that the generic class BiNode<E> extends the generic class MonoNode<E> and implements the
	generic interface IBiLink<E>
	
	Example 11.5 Extending Generic Types

	interface IBiLink<T> extends IMonoLink<T> {
	  void       setPrevious(IBiLink<T> previous);
	  IBiLink<T> getPrevious();
	}
	
	class BiNode<E> extends MonoNode<E> implements IBiLink<E> {
	  private IBiLink<E>  previous;    // Reference to previous node
	
	  BiNode(E data, IBiLink<E> next, IBiLink<E> previous) {
	    super(data, next);
	    this.previous = previous;
	  }
	  @Override public void setPrevious(IBiLink<E> previous) {
	    this.previous = previous;
	  }
	  @Override public IBiLink<E> getPrevious() { return this.previous; }
	  @Override public String toString() {
	    return (this.previous == null? "" : this.previous + ", ") +
	            this.getData() +
	           (this.getNext() == null? "" : ", " + this.getNext());
	  }
	}
	
	//
	interface IBiLink<E> extends IMonoLink<E> {
		  // ...
		}
		class BiNode<E> extends MonoNode<E> implements IBiLink<E> {
		  // ...
		}
	-> The compiler checks that the formal type parameters of the superclass in the extends clause can be resolved. 
	In the case above, the formal type parameter E, which is specified for the subclass, is also used as the type 
	parameter for the superclass and is used to constrain the interface to the same type parameter. 
	This dependency ensures that an invocation of the subclass will result in the same actual type parameter being
	used by the superclass and for the interface.
	
	BiNode<Integer> intBiNode = new BiNode<>(2020, null, null);
	MonoNode<Integer> intMonoNode = intBiNode;        // (1)
	Integer iRef = intMonoNode.getData();             // Integer with int value 2020
	MonoNode<Number> numMonoNode = intBiNode;         // (2) Compile-time error!
	
	VERY IMPORTANT:
	-> The assignment at (1) is type-safe, as the parameterized class BiNode<Integer> is a subtype of the 
	parameterized class MonoNode<Integer>. 
	-> It is important to note that the superclass and the subclass are parameterized with the same type parameter; 
	otherwise, the subtype relationship between the superclass and the subclass does not hold. 
	-> We get a compile-time error at (2) because the parameterized class BiNode<Integer> is not a 
	subtype of the parameterized class MonoNode<Number>. 
	Subtype relationships for generic types are discussed in a later section
	
	i) We can extend a non-generic type to a generic subtype as well:
			class AbstractNode { // }                      // A non-generic supertype
		class SimpleNode<E> extends AbstractNode { // }// A generic subtype
	
	ii) We can also extend concrete parameterized types to specialized non-generic subtypes:
		
		class IntegerBiNode extends BiNode<Integer> {         // A non-generic subtype
		  IntegerBiNode(Integer data, IntegerBiNode next, IntegerBiNode previous) {
		    super(data, next, previous);
		  }
		  //...
		}
		
	iii) Note that a subtype can inherit only one parameterization of the same generic interface supertype.
	Implementing or extending a parameterized type fixes the parameterization for the subtype and its supertypes.
	
	 -> In the declaration below, the subtype WeirdNode<E> tries to implement the interface IMonoLink<Integer>, 
	 but at the same time, it is a subtype of the interface IMonoLink<E> which the superclass Mono-Node<E> 
	 implements:
	 class WeirdNode<E> extends MonoNode<E> implements IMonoLink<Integer> { // Error!
		  //...
		}
	-> There is great flexibility in extending reference types, but care must be exercised to achieve the 
	desired result.
	 */
	

/*
	Raw Types and Unchecked Warnings
	-> A generic type without its formal type parameters is called a raw type. 
	-> The raw type is the supertype of all parameterized types of the generic type. 
	For example, the raw type Node is the supertype of 
		i) the parameterized types Node<String>, Node<Integer>, and Node<Node<String>>. 
		The last parameterized type is an example of a nested parameterization. 
		It means that a node of this type has a node of type Node<String> as data.
	
	-> A parameterized type (e.g., Node<String>) is not a class. 
	Parameterized types are used by the compiler to check that objects created are used correctly in the program. 
	The parameterized types Node<String>, Node<Integer>, and Node<Node<String>> are all represented at runtime by 
	their raw type Node. In other words, the compiler does not create a new class for each parameterized type. 
	Only one class (Node) exists that has the name of the generic class (Node<E>), and the compiler generates 
	only one class file (Node.class) with the Java bytecode for the generic class.
	
	-> Only reference types (excluding array creation and enumerations) can be used in invocations of generic types. 
	A primitive type is not permitted as an actual type parameter, the reason being that values of primitive types
	have different sizes.
	
	-> Generics are implemented in the compiler only. The JVM is oblivious about the use of generic types. 
	It does not differentiate between Node<String> and Node<Integer>, and just knows about the class Node.
	
	 -> The compiler translates the generic class by a process known as type erasure; meaning that information about
	 type parameters is erased and casts are inserted to make the program type-safe at runtime.
	 The compiler guarantees that casts added at compile time never fail at runtime, when the program compiles 
	 without any unchecked warnings.
	 
	 Example 11.6 Unchecked Warnings
	 -> It is possible to use a generic class by its raw type only, like a non-generic class, without specifying 
	 actual type parameters for its usage. Example 11.6 illustrates mixing generic and non-generic code.
	 
	 ->  The compiler will issue an unchecked warning if such a use can be a potential problem at runtime. 
	 Such usage is permitted for backward compatibility with legacy code, but is strongly advised against when 
	 writing new code.
	 
	 // A client for the generic class Node<E> in Example 11.2, p. 568.
		public class Preliminaries {
		  public static void main(String[] args) {
		
		    Node<Integer> intNode = new Node<>(2018, null);
		    Integer iRef = intNode.getData();        // Integer object with int value 2018
		    intNode.setData(2020);                   // Ok.
		//  intNode.setData("TwentyTwenty");         // (1) Compile-time error!
		    intNode.setNext(new Node<>(2019, null)); // (2020, (2019, null))
		//  intNode.setNext(new Node<>("Hi", null)); // (2) Compile-time error!
		
		    Node<String> strNode = new Node<>("Hi", null);
		//  intNode = strNode;              // (3) Compile-time error!
		    String str = strNode.getData(); // (4) No explicit cast necessary.
		
		    Node rawNode = intNode;         // (5) Assigning to raw type always possible.
		    rawNode.setData("BOOM");        // (6) Unchecked call warning!
		    intNode = rawNode;              // (7) Unchecked conversion warning!
		    iRef = intNode.getData();       // (8) ClassCastException!
		//  iRef = rawNode.getData();       // (9) Compile-time error!
		  }
		}
	 EXPLANATION:
	 -> The assignment at (5) in Example 11.6 shows that it is always possible to assign the reference value 
	 of a parameterized type to a reference of the raw type, as the latter is the supertype of the former. 
	 -> However, the raw type reference can be used to violate the type-safety of the node at runtime, as shown at (6)
	  Calling a method on a node using the raw type reference results in an unchecked call warning by the compiler. 
	  In this particular case, a String is set as the data of an Integer node.
	 
	  -> Assigning the reference value of a raw type to a reference of the parameterized type results in an 
	  unchecked conversion warning from the compiler, as shown at (7). 
	  -> If the node referred to by the raw type reference is not of type Integer, using it as a node of type Integer
	  can lead to problems at runtime, as shown at (8). 
	  -> The assignment at (8) is only type compatible, not type-safe, as its type-safety is compromised at (6) as 
	  explained above. 
	  -> A ClassCastException is thrown at runtime, since an Integer was expected, but a String was returned by 
	  the getData() method.
	  -> The assignment at (9) does not compile because of type mismatch: Without the generic type information, 
	  the compiler infers that the call on the getData() method using the raw type reference rawNode can only return 
	  an Object, whereas the type of the variable on the left-hand side is Integer.
	  
	  -> The class Preliminaries in Example 11.6 is shown compiled with the non-standard option -Xlint:unchecked. 
	  The compiler recommends using this option when non-generic and generic code are mixed in this way.
	  The program compiles in spite of the unchecked warnings, and can be executed. 
	  But all guarantees of type-safety are off in the face of unchecked warnings
	 
 */


