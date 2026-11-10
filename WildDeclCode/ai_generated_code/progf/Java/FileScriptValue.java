package types;

/* Start Code Supported via standard programming aids on 2025-02-19 */
public class FileScriptValue<T> {
    private T value;

    public FileScriptValue(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
/* End Code Supported via standard programming aids on 2025-02-19 */
