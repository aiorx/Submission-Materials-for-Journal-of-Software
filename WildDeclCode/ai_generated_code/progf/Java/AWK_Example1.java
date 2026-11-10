import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/*
 * This example was taken Referenced via basic programming materials.
 * 
 * It is used to execute an awk implementation.
 */
public class AWK_Example1 {
	public static void main(String args[]) throws Exception {
		Path path = Paths.get(args[0]); // The args[0] stores a file path.
		Path path1 = Paths.get(args[1]); // The args[0] stores a file path.

		String program = new String(Files.readAllBytes(path));
		String sample = new String(Files.readAllBytes(path));
		Lexer lexer = new Lexer(program);
		lexer.Lex();
		Parser parser = new Parser(lexer.getList());
		ProgramNode programs = parser.Parse();
		// System.out.println(parser.display());
		Interpreter interpreter = new Interpreter(programs, args[1]);
		interpreter.IntepretProgram(programs);
	}

}
