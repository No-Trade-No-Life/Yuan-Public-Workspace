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
  const src = useAccountInfo(source_account_id);
  const tar = useAccountInfo(`${source_account_id}-PL_${positionLimit}`);
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

/**
 * Merge Positions by product_id/variant
 * @param positions - List of Positions
 * @returns - Merged Positions
 *
 * @public
 */
const mergePositions = (positions: IPosition[]): IPosition[] => {
  const mapProductIdToPosition = positions.reduce((acc, cur) => {
    const { product_id, variant } = cur;
    if (!acc[`${product_id}-${variant}`]) {
      acc[`${product_id}-${variant}`] = { ...cur };
    } else {
      let thePosition = acc[`${product_id}-${variant}`];
      thePosition = {
        ...thePosition,
        volume: thePosition.volume + cur.volume,
        free_volume: thePosition.free_volume + cur.free_volume,
        position_price:
          (thePosition.position_price * thePosition.volume +
            cur.position_price * cur.volume) /
          (thePosition.volume + cur.volume),
        floating_profit: thePosition.floating_profit + cur.floating_profit,
        closable_price:
          (thePosition.closable_price * thePosition.volume +
            cur.closable_price * cur.volume) /
          (thePosition.volume + cur.volume),
      };
      acc[`${product_id}-${variant}`] = thePosition;
    }
    return acc;
  }, {} as Record<string, IPosition>);
  return Object.values(mapProductIdToPosition);
};
