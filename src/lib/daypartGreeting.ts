export const getDaypartGreeting = (date = new Date()) => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "goedeMORGEN";
  }

  if (hour >= 12 && hour < 18) {
    return "goedeMIDDAG";
  }

  if (hour >= 18 && hour < 24) {
    return "goedeAVOND";
  }

  return "goedeNACHT";
};
