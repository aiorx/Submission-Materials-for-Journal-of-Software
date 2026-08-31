```typescript
static forRoot(internalStorageProvider: any = {
  provide: InternalStorage,
  useClass: CookieBrowser
}): ModuleWithProviders {
  return {
    ngModule  : SDKBrowserModule,
    providers : [
      LoopBackAuth,
      LoggerService,
      JSONSearchParams,
      SDKModels,
      UserApi,
      QuestionApi,
      AnswerApi,
      internalStorageProvider,
      { provide: SDKStorage, useClass: StorageBrowser }
    ]
  };
}
```