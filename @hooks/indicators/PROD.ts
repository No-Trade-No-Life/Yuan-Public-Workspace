/**
 * 使用移动求积计算指标
 * @param source
 * @param period
 * @returns
 */
export const usePROD = (source: Series, period: number) => {
  const PROD = useSeries(`PROD(${source.name}, ${period})`, source);

  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    PROD[i] =
      (source[i] * (i > 0 ? PROD[i - 1] : 1)) /
      (i - period >= 0 ? source[i - period] : 1);
  });
  return PROD;
};
