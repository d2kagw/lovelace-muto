import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoCardConfig } from "../../shared/types";

export type ResponsiveCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        cards: LovelaceCardConfig[];
        hide_on_mobile?: boolean;
        show_on_mobile?: boolean;
    };
