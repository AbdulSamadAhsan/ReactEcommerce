import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=(await readFile(new URL('../src/api.js',import.meta.url),'utf8')).replace('import.meta.env.VITE_API_URL',JSON.stringify('https://example.test/api'));
const {updateAccount}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
for(const scenario of ['password','profile','failure'])test(`account update session behavior: ${scenario}`,async()=>{
 const previous={fetch:globalThis.fetch,localStorage:globalThis.localStorage,window:globalThis.window};
 const stored=new Map([['shopco.authToken','original-token'],['shopco.user','original-user']]);let events=0;
 globalThis.localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value),removeItem:key=>stored.delete(key)};
 globalThis.window={dispatchEvent:()=>events++};
 globalThis.fetch=async(url,options)=>{assert.equal(options.headers.Authorization,'Bearer original-token');return{ok:scenario!=='failure',status:scenario==='failure'?400:200,json:async()=>scenario==='failure'?{message:'Invalid password'}:{data:scenario==='password'?{requiresLogin:true,user:{name:'Customer'}}:{token:'replacement',user:{name:'Updated'}}}};};
 try{
  if(scenario==='failure'){await assert.rejects(updateAccount({newPassword:'short'}),/Invalid password/);assert.equal(stored.get('shopco.authToken'),'original-token');assert.equal(events,0);}
  else{const result=await updateAccount(scenario==='password'?{newPassword:'new-password'}:{firstName:'Updated'});if(scenario==='password'){assert.equal(result.requiresLogin,true);assert.equal(stored.has('shopco.authToken'),false);assert.equal(stored.has('shopco.user'),false);}else{assert.equal(stored.get('shopco.authToken'),'replacement');assert.equal(JSON.parse(stored.get('shopco.user')).name,'Updated');}assert.equal(events,1);}
 }finally{for(const[key,value]of Object.entries(previous)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
