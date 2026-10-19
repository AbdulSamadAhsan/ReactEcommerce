import { test } from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=(await readFile(new URL('../src/api.js',import.meta.url),'utf8')).replace('import.meta.env.VITE_API_URL',JSON.stringify('https://example.test/api'));
const {deleteAccount}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
for(const success of [true,false])test(`account deletion ${success?'clears session and cart':'preserves session on incorrect password'}`,async()=>{
 const previous={fetch:globalThis.fetch,localStorage:globalThis.localStorage,window:globalThis.window};
 const stored=new Map([['shopco.authToken','token'],['shopco.user','user'],['shopco.cartToken','cart-token'],['cart','items'],['shopco.cartTotals','totals']]);let events=[];
 globalThis.localStorage={getItem:key=>stored.get(key),removeItem:key=>stored.delete(key)};globalThis.window={dispatchEvent:event=>events.push(event.type)};
 globalThis.fetch=async(url,options)=>{assert.equal(options.method,'DELETE');assert.equal(options.headers.Authorization,'Bearer token');assert.deepEqual(JSON.parse(options.body),{currentPassword:'test-password'});return{ok:success,status:success?200:403,json:async()=>success?{data:{deleted:true}}:{message:'Your current password is incorrect.'}};};
 try{if(success){assert.deepEqual(await deleteAccount('test-password'),{deleted:true});assert.equal(stored.size,0);assert.deepEqual(events,['shopco:auth','shopco:cart']);}else{await assert.rejects(deleteAccount('test-password'),/current password is incorrect/);assert.equal(stored.get('shopco.authToken'),'token');assert.equal(stored.get('cart'),'items');assert.equal(events.length,0);}}
 finally{for(const[key,value]of Object.entries(previous)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
