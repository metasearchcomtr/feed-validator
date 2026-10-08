import {readFile} from "node:fs/promises";
import {stdin} from "node:process";

export type LoadInputOptions={
  timeoutMs?:number;
  maxBytes?:number;
  maxRedirects?:number;
};

const DEFAULT_TIMEOUT_MS=15_000;
const DEFAULT_MAX_BYTES=2_000_000;
const DEFAULT_MAX_REDIRECTS=3;

async function readStdin(maxBytes:number){
  const chunks:Buffer[]=[];
  let total=0;
  for await(const chunk of stdin){
    const buffer=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);
    total+=buffer.length;
    if(total>maxBytes)throw new Error(`Input exceeds the ${maxBytes} byte limit.`);
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function fetchWithLimits(initial:URL,options:Required<LoadInputOptions>){
  let url=initial;
  for(let redirects=0;redirects<=options.maxRedirects;redirects++){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),options.timeoutMs);
    let response:Response;
    try{
      response=await fetch(url,{redirect:"manual",signal:controller.signal,headers:{"User-Agent":"@metasearch/feed-validator/0.1"}});
    }catch(error){
      if(error instanceof Error&&error.name==="AbortError")throw new Error(`URL request timed out after ${options.timeoutMs} ms.`);
      throw error;
    }finally{clearTimeout(timer)}

    if([301,302,303,307,308].includes(response.status)){
      const location=response.headers.get("location");
      if(!location)throw new Error(`Redirect response ${response.status} did not include a Location header.`);
      if(redirects===options.maxRedirects)throw new Error(`URL exceeded the ${options.maxRedirects} redirect limit.`);
      url=new URL(location,url);
      if(!["http:","https:"].includes(url.protocol))throw new Error("Only HTTP and HTTPS URL redirects are supported.");
      continue;
    }
    if(!response.ok)throw new Error(`URL returned HTTP ${response.status}.`);
    const declared=Number(response.headers.get("content-length"));
    if(Number.isFinite(declared)&&declared>options.maxBytes)throw new Error(`URL response exceeds the ${options.maxBytes} byte limit.`);
    if(!response.body)return "";
    const reader=response.body.getReader();
    const chunks:Uint8Array[]=[];
    let total=0;
    while(true){
      const{done,value}=await reader.read();if(done)break;
      if(value){total+=value.byteLength;if(total>options.maxBytes){await reader.cancel();throw new Error(`URL response exceeds the ${options.maxBytes} byte limit.`)}chunks.push(value)}
    }
    const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
    return new TextDecoder().decode(bytes);
  }
  throw new Error("Unexpected redirect loop.");
}

export async function loadFeedInput(source:string,options:LoadInputOptions={}){
  const resolved={timeoutMs:options.timeoutMs??DEFAULT_TIMEOUT_MS,maxBytes:options.maxBytes??DEFAULT_MAX_BYTES,maxRedirects:options.maxRedirects??DEFAULT_MAX_REDIRECTS};
  if(source==="-")return readStdin(resolved.maxBytes);
  let parsed:URL|undefined;
  try{parsed=new URL(source)}catch{}
  if(parsed){
    if(!["http:","https:"].includes(parsed.protocol))throw new Error("Only HTTP and HTTPS feed URLs are supported.");
    return fetchWithLimits(parsed,resolved);
  }
  const data=await readFile(source);
  if(data.byteLength>resolved.maxBytes)throw new Error(`Input exceeds the ${resolved.maxBytes} byte limit.`);
  return data.toString("utf8");
}
