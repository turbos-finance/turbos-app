import { createChart, IChartApi, ISeriesApi, TimeRange } from "krasulya-lightweight-charts";
import { useCallback, useEffect, useState } from "react";
import { format as formatDateFn } from "date-fns";
import { CHART_PERIODS, getChainlinkChartPricesFromGraph } from "../../../../../utils/subgraph";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';
import styles from './Chart.module.css';
import downIcon from '../../../../../assets/images/down.png';
import upIcon from '../../../../../assets/images/up.png';
import { numberWithCommas } from "../../../../../utils";
import { useRefresh } from "../../../../../contexts/refresh";
import BigNumber from "bignumber.js";
import { getLocalStorage, getLocalStorageSupplyTradeToken, setLocalStorage, TurbosChartTime, TurbosPerpetualTo } from "../../../../../lib";
import { useStore } from "../../../../../contexts/store";

const times = [
  { label: '5m', id: '5' },
  { label: '15m', id: '' },
  { label: '1h', id: '' },
  { label: '4h', id: '' },
  { label: '1d', id: '' }
];

const timezoneOffset = -new Date().getTimezoneOffset() * 60;

function formatDateTime(time: number) {
  return formatDateFn(time * 1000, "dd MMM yyyy, h:mm a");
}

const getSeriesOptions = () => ({
  // https://github.com/tradingview/lightweight-charts/blob/master/docs/area-series.md
  lineColor: "#5472cc",
  topColor: "rgba(49, 69, 131, 0.4)",
  bottomColor: "rgba(42, 64, 103, 0.0)",
  lineWidth: 2,
  priceLineColor: "#3a3e5e",
  downColor: "#fa3c58",
  wickDownColor: "#fa3c58",
  upColor: "#0ecc83",
  wickUpColor: "#0ecc83",
  borderVisible: false,
});

const getChartOptions = (width: any, height: any) => ({
  width,
  height,
  layout: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    textColor: "#ccc",
    fontFamily: "Montserrat Light",
  },
  localization: {
    locale: 'en-US',
    // https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md#time-format
    timeFormatter: (businessDayOrTimestamp: number) => {
      return formatDateTime(businessDayOrTimestamp - timezoneOffset);
    },
  },
  grid: {
    vertLines: {
      visible: true,
      color: "rgba(35, 38, 59, 1)",
      style: 2,
    },
    horzLines: {
      visible: true,
      color: "rgba(35, 38, 59, 1)",
      style: 2,
    },
  },
  // https://github.com/tradingview/lightweight-charts/blob/master/docs/time-scale.md#time-scale
  timeScale: {
    rightOffset: 5,
    borderVisible: false,
    barSpacing: 5,
    timeVisible: true,
    fixLeftEdge: true,
  },
  // https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md#price-axis
  priceScale: {
    borderVisible: false,
  },
  crosshair: {
    horzLine: {
      color: "#aaa",
    },
    vertLine: {
      color: "#aaa",
    },
    mode: 0,
  },
});

type ChartProps = {
  symbol: string,
  changeChartSymbol?: (symbol: string) => void,
  dropdownDisabled?: boolean
}

