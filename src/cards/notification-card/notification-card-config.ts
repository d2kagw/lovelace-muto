import { LovelaceCardConfig } from "custom-card-helpers";

export type NotificationCardConfig = LovelaceCardConfig & {
    state: string;
    icon: string;
    label: string;
    sublabel: string;
    entity: string;
    css?: Text;
};
