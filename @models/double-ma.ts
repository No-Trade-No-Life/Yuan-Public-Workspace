// 双均线策略 (Double Moving Average)
// 当短期均线由下向上穿越长期均线时做多 (金叉)
// 当短期均线由上向下穿越长期均线时做空 (死叉)
import { useSMA, useSimplePositionManager } from "@libs";

export default () => {
  // 使用收盘价序列
  const { product_id, close } = useParamOHLC("SomeKey");
  // NOTE: 使用当前 K 线的上一根 K 线的收盘价，保证策略在 K 线结束时才会执行
  const idx = close.length - 2;

  // 使用 20，60 均线
  const sma20 = useSMA(close, 20);
  const sma60 = useSMA(close, 60);

  const accountInfo = useAccountInfo();

  // 设置仓位管理器
  const [targetVolume, setTargetVolume] = useSimplePositionManager(
    accountInfo.account_id,
    product_id
  );

  useEffect(() => {
    if (idx < 60) return; // 略过一开始不成熟的均线数据
    // 金叉开多平空
    if (sma20[idx] > sma60[idx]) {
      setTargetVolume(1);
    }
    // 死叉开空平多
    if (sma20[idx] < sma60[idx]) {
      setTargetVolume(-1);
    }
  }, [idx]);
};
