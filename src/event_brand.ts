// wrapper for the env variable EVENT_BRAND
const brand = process.env.EVENT_BRAND
if(!brand) {
    throw "EVENT_BRAND must be set"
}
export const EVENT_BRAND = brand;
