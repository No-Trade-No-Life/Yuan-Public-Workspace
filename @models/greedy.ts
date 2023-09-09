// 贪心策略
// 如果当前开盘价与前一根K线的高点或低点之间存在差距，贪婪策略会打开一个初始订单。如果开盘价大于前一个高点，则策略做多，如果开盘价低于前一个K线的低点，则开空仓。
// 开仓后，只要蜡烛的颜色与开仓一致，就会继续向同一方向填单。如果当前仓位是多头，将为每个后续的绿色蜡烛创建新的多头订单，反之亦然。这将继续进行，直到出现不同颜色的蜡烛
import { useMAX, useMIN } from "@libs";

export default () => {
  const { product_id, open, high, low } = useParamOHLC("SomeKey");
  const idx = open.length - 1;

  const prevHigh = useMAX(high, 2)[idx - 1];
  const prevLow = useMIN(low, 2)[idx - 1];

  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);

  useEffect(() => {
    if (idx < 1) return;
    if (open[idx] > prevHigh) {
      const current = pL.targetVolume;
      pL.setTargetVolume(current + 1);
      pS.setTargetVolume(0);
    }

    if (open[idx] < prevLow) {
      const current = pS.targetVolume;
      pS.setTargetVolume(current + 1);
      pL.setTargetVolume(0);
    }
  }, [idx]);
};
