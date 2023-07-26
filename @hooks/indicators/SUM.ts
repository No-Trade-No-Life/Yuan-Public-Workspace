/**
 * 使用移动求和计算指标
 * @param source
 * @param period
 * @returns
 */
export const useSUM = (source: Series, period: number) => {
  const SUM = useSeries(`SUM(${source.name}, ${period})`, source);

  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    SUM[i] =
      source[i] +
      (i > 0 ? SUM[i - 1] : 0) -
      (i - period >= 0 ? source[i - period] : 0);
  });
  return SUM;
};
