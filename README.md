# Net Time Protocol Client

Query time from NTP servers
## Import

- CommonJS
  ```javascript
  const { getTime } = require("ntp-client-promise")
  ```
- TypeScript
  ```typescript
  import { getTime } from "ntp-client-promise"
  ```
- ES Modules
  ```javascript
  import ntp from "ntp-client-promise"
  const getTime = ntp.getTime;
  ```

## Usage

```javascript

const date = await getTime()
date // => 2022-09-02T19:21:33.186Z

const russianTime = await getTime({
  // Everything is optional
  
  server: "ntp5.stratum2.ru", 
  port: 123, // 123 is default NTP port
  timeout: 1000, // timeout in MS
  socketType: "udp6", // udp4 or udp6 - which IP type to use
  utc: false // sync with UTC time (default) or local
})
```