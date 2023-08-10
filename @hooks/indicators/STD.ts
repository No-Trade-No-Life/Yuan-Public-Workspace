import { useSMA } from "@libs";

/**
 * 计算标准差
 * @param source
 * @param period
 * @returns
 */
export const useSTD = (source: Series, period: number): Series => {
  const smaOfSource = useSMA(source, period);

  const square = useSeries(`POW(${source.name}, 2)`, source); // X^2
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    square[i] = source[i] ** 2;
  });

  const smaOfSquare = useSMA(square, period);
  useEffect(() => {
    smaOfSource.tags.display = "none";
    square.tags.display = "none";
    smaOfSquare.tags.display = "none";
  }, []);

  // STD(X) = SQRT(E(X^2) - E(X)^2)
  const STD = useSeries(`STD(${source.name}, ${period})`, source, {
    display: "line",
    chart: "new",
  });
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    STD[i] = period > 1 ? (smaOfSquare[i] - smaOfSource[i] ** 2) ** 0.5 : 0;
  });
  return STD;
};
