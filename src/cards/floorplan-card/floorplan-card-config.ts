import { LovelaceCardConfig, LovelaceConfig } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";

export type FloorplanAreaConfig = {
    name: string;
    floorplan: string;

    top: string;
    left: string;
    width: string;
    height: string;

    climate?: string;
    motion?: string;
    temperature?: string;

    card: LovelaceCardConfig;
};

export type FloorplanCardConfig = LovelaceCardConfig & {
    floorplan: string;
    aspect_ratio: string;

    areas: FloorplanAreaConfig[];
};
