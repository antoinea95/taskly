
export const createdDate = (createdAt: number) => {
    const date = new Date(createdAt);
    const timeArray = date.toLocaleTimeString().split(":");
    const time = `${timeArray[0]}:${timeArray[1]}`
    return `${date.toLocaleDateString()} at ${time}`
}