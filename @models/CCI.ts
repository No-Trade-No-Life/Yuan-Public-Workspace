import { useATR, useCCI, useRef, useSimplePositionManager } from "@libs";

// CCI 顺势交易策略
export default () => {
  const { product_id, high, low, close } = useParamOHLC("SomeKey");
  const idx = close.length - 2;

  const cciFast = useCCI(high, low, close, 18);
  const cciSlow = useCCI(high, low, close, 54);
  const { ATR: atr108 } = useATR(high, low, close, 108);

  const accountInfo = useAccountInfo();
  const [targetVolume, setTargetVolume] = useSimplePositionManager(
    accountInfo.account_id,
    product_id
  );
  const stopLossPrice = useRef(close[idx] - 6 * atr108[idx]);

  useEffect(() => {
    if (idx < 108) return; // 确保ATR有足够的数据

    // 空头信号：当CCI快线进入正200以上，且下穿慢线时，建立空单。
    if (cciFast[idx] > 200 && cciFast[idx] < cciSlow[idx]) {
      setTargetVolume(-1);
      stopLossPrice.current = close[idx] + 6 * atr108[idx]; // 使用6倍ATR的值作为停损点位。
    }

    // 多头信号：当CCI快线进入负200以下，且上穿慢线时，建立多单。
    if (cciFast[idx] < -200 && cciFast[idx] > cciSlow[idx]) {
      setTargetVolume(1);
      stopLossPrice.current = close[idx] - 6 * atr108[idx]; // 使用6倍ATR的值作为停损点位。
    }

    // 多单平仓：当CCI快线进入正200以上，且下穿慢线时，平多单。
    if (targetVolume > 0 && cciFast[idx] > 200 && cciFast[idx] < cciSlow[idx]) {
      setTargetVolume(0);
    }
    // 空单平仓：当CCI快线进入负200以下，且上穿慢线时，平空单。
    if (
      targetVolume < 0 &&
      cciFast[idx] < -200 &&
      cciFast[idx] > cciSlow[idx]
    ) {
      setTargetVolume(0);
    }

    // 停损条件
    if (
      (targetVolume > 0 && close[idx] < stopLossPrice.current) ||
      (targetVolume < 0 && close[idx] > stopLossPrice.current)
    ) {
      setTargetVolume(0);
    }
  }, [idx]);
};
