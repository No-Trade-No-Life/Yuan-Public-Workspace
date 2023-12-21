import { useMAX, useMIN } from "@libs";

/**
 * 计算全距 (极差)，即数据源在窗口时间内的最大值与最小值之差
 * @param source 输入数据源
 * @param period 周期
 */
export const useRANGE = (source: Series, period: number) => {
  const min = useMIN(source, period);
  const max = useMAX(source, period);
  const Range = useSeries(`RANGE(${source.name},${period})`, source, {
    display: "line",
    chart: "new",
  });
  useEffect(() => {
    const currentIndex = source.currentIndex;
    if (currentIndex < 0) return;
    Range[currentIndex] = max.currentValue - min.currentValue;
  });
  return Range;
};
