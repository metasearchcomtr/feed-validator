import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {createServer} from "node:http";
import {loadFeedInput} from "../src/input.js";

test("loads local file",async()=>{
  const dir=await mkdtemp(join(tmpdir(),"metasearch-feed-"));const file=join(dir,"hotels.csv");await writeFile(file,"id,name\n1,Demo");
  assert.equal(await loadFeedInput(file),"id,name\n1,Demo");
});

test("loads URL and follows redirect",async()=>{
  const server=createServer((req,res)=>{if(req.url==="/redirect"){res.statusCode=302;res.setHeader("Location","/feed");res.end();return}res.setHeader("Content-Type","text/csv");res.end("id,name\n1,Demo")});
  await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));
  try{const address=server.address();assert.ok(address&&typeof address!=="string");const value=await loadFeedInput(`http://127.0.0.1:${address.port}/redirect`);assert.equal(value,"id,name\n1,Demo")}finally{server.close()}
});

test("rejects unsupported URL protocols",async()=>{await assert.rejects(()=>loadFeedInput("file:///tmp/feed.csv"),/Only HTTP and HTTPS/)})
