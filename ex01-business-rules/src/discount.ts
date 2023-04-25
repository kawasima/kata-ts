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
