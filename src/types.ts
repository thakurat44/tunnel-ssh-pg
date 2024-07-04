export type TunnelStatusEnumType = "unset" | "creating" | "created" | "closed";
export type ResultCodeEnumType = 200 | 429 | 500

export type ResultType = {
  code: ResultCodeEnumType
  data?: any
}
