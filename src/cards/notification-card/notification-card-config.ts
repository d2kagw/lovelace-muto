import { LovelaceCardConfig } from "custom-card-helpers";
import {
    MutoActionableCardConfig,
    MutoCardConfig,
    MutoSensorState,
    MutoStatusedCardConfig,
} from "../../shared/types";

export type NotificationCardConfig = LovelaceCardConfig &
    MutoCardConfig &
    MutoStatusedCardConfig &
    MutoActionableCardConfig & {
        level: string;
        icon: string;
        label: string;
        sublabel: string;
        state_entity?: MutoSensorState;
    };
