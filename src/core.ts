export type FeedRecord=Record<string,unknown>;

export function hasValue(value:unknown){
  return !(value===undefined||value===null||String(value).trim()==="");
}

export function normalizedKey(value:string){
  return value.toLowerCase().replace(/[^a-z0-9]/g,"");
}

export function findKey(record:FeedRecord,names:readonly string[]){
  const keys=new Map(Object.keys(record).map(key=>[normalizedKey(key),key]));
  for(const name of names){
    const key=keys.get(normalizedKey(name));
    if(key)return key;
  }
}

export function getValue(record:FeedRecord,names:readonly string[]){
  const key=findKey(record,names);
  return key?record[key]:undefined;
}

export function splitDelimited(input:string,delimiter=","){
  if(delimiter.length!==1)throw new Error("Delimiter must be one character.");
  const rows:string[][]=[];
  let row:string[]=[],current="",quoted=false;
  for(let i=0;i<input.length;i++){
    const ch=input[i];
    if(ch==='"'){
      if(quoted&&input[i+1]==='"'){current+='"';i++}
      else quoted=!quoted;
      continue;
    }
    if(ch===delimiter&&!quoted){row.push(current.trim());current="";continue}
    if((ch==="\n"||ch==="\r")&&!quoted){
      if(ch==="\r"&&input[i+1]==="\n")i++;
      row.push(current.trim());current="";
      if(row.some(value=>value!==""))rows.push(row);
      row=[];
      continue;
    }
    current+=ch;
  }
  if(quoted)throw new Error("Delimited file contains an unclosed quoted value.");
  row.push(current.trim());
  if(row.some(value=>value!==""))rows.push(row);
  return rows;
}

export function detectDelimiter(input:string){
  const firstLine=input.split(/\r?\n/,1)[0]||"";
  const comma=(firstLine.match(/,/g)||[]).length;
  const tab=(firstLine.match(/\t/g)||[]).length;
  return tab>comma?"\t":",";
}

export function parseDelimitedRecords(input:string,delimiter=detectDelimiter(input)){
  const rows=splitDelimited(input,delimiter);
  if(rows.length<2)throw new Error("Delimited feed needs a header and at least one data row.");
  const [headers,...data]=rows;
  if(!headers)throw new Error("Delimited feed header is missing.");
  return {
    delimiter,
    headers,
    records:data.map(values=>Object.fromEntries(headers.map((header,index)=>[header,values[index]??""])) as FeedRecord)
  };
}

export function duplicateRows(records:FeedRecord[],aliases:readonly string[]){
  const map=new Map<string,number[]>();
  records.forEach((record,index)=>{
    const id=String(getValue(record,aliases)??"").trim();
    if(id)map.set(id,[...(map.get(id)||[]),index]);
  });
  return [...map.values()].filter(rows=>rows.length>1).flat();
}

export function invalidCoordinateRows(records:FeedRecord[],latitudeAliases:readonly string[],longitudeAliases:readonly string[]){
  return records.map((record,index)=>{
    const latRaw=getValue(record,latitudeAliases),lngRaw=getValue(record,longitudeAliases);
    if(!hasValue(latRaw)&&!hasValue(lngRaw))return -1;
    if(!hasValue(latRaw)||!hasValue(lngRaw))return index;
    const lat=Number(latRaw),lng=Number(lngRaw);
    return Number.isFinite(lat)&&lat>=-90&&lat<=90&&Number.isFinite(lng)&&lng>=-180&&lng<=180?-1:index;
  }).filter(index=>index>=0);
}
