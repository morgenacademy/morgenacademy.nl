export const getDaypartGreeting = (date = new Date()) => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "GoedeMORGEN";
  }

  if (hour >= 12 && hour < 18) {
    return "GoedeMIDDAG";
  }

  if (hour >= 18 && hour < 24) {
    return "GoedeAVOND";
  }

  return "GoedeNACHT";
};
