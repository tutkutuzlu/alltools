export function parseNumber(value) {
  const normalized = String(value ?? "").trim().replace(/,/g, "");
  if (!normalized) return null;
  const number = Number(normalized);
  if (!Number.isFinite(number)) throw new Error("Enter a finite numeric value.");
  return number;
}

export function formatNumber(value, precision = "auto") {
  if (!Number.isFinite(value)) throw new Error("The conversion result is outside the supported numeric range.");
  if (precision === "auto") {
    if (value === 0) return "0";
    const magnitude = Math.abs(value);
    if (magnitude >= 1e12 || magnitude < 1e-6) return value.toExponential(8).replace(/\.0+e/, "e").replace(/(\.\d*?)0+e/, "$1e");
    return Number(value.toPrecision(12)).toString();
  }
  return value.toFixed(Number(precision)).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function linearConvert(value, from, to, units) {
  if (!Object.hasOwn(units, from) || !Object.hasOwn(units, to)) throw new Error("Choose valid source and target units.");
  return value * units[from].factor / units[to].factor;
}

export function temperatureConvert(value, from, to) {
  const celsius = from === "c" ? value : from === "f" ? (value - 32) * 5 / 9 : from === "k" ? value - 273.15 : NaN;
  if (!Number.isFinite(celsius)) throw new Error("Choose valid temperature units.");
  if (celsius < -273.15) throw new Error("Temperature cannot be below absolute zero.");
  const result = to === "c" ? celsius : to === "f" ? celsius * 9 / 5 + 32 : to === "k" ? celsius + 273.15 : NaN;
  return result;
}

export function fuelEconomyConvert(value, from, to) {
  if (value <= 0) throw new Error("Fuel economy must be greater than zero.");
  const kmPerLiter = from === "km-l" ? value : from === "l-100km" ? 100 / value : from === "mpg-us" ? value * 0.425143707430272 : from === "mpg-imp" ? value * 0.354006189934647 : NaN;
  if (!Number.isFinite(kmPerLiter)) throw new Error("Choose valid fuel economy units.");
  return to === "km-l" ? kmPerLiter : to === "l-100km" ? 100 / kmPerLiter : to === "mpg-us" ? kmPerLiter / 0.425143707430272 : to === "mpg-imp" ? kmPerLiter / 0.354006189934647 : NaN;
}

export function convertValue(definition, input, options = {}) {
  const value = parseNumber(input);
  if (value === null) return { output: "", numeric: null };
  const from = options.from ?? definition.defaultFrom;
  const to = options.to ?? definition.defaultTo;
  const numeric = definition.mode === "temperature" ? temperatureConvert(value, from, to) : definition.mode === "fuel" ? fuelEconomyConvert(value, from, to) : linearConvert(value, from, to, definition.units);
  return { output: formatNumber(numeric, options.precision ?? "auto"), numeric, from, to };
}
