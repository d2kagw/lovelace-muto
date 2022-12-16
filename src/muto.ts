import { version } from "../package.json";

export { ButtonCard } from "./cards/button-card/button-card";
export { FlexRowCard, FlexColumnCard } from "./cards/flex-card/flex-card";
export { HeadingCard } from "./cards/heading-card/heading-card";

console.info(`%c🛠️ Muto 🛠️ - ${version}`, "color: #ef5350; font-weight: 700;");
