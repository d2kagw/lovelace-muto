import { LovelaceCardConfig } from "custom-card-helpers";

export type HeadingCardConfig = LovelaceCardConfig & {
    size?: string;
    text?: string;
    icon?: string;
    css?: Text;
};
