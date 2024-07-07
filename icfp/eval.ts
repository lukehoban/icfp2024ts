import type { AST } from './ast';
import { fromBase94, toBase94 } from './util';

type Value = boolean | number | string | ((x: Value) => Value);
type Environment = Map<number, Value>;

export const evaluate = (ast: AST, env: Environment = new Map()): Value => {
  switch (ast.kind) {
    case 'constant':
      return ast.v;
    case 'variable':
      if (!env.has(ast.v)) throw new Error(`Unbound variable: ${ast.v}`);
      return env.get(ast.v)!;
    case 'unary':
      const x = evaluate(ast.x, env);
      switch (ast.op) {
        case '-': return -x;
        case '!': return !x;
        case '#': return fromBase94(x as string); 
        case '$': return toBase94(x as number);
        default: throw new Error(`Unknown unary operator: ${ast.op}`);
      }
    case 'binary':
      const left = evaluate(ast.x, env);
      switch (ast.op) {
        case '$': {
          if (typeof left !== 'function') throw new Error('Application requires a function');
          return left(evaluate(ast.y, env));
        }
        default: {
          const right = evaluate(ast.y, env);
          switch (ast.op) {
            case '+': return (left as number) + (right as number);
            case '-': return (left as number) - (right as number);
            case '*': return (left as number) * (right as number);
            case '/': return Math.trunc((left as number) / (right as number));
            case '%': return (left as number) % (right as number);
            case '<': return (left as number) < (right as number);
            case '>': return (left as number) > (right as number);
            case '=': return left === right;
            case '|': return (left as boolean) || (right as boolean);
            case '&': return (left as boolean) && (right as boolean);
            case '.': return (left as string) + (right as string);
            case 'T': return ((right as string).slice(0, left as number));
            case 'D': return ((right as string).slice(left as number));
            default: throw new Error(`Unknown binary operator: ${ast.op}`);
          }
        }
      }
    case 'ternary':
      return evaluate(evaluate(ast.cond, env) ? ast.then : ast.else, env);
    case 'lambda':
      return (x: Value): Value => evaluate(ast.body, new Map(env).set(ast.v, x));
  }
};
