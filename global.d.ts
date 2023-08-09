/**
 * 订单: 通过交易命令改变账户内 {@link IAccountInfo} 头寸 {@link IPosition}
 * @public
 */
declare interface IOrder {
  /**
   * 客户端订单ID
   */
  client_order_id: string;
  /**
   * 交易所订单ID (如果有)
   */
  exchange_order_id?: string;
  /**
   * 账户 ID
   *
   * {@link IAccountInfo.account_id}
   */
  account_id: string;
  /**
   * 品种 ID
   *
   * {@link IProduct}
   */
  product_id: string;
  /**
   * 指定需要操作的头寸 ID
   *
   * - 如果留空，表达 "操作同账户、同品种下哪个具体头寸都可以"
   * - 如果填写了，只能操作匹配的头寸，不得影响同账户下同品种下的其他头寸。
   *
   * {@link IPosition.position_id}
   */
  position_id?: string;
  /** 订单类型 */
  type: OrderType;
  /** 订单方向 */
  direction: OrderDirection;
  /** 委托量 */
  volume: number;
  /**
   * 非标准模型下的盈亏修正
   *
   * 当盈亏模型非标准时，可以添加一个盈亏修正值，将标准模型盈亏修正到实际盈亏。
   *
   * 盈亏修正 = 实际盈亏 - 标准盈亏
   *
   * 如果此值为空，语义等同于 0
   *
   * 参考 [如何计算盈亏](https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh)
   *
   */
  profit_correction?: number;
  /**
   * 实际盈亏
   *
   * 平仓时，对账户的余额产生的改变量
   *
   * 如果此值为空，语义等同于 "盈亏修正 == 0" 即 "标准盈亏 == 实际盈亏"
   *
   * 参考 [如何计算盈亏](https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh)
   */
  real_profit?: number;
  /**
   * 推断得到的平仓时基准货币兑保证金货币的价格
   *
   * 如果此值为空，语义等同于 1 (即基准货币 == 保证金货币)
   *
   * 参考 [如何计算盈亏](https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh)
   */
  inferred_base_currency_price?: number;
  /** 下单时间戳 / 成交时间戳 */
  timestamp_in_us?: number;
  /** 委托价 */
  price?: number;
  /** 成交量 */
  traded_volume?: number;
  /** 成交价 */
  traded_price?: number;
  /** 订单状态 */
  status?: OrderStatus;
  /** 订单注释 */
  comment?: string;
  /** 止盈价 (暂时不可用) */
  take_profit_price?: number;
  /** 止损价 (暂时不可用) */
  stop_loss_price?: number;
}
/**
 * 头寸类型
 * @public
 */
declare enum PositionVariant {
  /** 做多 */
  LONG = 0,
  /** 做空 */
  SHORT = 1,
}
/**
 * 原子性的持仓头寸信息
 *
 * 相同品种上的头寸可以被合计
 *
 * @public
 */
declare interface IPosition {
  /**
   * 头寸 ID
   */
  position_id: string;
  /** 品种 ID */
  product_id: string;
  /**
   * 仓位类型
   *
   * 可以根据仓位类型计算净头寸
   */
  variant: PositionVariant;
  /**
   * 持仓量 (非负)
   *
   * 结算净值时应参考此字段
   */
  volume: number;
  /**
   * 可交易量 (非负)
   *
   * 下单时应检查此字段
   *
   * 市场为 T+0 交易时应当与 volume 字段一致;
   * 市场为 T+1 交易时，可能比 volume 小.
   */
  free_volume: number;
  /** 持仓成本价 (可通过 product_id 得到价格的内在含义) */
  position_price: number;
  /** 当前可平仓结算价格 */
  closable_price: number;
  /** 持仓浮动盈亏 */
  floating_profit: number;
  /**
   * 头寸的备注
   */
  comment?: string;
}
/**
 * 账户资金信息
 *
 * @remarks
 *
 * 净值符合方程:
 *
 * 1. 净值 = 余额 + 浮动盈亏
 *
 * 2. 净值 = 可用保证金 + 占用保证金
 *
 * 如果交易所已提供这些字段，直接用交易所的。否则可以根据如下算法计算:
 *
 * 1. 浮动盈亏 := 所有头寸的品种的当前报价和持仓价的价差形成的盈亏之和
 *
 * 2. 可用保证金 := 所有头寸的价值所对应的保证金
 *
 * 3. 余额 := 开仓时不会变，仅平仓的时候会将头寸的浮动盈亏加入余额
 *
 * 4. 净值 := 余额 + 浮动盈亏
 *
 * 5. 可用保证金 := 净值 - 占用保证金
 *
 * @public
 */
