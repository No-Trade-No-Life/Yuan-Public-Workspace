import { useSTD } from "./STD";
/**
 * 计算历史波动率指标
 * @param source
 * @param period
 * @returns
 */
export const useHV = (source: Series, period: number): Series => {
  const logROI = useSeries(`LOGROI(${source.name}, ${period})`, source);

  useEffect(() => {
    for (let i = Math.max(0, logROI.length - 1); i < source.length; i++) {
      logROI[i] = i > 0 ? Math.log(source[i]) - Math.log(source[i - 1]) : 0;
    }
  });

  const std = useSTD(logROI, period);
  useEffect(() => {
    std.tags.display = "none";
  }, []);
  const output = useSeries(`HV(${source.name}, ${period})`, source, {
    display: "line",
    chart: "new",
  });

  useEffect(() => {
    for (let i = Math.max(0, output.length - 1); i < source.length; i++) {
      output[i] = std[i] * Math.sqrt(period);
    }
  });

  return output;
};
