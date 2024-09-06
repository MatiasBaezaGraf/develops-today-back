import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async fetchAvailableCountries() {
    return this.countryService.fetchAvailableCountries();
  }

  @Get(':countryCode')
  async fetchCountryDetails(@Param('countryCode') countryCode: string) {
    return this.countryService.fetchCountryDetails(countryCode);
  }
}
