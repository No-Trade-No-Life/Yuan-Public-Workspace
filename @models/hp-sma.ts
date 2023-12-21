// 使用了 HP Filter 的双均线策略
import {
  useHPFilter,
  useParamNumber,
  useParamOHLC,
  useRuleEffect,
  useSMA,
  useSimplePositionManager,
} from "@libs";

export default () => {
  const { product_id, close } = useParamOHLC("SomeKey"); // 使用收盘价序列
  const lambda = useParamNumber("HP Filter 平滑系数");
  // NOTE: 使用当前 K 线的上一根 K 线的收盘价，保证策略在 K 线结束时才会执行

  const hp = useHPFilter(close, lambda);

  // 使用 20，60 均线
  const sma20 = useSMA(hp, 20);
  const sma60 = useSMA(hp, 60);

  // 设置仓位管理器
  const accountInfo = useAccountInfo();
  const [targetVolume, setTargetVolume] = useSimplePositionManager(
    accountInfo.account_id,
    product_id
  );

  useRuleEffect(
    "金叉开多平空",
    () =>
      close.previousIndex >= 60 && sma20.previousValue > sma60.previousValue,
    () => setTargetVolume(1),
    [close.previousIndex]
  );

  useRuleEffect(
    "死叉开空平多",
    () =>
      close.previousIndex >= 60 && sma20.previousValue < sma60.previousValue,
    () => setTargetVolume(-1),
    [close.previousIndex]
  );
};
