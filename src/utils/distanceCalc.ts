type Props = {
    lat: number
    lng: number
}

export function distanceCal(
    { lat: lat1, lng: lng1 }: Props,
    { lat: lat2, lng: lng2 }: Props
) {
    const toRad = function (value) {
        return value * Math.PI / 180;
    }
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}