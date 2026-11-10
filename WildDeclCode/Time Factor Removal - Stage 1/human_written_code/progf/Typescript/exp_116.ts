var Context = require('./eval').Context;
var EvalProgram = require('./eval').EvalProgram;
var ParseProgram = require('./parser').ParseProgram;
var ResolveLabels = require('./parser').ResolveLabels;

export type InterpretProgram<
  T,
  StartingContext extends Context = {
    registers: {
      r0: '00000000';
      r1: '00000000';
      r2: '00000000';
      r3: '00000000';
      r4: '00000000';
      r5: '00000000';
      r6: '00000000';
      r7: '00000000';
      sp: '11111111';
      lr: '00000000';
      pc: '00000000';
    };
    memory: {};
  },
> = EvalProgram<ResolveLabels<ParseProgram<T>>, StartingContext>;
