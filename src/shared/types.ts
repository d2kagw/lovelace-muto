export type MutoActionConfig = {
    type: string;
    entity?: string;
    service?: string;
    data?: any;
};

export type MutoSensorState = {
    entity: string;
    state: string;
};

export type MutoCardConfig = {
    css?: Text;
};

export type MutoStatusedCardConfig = {
    status_entity?: MutoSensorState;
};

export type MutoActionableCardConfig = {
    action?: MutoActionConfig;
};
