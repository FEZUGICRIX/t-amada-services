import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService, HealthResponseDto } from './app.service';
import { SearchTransfersDto } from './dto/search-transfers.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiTags('Health')
  @ApiOperation({ summary: 'Health check' })
  getHealth(): HealthResponseDto {
    return this.appService.getHealth();
  }

  @Get('search')
  @ApiTags('Transfers')
  @ApiOperation({ summary: 'Search available transfers' })
  @ApiOkResponse({ type: [TransferResponseDto] })
  async searchTransfers(@Query() query: SearchTransfersDto): Promise<TransferResponseDto[]> {
    return this.appService.searchTransfers(query);
  }
}
