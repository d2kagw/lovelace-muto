import { LovelaceCardConfig } from "custom-card-helpers";

export type ButtonCardConfig = LovelaceCardConfig & {
    entity?: string | undefined;
    action?: string;
    label?: string;
    icon?: string;
    image?: string;
    css?: Text;
};
