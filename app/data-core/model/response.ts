export interface ResponseBase {
  FaultCode: number
  FaultReason: string
  InnerException: ExceptionData
  Id: string
}

export interface Response<T> extends ResponseBase {
  Data: T
}

export interface ExceptionData {
  Message: string
  ExceptionType: string
  InnerException: ExceptionData
}

export interface HttpResponse<T> {
  data: Response<T>
  status: number
  statusText: string
}
