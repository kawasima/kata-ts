import z from "zod"
import * as JapaneseHolidays from "japanese-holidays"

type IsHoliday = (d: Date) => boolean
export const isHoliday:IsHoliday = d => d.getDay() === 0
    || d.getDay() === 6
    || Boolean(JapaneseHolidays.isHoliday(d))

const Driver = z.object({
    countPerMonth: z.number().int().positive(),
})
type Driver = z.infer<typeof Driver>

const VehicleFamily = z.union([
    z.literal("STANDARD"), // 普通車
    z.literal("MINI"),     // 軽自動車
    z.literal("MORTERCYCLE"), // 二輪車
    z.literal("OTHER"),    // その他
])

const NotLargeVehicleFamily = z.union([
    z.literal("STANDARD"), // 普通車
    z.literal("MINI"),     // 軽自動車
    z.literal("MORTERCYCLE"), // 二輪車
])

const RouteType = z.union([
    z.literal("RURAL"), // 地方部
    z.literal("URBAN"), // 都市部
])

export const HighwayDrive = z.object({
    enteredAt: z.date(),
    exitedAt: z.date(),
    vehicleFamily: VehicleFamily,
    routeType: RouteType,
    driver: Driver,
})
export type HighwayDrive = z.infer<typeof HighwayDrive>

const Percentage = z.number().positive().max(100)
type Percentage = z.infer<typeof Percentage>

export type CalcDiscount = (highwayDrive: HighwayDrive) => Percentage

// 割引ルール
const DiscountRule = z.object({
    isApplicable: z.function().args(HighwayDrive).returns(z.boolean()),
    discount: z.function().args(HighwayDrive).returns(Percentage),
})
type DiscountRule = z.infer<typeof DiscountRule>

// 日付の範囲
const DateRange = z.object({
    from: z.date(),
    to: z.date(),
}).refine(v => v.from.getTime() <= v.to.getTime(), {
    message: "from - toの関係が逆"
})
type DateRange = z.infer<typeof DateRange>

// 時間帯の定義
const HourRange = z.object({
    from: z.number().int().min(0).max(23),
    to: z.number().int().min(0).max(23),
}).refine(v => v.from <= v.to, {
    message: "from - toの関係が逆"
})
type HourRange = z.infer<typeof HourRange>

// DateRangeが時間帯に入っているかどうか?
const dateIn = (std: HourRange, given: DateRange): boolean => {
    const offset = std.to <= given.from.getHours() ? 1 : 0
    const stdFrom = new Date(given.from.getFullYear(), given.from.getMonth(), given.from.getDate() + offset, std.from, 0, 0)
    const stdTo = new Date(given.to.getFullYear(), given.to.getMonth(), given.to.getDate() + offset, std.to, 0, 0)
    return given.from.getTime() >= stdFrom.getTime() && given.to.getTime() <= stdTo.getTime()
}

// 朝夕割引
const morning = HourRange.parse({ from: 6, to: 9})
const evening = HourRange.parse({ from: 17, to: 20})
const discountInMorningOrEvening = DiscountRule.parse({
    isApplicable: (drive: HighwayDrive): boolean =>
        ((!isHoliday(drive.enteredAt) && dateIn(morning, DateRange.parse({from: drive.enteredAt, to: drive.exitedAt})))
        || (!isHoliday(drive.enteredAt) && dateIn(evening, DateRange.parse({from: drive.enteredAt, to: drive.exitedAt}))))
        && drive.routeType === "RURAL",
    discount: (drive: HighwayDrive): Percentage => {
        const count = drive.driver.countPerMonth
        if (count >= 10) {
            return Percentage.parse(50)
        } else if (count >= 5) {
            return Percentage.parse(30)
        } else {
            return Percentage.parse(0)
        }
    }
})

// 深夜割引
const midnight = HourRange.parse({from: 0, to: 4})
const discountAtMidnight = DiscountRule.parse({
    isApplicable: (drive: HighwayDrive): boolean => dateIn(
        midnight,
        DateRange.parse({from: drive.enteredAt, to: drive.exitedAt}),
    ),
    discount: (drive: HighwayDrive) => 30,
})

// 休日割引
const discountOnHoliday = DiscountRule.parse({
    isApplicable: (drive: HighwayDrive) =>
        (isHoliday(drive.enteredAt) && isHoliday(drive.exitedAt))
        && NotLargeVehicleFamily.safeParse(drive.vehicleFamily).success
        && drive.routeType === "RURAL",
    discount: (drive: HighwayDrive) => 30,
}) 

// 割引ルールたち
const rules: DiscountRule[] = [
    discountInMorningOrEvening,
    discountAtMidnight,
    discountOnHoliday,
]

// 複数のルールから割引率を計算する
export const calcDiscount: CalcDiscount = (drive: HighwayDrive) =>
    rules.filter(rule => rule.isApplicable(drive))
        .map(rule => rule.discount(drive))
        .reduce((a, b) => Math.max(a, b), 0)
