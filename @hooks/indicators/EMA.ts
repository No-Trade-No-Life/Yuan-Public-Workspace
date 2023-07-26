/**
 * 计算指数移动平均线 (EMA)
 * @param source - 源数据
 * @param period - 周期
 * @returns 指数移动平均线序列
 */
export const useEMA = (source: Series, period: number) => {
  const EMA = useSeries(`EMA(${source.name}, ${period})`, source, {
    display: "line",
  });
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    EMA[i] =
      i > 0
        ? (2 * source[i] + (period - 1) * EMA[i - 1]) / (period + 1)
        : source[i];
  });
  return EMA;
};
