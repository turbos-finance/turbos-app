import { createChart, IChartApi, ISeriesApi, TimeRange } from "krasulya-lightweight-charts";
import { useCallback, useEffect, useState } from "react";
import { format as formatDateFn } from "date-fns";
import { CHART_PERIODS, getChainlinkChartPricesFromGraph } from "../../../../../utils/subgraph";

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
    fontFamily: "Relative",
  },
  localization: {
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
  const [chartTime, setChartTime] = useState('5m');
  const [chartToken, setChartToken] = useState('BTC');
  const [currentChart, setCurrentChart] = useState<undefined | IChartApi>();
  const [currentSeries, setCurrentSeries] = useState<undefined | ISeriesApi<"Candlestick">>();
  const [hoveredCandlestick, setHoveredCandlestick] = useState<null | any>(null);


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
      scaleChart();
    }
  }, [pricedata, currentSeries]);

  // loading data
  useEffect(() => {
    (async () => {
      setPricedata(await getChainlinkChartPricesFromGraph(chartToken, chartTime) || []);
    })();
  }, [chartToken, chartTime])

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

    const series = chart.addCandlestickSeries(getSeriesOptions());

    setCurrentChart(chart);
    setCurrentSeries(series);

    setHoveredCandlestick(pricedata[pricedata.length - 1]);
  }, [node, chartNode, pricedata]);

  return (
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

  )
}


export default Chart;