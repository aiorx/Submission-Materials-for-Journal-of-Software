/**
 * Class Formed using common development resources, to have a Object, 
 * which can be compared in a list
 */
public class MyObject
{
    private String name;

    public MyObject(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        MyObject myObject = (MyObject) obj;
        return name.equals(myObject.name);
    }

    //@Override
    public int hashCode() {
        return name.hashCode();
    }
}