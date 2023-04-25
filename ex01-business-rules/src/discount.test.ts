import { calcDiscount, HighwayDrive, isHoliday } from "./discount"

process.env.TZ = "Asia/Tokyo"
describe("isHoliday", () => {
    test("2023/4/22は休日", () => expect(isHoliday(
        new Date("2023-04-22T06:00:00"))).toBe(true))
    test("2023/4/23は休日", () => expect(isHoliday(
        new Date("2023-04-23T06:00:00"))).toBe(true))
    test("2023/4/25は平日", () => expect(isHoliday(
        new Date("2023-04-25T06:00:00"))).toBe(false))
    test("2023/5/3は休日", () => expect(isHoliday(
        new Date("2023-05-03T06:00:00"))).toBe(true))
})

test("0%", () => {
    const drive = HighwayDrive.parse({
        driver: {
            countPerMonth: 1
        },
        routeType: 'URBAN',
        vehicleFamily: 'STANDARD',
        enteredAt: new Date("2023-04-24T06:00:00+09:00"),
        exitedAt: new Date("2023-04-24T06:00:00+10:00")
    })
    expect(calcDiscount(drive)).toBe(0);
})

test("平日朝夕割30%", () => {
    const drive = HighwayDrive.parse({
        driver: {
            countPerMonth: 5
        },
        routeType: 'RURAL',
        vehicleFamily: 'STANDARD',
        enteredAt: new Date("2023-04-24T06:00:00+09:00"),
        exitedAt: new Date("2023-04-24T07:00:00+09:00")
    })
    expect(calcDiscount2(drive)).toBe(30);
})

test("平日朝夕割50%", () => {
    const drive = HighwayDrive.parse({
        driver: {
            countPerMonth: 10
        },
        routeType: 'RURAL',
        vehicleFamily: 'STANDARD',
        enteredAt: new Date("2023-04-24T06:00:00+09:00"),
        exitedAt: new Date("2023-04-24T07:00:00+09:00")
    })
    expect(calcDiscount(drive)).toBe(50);
})

test("走行時間オーバーすると平日朝夕割が適用されない", () => {
    const drive = HighwayDrive.parse({
        driver: {
            countPerMonth: 10
        },
        routeType: 'RURAL',
        vehicleFamily: 'STANDARD',
        enteredAt: new Date("2023-04-24T06:00:00+09:00"),
        exitedAt: new Date("2023-04-24T10:00:00+09:00")
    })
    expect(calcDiscount(drive)).toBe(0);
})
