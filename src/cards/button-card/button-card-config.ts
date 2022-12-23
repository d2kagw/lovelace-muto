import { LovelaceCardConfig } from "custom-card-helpers";

export type ButtonCardConfig = LovelaceCardConfig & {
    entity?: string;
    label?: string;
    icon?: string;
    aspect?: string;
    css?: Text;
};
