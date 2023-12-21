/**
 * 计算滑动窗口最大值 (Rolling Max)
 *
 * 利用了单调队列，均摊时间复杂度为 O(n)
 *
 * @param source 输入数据源
 * @param period 周期 (>0)
 */
export const useMAX = (source: Series, period: number) => {
  const MAX = useSeries(`MAX(${source.name},${period})`, source, {
    display: "line",
  });
  // 单调队列: 保存当前窗口期内，比最新的元素小的元素的索引
  const queue = useRef<number[]>([]);
  useEffect(() => {
    const previousIndex = source.previousIndex;
    if (previousIndex < 0) return;
    // 从栈顶开始，移除所有小于当前值的元素
    while (
      queue.current.length > 0 &&
      source[queue.current[queue.current.length - 1]] <= source.previousValue
    ) {
      queue.current.pop();
    }
    // 将当前值入栈
    queue.current.push(previousIndex);
    // 移除超出窗口期的元素 (通常一次只会移除一个)
    while (
      queue.current.length > 0 &&
      queue.current[0] <= previousIndex - period
    ) {
      queue.current.shift();
    }
  }, [source.length]);
  useEffect(() => {
    const currentIndex = source.currentIndex;
    if (currentIndex < 0) return;
    // 队首元素即为当前窗口期内的最小值
    MAX[currentIndex] = Math.max(
      source.currentValue,
      source[queue.current[0]] || -Infinity
    );
  });
  return MAX;
};
