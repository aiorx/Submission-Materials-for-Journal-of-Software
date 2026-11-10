package dispatch;

import exceptions.FileScriptException;
import exceptions.FileScriptRuntimeException;
import types.FileScriptValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FunctionDispatch {

    /* Start Code Aided using common development resources on 2025-02-19 */
    @FunctionalInterface
    public interface FileScriptFunction {
        FileScriptValue<?> apply(List<FileScriptValue<?>> args) throws FileScriptException;
    }
    /* End Code Aided using common development resources on 2025-02-19 */

    private final Map<String, FileScriptFunction> functions = new HashMap<>();

    // Register a function that returns a "ValueNode" type where ValueNode
    public void register(String name, FileScriptFunction function) {
        functions.put(name, function);
    }

    public FileScriptValue<?> dispatch(String name, List<FileScriptValue<?>> args) throws FileScriptException {
        FileScriptFunction function = functions.get(name);
        if (function != null) {
            return function.apply(args);
        } else {
            throw new FileScriptRuntimeException("Function could not be found " + name);
        }
    }
}
