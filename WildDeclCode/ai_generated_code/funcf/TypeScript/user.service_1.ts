```typescript
private generateRandomString(length: number = 8): string {
  let characters: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // 한글 범위를 추가
  characters += String.fromCodePoint(
    ...Array.from({ length: 0xd7a3 - 0xac00 + 1 }, (_, i) => {
      return i + 0xac00;
    })
  );

  let result: string = '';
  for (let i: number = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
```