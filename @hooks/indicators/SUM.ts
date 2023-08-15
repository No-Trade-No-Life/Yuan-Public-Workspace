import { useSeriesMap } from "@libs";

/**
 * 使用移动求和计算指标
 * @param source
 * @param period
 * @returns
 */
export const useSUM = (source: Series, period: number) =>
  useSeriesMap(
    `SUM(${source.name}, ${period})`,
    source,
    {},
    (i, SUM) =>
      source[i] +
      (i > 0 ? SUM[i - 1] : 0) -
      (i - period >= 0 ? source[i - period] : 0)
  );
