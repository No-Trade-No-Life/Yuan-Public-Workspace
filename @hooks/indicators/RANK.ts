/**
 * 计算序列在指定周期内的排名 (升序, 从1开始)
 * @param source - 输入序列
 * @param period - 周期
 * @returns 排名 (升序, 从1开始)
 */
export const useRank = (source: Series, period: number) => {
  const ret = useSeries(`TS_RANK(${source.name}, ${period})`, source);
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    let rank = 1;
    for (let j = Math.max(0, i - period + 1); j < i; j++) {
      if (source[i] > source[j]) {
        rank++;
      }
    }
    ret[i] = rank;
  });
  return ret;
};
