export type AST = 
  | {kind: 'constant', v: boolean | number | string}
  | {kind: 'unary', op: string, x: AST} 
  | {kind: 'binary', op: string, x: AST, y: AST}
  | {kind: 'ternary', cond: AST, then: AST, else: AST}
  | {kind: 'lambda', v: number, body: AST}
  | {kind: 'variable', v: number}; 
