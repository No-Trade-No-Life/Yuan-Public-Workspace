// Dual Thrust 策略
// 收盘价突破上轨，做多
// 收盘价突破下轨，做空
import {
  useMAX,
  useMIN,
  useParamNumber,
  useParamOHLC,
  useRuleEffect,
  useSimplePositionManager,
} from "@libs";

export default () => {
  const { product_id, open, high, low, close } = useParamOHLC("SomeKey");
  const N = useParamNumber("N", 20);
  const K1 = useParamNumber("K1", 0.2);
  const K2 = useParamNumber("K2", 0.2);

  // 计算 Dual Thrust 策略所需的指标
  const HH = useMAX(high, N);
  const HC = useMAX(close, N);
  const LC = useMIN(close, N);
  const LL = useMIN(low, N);
  // 避免中间指标在图表中显示，可能会显得杂乱
  useEffect(() => {
    HH.tags.display = "none";
    HC.tags.display = "none";
    LC.tags.display = "none";
    LL.tags.display = "none";
  }, []);
  const Range = useSeries("Range", close);
  useEffect(() => {
    const currentIndex = close.currentIndex;
    Range[currentIndex] = Math.max(
      HH.currentValue - LC.currentValue,
      HC.currentValue - LL.currentValue
    );
  });
  const Upper = useSeries("Upper", close, { display: "line" });
  const Lower = useSeries("Lower", close, { display: "line" });
  useEffect(() => {
    const currentIndex = close.currentIndex;
    Upper[currentIndex] = open.currentValue + K1 * Range.currentValue;
    Lower[currentIndex] = open.currentValue - K2 * Range.currentValue;
  });

  // 设置仓位管理器
  const accountInfo = useAccountInfo();
  const [targetVolume, setTargetVolume] = useSimplePositionManager(
    accountInfo.account_id,
    product_id
  );

  useRuleEffect(
    "突破上轨开多",
    () => close.previousIndex >= N && close.previousValue > Upper.previousValue,
    () => setTargetVolume(1),
    [close.previousIndex]
  );

  useRuleEffect(
    "突破下轨开空",
    () => close.previousIndex >= N && close.previousValue < Lower.previousValue,
    () => setTargetVolume(-1),
    [close.previousIndex]
  );
};
