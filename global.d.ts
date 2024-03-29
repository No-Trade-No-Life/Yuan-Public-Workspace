/**
 * Order: Change the {@link IPosition} of {@link IAccountInfo} in the account through trading commands
 * @public
 */
declare interface IOrder {
  /**
   * Client order ID
   */
  client_order_id: string;
  /**
   * Exchange order ID (if any)
   */
  exchange_order_id?: string;
  /**
   * Account ID
   *
   * {@link IAccountInfo.account_id}
   */
  account_id: string;
  /**
   * Product ID
   *
   * {@link IProduct}
   */
  product_id: string;
  /**
   * Specify the position ID that needs to be operated
   *
   * - If left blank, it means "which specific position under the same account and product can be operated"
   * - If filled in, only the matching position can be operated, and other positions under the same account and product cannot be affected.
   *
   * {@link IPosition.position_id}
   */
  position_id?: string;
  /** Order type */
  type: OrderType;
  /** Order direction */
  direction: OrderDirection;
  /** Commission volume */
  volume: number;
  /**
   * Profit and loss correction under non-standard models
   *
   * When the profit and loss model is non-standard, a profit and loss correction value can be added to correct the standard model profit and loss to the actual profit and loss.
   *
   * Profit and loss correction = actual profit and loss - standard profit and loss
   *
   * If this value is empty, the semantics are equivalent to 0
   *
   * Refer to [How to calculate profit and loss](https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh)
   *
   */
  profit_correction?: number;
  /**
   * Actual profit and loss
   *
   * When closing a position, the amount of change in the account balance
   *
   * If this value is empty, the semantics are equivalent to "profit and loss correction == 0", that is, "standard profit and loss == actual profit and loss"
   *
   * Refer to [How to calculate profit and loss](https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh)
   */
  real_profit?: number;
  /**
   * Inferred price of the base currency against the margin currency when closing the position
   *
   * if this value is empty, the semantics are equivalent to 1 (that is, the base currency == margin currency)
   *
   * Refer to [How to calculate profit and loss](https://tradelife.feishu.cn/wiki/wikcnRNzWSF7jtkH8nGruaMhhlh)
   */
  inferred_base_currency_price?: number;
  /**
   * Order timestamp / transaction timestamp
   */
  timestamp_in_us?: number;
  /**
   * Order price
   */
  price?: number;
  /**
   * Traded volume
   */
  /** 成交量 */
  traded_volume?: number;
  /**
   * Traded price
   */
  traded_price?: number;
  /**
   * Order status
   */
  status?: OrderStatus;
  /**
   * Order comment
   */
  comment?: string;
  /**
   * Take profit price
   */
  take_profit_price?: number;
  /**
   * Stop loss price
   */
  stop_loss_price?: number;
}
/**
 * Position Variant
 * @public
 */
declare enum PositionVariant {
  /** Long */
  LONG = 0,
  /** Short */
  SHORT = 1,
}
/**
 * Atomic position information
 *
 * Same product positions can be summed up into one position
 *
 * @public
 */
declare interface IPosition {
  /**
   * Position ID
   */
  position_id: string;
  /**
   * Product ID
   */
  product_id: string;
  /**
   * Position variant
   *
   * can be used to calculate net position
   */
  variant: PositionVariant;
  /**
   * Volume
   *
   * Settlement net value should refer to this field
   */
  volume: number;
  /**
   * Tradable volume (non-negative)
   *
   * This field should be checked when placing an order
   *
   * When the market is T+0 trading, it should be consistent with the volume field;
   * When the market is T+1 trading, it may be smaller than the volume.
   */
  free_volume: number;
  /** Position cost price (the intrinsic meaning of the price can be obtained through product_id) */
  position_price: number;
  /** Current closable settlement price */
  closable_price: number;
  /** Floating profit and loss of the position */
  floating_profit: number;
  /**
   * Remarks of the position
   */
  comment?: string;
}
/**
 * Tick: Market transaction data at a certain moment
 * Tick: 某个时刻的市场成交行情数据
 */

