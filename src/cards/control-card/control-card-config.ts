import { LovelaceCardConfig } from "custom-card-helpers";

export type ControlCardConfig = LovelaceCardConfig & {
    entity: string;
    sensor_entity?: string;

    label?: string;
    sublabel?: string;

    icon?: string;
    css?: Text;
};
