# TradingLite Reverse engineered webshocket api.

Reverse engineer of the obfuscated communication between tradinglite web-app and tradinglite server.
It translates the binary data found in the webshocket communication to a readable format.

##### Change those values with yours
```javascript
const token = 'acc_0TFmHg1UdssK0ZJJ4AbsKbUV1Ej'
const tab_id = 'tab_PHUfBeaPeR'
const wsId = 'eWGDsHnx' // Workspace Id (can be found in the url of your workspace)
const version = "v0.41.13"
```
You can find the right values inspecting the headers of the requests with the Chrome or Firefox devtools


##### How to run:
	npm i
	node main.js

#### Example data from heatmap subscription
```javascript
{
    id: 'update,coinbase:ETH-USD,0,heatmap@1',
    meta_id: -1,
    data: {
      time: 1655748660000,
      data: [
                2.5,           334,           258,           445,         2015,
                2015,   -9.89015988,        2012.5,  -10.35244596,         2010,
        -7.00702362,          2005,  -69.76313881,        2002.5,  -6.29612455,
                2000, -650.74330765,        1997.5,  -17.21699152,         1995,
        -68.05800098,          1990, -199.60633944,        1987.5, -53.25614549,
                1985,  -19.04176842,          1980,  -12.60495073,       1977.5,
            -1.05255,          1975,  -32.79220718,          1970, -13.12057759,
              1967.5,   -1.01807122,          1965,   -9.10967063,       1962.5,
        -1.03998002,          1960,  -18.07120218,          1955,  -1.52601307,
              1952.5,  -91.53607928,          1950, -180.58936481,       1947.5,
        -6.20683097,          1945,  -10.26822449,        1942.5,    -7.211758,
                1940,  -41.47125895,        1937.5,   -2.30163883,         1935,
        -2.36570516,        1932.5,   -2.29502063,          1930, -11.74240411,
              1927.5,   -2.46488367,          1925,  -29.71000207,       1922.5,
        -1.03289405,          1920,   -5.68576701,          1915, -24.52529949,
              1912.5,  -34.04054047,          1910,   -37.2203454,       1907.5,
        -6.58655939,          1905,  -44.49303714,        1902.5,  -1.38618795,
                1900, -155.38403731,        1897.5,   -2.26223596,         1895,
        -1.05158784,          1890,  -16.89982177,        1887.5, -10.80063955,
                1885,   -6.03346515,        1882.5,   -5.29124277,         1880,
        ... 1089 more items
      ]
    },
    opts: {
      exchange: 'coinbase',
      symbol: 'ETH-USD',
      timeframe: 15,
      type: 'heatmap'
    }
  }
```

                    


### Links

[www.tradinglite.com](https://www.tradinglite.com/)

----
Feel free to open any issue for questions or bugs.
