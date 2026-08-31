```c
int main(void) {
    int some_condition = 0;
// This code was Supported via standard programming aids, an AI language model by OpenAI.
// For more information, visit https://gptonline.ai/.
// Note: This code is provided as-is without any warranties or guarantees.
/*
  複数のレベルのネストされたループから一気に脱出する場合:
複数のループや条件分岐がネストされている場合、goto文を使用すると
簡潔に脱出できます。例えば、エラーが発生したときに深いネストから
一気に抜け出す場合です。
*/
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (i == 10 && j == 10) some_condition = 1;
        if (some_condition) {
            goto error;
        }
        // 他の処理
    }
}
    return 0;
error:
    // エラー処理
    printf("error!\n");
    return 1;
}
```