import { useSMA } from "./SMA";
import { useSTD } from "./STD";

/**
 * 计算 BOLL 指标
 * @param source - 源数据序列
 * @param period - 周期
 * @param multiplier - 标准差倍数
 */
export const useBOLL = (
  source: Series,
  period: number = 20,
  multiplier: number = 2
) => {
  const MIDDLE = useSMA(source, period);
  useEffect(() => {
    MIDDLE.name = `BOLL.MIDDLE(${source.name}, ${period}, ${multiplier})`;
  }, []);
  const STD = useSTD(source, period);
  useEffect(() => {
    STD.tags.display = "none";
  }, []);
  const UPPER = useSeries(
    `BOLL.UPPER(${source.name}, ${period}, ${multiplier})`,
    source,
    { display: "line" }
  );
  const LOWER = useSeries(
    `BOLL.LOWER(${source.name}, ${period}, ${multiplier})`,
    source,
    { display: "line" }
  );
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    UPPER[i] = MIDDLE[i] + multiplier * STD[i];
    LOWER[i] = MIDDLE[i] - multiplier * STD[i];
  });
  return { MIDDLE, UPPER, LOWER };
};
