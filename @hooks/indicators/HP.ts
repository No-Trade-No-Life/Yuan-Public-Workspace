/**
 * 计算 Hodrick-Prescott 滤波器
 *
 * @param source 输入数据源
 * @param lambda 平滑系数
 */
export const useHP = (source: Series, lambda: number) => {
  const HP = useSeries(`HP(${source.name},${lambda})`, source, {
    display: "line",
    chart: "new",
  });

  useEffect(() => {
    const i = source.length - 1;
    if (source.length <= 2) {
      HP[i] = source[i];
      return;
    }

    HP[i] =
      (4 * lambda * HP[i - 1] + 2 * source[i] - 2 * lambda * HP[i - 2]) /
      (2 + 2 * lambda);
  });

  return HP;
};
