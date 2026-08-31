```java
private static boolean inject(String agentArgs, String agentPath,String process) throws Exception {
    List<VirtualMachineDescriptor> vmList = VirtualMachine.list();
    if (vmList.size() <= 0)
        return false;
    if (process != null){
        for (VirtualMachineDescriptor vmd : vmList) {
            String displayName = vmd.displayName();
            if (displayName.equals(process)){
               return inject(vmd,agentArgs,agentPath);
            }
        }
    }

    for (VirtualMachineDescriptor vmd : vmList) {
        String displayName = vmd.displayName();
        if (displayName.contains("weblogic.Server") || displayName.contains("catalina")) {
            return inject(vmd,agentArgs,agentPath);
        }
    }
    return false;
}
```