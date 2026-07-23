// Helpers compartilhados pelas views que exibem ranking de consultores.
export function getDominantTemperature(consultant) {
  const options = [
    { key: "quente", count: consultant.leadsHot, icon: "🔥" },
    { key: "morno", count: consultant.leadsWarm, icon: "☀" },
    { key: "frio", count: consultant.leadsCold, icon: "❄" },
  ];
  return options.reduce((best, option) => (option.count > best.count ? option : best));
}

export function sortByValueDesc(list) {
  return [...list].sort((a, b) => b.value - a.value);
}
