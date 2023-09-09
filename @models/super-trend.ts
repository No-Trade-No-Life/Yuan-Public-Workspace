// 超级趋势策略
// 每当超级趋势为它就进入多头，并在相反情况发生时进入空头。
// 超级趋势定义为：
// 超级趋势分为上轨和下轨
// 上轨为上一根K线的(close+open)/2 + A * atr
// 下轨为上一根K线的(close+open)/2 - A * atr
// 当价格上穿到上轨时，进入突破模式，当下穿上轨时，进入下跌模式
import { useATR } from "@libs";

export default () => {
  const { product_id, close, open, high, low } = useParamOHLC("SomeKey");
  const A = useParamNumber("A", 2);
  const atr = useATR(high, low, close, 14);

  const idx = close.length - 2;
  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);

  useEffect(() => {
    if (idx < 1) return;

    const prevClose = (close[idx] + open[idx]) / 2;
    const prevUpper = prevClose + A * atr[idx];
    const prevLower = prevClose - A * atr[idx];

    if (close[idx] > prevUpper) {
      // 进入突破模式，做多
      pL.setTargetVolume(1);
      pS.setTargetVolume(0);
    }

    if (close[idx] < prevLower) {
      // 进入下跌模式，做空
      pL.setTargetVolume(0);
      pS.setTargetVolume(1);
    }
  }, [idx]);
};
