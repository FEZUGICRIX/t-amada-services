import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard API error response DTO
 */
export class ErrorResponseDto {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates request failure',
    example: false,
    default: false,
  })
  readonly success: boolean = false;

  @ApiProperty({
    type: Number,
    description: 'HTTP status code',
    example: 400,
  })
  readonly statusCode: number;

  @ApiProperty({
    type: Object,
    description: 'Error message or list of validation error messages',
    oneOf: [
      { type: 'string', example: 'Bad Request' },
      { type: 'array', items: { type: 'string' }, example: ['field must not be empty'] },
    ],
  })
  readonly message: string | string[];

  @ApiProperty({
    type: String,
    description: 'HTTP error title or category',
    example: 'Bad Request',
  })
  readonly error: string;

  @ApiProperty({
    type: String,
    description: 'ISO 8601 timestamp of when the error occurred',
    example: '2026-10-05T12:00:00.000Z',
  })
  readonly timestamp: string;

  @ApiProperty({
    type: String,
    description: 'Request URL path where the error occurred',
    example: '/api/v1/resource',
    required: false,
  })
  readonly path?: string;
}
