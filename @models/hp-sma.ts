// 使用了 HP Filter 的双均线策略
import { useHPFilter, useSMA } from "@hooks";

export default () => {
  // 设定参数
  const datasource_id = useParamString("数据源ID");
  const product_id = useParamString("品种ID");
  const period_in_sec = useParamNumber("周期");
  const lambda = useParamNumber("HP Filter 平滑系数");

  // 使用收盘价序列
  const { close: c } = useOHLC(datasource_id, product_id, period_in_sec);
  // NOTE: 使用当前 K 线的上一根 K 线的收盘价，保证策略在 K 线结束时才会执行
  const idx = c.length - 2;

  const hp = useHPFilter(c, lambda);

  // 使用 20，60 均线
  const sma20 = useSMA(hp, 20);
  const sma60 = useSMA(hp, 60);

  // 设置仓位管理器
  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);

  useEffect(() => {
    if (idx < 60) return; // 略过一开始不成熟的均线数据
    // 金叉开多平空
    if (sma20[idx] > sma60[idx]) {
      pL.setTargetVolume(1);
      pS.setTargetVolume(0);
    }
    // 死叉开空平多
    if (sma20[idx] < sma60[idx]) {
      pL.setTargetVolume(0);
      pS.setTargetVolume(1);
    }
  }, [idx]);
};
