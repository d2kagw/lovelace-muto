import { LovelaceCardConfig } from "custom-card-helpers";

export type FlexCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    css?: Text;
};
