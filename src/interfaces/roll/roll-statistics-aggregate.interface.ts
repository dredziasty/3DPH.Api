export interface IRollStatisticsAggregate {
  readonly _id?: string
  readonly key?: string
  readonly totalActualWeight?: number
  readonly totalUsedWeight?: number
  readonly lastCoolingSpeed?: number
  readonly lastPrintingTemperature?: number
  readonly lastBedTemperature?: number
  readonly overallRating?: number
}