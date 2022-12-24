import { HassEntity } from "home-assistant-js-websocket";
import { deviceTypeForEntity } from "./helpers";

export const stateColors = {
    blank: false,
    positive: "#99DD2A",
    negative: "#ED2664",
    alert: "#D6C64B",
};

const defaultStateColors = {
    on_is_bad: {
        on: stateColors.negative,
        off: stateColors.blank,
    },
    on_is_good: {
        on: stateColors.positive,
        off: stateColors.blank,
    },
    off_is_good: {
        on: stateColors.blank,
        off: stateColors.positive,
    },
    off_is_bad: {
        on: stateColors.blank,
        off: stateColors.negative,
    },
    on_is_temporary: {
        on: stateColors.alert,
        off: stateColors.blank,
    },
};

export const noStateColor = ["unknown", "temperature", "humidity", "carbon_dioxide"];

export const deviceStateColor = {
    unknown: defaultStateColors.on_is_good,

    battery: defaultStateColors.on_is_bad,
    carbon_monoxide: defaultStateColors.on_is_bad,
    door: defaultStateColors.on_is_bad,
    garage_door: defaultStateColors.on_is_bad,
    gas: defaultStateColors.on_is_bad,
    lock: defaultStateColors.on_is_bad,
    moisture: defaultStateColors.on_is_bad,
    problem: defaultStateColors.on_is_bad,
    safety: defaultStateColors.on_is_bad,
    smoke: defaultStateColors.on_is_bad,
    sound: defaultStateColors.on_is_bad,
    tamper: defaultStateColors.on_is_bad,
    update: defaultStateColors.on_is_bad,
    vibration: defaultStateColors.on_is_bad,
    window: defaultStateColors.on_is_bad,

    cold: defaultStateColors.on_is_good,
    light: defaultStateColors.on_is_good,
    heat: defaultStateColors.on_is_good,
    plug: defaultStateColors.on_is_good,
    power: defaultStateColors.on_is_good,
    fan: defaultStateColors.on_is_good,

    battery_charging: defaultStateColors.off_is_good,
    connectivity: defaultStateColors.off_is_bad,

    motion: defaultStateColors.on_is_temporary,
    moving: defaultStateColors.on_is_temporary,
    occupancy: defaultStateColors.on_is_temporary,
    opening: defaultStateColors.on_is_temporary,
    presence: defaultStateColors.on_is_temporary,
    running: defaultStateColors.on_is_temporary,
};

export function colorForEntityState(entity: HassEntity): string {
    let styleString: string = "";
    let cssColor: string | boolean = stateColors.blank;
    let deviceType = deviceTypeForEntity(entity);
    let deviceStateColors = deviceStateColor[deviceType];

    if (noStateColor.includes(deviceType)) {
        return "";
    } else {
        if (deviceStateColors) {
            cssColor = deviceStateColors[entity.state];
            if (cssColor) {
                styleString = `background: ${cssColor}`;
            }
        } else {
            console.error("Could not find device type", deviceType);
        }
    }

    return styleString;
}
