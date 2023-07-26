import { useEMA } from "./EMA";

/**
 * 计算相对强弱指标 (RSI)
 * @param source - 源数据
 * @param period - 周期
 */
export const useRSI = (source: Series, period = 14) => {
  const RSI = useSeries(`RSI(${source.name},${period})`, source, {
    display: "line",
    chart: "new",
  });
  const U = useSeries("U", source);
  const D = useSeries("D", source);
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    U[i] = source[i] > source[i - 1] ? source[i] - source[i - 1] : 0;
    D[i] = source[i] < source[i - 1] ? source[i - 1] - source[i] : 0;
  });

  const EMA_U = useEMA(U, period);
  const EMA_D = useEMA(D, period);
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    RSI[i] = (EMA_U[i] / (EMA_U[i] + EMA_D[i])) * 100;
  });
  return RSI;
};
