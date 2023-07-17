import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getData(): string {
    this.logger.log("Log from AppService");
    return 'This is Data!';
  }
}
