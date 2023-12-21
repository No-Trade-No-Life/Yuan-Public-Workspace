// TD 序列指标
export const useTD = (source: Series) => {
  const TD = useSeries("Output", source, {
    display: "hist",
    chart: "new",
  });

  useEffect(() => {
    const currentIndex = source.currentIndex;
    if (currentIndex < 0) return;
    TD[currentIndex] = 0;
    if (source.currentValue > source[currentIndex - 4]) {
      TD[currentIndex] = Math.max(0, TD.previousValue ?? 0) + 1;
    }
    if (source.currentValue < source[currentIndex - 4]) {
      TD[currentIndex] = Math.min(0, TD.previousValue ?? 0) - 1;
    }
  });

  return { TD };
};
