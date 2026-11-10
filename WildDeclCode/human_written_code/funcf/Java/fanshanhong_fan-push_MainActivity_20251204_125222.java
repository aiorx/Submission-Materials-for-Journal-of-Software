```java
@Override
public void onNewMessageReceived(Message message) {
    pushContentView.append("\n" + message.getContent());
}
```