// 双均线策略 (Double Moving Average)
// 当短期均线由下向上穿越长期均线时做多 (金叉)
// 当短期均线由上向下穿越长期均线时做空 (死叉)
import {
  useParamOHLC,
  useRuleEffect,
  useSMA,
  useSimplePositionManager,
} from "@libs";

export default () => {
  // 使用收盘价序列
  const { product_id, close } = useParamOHLC("SomeKey");
  // NOTE: 使用当前 K 线的上一根 K 线的收盘价，保证策略在 K 线结束时才会执行

  // 使用 20，60 均线
  const sma20 = useSMA(close, 20);
  const sma60 = useSMA(close, 60);

  const accountInfo = useAccountInfo();

  // 设置仓位管理器
  const [targetVolume, setTargetVolume] = useSimplePositionManager(
    accountInfo.account_id,
    product_id
  );

  useRuleEffect(
    "金叉开多平空",
    () => sma20.previousValue > sma60.previousValue,
    () => setTargetVolume(1),
    [close.currentIndex]
  );

  useRuleEffect(
    "死叉开空平多",
    () => sma20.previousValue < sma60.previousValue,
    () => setTargetVolume(-1),
    [close.currentIndex]
  );
};
