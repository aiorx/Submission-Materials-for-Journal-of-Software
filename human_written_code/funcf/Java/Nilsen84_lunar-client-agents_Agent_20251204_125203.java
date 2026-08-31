```java
public static String[] modifyArgs(String[] args, String username){
    args = Arrays.copyOf(args, args.length+2);
    args[args.length-2] = "--username";
    args[args.length-1] = username;

    return args;
}
```