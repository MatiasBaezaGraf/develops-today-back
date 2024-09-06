import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CountryService {
  private readonly dateNagerApiBaseUrl: string;
  private readonly countriesNowApiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.dateNagerApiBaseUrl = this.configService.get<string>(
      'DATE_NAGER_API_BASE_URL',
    );
    this.countriesNowApiBaseUrl = this.configService.get<string>(
      'COUNTRIES_NOW_API_BASE_URL',
    );
  }

  async fetchAvailableCountries(): Promise<any> {
    const url = `${this.dateNagerApiBaseUrl}/v3/AvailableCountries`;

    try {
      const { data } = await lastValueFrom(this.httpService.get(url));
      return data;
    } catch (error) {
      throw new Error(`Error fetching available countries: ${error.message}`);
    }
  }

  async fetchCountryDetails(countryCode: string): Promise<any> {
    const datNagerUrl = `${this.dateNagerApiBaseUrl}/v3/CountryInfo/${countryCode}`;
    const countriesNowUrl = `${this.countriesNowApiBaseUrl}/countries`;

    try {
      const { data: dateNagerData } = await lastValueFrom(
        this.httpService.get(datNagerUrl),
      );

      const countryName = dateNagerData?.commonName;

      const countriesNowPopulationBody = {
        country: countryName,
      };

      try {
        const { data: countriesNowPopulationData } = await lastValueFrom(
          this.httpService.post(
            countriesNowUrl + '/population',
            countriesNowPopulationBody,
          ),
        );

        const countriesNowFlagBody = {
          iso2: countryCode,
        };

        const { data: countriesNowFlagData } = await lastValueFrom(
          this.httpService.post(
            countriesNowUrl + '/flag/images',
            countriesNowFlagBody,
          ),
        );

        const dataToReturn = {
          name: countryName,
          flag: countriesNowFlagData.data?.flag,
          borders: dateNagerData?.borders,
          historicPopulation: countriesNowPopulationData.data?.populationCounts,
        };

        return dataToReturn;
      } catch (error) {
        console.log(error);
        const dataToReturn = {
          name: countryName,
          flag: '',
          borders: dateNagerData?.borders,
          historicPopulation: [],
        };

        return dataToReturn;
      }
    } catch (error) {
      throw new Error(`Error fetching country details: ${error.message}`);
    }
  }
}
