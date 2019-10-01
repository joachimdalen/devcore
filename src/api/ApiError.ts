import { AxiosError } from 'axios';

export class ApiError {
  public readonly isAxiosError: boolean;
  public readonly errorType: string;
  public readonly statusCode: number;
  public readonly statusText: string;
  public readonly message: string;
  public readonly errors: object[];
  public readonly rawError?: AxiosError | Error;

  constructor(rawError: Error | AxiosError, isAxiosError: boolean = false) {
    if (isAxiosError) {
      this.isAxiosError = true;
      const error: AxiosError = rawError as AxiosError;
      const { response } = error;
      if (response) {
        const { status, data, statusText } = response;
        this.statusCode = data.code || status;
        this.statusText =
          data.statusText || statusText || 'An unknown error occurred.';
        this.message = data.message;
        if (data.errors) {
          this.errorType = 'validation';
          this.errors = data.errors;
        } else {
          this.errorType = 'error';
          this.errors = [];
        }
      } else {
        this.statusText = 'An error occurred.';
        this.message = 'An unknown error occurred.';
        this.errorType = 'error';
        this.errors = [];
        this.statusCode = 500;
      }
    } else {
      this.statusText = 'An error occurred.';
      this.message = 'An unknown error occurred.';
      this.errorType = 'error';
      this.errors = [];
      this.statusCode = 500;
      this.isAxiosError = false;
    }
    this.rawError = rawError;
  }
  public hasError(key: string) {
    if (this.errors === undefined) return false;
    if (!this.isValidationError) return false;

    return this.errors[key as any] !== undefined;
  }
  public isValidationError(): Boolean {
    return this.errorType === 'validation';
  }
  public getError(key: string): string {
    if (!this.hasError(key)) return '';
    return this.errors && this.errors[key as string];
  }
}
