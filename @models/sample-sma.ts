// 双均线策略
import { useSMA } from "@hooks";

export default () => {
  // 设定参数
  const datasource_id = useParamString("数据源ID");
  const product_id = useParamString("品种ID");
  const period_in_sec = useParamNumber("周期");

  // 使用收盘价序列
  const { close: c } = useOHLC(datasource_id, product_id, period_in_sec);
  // NOTE: 使用当前 K 线的上一根 K 线的收盘价，保证策略在 K 线结束时才会执行
  const idx = c.length - 2;

  // 使用 20，60 均线
  const sma20 = useSMA(c, 20);
  const sma60 = useSMA(c, 60);

  // 设置仓位管理器
  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);

  // 金叉开多平空
  useEffect(() => {
    if (idx < 60) {
      return;
    }
    const price = c[idx];
    if (pL.volume === 0) {
      if (sma20[idx] > sma60[idx] && price > sma20[idx]) {
        pL.setTargetVolume(1);
      }
    } else {
      if (pL.volume > 0 && sma20[idx] < sma60[idx]) {
        pL.setTargetVolume(0);
      }
    }
  }, [idx]);

  // 死叉开空平多
  useEffect(() => {
    if (idx < 60) {
      return;
    }
    const price = c[idx];
    if (pS.volume === 0) {
      if (sma20[idx] < sma60[idx] && price < sma20[idx]) {
        pS.setTargetVolume(1);
      }
    } else {
      if (pS.volume < 0 && sma20[idx] > sma60[idx]) {
        pS.setTargetVolume(0);
      }
    }
  }, [idx]);
};
