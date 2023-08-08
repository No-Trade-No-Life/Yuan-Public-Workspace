/**
 * 将信号延迟 N 个周期
 * @param series - 信号
 * @param period - 周期
 */
export const useDelay = (series: Series, period: number) => {
  const delayed = useSeries(`DELAY(${series.name}, ${period})`, series, {});
  useEffect(() => {
    const i = series.length - 1;
    if (i < 0) return;
    delayed[i] = series[i - period] ?? NaN;
  });
  return delayed;
};