declare interface ITick {
  /**
   * Data source ID
   * 数据源 ID
   */
  datasource_id: string;
  /**
   * Product ID
   * 品种 ID
   */
  product_id: string;
  /**
   * Timestamp (in microseconds)
   * 时间戳
   * @deprecated use updated_at instead
   */
  timestamp_in_us: number;
  /**
   * Timestamp (in ms)
   * 时间戳
   */
  updated_at?: number;
  /**
   * Price
   * 成交价
   */
  price: number;
  /**
   * Volume
   * 成交量
   */
  volume: number;
  /**
   * Open interest
   * 持仓量
   */
  open_interest?: number;
  /**
   * Spread
   * 点差
   */
  spread?: number;
  /**
   * Ask price
   * 卖一价
   */
  ask?: number;
  /** 买一价 */
  bid?: number;
}
/**
 * Account fund information
 *
 * @remarks
 *
 * Net value conforms to the equation:
 *
 * 1. Net value = balance + floating profit and loss
 *
 * 2. Net value = available margin + margin in use
 *
 * If the exchange has provided these fields, use them directly. Otherwise, they can be calculated according to the following algorithm:
 *
 * 1. Floating profit and loss := the sum of the profits and losses formed by the price difference between the current quote and the position price of all positions of the variety
 *
 * 2. Available margin := the margin corresponding to the value of all positions
 *
 * 3. Balance := does not change when opening a position, only when closing a position, the floating profit and loss of the position is added to the balance
 *
 * 4. Net value := balance + floating profit and loss
 *
 * 5. Available margin := net value - margin in use
 *
 * @public
 */
declare interface IAccountMoney {
  /**
   * Settlement currency of the account
   *
   * @example "CNY"
   */
  currency: string;
  /**
   * Net value: equity of the account
   */
  equity: number;
  /**
   * Balance: balance before opening a position
   */
  balance: number;
  /**
   * Floating profit and loss: total floating profit and loss generated by positions in the account
   */
  profit: number;
  /**
   * Available funds/available margin
   */
  free: number;
  /**
   * Used funds/used margin
   */
  used: number;
  /**
   * Account leverage ratio
   */
  leverage?: number;
}

/** Account information @public */
declare interface IAccountInfo {
  /** Account ID */
  account_id: string;
  /** Fund information */
  money: IAccountMoney;
  /** Position information */
  positions: IPosition[];
  /** Unfilled orders */
  orders: IOrder[];
  /**
   * Timestamp when the account information was generated
   *
   * (Used for conflict resolution: always accept the latest information)
   */
  timestamp_in_us: number;
}

/**
 * Product: The underlying asset of a transaction.
 */
declare interface IProduct {
  /** Data source ID */
  datasource_id: string;
  /**
   * Product ID
   *
   * It's RECOMMENDED that make the product ID the original form from the data source. Don't transform it to somehow standard form.
   */
  product_id: string;
  /** Human-readable product name */
  name?: string;
  /**
   * The quote currency to price the product.
   *
   * e.g. "USD", "CNY", "GBP", "USDT", "BTC", ...etc.
   */
  quote_currency?: string;

  /**
   * Base Currency
   *
   * Only available in foreign exchange products.
   *
   * If defined, the price of this product (P(this, quote_currency)) can be treated as P(base_currency, quote_currency)
   *
   * The base currency is the currency used as the basis for exchange rate quotes, expressed as the number of units of the currency that can be exchanged for one unit of the quoted currency.
   *
   * e.g. The base currency of GBPJPY is GBP; the base currency of USDCAD is USD.
   *
   */
  base_currency?: string;

  /**
   * price step, default is 1
   */
  price_step?: number;
  /**
   * Volume unit (unit: lot), default is 1
   */
  volume_step?: number;
  /**
   * Value scale, default is 1
   *
   * The quantity of the underlying asset specified by one lot.
   */
  value_scale?: number;

  /**
   * Unit of value scale.
   *
   * - Leave empty to use the product itself.
   * - If the value is equal to currency, it means that the 1 volume is based on the currency.
   */
  value_scale_unit?: string;

  /**
   * Margin rate
   */
  margin_rate?: number;

  /**
   * Value-based cost
   */
  value_based_cost?: number;
  /**
   * Volume-based cost
   */
  volume_based_cost?: number;

  /**
   * Maximum position
   */
  max_position?: number;
  /** 最大单笔委托量 */
  max_volume?: number;

  /**
   * Allow long
   *
   * If this value is empty, it is semantically equivalent to true.
   */
  allow_long?: boolean;
  /**
   * Allow short
   *
   * If this value is empty, it is semantically equivalent to true.
   */
  allow_short?: boolean;

  /**
   * Spread
   */
  spread?: number;
}

/**
 * 订单类型
 * @public
 */
