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


function Chart() {

  const { refreshTime } = useRefresh();

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


  const [pricedata, setPricedata] = useState<any[]>([]);
  const [chartTime, setChartTime] = useState('4h');
  const [currentChart, setCurrentChart] = useState<undefined | IChartApi>();
  const [currentSeries, setCurrentSeries] = useState<undefined | ISeriesApi<"Candlestick">>();
  const [hoveredCandlestick, setHoveredCandlestick] = useState<null | any>(null);
  const [chartInited, setChartInited] = useState(false);
  const [visible, setVisible] = useState(false);

  const [chartToken, setChartToken] = useState('BTC')

  const changeChartToken = (value: string) => {
    setChartToken(value);
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
      const from = Date.now() / 1000 - (7 * 24 * CHART_PERIODS[chartTime]) / 2 + timezoneOffset;
      const to = Date.now() / 1000 + timezoneOffset;
      currentChart.timeScale().setVisibleRange({ from, to } as TimeRange);
      // currentChart.timeScale().fitContent();
    }
  }, [currentChart, chartTime]);


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
    (async () => {
      setPricedata(await getChainlinkChartPricesFromGraph(chartToken, chartTime) || []);
    })();
  }, [chartToken, chartTime, refreshTime])

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


  let high;
  let low;
  let deltaPrice;
  let delta;
  let deltaPercentage;
  let deltaPercentageStr;

  const now = Date.now() / 1000;
  const timeThreshold = now - 24 * 60 * 60;
  // console.log(pricedata);
  console.log(pricedata[pricedata.length - 1])
  if (pricedata) {
    for (let i = pricedata.length - 1; i > 0; i--) {
      const price = pricedata[i];
      if (price.time < timeThreshold) {
        break;
      }

      if (!low) {
        low = price.low;
      }
      if (!high) {
        high = price.high;
      }

      if (price.high > high) {
        high = price.high;
      }
      if (price.low < low) {
        low = price.low;
      }

      deltaPrice = price.open;
    }
  }

  return (
    <>
      <div className="main-right-container">

        <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown menus-dropdown'} onVisibleChange={changeVisible}>
          <div className={styles.tokenselect}>
            <span>{chartToken} / USD</span>
            <img src={visible ? upIcon : downIcon} className="sectiontokensicon" alt="" />
          </div>
        </Dropdown>

        <div className={styles.pricelistcon}>
          <div className={styles.pricelist}>
            <div className={styles.value1}>{deltaPrice && numberWithCommas(deltaPrice.toFixed(2)) || '-'}</div>
            <div className={styles.value2}>${deltaPrice && numberWithCommas(deltaPrice.toFixed(2)) || '-'}</div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h Change</div>
            <div className={styles.value1} style={{ color: '#0ecc83' }}>+6.9%</div>
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
              onClick={() => { setChartTime(item.label) }}>
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