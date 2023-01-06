import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoCardConfig } from "../../shared/types";

export type PanelCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        cards: LovelaceCardConfig[];
        padded: boolean;
    };
