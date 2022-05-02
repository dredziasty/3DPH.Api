export class DTOHelper {
  constructor() { }

  public generateQueryFromDTO = (obj: any, prefix: string = '') => {
    return Object.keys(obj).reduce((acc: any, k: any) => {
      const pre = prefix.length ? prefix + '.' : ''
      if (typeof obj[k] === 'object' && obj[k] !== null) Object.assign(acc, this.generateQueryFromDTO(obj[k], pre + k))
      else acc[pre + k] = obj[k]
      return acc
    }, {})
  }

  public removeEmptyFields = <T>(dto: T): T => {
    return Object.fromEntries(
      Object.entries(dto).filter(([key, value]) => {
        return !(value === '' || value === undefined || value === null)
      })
    ) as T
  }

  public processedQuery = (dto: object): object => this.removeEmptyFields(this.generateQueryFromDTO(dto))
}