/**
 * 计算全距 (极差)，即数据源在窗口时间内的最大值与最小值之差
 * @param source 输入数据源
 * @param period 周期
 */
export const useRANGE = (source: Series, period: number) => {
  const Range = useSeries(`RANGE(${source.name},${period})`, source, {
    display: "line",
    chart: "new",
  });
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    const max = Math.max(...source.slice(i - period + 1, i + 1));
    const min = Math.min(...source.slice(i - period + 1, i + 1));
    Range[i] = max - min;
  });
  return Range;
};
