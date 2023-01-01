import { LovelaceCardConfig } from "custom-card-helpers";
import {
    MutoActionableCardConfig,
    MutoCardConfig,
    MutoStatusedCardConfig,
} from "../../shared/types";

export type ControlCardConfig = LovelaceCardConfig &
    MutoCardConfig &
    MutoActionableCardConfig &
    MutoStatusedCardConfig & {
        sensor_entity?: string;
        label?: string;
        sublabel?: string;
        icon?: string;
    };
