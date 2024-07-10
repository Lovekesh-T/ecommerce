export class ApiResponse {
  public success: boolean;
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = this.statusCode < 400;
    this.data = this.data || null;
  }
}