declare enum OrderType {
  /**
   * Market Order: Executed at the current market price
   *
   * The most common and simple order type, no need to specify an order price
   */
  MARKET = 0,
  /**
   * Limit Order: Limits the price at which the order can be executed
   *
   * - BUY LIMIT: The execution price will not be higher than the order price
   * - SELL LIMIT: The execution price will not be lower than the order price
   */
  LIMIT = 1,
  /**
   * Stop Order: Triggers a market order when the market price reaches the order price
   *
   * - BUY STOP: Place an order when the market price is higher than the order price
   * - SELL STOP: Place an order when the market price is lower than the order price
   */
  STOP = 2,
  /**
   * Fill or Kill: Requires immediate and complete
   *
   * It is required to be executed immediately and completely when placing an order, otherwise it will be cancelled
   */
  FOK = 3,
  /**
   * Immediate or Cancel: Requires immediate execution, allows partial execution, and cancels the rest
   *
   * It is required to be executed immediately when placing an order, allows partial execution, and cancels the rest
   */
  IOC = 4,
}

/**
 * 订单方向
 * @public
 */
declare enum OrderDirection {
  /**
   * Open long position
   */
  OPEN_LONG = 0,
  /**
   * Close long position
   */
  CLOSE_LONG = 1,
  /**
   * Open short position
   */
  OPEN_SHORT = 2,
  /**
   * Close short position
   */
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

// Basic Hooks
/**
 * Use a reference to a variable to maintain a reference to the same value in all execution stages, similar to React.useRef
 *
 * @param initial_value - The initial value of the reference
 * @returns An object with a `current` property that holds the reference to the value
 */
declare const useRef: <T>(initial_value: T) => { current: T };
/**
 * Use a side effect. When the dependencies of two consecutive calls are different, `fn` will be called again, similar to React.useEffect
 *
 * @param fn - The function to be called as a side effect
 * @param deps - An array of dependencies that trigger the side effect when changed
 */
declare const useEffect: (fn: () => (() => void) | void, deps?: any[]) => void;
/**
 * Cache a calculation, similar to React.useMemo
 *
 * @param fn - The function to be cached
 * @param deps - An array of dependencies that trigger the recalculation of the cached value when changed
 * @returns The cached value
 */
declare const useMemo: <T>(fn: () => T, deps: any[]) => T;
/**
 * Use a state, similar to React.useState
 *
 * @param initState - The initial state value
 * @returns A tuple with the current state value and a function to update the state
 */
declare const useState: <T>(initState: T) => [T, (v: T) => void];
/**
 * Cache a calculation asynchronously, similar to useMemo, but blocks subsequent processes asynchronously
 *
 * @param fn - The function to be cached
 * @param deps - An array of dependencies that trigger the recalculation of the cached value when changed
 * @returns A promise that resolves to the cached value
 */
declare const useMemoAsync: <T>(
  fn: () => Promise<T>,
  deps?: any[] | undefined
) => Promise<T>;

// Basic parameters
/**
 * Use an JSON Schema parameter
 *
 * @param key - The key of the parameter
 * @param schema - The JSON Schema for the parameter
 * @returns The value of the parameter
 * @see https://json-schema.org/ for JSON Schema Specification
 */
declare const useParamSchema: <T>(key: string, schema: any) => T;

// Series Hook
/** A series is a number[] with some additional fields */
declare class Series extends Array<number> {
  series_id: string;
  name: string | undefined;
  tags: Record<string, any>;
  parent: Series | undefined;
  get currentIndex(): number;
  get previousIndex(): number;
  get currentValue(): number;
  get previousValue(): number;
}
/** Use a series */
declare const useSeries: (
  name: string,
  parent: Series | undefined,
  tags?: Record<string, any>
) => Series;

// Business class Hook
/** Use product information */
declare const useProduct: (
  datasource_id: string,
  product_id: string
) => IProduct;

/**
 * Use OHLC Period Data
 * @param datasource_id - Data source ID
 * @param product_id - Product ID
 * @param period - Period in seconds or RFC3339 duration format
 */
declare const useOHLC: (
  datasource_id: string,
  product_id: string,
  period: number | string
) => {
  time: Series;
  open: Series;
  high: Series;
  low: Series;
  close: Series;
  volume: Series;
};

/**
 * Use Tick
 *
 * @param account_id - The AccountID in Agent
 * @param datasource_id - The DataSourceID in Host
 * @param product_id - The ProductID in the Data Source
 * @returns the Tick data. undefined if not loaded
 */
declare const useTick: (
  account_id: string,
  datasource_id: string,
  product_id: string
) => ITick | undefined;

/** Use Account Info */
declare const useAccountInfo: (options?: {
  account_id?: string;
  currency?: string;
  leverage?: number;
  initial_balance?: number;
}) => IAccountInfo;

/** Use Exchange */
declare const useExchange: () => {
  /** Get Quote of Product */
  getQuote: (
    datasource_id: string,
    product_id: string
  ) => { ask: number; bid: number };
  /** Get Order by Order ID */
  getOrderById: (id: string) => IOrder | undefined;
  /** List of unfilled orders */
  listOrders: () => IOrder[];
  /** Submit orders */
  submitOrder: (...orders: IOrder[]) => void;
  /** Cancel orders */
  cancelOrder: (...orderIds: string[]) => void;
};

// Utility Hooks
/** Use a logging function */
declare const useLog: () => (...params: any[]) => void;
/** Use a record table */
declare const useRecordTable: <T extends Record<string, any>>(
  title: string
) => T[];
/** Get Time String */
declare const formatTime: (timestamp: number) => string;
/** Generate a UUID (Universal-Unique-ID) */
declare const UUID: () => string;
declare const roundToStep: (
  value: number,
  step: number,
  roundFn?: ((x: number) => number) | undefined
) => number;

/**
 * convert params to path.
 * Path is splitted by `/`.
 * Escape to `\/` if a param including `/`.
 */
declare const encodePath: (...params: any[]) => string;

/**
 * convert path to params.
 * Path is splitted by `/`.
 * Escape to `\/` if a param including `/`.
 * @public
 */
declare const decodePath: (path: string) => string[];

declare const getProfit: (
  product: IProduct,
  openPrice: number,
  closePrice: number,
  volume: number,
  variant: string,
  currency: string,
  quotes: (product_id: string) =>
    | {
        ask: number;
        bid: number;
      }
    | undefined
) => number;

// Deployment script context
/**
 * Deployment specification: uniquely identifies a deployment by specifying this value
 * @public
 */
declare interface IDeploySpec {
  /**
   * The image tag used for deployment
   */
  version?: string;
  /**
   * The package to be deployed, e.g. \@yuants/hv
   */
  package: string;
  /**
   * Environment variables
   */
  env?: Record<string, string>;
  /**
   * Annotations, which can add some metadata to it
   * e.g. can be used to generate some non-standard resources in the corresponding vendor interpretation
   * Reference: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/
   */
  annotations?: Record<string, string>;
  /**
   * Network configuration
   */
  network?: {
    /**
     * Port forwarding, reference: https://docs.docker.com/config/containers/container-networking/#published-ports
     * Generally, when starting a container, we need to specify [container internal port name]:[container external port]
     * However, here we only specify which port to expose, that is, [container external port], and bind it with the container internal port through a unique semantic name
     * The reason is that only the package can define which port needs to be exposed, and the deployer only defines which port to forward to
     * e.g. vnc -\> 5900, hv -\> 8888
     */
    port_forward?: Record<string, number>;
    /**
     * Reverse proxy,
     * e.g. hv: y.ntnl.io/hv
     */
    backward_proxy?: Record<string, string>;
  };
  /**
   * File system configuration
   * The format is [container internal Volume name]:[container external URI]
   *
   * e.g. config-file1 -\> file://path/to/file
   *      config-file2 -\> s3://bucket_url
   *      config-file3 -\> yuan-workspace://some/path
   */
  filesystem?: Record<string, string>;
  /**
   * CPU resource claim, leaving it blank means using the default value in the package
   */
  cpu?: IResourceClaim;
  /**
   * Memory resource claim, leaving it blank means using the default value in the package
   */
  memory?: IResourceClaim;

  /**
   * Inline JSON data, could be used as a configuration file
   *
   * should be serializable
   */
  one_json?: any;
}

/**
 * Resource claim definition, format reference: https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/
 * @public
 */
declare interface IResourceClaim {
  /** required */
  min?: string;
  /** limited */
  max?: string;
}

/**
 * Deployment configuration context
 */
declare interface IDeployContext {
  /**
   * bundleCode bundles the entry into IIFE format code
   * @param entry Entry file path
   * @returns IIFE format code
   */
  bundleCode: (entry: string) => Promise<string>;
}

declare const DeployContext: IDeployContext;