declare interface IAccountMoney {
  /**
   * 账户的结算货币
   *
   * @example "CNY"
   */
  currency: string;
  /**
   * 净值: 账户的权益
   */
  equity: number;
  /**
   * 余额: 开仓前的余额
   */
  balance: number;
  /**
   * 浮动盈亏: 持仓中的头寸产生的总浮动盈亏
   */
  profit: number;
  /** 可用资金/可用保证金 */
  free: number;
  /** 已用资金/已用保证金 */
  used: number;
  /**
   * 账户杠杆率
   */
  leverage?: number;
}
/** 账户信息 @public */
declare interface IAccountInfo {
  /** 账户ID */
  account_id: string;
  /** 资金信息 */
  money: IAccountMoney;
  /** 持仓信息 */
  positions: IPosition[];
  /** 未成交的挂单 */
  orders: IOrder[];
  /**
   * 账户信息产生的时间戳
   *
   * (用于处理冲突: 应当总是接受最新的信息)
   */
  timestamp_in_us: number;
}
/**
 * 品种: 交易的标的物
 *
 * @public
 */
declare interface IProduct {
  /** 数据源 ID */
  datasource_id: string;
  /** 品种 ID */
  product_id: string;
  /** 可读的品种名 */
  name?: string;
  /**
   * 基准货币 (Base Currency)
   *
   * 基准货币是汇率报价中作为基础的货币，即报价表达形式为每一个单位的货币可兑换多少另一种货币。
   *
   * e.g. GBPJPY 的 base_currency 为 GBP; USDCAD 的 base_currency 为 USD.
   */
  base_currency: string;
  /**
   * 标价货币 (Quoted Currency)
   *
   * 汇率的表达方式为一单位的基准货币可兑换多少单位的标价货币
   *
   * e.g. GBPJPY 的 quoted_currency 为 JPY; USDCAD 的 quoted_currency 为 CAD.
   *
   * 对于非外汇品种，quoted_currency 应当为空。
   */
  quoted_currency?: string;
  /**
   * 标的物是基准货币吗？
   *
   * 1 手对应 value_speed 数量的标的物，此标的物可以是基准货币或其他商品。
   *
   * - 对于商品，包括现货和期货，此值通常为 false，因为 1 手对应着 value_speed 倍数的商品数量。
   *
   * - 对于外汇，此值通常为 true，因为 1 手对应着 value_speed 倍数的基础货币等值的任一货币。
   *
   * 如果值为空，语义上等同于 false.
   *
   * 如果此值为 true，需要在标准收益公式中额外除以本品种的"平仓时的价格"。
   */
  is_underlying_base_currency?: boolean;
  /** 报价单位 */
  price_step: number;
  /** 成交量单位 (单位: 手) */
  volume_step: number;
  /**
   * 价值速率
   *
   * 1 手对应的标的物的数量
   *
   * ~~每做多 1 手，价格每上升 1，获得的结算资产收益~~
   */
  value_speed: number;
  /**
   * 保证金率
   *
   * 保证金计算参考 [如何计算保证金](https://tradelife.feishu.cn/wiki/wikcnEVBM0RQ7pmbNZUxMV8viRg)
   */
  margin_rate?: number;
  /** 基于价值的成本 */
  value_based_cost?: number;
  /** 基于成交量的成本 */
  volume_based_cost?: number;
  /** 最大持仓量 */
  max_position?: number;
  /** 最大单笔委托量 */
  max_volume?: number;
  /** 允许做多 */
  allow_long?: boolean;
  /** 允许做空 */
  allow_short?: boolean;
  /** 预期点差 */
  spread?: number;
}
/**
 * 订单类型
 * @public
 */
