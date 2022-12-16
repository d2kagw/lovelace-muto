import { LovelaceCardConfig } from "../../ha";

export type FlexCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    css?: Text;
};
