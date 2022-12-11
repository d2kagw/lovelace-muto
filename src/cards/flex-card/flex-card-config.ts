import { LovelaceCardConfig } from "../../ha";

export type FlexCardConfig = LovelaceCardConfig &
    {
        cards: LovelaceCardConfig[];
        flex_wrap?: Text;
        justify_content?: Text;
        align_items?: Text;
        gap?: Text;
        css?: Text;
    };
