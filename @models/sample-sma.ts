// 双均线策略
import { useSMA } from "@hooks";

export default () => {
  const datasource_id = useParamString("数据源ID");
  const product_id = useParamString("品种ID");
  const period_in_sec = useParamNumber("周期");

  const { close: c } = useOHLC(datasource_id, product_id, period_in_sec);
  const idx = c.length - 2;

  const sma20 = useSMA(c, 20);
  const sma60 = useSMA(c, 60);

  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);

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
