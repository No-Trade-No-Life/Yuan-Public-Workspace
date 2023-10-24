// 海龟交易法，做多版本
// 当价格突破20日价格的最高价的时候，开仓做多
// 开仓后，当多头头寸在突破过去10日最低价处止盈离市。
// 开仓后，当市价继续向盈利方向突破1/2 ATR时加仓，止损位为2ATR, 每加仓一次，止损位就提高1/2 ATR
import { useATR, useMAX, useMIN } from "@libs";

export default () => {
  const { product_id, high, low, close } = useParamOHLC("SomeKey");
  const N = useParamNumber("N", 20);

  const HH = useMAX(high, N);
  const LL = useMIN(low, N);

  const pL = useSinglePosition(product_id, PositionVariant.LONG);
  const atr = useATR(high, low, close, 14);
  const price_break = useRef(0);
  useEffect(() => {
    const idx = close.length - 2;
    if (idx < N) return;

    const atrValue = atr[idx];

    // 当价格突破20日价格的最高价时，首次开仓做多，同时记录当前价格
    if (close[idx] > HH[idx - 1] && pL.volume === 0) {
      price_break.current = close[idx];
      pL.setTargetVolume(1);
    }

    // 当多头头寸在突破过去10日最低价处止盈离市
    if (pL.volume > 0 && close[idx] < LL[idx - 10]) {
      pL.setTargetVolume(0);
    }

    // 当市价继续向盈利方向突破1/2 atr时加仓，止损位为2*atr
    if (pL.volume > 0 && close[idx] > price_break.current + 0.5 * atrValue) {
      pL.setTargetVolume(pL.volume + 1);
      pL.setStopLossPrice(price_break.current - 2 * atrValue);
      price_break.current = close[idx];
    }
  }, [close.length]);
};