function Chart(props: ChartProps) {
  const turbos_perpetual_to = getLocalStorageSupplyTradeToken(TurbosPerpetualTo);
  const turbos_chart_time = getLocalStorage(TurbosChartTime);

  const { symbol, changeChartSymbol, dropdownDisabled } = props;

  const { refreshTime } = useRefresh();
  const { store } = useStore();
  const { allSymbolPrice } = store;

  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [chartNode, setChartNode] = useState<HTMLDivElement | null>(null);
  const divRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setNode(node)
    }
  }, []);

  const chartRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setChartNode(node)
    }
  }, []);

  const [prices, setPrices] = useState({
    high_24: 0,
    low_24: 0,
    start_price: 0,
    current_price: 0
  });
  const [pricedata, setPricedata] = useState<any[]>([]);
  const [chartTime, setChartTime] = useState(turbos_chart_time || '4h');
  const [currentChart, setCurrentChart] = useState<undefined | IChartApi>();
  const [currentSeries, setCurrentSeries] = useState<undefined | ISeriesApi<"Candlestick">>();
  const [hoveredCandlestick, setHoveredCandlestick] = useState<null | any>(null);
  const [chartInited, setChartInited] = useState(false);
  const [visible, setVisible] = useState(false);

  const [chartToken, setChartToken] = useState(turbos_perpetual_to ? turbos_perpetual_to.symbol : 'BTC')

  const changeChartToken = (value: string) => {
    setChartToken(value);
    changeChartSymbol && changeChartSymbol(value);
    setVisible(false);
  }

  const changeVisible = (visible: boolean) => {
    setVisible(visible)
  }

  const onCrosshairMove = useCallback(
    (evt: any) => {
      if (!evt.time) {
        return;
      }
      for (const point of evt.seriesPrices.values()) {
        setHoveredCandlestick((hoveredCandlestick: { time: any; }) => {
          if (hoveredCandlestick && hoveredCandlestick.time === evt.time) {
            return hoveredCandlestick;
          }
          return {
            time: evt.time,
            ...point,
          };
        });
        break;
      }
    },
    [setHoveredCandlestick]
  );

  const scaleChart = useCallback(() => {
    if (currentChart) {
      let periods = CHART_PERIODS[chartTime]
      if (periods < CHART_PERIODS['1h']) {
        periods = CHART_PERIODS['1h'];
      }
      const from = Date.now() / 1000 - (7 * 24 * periods) / 2 + timezoneOffset;
      const to = Date.now() / 1000 + timezoneOffset;
      currentChart.timeScale().setVisibleRange({ from, to } as TimeRange);
      // currentChart.timeScale().fitContent();
    }
  }, [currentChart, chartTime]);

  const changeChartTime = (label: string) => {
    setChartTime(label);
    setLocalStorage(TurbosChartTime, label);
  }

  useEffect(() => {
    if (!currentChart || !chartNode) {
      return;
    }
    const resizeChart = () => {
      currentChart.resize(chartNode.offsetWidth, chartNode.offsetHeight);
    };
    window.addEventListener("resize", resizeChart);
    return () => window.removeEventListener("resize", resizeChart);
  }, [currentChart]);

  useEffect(() => {
    if (currentSeries && pricedata && pricedata.length) {
      currentSeries.setData(pricedata);
      if (!chartInited) {
        scaleChart();
        setChartInited(true);
      }
    }
  }, [pricedata, currentSeries]);

  // loading data
  useEffect(() => {
    if (chartToken && allSymbolPrice && allSymbolPrice[chartToken] && refreshTime) {
      (async () => {
        const {
          prices,
          high_24,
          low_24,
          start_price,
          current_price
        } = await getChainlinkChartPricesFromGraph(chartToken, chartTime) || { prices: [] }
        // sui token price
        if (allSymbolPrice[chartToken] && prices.length > 0) {
          const symbolPrice = Number(allSymbolPrice[chartToken].price);
          const lastData = prices[prices.length - 1];
          lastData.close = symbolPrice;

          if (symbolPrice > lastData.high) {
            lastData.higt = symbolPrice;
          }

          if (symbolPrice < lastData.low) {
            lastData.low = symbolPrice
          }

        }

        setPricedata(prices);
        setPrices({
          high_24,
          low_24,
          start_price,
          current_price
        })
      })();
    }
  }, [chartToken, chartTime, refreshTime, allSymbolPrice])

  // create cart
  useEffect(() => {
    if (!node || !chartNode || !pricedata || pricedata.length <= 0 || currentChart) {
      return;
    }
    const chart = createChart(
      node,
      getChartOptions(chartNode.offsetWidth, chartNode.offsetHeight)
    );
    chart.subscribeCrosshairMove(onCrosshairMove);

    const series = chart.addCandlestickSeries();

    setCurrentChart(chart);
    setCurrentSeries(series);

    setHoveredCandlestick(pricedata[pricedata.length - 1]);
  }, [node, chartNode, pricedata]);

  useEffect(() => {
    if (symbol && symbol !== chartToken) {
      setChartToken(symbol);
    }
  }, [symbol]);

  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <div className="overlay-dropdown-li menus-dropdown-li" onClick={() => { changeChartToken('BTC'); }}>
          <span>BTC / USD</span>
        </div>
        <div className="overlay-dropdown-li menus-dropdown-li " onClick={() => { changeChartToken('ETH'); }}>
          <span>ETH / USD</span>
        </div>
      </MenuItem>
    </Menu>
  );

  let price = prices.current_price;
  let ema_price = prices.current_price;
  let low = prices.low_24;
  let high = prices.high_24;
  let percent = prices.start_price && prices.current_price && BigNumber(prices.current_price).minus(prices.start_price).div(prices.start_price).multipliedBy(100).toNumber();
  // sui token price
  if (allSymbolPrice && allSymbolPrice[chartToken]) {
    const symbolPrice = Number(allSymbolPrice[chartToken].price);
    const ema_symbolPrice = Number(allSymbolPrice[chartToken].emaPrice);

    price = symbolPrice;
    ema_price = ema_symbolPrice;
    low = low > symbolPrice ? symbolPrice : low;
    high = high > symbolPrice ? high : symbolPrice;
    percent = prices.start_price && BigNumber(price).minus(prices.start_price).div(prices.start_price).multipliedBy(100).toNumber();
  }

  return (
    <>
      <div className="main-right-container">
        {
          dropdownDisabled
            ? <div className={styles.tokenselect}>
              <span>{chartToken} / USD</span>
            </div>
            : <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown menus-dropdown'} onVisibleChange={changeVisible}>
              <div className={styles.tokenselect}>
                <span>{chartToken} / USD</span>
                <img src={visible ? upIcon : downIcon} className="sectiontokensicon" alt="" />
              </div>
            </Dropdown>
        }

        <div className={styles.pricelistcon}>
          <div className={styles.pricelist}>
            <div className={styles.value1}>
              {price && `\$${numberWithCommas(price.toFixed(2))}` || '-'}
            </div>
            <div className={styles.value2}>
              {ema_price && `\$${numberWithCommas(ema_price.toFixed(2))}` || '-'}
            </div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h Change</div>
            <div className={styles.value1} style={{ color: percent >= 0 ? '#0ecc83' : '#F04438' }}>{`${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`}</div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h High</div>
            <div className={styles.value1}>{high && numberWithCommas(high.toFixed(2)) || '-'}</div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h Low</div>
            <div className={styles.value1}>{low && numberWithCommas(low.toFixed(2)) || '-'}</div>
          </div>
        </div>
      </div>

      <div className="chart" ref={chartRef}>
        <div className='chart-con'>
          <div className='chart-tabs'>
            {times.map((item: any) => <span
              key={item.label}
              className={chartTime === item.label ? 'active' : ''}
              onClick={() => { changeChartTime(item.label) }}>
              {item.label}
            </span>)}
          </div>
          {
            hoveredCandlestick ?
              <div className='chart-value'>
                <div>O <span>{hoveredCandlestick.open.toFixed(2)}</span></div>
                <div>H <span>{hoveredCandlestick.high.toFixed(2)}</span></div>
                <div>L <span>{hoveredCandlestick.low.toFixed(2)}</span></div>
                <div>C <span>{hoveredCandlestick.close.toFixed(2)}</span></div>
              </div>
              : null
          }

        </div>
        <div className='chart-result' ref={divRef}></div>
      </div>

    </>

  )
}


export default Chart;