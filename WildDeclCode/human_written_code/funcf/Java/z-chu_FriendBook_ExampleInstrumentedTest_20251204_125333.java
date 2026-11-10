```java
@Test
public void getBookList() {
    DataManager
            .getInstance()
            .getBookList(1, 20)
            .subscribe(new Subscriber<DataList<Book>>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {
                    Logger.e(e);
                    throw new RuntimeException(e);
                }

                @Override
                public void onNext(DataList<Book> bookDataList) {
                    Logger.e(bookDataList);
                }
            });
}
```