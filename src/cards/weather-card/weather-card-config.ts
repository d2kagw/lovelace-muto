import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoCardConfig } from "../../shared/types";

export type WeatherCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        sensor_entity?: string;
    };
