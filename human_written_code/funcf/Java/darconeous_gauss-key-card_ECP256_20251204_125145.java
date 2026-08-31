```java
public static void setCurveParameters(ECKey eckey) {
	eckey.setFieldFP(p, (short)0, (short)(p.length));
	eckey.setA(a, (short)0, (short)(a.length));
	eckey.setB(b, (short)0, (short)(b.length));
	eckey.setG(g, (short)0, (short)(g.length));
	eckey.setR(r, (short)0, (short)(r.length));
}
```