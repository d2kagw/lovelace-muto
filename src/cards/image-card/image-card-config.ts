import { LovelaceCardConfig } from "custom-card-helpers";

export type ImageCardConfig = LovelaceCardConfig & {
    image?: string;
    css?: Text;
};
