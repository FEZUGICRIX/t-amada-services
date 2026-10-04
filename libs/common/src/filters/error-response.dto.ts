export interface ErrorResponseDto {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
