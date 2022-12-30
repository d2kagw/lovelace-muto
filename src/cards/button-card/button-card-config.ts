import { LovelaceCardConfig } from "custom-card-helpers";
import {
    MutoActionableCardConfig,
    MutoCardConfig,
    MutoStatusedCardConfig,
} from "../../shared/types";

export type ButtonCardConfig = LovelaceCardConfig &
    MutoCardConfig &
    MutoActionableCardConfig &
    MutoStatusedCardConfig & {
        label?: string;
        icon?: string;
        image?: string;
        aspect_ratio?: string;
    };
