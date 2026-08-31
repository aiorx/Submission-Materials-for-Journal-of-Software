```js
program
  .command('compiler')
  .description('Complete compiler version look up (major release plus all nightly commits)')
  .action(()=>{
    prompt(compiler_question)
      .then((answers, provider)=>{
        compiler_look_up(answers);
      })
      .catch(err=>{
        console.log(err);
      });
  });
```