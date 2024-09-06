import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';

@Module({
  imports: [HttpModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