declare enum OrderType {
  /**
   * 市价单: 以市场价格成交
   *
   * 最普遍而简单的订单类型，不需要指定委托价
   */
  MARKET = 0,
  /**
   * 限价单: 限制成交的价格
   *
   * - BUY LIMIT: 成交价不会高于委托价
   * - SELL LIMIT: 成交价不会低于委托价
   */
  LIMIT = 1,
  /**
   * 触发单: 市场价达到委托价时触发市价单
   *
   * - BUY STOP: 市场价高于委托价时下单
   * - SELL STOP: 市场价低于委托价时下单
   */
  STOP = 2,
  /**
   * 即成或撤单: Fill or Kill
   *
   * 下单时要求立即全部成交，否则撤单
   */
  FOK = 3,
  /**
   * 即成余撤单: Immediate or Cancel
   *
   * 下单时要求立即成交，允许部分成交，未成交的直接撤单
   */
  IOC = 4,
}
/**
 * 订单方向
 * @public
 */
declare enum OrderDirection {
  /** 开多 */
  OPEN_LONG = 0,
  /** 平多 */
  CLOSE_LONG = 1,
  /** 开空 */
  OPEN_SHORT = 2,
  /** 平空 */
  CLOSE_SHORT = 3,
}
/**
 * 订单状态
 * @public
 */
declare enum OrderStatus {
  /** 交易所已接受委托 */
  ACCEPTED = 0,
  /** 已成交 */
  TRADED = 1,
  /** 已撤单 */
  CANCELLED = 2,
}

// 基础 Hook
/** 使用变量的引用，在所有的执行阶段保持对同一个值的引用，类似 React.useRef */
declare const useRef: <T>(initial_value: T) => { current: T };
/** 使用副作用，当两次调用的 deps 不同时，fn 会被重新调用，类似 React.useEffect */
declare const useEffect: (fn: () => (() => void) | void, deps?: any[]) => void;
/** 缓存计算，类似 React.useMemo */
declare const useMemo: <T>(fn: () => T, deps: any[]) => T;
/** 使用状态，类似 React.useState */
declare const useState: <T>(initState: T) => [T, (v: T) => void];
/** 缓存计算，类似 useMemo，但是会异步阻塞后续的流程 */
declare const useMemoAsync: <T>(
  fn: () => Promise<T>,
  deps?: any[] | undefined
) => Promise<T>;
// 基本参数
/** 使用应用参数 (数字) */
declare const useParamNumber: (key: string, defaultValue?: number) => number;
/** 使用应用参数 (布尔) */
declare const useParamBoolean: (key: string, defaultValue?: boolean) => boolean;
/** 使用应用参数 (字符串) */
declare const useParamString: (key: string, defaultValue?: string) => string;

// 序列 Hook
/** 序列是一个 number[], 具有一些额外的字段 */
declare class Series extends Array<number> {
  series_id: string;
  name: string | undefined;
  tags: Record<string, any>;
  parent: Series | undefined;
}
/** 使用序列 */
declare const useSeries: (
  name: string,
  parent: Series | undefined,
  tags?: Record<string, any>
) => Series;

// 业务类 Hook
/** 使用品种信息 */
declare const useProduct: (
  datasource_id: string,
  product_id: string
) => IProduct;
/** 使用品种参数 */
declare const useParamProduct: (key: string) => IProduct;
/** 使用周期数据 \`[idx, timestamp_in_us, open, high, low, close, volume]\` */
declare const useOHLC: (
  datasource_id: string,
  product_id: string,
  period_in_sec: number
) => {
  time: Series;
  open: Series;
  high: Series;
  low: Series;
  close: Series;
  volume: Series;
};
/** 使用 OHLC 数据 */
declare const useParamOHLC: (key: string) => ReturnType<typeof useOHLC> & {
  datasource_id: string;
  product_id: string;
  period_in_sec: number;
};
/** 使用账户信息 */
declare const useAccountInfo: () => IAccountInfo;
/**
 * 使用指定品种和指定方向的头寸管理器
 */
declare const useSinglePosition: (
  product_id: string,
  variant: PositionVariant
) => {
  targetVolume: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  setTargetVolume: (v: number) => void;
  setTakeProfitPrice: (v: number) => void;
  setStopLossPrice: (v: number) => void;
} & IPosition;

/** 使用交易所 */
declare const useExchange: () => {
  /** 列出未成交的订单列表 */
  listOrders: () => IOrder[];
  /** 提交订单 */
  submitOrder: (...orders: IOrder[]) => void;
  /** 取消订单 */
  cancelOrder: (...orderIds: string[]) => void;
};

// 辅助类 Hook
/** 使用日志函数 */
declare const useLog: () => (...params: any[]) => void;
/** 使用记录表 */
declare const useRecordTable: <T extends Record<string, any>>(
  title: string
) => T[];
