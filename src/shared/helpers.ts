import { HassEntity } from "home-assistant-js-websocket";
import { stateColors } from "../const";

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

export const ignoreStateColor = [
    "unknown",
    "temperature",
    "humidity",
    "carbon_dioxide",
    "energy",
    "media_player",
];

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

    climate: defaultStateColors.on_is_good,
    switch: defaultStateColors.on_is_good,

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
    let deviceType = deviceTypeForEntity(entity);
    let deviceStateColors = deviceStateColor[deviceType];

    if (ignoreStateColor.includes(deviceType)) {
        return "";
    } else {
        if (deviceStateColors) {
            styleString = deviceStateColors[entity.state];
        } else {
            console.info(`Muto`, `No device state colors for device type`, deviceType);
        }
    }

    if (deviceType == "garage") {
        switch (entity.state) {
            case "open":
                styleString = stateColors.negative;
                break;

            case "opening":
            case "closing":
                styleString = stateColors.alert;
                break;

            case "closed":
                break;

            default:
                console.info(`Muto`, `Unsupported garage state`, entity.state, entity);
                break;
        }
    }

    if (deviceType == "climate") {
        switch (entity.state) {
            case "heat":
                styleString = stateColors.warm;
                break;

            case "cool":
                styleString = stateColors.cold;
                break;

            case "dry":
                styleString = stateColors.positive;
                break;

            case "fan_only":
                styleString = stateColors.positive;
                break;

            case "heat_dry":
                styleString = stateColors.positive;
                break;

            case "heat_cool":
                styleString = stateColors.positive;
                break;

            case "auto":
                styleString = stateColors.positive;
                break;

            case "off":
                break;

            default:
                console.info(`Muto`, `Unsupported climate state`, entity.state, entity);
                break;
        }
    }

    return styleString;
}

export function deviceTypeForEntity(entity: HassEntity): string {
    let type: string = "unknown";

    if (entity && entity.attributes && entity.attributes.device_class) {
        type = entity.attributes.device_class;
    }
    if (entity && type == "unknown") {
        type = entity.entity_id.split(".")[0];
    }

    return type;
}

export function iconForClimateEntity(entity: HassEntity): string | false {
    switch (entity.state) {
        case "cool":
            return "mdi:snowflake";

        case "heat":
            return "mdi:fire";

        case "dry":
            return "mdi:fan";

        case "fan_only":
            return "mdi:fan";

        case "heat_dry":
            return "mdi:fire";

        case "off":
            return "mdi:fan-off";

        default:
            return false;
    }
}

export function iconForEntity(entity: HassEntity): string {
    if (entity == undefined) {
        return "mdi:help-circle-outline";
    } else {
        let type: string = deviceTypeForEntity(entity);
        switch (type) {
            case "light":
                return "mdi:lightbulb";
            case "binary_sensor":
                return "mdi:bell-outline";
            case "climate":
                return "mdi:air-conditioner";
            case "switch":
                return "mdi:toggle-switch-off-outline";
            case "moisture":
                return "mdi:water";
            case "motion":
                return "mdi:walk";
            default:
                console.warn(`Muto`, `Unknown entity icon type:`, type, entity);
                return "mdi:help-circle-outline";
        }
    }
}
