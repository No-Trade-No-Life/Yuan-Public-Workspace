// R-Breaker 策略
// 高低周期的回转策略，根据高周期计算几个枢轴价位，然后在低周期上进行交易
import { useParamOHLC, useRuleEffect, useSinglePosition } from "@libs";
export default () => {
  // 设定参数
  const { product_id, close: C } = useParamOHLC("低周期"); // e.g. 1min
  const { high, low, close } = useParamOHLC("高周期"); // e.g. 1Day

  const 中心价位 =
    (high.previousValue + low.previousValue + close.previousValue) / 3;
  const 突破买入价 = high.previousValue + 2 * 中心价位 - 2 * low.previousValue;
  const 观察卖出价 = 中心价位 + high.previousValue - low.previousValue;
  const 反转卖出价 = 2 * 中心价位 - low.previousValue;
  const 反转买入价 = 2 * 中心价位 - high.previousValue;
  const 观察买入价 = 中心价位 - (high.previousValue - low.previousValue);
  const 突破卖出价 = low.previousValue - 2 * (high.previousValue - 中心价位);
  // 绘制采样点
  const _中心价位 = useSeries("中心价位", C, { display: "line" });
  const _突破买入价 = useSeries("突破买入价", C, { display: "line" });
  const _观察卖出价 = useSeries("观察卖出价", C, { display: "line" });
  const _反转卖出价 = useSeries("反转卖出价", C, { display: "line" });
  const _反转买入价 = useSeries("反转买入价", C, { display: "line" });
  const _观察买入价 = useSeries("观察买入价", C, { display: "line" });
  const _突破卖出价 = useSeries("突破卖出价", C, { display: "line" });
  useEffect(() => {
    const currentIndex = C.currentIndex;
    _中心价位[currentIndex] = 中心价位;
    _突破买入价[currentIndex] = 突破买入价;
    _观察卖出价[currentIndex] = 观察卖出价;
    _反转卖出价[currentIndex] = 反转卖出价;
    _反转买入价[currentIndex] = 反转买入价;
    _观察买入价[currentIndex] = 观察买入价;
    _突破卖出价[currentIndex] = 突破卖出价;
  });
  // 设置仓位管理器
  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const pS = useSinglePosition(product_id, PositionVariant.SHORT);

  const price = C.currentValue;

  useRuleEffect(
    "突破买入",
    () => pL.volume === 0 && pS.volume === 0 && price > 突破买入价,
    () => pL.setTargetVolume(1),
    [close.previousIndex]
  );

  useRuleEffect(
    "突破卖出",
    () => pL.volume === 0 && pS.volume === 0 && price < 突破卖出价,
    () => pS.setTargetVolume(1),
    [close.previousIndex]
  );

  useRuleEffect(
    "反转卖出",
    () => pL.volume > 0 && high.currentValue > 观察卖出价 && price < 反转卖出价,
    () => {
      pL.setTargetVolume(0);
      pS.setTargetVolume(1);
    },
    [close.previousIndex]
  );

  useRuleEffect(
    "反转买入",
    () => pS.volume > 0 && low.currentValue < 观察买入价 && price > 反转买入价,
    () => {
      pL.setTargetVolume(1);
      pS.setTargetVolume(0);
    },
    [close.previousIndex]
  );
};
