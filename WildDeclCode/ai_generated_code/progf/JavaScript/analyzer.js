/************
 * There are 2 parts to semantic analysis:
 * 1. Building a program representation
 * 2. Type Checking the program
 * 
 * 
 *  
 ***********/

import {breakStatement, variable, fun, program, whileStatement, assignment, printStatement, conditional, binary, unary, call, subscript, arrayType, variableDeclaration, functionDeclaration 
} from "./core.js"
// why variable id's are so complicated: 
// whenever you have a variable: you have to check if it's been declared before, and if it's been declared before, you have to check if it's been declared in the same scope, and if it's been declared in the same scope, you have to check if it's been declared in the same scope and not been redeclared.
// need to store somewhere, 
// need to type check
// ^^^ This was all Composed with GitHub coding tools, but you get the gist

function must(condition,message, errorLocation){
  if(!condition){
    // shows the line where the error occurs
    const prefix = errorLocation.at.source.getLineAndColumnMessage()
    // then shows the error
    throw new Error(`${prefix} ${message}`)
  }
}


// lets store the variable
class Context {
  constructor({parent = null} = {}){
    this.locals = new Map()
    // parent indicates the scope
    this.parent = parent
  }
  add(name, variable){
    if(this.locals.has(name)){
      throw new Error(`Variable ${name} already declared`)
    }
    this.locals.set(name, variable)
  }
  lookup(name){
    // try to look it up in the local map, otherwise look it up in the parent
    return this.locals.get(name) || this.parent?.lookup(name)
  }
}


export default function analyze(match){
  //create a context object that stores the variables
  let context = new Context()

  // checks whether identifier was found
  function mustHaveBeenFound(entity, name, at){
    must(entity, `Variable ${name} not defined`, at)
  }

  // build a program representation
  const analyzer = match.matcher.grammar.createSemantics().addOperation("rep", {
    // provide acction dictionary:  object with methods 
    // basically, these are the constructors for the different types of nodes in our AST
    // - Takes in the whole dinner plate (i.e. the matched strings from the parser)
    // - Passes in the meat and potatoes to core.js
    Program(statements){
      return program(statements.children.map((s)=>s.rep()))
    },
    Stmt_vardec(_let, id, _eq, exp, _semi){
      const initializer = exp.rep()
      const newVariable = variable(id.sourceString /*, initializer.type*/)
      // store the variable in the context
      context.add(id.sourceString, newVariable)

      return variableDeclaration(newVariable, initializer)
    },
    Stmt_fundec(_fun, id, _lparen, params, _rparen, _eq, exp, _semi){
      // RECURSION IS HARD, LET'S DEFER IT A LITTLE
      const fun = fun(id.sourceString, params.rep(), body.type)
      const body = exp.rep()
      return functionDeclaration(fun, body)
    },
    Stmt_while(_while, test, body){
      return whileStatement(test.rep(), body.rep())
    },
    Stmt_break(_break, _semi){ return breakStatement },

    Stmt_assign(variable, _eq, exp, _semi){
      return assignment(variable.rep(), exp.rep())
    },
    Stmt_print(_print, _lparen, exp, _rparen, _semi){
      return printStatement(exp.rep())
    },
    Params(params){
      return params.asIteration.children.map((p) => p.rep())
    },
    Param(id, _colon, type){
      return variable(id.sourceString, type.rep())
    },
    Type_array(baseType, _lbracket, _rbracket){
      return arrayType(baseType.rep()) 
    },
    Type_id(id){
      // hard, for now just return id
      return id.sourceString
    },
    Block(_lbrace, statements, _rbrace){
      // statements is a list of statements
      return statements.children.map((s)=>s.rep())
    },
    Exp_negate(_minus, operand){
      return unary("-", operand.rep())
    },
    Exp_conditional(test, _question, consequent, _colon, alternate){
      return conditional(test.rep(), consequent.rep(), alternate.rep())
    },
    Exp1_or(left, _or, right){
      return binary("||", left.rep(), right.rep())
    },
    Exp2_and(left, _and, right){
      return binary("&&", left.rep(), right.rep())
    },
    Exp3_compare(left, op, right){
      return binary(op.sourceString, left.rep(), right.rep())
    },
    Exp4_add(left, op, right){
      return binary(op.sourceString, left.rep(), right.rep())
    },
    Term_mul(left, op, right){
      return binary(op.sourceString, left.rep(), right.rep())
    },
    Factor_exp(left, op, right){
      return binary(op.sourceString, left.rep(), right.rep())
    },
    Primary_parens(_lparen, exp, _rparen){
      return exp.rep()
    },
    Var_subscript(array, _lbracket, index, _rbracket){
      return subscript(array.rep(), index.rep())
    },
    Var_id(id){
      // HARD, FOR NOW
      // look up the variable in the context
      const entity = context.lookup(id.sourceString)
      mustHaveBeenFound(entity, id.sourceString, id)
      return entity
    },
    Call(callee, _lparen, args, _rparen){
      // whenever we have "listOf" from OHM, we have to do these asIteration.children.map
      return call(callee.rep(), args.asIteration.children.map(e => exp.rep()))
    },
    true(_){return true},
    false(_){return false},
    num(_int, _dot, _frac,_e, _esign, _exp){ return Number(this.sourceString) },
    string(_open, chars, _close){ return chars.sourceString}


  })
  return analyzer(match).rep()
  // check program (type checking, and other semantic checks)
  // are variables used declared? have you redeclared a variable? Are you calling function with correct # of args?
}