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
        enteredAt: new Date("2023-04-24T05:00:00"),
        exitedAt: new Date("2023-04-24T06:00:00")
    })
    expect(calcDiscount(drive)).toBe(0);
})

describe("平日朝夕割", () => {
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
        expect(calcDiscount(drive)).toBe(30);
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
    test("休日は0%", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 10
            },
            routeType: 'URBAN',
            vehicleFamily: 'STANDARD',
            enteredAt: new Date("2023-05-03T06:00:00+09:00"),
            exitedAt: new Date("2023-05-03T07:00:00+09:00")
        })
        expect(calcDiscount(drive)).toBe(0)
    })
})

describe("深夜割", () => {
    test("深夜30%", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 1
            },
            routeType: 'URBAN',
            vehicleFamily: 'STANDARD',
            enteredAt: new Date("2023-04-24T00:00:00+09:00"),
            exitedAt: new Date("2023-04-24T04:00:00+09:00")
        })
        expect(calcDiscount(drive)).toBe(30)
    })
    test("一秒でもオーバーしたら適用されない", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 1
            },
            routeType: 'URBAN',
            vehicleFamily: 'STANDARD',
            enteredAt: new Date("2023-04-24T00:00:00+09:00"),
            exitedAt: new Date("2023-04-24T04:00:01+09:00")
        })
        expect(calcDiscount(drive)).toBe(0)
    })    
})

describe("休日割", () => {
    test("休日30%", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 1
            },
            routeType: 'RURAL',
            vehicleFamily: 'STANDARD',
            enteredAt: new Date("2023-04-23T10:00:00+09:00"),
            exitedAt: new Date("2023-04-23T11:00:00+09:00")
        })
        expect(calcDiscount(drive)).toBe(30)
    })
    test("一秒でもオーバーしたら適用されない", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 1
            },
            routeType: 'RURAL',
            vehicleFamily: 'STANDARD',
            enteredAt: new Date("2023-04-23T10:00:00"),
            exitedAt: new Date("2023-04-24T00:00:01")
        })
        expect(calcDiscount(drive)).toBe(0)
    })
    test("都会は適用されず", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 1
            },
            routeType: 'URBAN',
            vehicleFamily: 'STANDARD',
            enteredAt: new Date("2023-04-23T10:00:00"),
            exitedAt: new Date("2023-04-23T20:00:00")
        })
        expect(calcDiscount(drive)).toBe(0)
    })
    test("その他車種も適用されず", () => {
        const drive = HighwayDrive.parse({
            driver: {
                countPerMonth: 1
            },
            routeType: 'RURAL',
            vehicleFamily: 'OTHER',
            enteredAt: new Date("2023-04-23T10:00:00"),
            exitedAt: new Date("2023-04-23T20:00:00")
        })
        expect(calcDiscount(drive)).toBe(0)
    })         
})