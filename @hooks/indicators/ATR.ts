import { useSMA } from "./SMA";

/**
 * 计算真实波动范围 (ATR)
 * @param H - 最高价
 * @param L - 最低价
 * @param C - 收盘价
 * @param period - 周期 (默认 14)
 * @returns ATR 序列
 */
export const useATR = (
  H: Series,
  L: Series,
  C: Series,
  period: number = 14
) => {
  const TR = useSeries("TR", C);
  useEffect(() => {
    const i = C.length - 1;
    if (i < 0) return;
    TR[i] = Math.abs(H[i] - L[i]);
    if (i > 0) {
      TR[i] = Math.max(
        TR[i],
        Math.abs(H[i] - C[i - 1]),
        Math.abs(L[i] - C[i - 1])
      );
    }
  });
  const ATR = useSMA(TR, period);
  useEffect(() => {
    ATR.name = `ATR(${period})`;
    ATR.tags.display = "line";
    ATR.tags.chart = "new";
  }, []);
  return ATR;
};
