import { LovelaceCardConfig } from "custom-card-helpers";

export type LayoutCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    css?: Text;
};
