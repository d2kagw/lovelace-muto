import { LovelaceCardConfig } from "../../ha";

export type HeadingCardConfig = LovelaceCardConfig & {
    size?: string;
    text?: string;
    icon?: string;
    css?: Text;
};
