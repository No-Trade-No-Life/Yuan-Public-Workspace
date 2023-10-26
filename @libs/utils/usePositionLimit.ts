import { mergePositions } from "./mergePositions";

/**
 * Derive a PositionLimit account from the source account.
 *
 * The derived account has a specified position limit. Its positions' volume will be limited to the position limit.
 *
 */
export function usePositionLimit(
  source_account_id: string,
  positionLimit: number
) {
  const src = useAccountInfo({ account_id: source_account_id });
  const tar = useAccountInfo({
    account_id: `${source_account_id}-PL_${positionLimit}`,
    currency: src.money.currency,
    leverage: src.money.leverage,
  });
  const ex = useExchange();
  useEffect(() => {
    const orders: IOrder[] = [];
    const mapProductToPosition = Object.fromEntries(
      mergePositions(tar.positions).map((position) => [
        `${position.product_id}-${position.variant}`,
        position,
      ])
    );
    for (const order of ex.listOrders()) {
      if (order.account_id === src.account_id) {
        const positionVolume =
          mapProductToPosition[
            `${order.product_id}-${
              [OrderDirection.CLOSE_LONG, OrderDirection.OPEN_LONG].includes(
                order.direction
              )
                ? PositionVariant.LONG
                : PositionVariant.SHORT
            }`
          ]?.volume ?? 0;
        const volume = [
          OrderDirection.CLOSE_LONG,
          OrderDirection.CLOSE_SHORT,
        ].includes(order.direction)
          ? Math.min(order.volume, positionVolume)
          : Math.min(order.volume, positionLimit - positionVolume);
        if (volume > 0) {
          const theOrder = {
            ...order,
            account_id: tar.account_id,
            client_order_id: UUID(),
            volume,
          };
          ex.submitOrder(theOrder);
          orders.push(theOrder);
        }
      }
    }
    return () => {
      for (const order of orders) {
        ex.cancelOrder(order.client_order_id);
      }
    };
  });
  return tar;
}
