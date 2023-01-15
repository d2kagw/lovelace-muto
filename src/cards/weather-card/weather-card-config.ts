import { LovelaceCardConfig } from "custom-card-helpers";
import { MutoCardConfig } from "../../shared/types";

export type WeatherCardConfig = LovelaceCardConfig &
    MutoCardConfig & {
        weather_entity: string;
        moon_entity?: string;
        sun_entity?: string;
    };
