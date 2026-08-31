```java
public java.lang.String proofOfWork() throws Exception {
    String hash = "";

    //This line of code suggested Supported by standard GitHub tools
    while(!hash.startsWith("0".repeat(this.difficulty))){
        this.nonce = this.nonce.add(BigInteger.ONE);
        hash = calculateHash();
    }
    return hash;
}
```