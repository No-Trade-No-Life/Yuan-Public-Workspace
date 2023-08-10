import { useSUM } from "@libs";
/**
 * 使用移动平均线指标
 * @param source
 * @param period
 * @returns
 */
export const useSMA = (source: Series, period: number): Series => {
  const SUM = useSUM(source, period);
  const SMA = useSeries(`SMA(${source.name},${period})`, source, {
    display: "line",
  });
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    SMA[i] = SUM[i] / Math.min(i + 1, period);
  });
  return SMA;
};
