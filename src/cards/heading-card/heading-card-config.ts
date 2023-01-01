import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoActionableCardConfig, MutoCardConfig } from "../../shared/types";

export type HeadingCardConfig = LovelaceCardConfig &
    MutoCardConfig &
    MutoActionableCardConfig & {
        size?: string;
        text?: string;
        icon?: string;
    };
