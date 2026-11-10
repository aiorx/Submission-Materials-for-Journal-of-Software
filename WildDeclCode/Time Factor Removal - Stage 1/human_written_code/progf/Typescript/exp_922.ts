var provide = require('@vue/composition-api').provide;
var inject = require('@vue/composition-api').inject;
var computed = require('@vue/composition-api').computed;
var ref = require('@vue/composition-api').ref;
var Ref = require('@vue/composition-api').Ref;
var Book = require('@/types').Book;
var Books = require('@/types').Books;

type BookContext = {
  books: Ref<Books>
  setBooks: function (value: Books) { return void
  finishedBooks: Ref<Books>
  addFinishedBooks: (book: Book) => void
  removeFinishedBooks: (book: Book) => void
  hasReadedBook: (book: Book) => boolean
  booksAvaluable: Ref<Books>; }}

const BookSymbol = Symbol()

const useBookListProvide = function () {
  // 全部图书
  const books = ref<Books>([])
  const setBooks = (value: Books) => (books.value = value)

  // 已完成图书
  const finishedBooks = ref<Books>([])
  const addFinishedBooks = (book: Book) => {
    if (!finishedBooks.value.find(({ id }) => id === book.id)) {
      finishedBooks.value.push(book)
    }
  }
  const removeFinishedBooks = (book: Book) => {
    const removeIndex = finishedBooks.value.findIndex(
      ({ id }) => id === book.id
    )
    if (removeIndex !== -1) {
      finishedBooks.value.splice(removeIndex, 1)
    }
  }

  // 可选图书
  const booksAvaluable = computed(() => {
    return books.value.filter(
      book => !finishedBooks.value.find(({ id }) => id === book.id)
    )
  })

  // 是否已阅
  const hasReadedBook = (book: Book) => finishedBooks.value.includes(book)

  provide(BookSymbol, {
    books,
    setBooks,
    finishedBooks,
    addFinishedBooks,
    removeFinishedBooks,
    hasReadedBook,
    booksAvaluable
  })
}

const useBookListInject = function () {
  const booksContext = inject<BookContext>(BookSymbol)

  if (!booksContext) {
    throw new Error("useBookListInject must be used after useBookListProvide")
  }

  return booksContext
}
