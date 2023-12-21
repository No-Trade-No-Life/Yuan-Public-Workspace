/**
 * 计算 Parabolic SAR
 * @param high - 最高价序列
 * @param low - 最低价序列
 * @param start - 加速因子起始值
 * @param increment - 加速因子增量
 * @param max - 加速因子最大值
 */
export const useSAR = (
  high: Series,
  low: Series,
  start: number = 0.02,
  increment: number = 0.02,
  max: number = 0.2
) => {
  const Name = `SAR(${start}, ${increment}, ${max})`;
  const U = useSeries(`${Name}.U`, high, { display: "line" });
  const D = useSeries(`${Name}.D`, high, { display: "line" });
  const MAX = useSeries("MAX", high); // 区间极大值
  const MIN = useSeries("MIN", high); // 区间极小值
  const AF = useSeries("AF", high); // Accelerate Factor
  const direction = useSeries("direction", high); // 1 for upward, -1 for downward, 0 for unknown

  useEffect(() => {
    const i = high.currentIndex;
    if (i < 0) return;

    if (i === 0) {
      MAX[i] = high.currentValue;
      MIN[i] = low.currentValue;
      AF[i] = start;
      U[i] = high.currentValue;
      D[i] = low.currentValue;
      direction[i] = 0;
      return;
    }
    // U[i] = U[i - 1];
    // D[i] = D[i - 1];

    if (direction.previousValue !== 1) {
      // 按下行处理

      // 检查是否向上反转
      if (high.currentValue >= U.previousValue) {
        direction[i] = 1;
        MAX[i] = high.currentValue;
        MIN[i] = low.currentValue;
        U[i] = NaN; // MAX[i];
        D[i] = MIN.previousValue; // 从上一个区间的最小值开始
        AF[i] = start;
        return;
      }
      direction[i] = direction.previousValue;
      // 检查是否创新低
      if (low.currentValue < MIN.previousValue) {
        AF[i] = Math.min(max, AF.previousValue + increment);
      } else {
        AF[i] = AF.previousValue;
      }
      // 维护区间极值
      MAX[i] = Math.max(MAX.previousValue, high.currentValue);
      MIN[i] = Math.min(MIN.previousValue, low.currentValue);

      U[i] =
        U.previousValue +
        AF.currentValue * (MIN.previousValue - U.previousValue);
      D[i] = NaN; // MIN[i];
    } else {
      // 按上行处理

      // 检查是否向下反转
      if (low.currentValue <= D.previousValue) {
        direction[i] = -1;
        MAX[i] = high.currentValue;
        MIN[i] = low.currentValue;
        AF[i] = start;
        U[i] = MAX.previousValue; // 从上一个区间的最大值开始
        D[i] = NaN; // MIN[i];
        return;
      }
      direction[i] = direction.previousValue;
      // 检查是否创新高
      if (high.currentValue < MAX.previousValue) {
        AF[i] = Math.min(max, AF.previousValue + increment);
      } else {
        AF[i] = AF.previousValue;
      }
      // 维护区间极值
      MAX[i] = Math.max(MAX.previousValue, high.currentValue);
      MIN[i] = Math.min(MIN.previousValue, low.currentValue);
      U[i] = NaN; //MAX[i];
      D[i] =
        D.previousValue +
        AF.currentValue * (MAX.previousValue - D.previousValue);
    }
  });
  return { U, D, direction, MAX, MIN, AF };
};
