import type { AST } from "./ast";
import { fromBase94, decodeString } from "./util";

type Token = string;

const tokenize = (input: string): Token[] => input.match(/[!-~]+/g) || [];

const parse = (tokens: Token[]): [AST, Token[]] => {
  if (tokens.length === 0) throw new Error('Unexpected end of input');

  const [t, ...ts] = tokens;
  const h = t[0];
  const r = t.slice(1);

  switch (h) {
    case 'T': return [{kind: 'constant', v: true}, ts];
    case 'F': return [{kind: 'constant', v: false}, ts];
    case 'I': return [{kind: 'constant', v: fromBase94(r)}, ts];
    case 'S': return [{kind: 'constant', v: decodeString(r)}, ts];
    case 'U': {
      const [x, rest] = parse(ts);
      return [{kind: 'unary', op: r, x}, rest];
    }
    case 'B': {
      const [x, ts1] = parse(ts);
      const [y, ts2] = parse(ts1);
      return [{kind: 'binary', op: r, x, y}, ts2];
    }
    case '?': {
      const [cond, ts1] = parse(ts);
      const [then, ts2] = parse(ts1);
      const [els, ts3] = parse(ts2);
      return [{kind: 'ternary', cond, then, else: els}, ts3];
    }
    case 'L': {
      const [body, rest] = parse(ts);
      return [{kind: 'lambda', v: fromBase94(r), body}, rest];
    }
    case 'v': return [{kind: 'variable', v: fromBase94(r)}, ts];
    default: throw new Error(`Unexpected token: ${t}`);
  }
};

export const parseICFP = (input: string): AST => {
  const [ast, remaining] = parse(tokenize(input));
  if (remaining.length > 0) throw new Error('Input was not fully parsed');
  return ast;
};
