# @metasearch/feed-validator

Hotel feed validation CLI and Node.js SDK for Google Hotel Center, Wego, trivago, Meta, Criteo and canonical hotel master data.

## CLI

```bash
npx @metasearch/feed-validator validate hotels.csv --target google-hotel-center
```

Public URL:

```bash
npx @metasearch/feed-validator validate https://example.com/hotels.xml --target wego
```

stdin:

```bash
curl -s https://example.com/hotels.csv | npx @metasearch/feed-validator validate - --target trivago
```

Compare targets:

```bash
npx @metasearch/feed-validator compare hotels.csv --targets google-hotel-center,wego,trivago
```

Machine-readable output:

```bash
npx @metasearch/feed-validator validate hotels.csv --target google-hotel-center --output json
```

CI gate:

```bash
npx @metasearch/feed-validator validate hotels.csv --target google-hotel-center --fail-on error
```

Exit codes: `0` pass, `1` validation threshold failed, `2` CLI/input/parse error.

## Node.js SDK

```ts
import {validateFeed, normalizeHotelRecords, comparePlatformRequirements} from "@metasearch/feed-validator";

const result=validateFeed("google_hotel_center",csv);
```

Node input loader:

```ts
import {loadFeedInput, validateFeed} from "@metasearch/feed-validator/node";

const content=await loadFeedInput("https://example.com/hotels.csv");
const result=validateFeed("wego",content);
```

## Evidence levels

Google Hotel Center, Wego and trivago validators use published platform requirements where documented. Meta and Criteo are readiness/mapping checks and are not official certification.

Website: https://metasearch.com.tr/en/tools/hotel-feed-validator
