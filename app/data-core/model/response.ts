export interface Response<T> {
    FaultCode: number;
    FaultReason: string;
    InnerException: ExceptionData;
    Data: T;
}

export interface ExceptionData {
    Message: string;
    ExceptionType: string;
    InnerException: ExceptionData;
}

export interface HttpResponse<T> {
    data: Response<T>;
    status: number;
    statusText: string;
}