export class ResponseError<T> {
  private readonly data: T | T[];
  private readonly message: String;
  private readonly success?: boolean;
  private readonly error: any;
  private readonly status: String;

  constructor(data: T | T[], message: String, status: String, success: boolean = false, error: any) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.error = error;
    this.status = status;
  }
}

export class SuccessResponse<T> {
  private readonly data: T | T[];
  private readonly message: String;
  private readonly success?: boolean;
  private readonly status: String;

  constructor(data: T | T[], message: String, status: String, success: boolean = true) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.status = status;
  }
}
