// 超级趋势策略
// 每当超级趋势为它就进入多头，并在相反情况发生时进入空头。
// 超级趋势定义为：
// 超级趋势分为上轨和下轨
// 上轨为上一根K线的(close+open)/2 + A * atr
// 下轨为上一根K线的(close+open)/2 - A * atr
// 当价格上穿到上轨时，进入突破模式，当下穿上轨时，进入下跌模式
// 并画出上轨和下轨
import {
  useATR,
  useParamNumber,
  useParamOHLC,
  useRuleEffect,
  useSeriesMap,
  useSinglePosition,
} from "@libs";

export default () => {
  const { product_id, close, open, high, low } = useParamOHLC("SomeKey");
  const A = useParamNumber("A", 2);
  const { ATR: atr } = useATR(high, low, close, 14);

  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);
  const prevClose = (close.previousValue + open.previousValue) / 2;
  const upper = useSeriesMap(
    "Upper",
    close,
    { display: "line" },
    (i) => prevClose + A * atr[i]
  );
  const lower = useSeriesMap(
    "Lower",
    close,
    { display: "line" },
    (i) => prevClose - A * atr[i]
  );

  useRuleEffect(
    "突破模式",
    () => close.previousIndex > 0 && close.previousValue > upper.previousValue,
    () => {
      pL.setTargetVolume(1);
      pS.setTargetVolume(0);
    },
    [close.previousIndex]
  );

  useRuleEffect(
    "下跌模式",
    () => close.previousIndex > 0 && close.previousValue < lower.previousValue,
    () => {
      pL.setTargetVolume(0);
      pS.setTargetVolume(1);
    },
    [close.previousIndex]
  );
};
