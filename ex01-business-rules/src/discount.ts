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
export const calcDiscount: CalcDiscount = highwayDriver => {
    return 0;
}

const DiscountRule = z.object({
    isApplicable: z.function().args(HighwayDrive).returns(z.boolean()),
    discount: z.function().args(HighwayDrive).returns(Percentage),
})
type DiscountRule = z.infer<typeof DiscountRule>

const DateRange = z.object({
    from: z.date(),
    to: z.date(),
}).refine(v => v.from.getTime() <= v.to.getTime(), {
    message: "from - toの関係が逆"
})
type DateRange = z.infer<typeof DateRange>

const TimeRange = z.object({
    from: z.number().int().min(0).max(23),
    to: z.number().int().min(0).max(23),
}).refine(v => v.from <= v.to, {
    message: "from - toの関係が逆"
})
type TimeRange = z.infer<typeof TimeRange>

const dateIn = (std: TimeRange, given: DateRange): boolean => {
    return given.from.getHours() >= std.from && given.to.getHours() <= std.to
}

const morning = TimeRange.parse({ from: 6, to: 9})
const evening = TimeRange.parse({ from: 17, to: 20})
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
const midnight = TimeRange.parse({from: 0, to: 4})
const discountAtMidnight = DiscountRule.parse({
    isApplicable: (drive: HighwayDrive): boolean => dateIn(
        midnight,
        DateRange.parse({from: drive.enteredAt, to: drive.exitedAt}),
    ),
    discount: (drive: HighwayDrive) => 30,
})
const discountOnHoliday = DiscountRule.parse({
    isApplicable: (drive: HighwayDrive) =>
        (isHoliday(drive.enteredAt) || isHoliday(drive.exitedAt))
        && drive.routeType === "RURAL",
    discount: (drive: HighwayDrive) => 30,
}) 

const rules: DiscountRule[] = [
    discountInMorningOrEvening,
    discountAtMidnight,
    discountOnHoliday,
]

export const calcDiscount2: CalcDiscount = (drive: HighwayDrive) =>
    rules.filter(rule => rule.isApplicable(drive))
        .map(rule => rule.discount(drive))
        .reduce((a, b) => Math.max(a, b), 0)
