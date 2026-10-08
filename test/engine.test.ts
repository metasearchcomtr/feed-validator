import test from "node:test";
import assert from "node:assert/strict";
import {detectFeedFormat,normalizeHotelRecords,validateFeed} from "../src/engine.js";

test("detects CSV and validates Wego feed",()=>{
  const csv="id,name,address,city,country,latitude,longitude\n1,Hotel One,Main St,Istanbul,TR,41.01,28.97";
  assert.equal(detectFeedFormat(csv),"CSV");
  const result=validateFeed("wego",csv);
  assert.equal(result.score,100);
  assert.equal(result.issues.filter(i=>i.level==="error").length,0);
});

test("trivago CSV requires accommodation type and category",()=>{
  const csv="partner_reference,name,street,postcode,city,country,latitude,longitude\n1,Hotel One,Main St,34000,Istanbul,TR,41.01,28.97";
  const result=validateFeed("trivago",csv);
  assert.ok(result.issues.some(i=>i.code==="MISSING_ACCOMMODATION_TYPE"));
  assert.ok(result.issues.some(i=>i.code==="MISSING_CATEGORY"));
});

test("normalizes common hotel aliases",()=>{
  const csv="hotel_id,hotel_name,street_address,city_name,country_code,lat,lng\n42,Demo Hotel,Main St,Istanbul,TR,41,29";
  const normalized=normalizeHotelRecords(csv);
  assert.equal(normalized.records[0]?.id,"42");
  assert.equal(normalized.records[0]?.name,"Demo Hotel");
  assert.equal(normalized.records[0]?.country,"TR");
});
