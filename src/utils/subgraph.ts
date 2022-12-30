import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { DoNotStepOutlined } from "@mui/icons-material";
import BigNumber from "bignumber.js";
export const CHART_PERIODS: { [x: string]: number } = {
    "5m": 60 * 5,
    "15m": 60 * 15,
    "1h": 60 * 60,
    "4h": 60 * 60 * 4,
    "1d": 60 * 60 * 24,
};
export function createClient(uri: string) {
    return new ApolloClient({
        uri,
        cache: new InMemoryCache(),
    });
}
export const chainlinkClient = createClient('https://api.thegraph.com/subgraphs/name/deividask/chainlink');

const timezoneOffset = -new Date().getTimezoneOffset() * 60;
const FEED_ID_MAP: any = {
    BTC_USD: "0xae74faa92cb67a95ebcab07358bc222e33a34da7",
    ETH_USD: "0x37bc7498f4ff12c19678ee8fe19d713b87f6a9e6",
    USDC_USD: "0x68577f915131087199fe48913d8b416b3984fd38",
    SUI_USD: "0x0fc3657899693648bba4dbd2d8b33b82e875105d",
};
function getCandlesFromPrices(prices: string | any[], period: string) {
    const periodTime = CHART_PERIODS[period];
    if (prices.length < 2) {
        return [];
    }

    const candles = [];
    const first = prices[0];
    let prevTsGroup = Math.ceil(first[0] / periodTime) * periodTime;
    let prevPrice = first[1];
    let o = prevPrice;
    let h = prevPrice;
    let l = prevPrice;
    let c = prevPrice;
    for (let i = 1; i < prices.length; i++) {
        const [ts, price] = prices[i];
        const tsGroup = Math.ceil(ts / periodTime) * periodTime;

        if (prevTsGroup !== tsGroup) {
            candles.push({ t: prevTsGroup + timezoneOffset, o, h, l, c });
            o = c;
            h = Math.max(o, c);
            l = Math.min(o, c);
        }
        c = price;
        h = Math.max(h, price);
        l = Math.min(l, price);
        prevTsGroup = tsGroup;

        if (i === prices.length - 1) {
            candles.push({ t: ts + timezoneOffset, o, h, l, c });
        }
    }

    return candles.map(({ t: time, o: open, c: close, h: high, l: low }) => ({
        time,
        open,
        close,
        high,
        low,
    }));
}

const getHighAndlow24 = (prices: any[]) => {
    let high_24;
    let low_24;
    let start_price;
    const len = prices.length - 1;

    high_24 = prices[len][1];
    low_24 = prices[len][1];

    const unixTimestamp = Math.floor(Date.now() / 1000) - CHART_PERIODS['1d'];
    for (let i = len; i > 0; i--) {
        if (unixTimestamp > prices[i][0]) {
            break;
        }
        start_price = prices[i][1];

        if (high_24 < start_price) {
            high_24 = start_price;
        }
        if (low_24 > start_price) {
            low_24 = start_price
        }
    }
    return { high_24, low_24, start_price };
}

export async function getChainlinkChartPricesFromGraph(tokenSymbol = 'ETH', period = '1d') {
    const marketName = tokenSymbol + "_USD";
    const feedId = FEED_ID_MAP[marketName];
    if (!feedId) {
        throw new Error(`undefined marketName ${marketName}`);
    }

    const PER_CHUNK = 1000;
    const CHUNKS_TOTAL = 6;
    const requests = [];
    for (let i = 0; i < CHUNKS_TOTAL; i++) {
        const query = gql(`{
        rounds(
          first: ${PER_CHUNK},
          skip: ${i * PER_CHUNK},
          orderBy: unixTimestamp,
          orderDirection: desc,
          where: {feed: "${feedId}"}
        ) {
          unixTimestamp,
          value
        }
      }`);
        requests.push(chainlinkClient.query({ query }));
    }

    try {
        const chunks = await Promise.all(requests);
        let prices: any[] = [];
        const uniqTs = new Set();
        chunks.forEach((chunk) => {
            chunk.data.rounds.forEach((item: any) => {
                if (uniqTs.has(item.unixTimestamp)) {
                    return;
                }

                uniqTs.add(item.unixTimestamp);
                prices.push([item.unixTimestamp, Number(item.value) / 1e8]);
            });
        });
        prices.sort(([timeA], [timeB]) => timeA - timeB);
        const current_price = prices[prices.length - 1][1];
        const { high_24, low_24, start_price } = getHighAndlow24(prices);
        prices = getCandlesFromPrices(prices, period);
        console.log(prices)
        return {
            prices,
            high_24,
            low_24,
            start_price,
            current_price
        };
    } catch (err) {
        console.error(err);
        console.warn("getChainlinkChartPricesFromGraph failed");
    }
}
