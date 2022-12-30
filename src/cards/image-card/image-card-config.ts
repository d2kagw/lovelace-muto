import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoActionableCardConfig, MutoActionConfig, MutoCardConfig } from "../../shared/types";

export type ImageCardConfig = LovelaceCardConfig &
    MutoCardConfig &
    MutoActionableCardConfig & {
        image: string;
    };
