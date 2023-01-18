export abstract class ApiErrors {
  status: String;
  message: String;

  constructor(status: String, message: String) {
    this.message = message;
    this.status = status;
  }
}

export class NotFound extends ApiErrors {
  constructor(status: String = "404", message: String) {
    super(status, message);
  }
}

export class InternalServerError extends ApiErrors {
  constructor(status: String = "500", message: String) {
    super(status, message);
  }
}
