import { LovelaceCardConfig } from "custom-card-helpers";

export type LayoutColumnCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    css?: Text;
};

export enum LayoutRowFits {
    SCROLL = "scroll",
    WRAP = "wrap",
    SCALE = "scale",
}

export type LayoutRowCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    fit?: LayoutRowFits;
    css?: Text;
};

export type LayoutCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    css?: Text;
};
