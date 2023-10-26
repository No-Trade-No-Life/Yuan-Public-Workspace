/**
 * 根据目标盈利计算目标平仓价
 * @public
 * @param product - 品种信息
 * @param openPrice - 开仓价
 * @param volume - 成交量
 * @param desiredProfit - 目标盈利
 * @param variant - 仓位类型
 * @param currency - 账户货币
 * @param quotes - 市场报价
 * @returns - 目标平仓价
 * @see https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh
 */
export const getClosePriceByDesiredProfit = (
  product: IProduct,
  openPrice: number,
  volume: number,
  desiredProfit: number,
  variant: PositionVariant,
  currency: string,
  quotes: (product_id: string) => { ask: number; bid: number } | undefined
) => {
  const variant_coefficient = variant === PositionVariant.LONG ? 1 : -1;
  const cross_product_exchange_rate =
    product.base_currency !== currency
      ? (variant === PositionVariant.LONG
          ? quotes(`${product.base_currency}${currency}`)?.bid
          : quotes(`${product.base_currency}${currency}`)?.ask) ?? 1
      : 1;

  const beta =
    desiredProfit / (variant_coefficient * volume * (product.value_speed ?? 1));

  if (!product.is_underlying_base_currency) {
    return openPrice + beta / cross_product_exchange_rate;
  }
  if (product.quoted_currency === currency) {
    return openPrice + beta;
  }
  if (beta >= cross_product_exchange_rate) {
    return NaN;
  }
  return openPrice / (1 - beta / cross_product_exchange_rate);
};
