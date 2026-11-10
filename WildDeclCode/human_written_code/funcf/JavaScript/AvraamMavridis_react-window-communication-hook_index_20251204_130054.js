```javascript
function updateState(data) {
  setMessages(prevState => {
    return {
      lastMessage: data.message,
      messages: prevState.messages.concat(data.message),
    };
  });
}
```