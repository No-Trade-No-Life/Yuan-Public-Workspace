/**
 * Derive a Counter Party account from the source account.
 *
 * The derived account has the same positions as the source account, but the positions' direction is reversed.
 */
export function useCounterParty(source_account_id: string) {
  const src = useAccountInfo({ account_id: source_account_id });
  const tar = useAccountInfo({
    account_id: `${source_account_id}-CP`,
    currency: src.money.currency,
    leverage: src.money.leverage,
  });

  const ex = useExchange();
  useEffect(() => {
    const orders: IOrder[] = [];
    for (const order of ex.listOrders()) {
      if (order.account_id === src.account_id) {
        const theOrder = {
          ...order,
          account_id: tar.account_id,
          client_order_id: UUID(),
          type:
            order.type === OrderType.STOP
              ? OrderType.LIMIT
              : order.type === OrderType.LIMIT
              ? OrderType.STOP
              : order.type,
          direction:
            order.direction === OrderDirection.OPEN_LONG
              ? OrderDirection.OPEN_SHORT
              : order.direction === OrderDirection.OPEN_SHORT
              ? OrderDirection.OPEN_LONG
              : order.direction === OrderDirection.CLOSE_LONG
              ? OrderDirection.CLOSE_SHORT
              : order.direction === OrderDirection.CLOSE_SHORT
              ? OrderDirection.CLOSE_LONG
              : order.direction,
        };
        ex.submitOrder(theOrder);
        orders.push(theOrder);
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
