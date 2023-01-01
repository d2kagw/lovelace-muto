import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoCardConfig } from "../../shared/types";

export type LayoutColumnCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        cards: LovelaceCardConfig[];
    };

export enum LayoutRowFits {
    SCROLL = "scroll",
    WRAP = "wrap",
    SCALE = "scale",
}

export type LayoutRowCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        cards: LovelaceCardConfig[];
        fit?: LayoutRowFits;
    };

export type LayoutCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        cards: LovelaceCardConfig[];
    };
