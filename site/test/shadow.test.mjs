// A local name that shadows an import is fine until the import is called inside its scope: a `const t`
// declared further down a block puts the translation function t() in its temporal dead zone, and the
// page throws "Cannot access 't' before initialization" only when that code first runs (it broke the
// doughnut chart once). This checks every call to an imported function in src/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parseAst } from 'rolldown/parseAst';

const files=dir=>readdirSync(new URL(dir,import.meta.url),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(`${dir}${e.name}/`):e.name.endsWith('.js')?[`${dir}${e.name}`]:[]);
// Names a pattern binds.
const bound=(p,out)=>{if(!p)return out;
  if(p.type==='Identifier')out.push(p.name);
  else if(p.type==='ObjectPattern')p.properties.forEach(q=>bound(q.value??q.argument,out));
  else if(p.type==='ArrayPattern')p.elements.forEach(q=>bound(q,out));
  else if(p.type==='AssignmentPattern')bound(p.left,out);
  else if(p.type==='RestElement')bound(p.argument,out);
  return out;};
const declared=body=>(body||[]).flatMap(s=>s.type==='VariableDeclaration'?s.declarations.flatMap(d=>bound(d.id,[])):(s.type==='FunctionDeclaration'||s.type==='ClassDeclaration')&&s.id?[s.id.name]:[]);

test('no call to an imported function is shadowed by a local name',()=>{
  const found=[];
  for(const f of files('../src/')){
    const src=readFileSync(new URL(f,import.meta.url),'utf8'),ast=parseAst(src,{lang:'js',sourceType:'module'});
    const imports=new Set(ast.body.filter(n=>n.type==='ImportDeclaration').flatMap(n=>n.specifiers.map(s=>s.local.name)));
    const line=pos=>src.slice(0,pos).split('\n').length;
    const walk=(n,live)=>{
      if(!n||typeof n.type!=='string')return;
      let hidden=[];
      if(/Function/.test(n.type))hidden=[...n.params.flatMap(p=>bound(p,[])),...(n.body?.type==='BlockStatement'?declared(n.body.body):[])];
      else if(n.type==='BlockStatement')hidden=declared(n.body);
      else if(/^For(Of|In)?Statement$/.test(n.type)){const d=n.init??n.left;if(d?.type==='VariableDeclaration')hidden=d.declarations.flatMap(x=>bound(x.id,[]));}
      else if(n.type==='CatchClause')hidden=bound(n.param,[]);
      const scope=hidden.some(h=>live.has(h))?new Set([...live].filter(x=>!hidden.includes(x))):live;
      if(n.type==='CallExpression'&&n.callee.type==='Identifier'&&imports.has(n.callee.name)&&!scope.has(n.callee.name))found.push(`${f.slice(3)}:${line(n.start)} ${n.callee.name}()`);
      for(const k in n)if(k!=='type'){const v=n[k];if(Array.isArray(v))v.forEach(x=>walk(x,scope));else if(v&&typeof v==='object')walk(v,scope);}
    };
    walk(ast,imports);
  }
  assert.deepEqual(found,[],`imported functions called where a local name hides them:\n${found.join('\n')}`);
});
