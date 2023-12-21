/**
 * 节流信号，源信号在发出非零信号后一定时间内会被静默为 NaN
 * @param series - 源信号
 * @param period - 静默周期
 */
export const useThrottle = (series: Series, period: number) => {
  const ret = useSeries(`THROTTLE(${series.name},${period})`, series, {});
  const openIdxRef = useRef(0);
  useEffect(() => {
    const currentIndex = series.currentIndex;
    if (currentIndex < 0) return;
    if (currentIndex < openIdxRef.current) {
      ret[currentIndex] = NaN;
      return;
    }
    if (series[currentIndex - 1]) {
      openIdxRef.current = currentIndex + period;
      ret[currentIndex - 1] = series.previousValue;
      ret[currentIndex] = NaN;
      return;
    }
    ret[currentIndex] = series.currentValue;
  });
  return ret;
};
