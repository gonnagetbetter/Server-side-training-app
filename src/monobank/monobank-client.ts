import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { MONOBANK_CONFIG, ENDPOINTS } from './constants';
import { IMonobankConfig } from './interface/monobank-config.interface';
import { IMonobankInvoiceResponse } from './interface/monobank-invoice-response.interface';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class MonobankClient {
  private readonly logger = new Logger(MonobankClient.name);
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(MONOBANK_CONFIG) private readonly config: IMonobankConfig,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl,
    });
  }

  private createHeaders(token: string): Record<string, string> {
    return {
      'X-Token': token,
    };
  }

  public async invoiceCreate(
    dto: CreateInvoiceDto,
  ): Promise<IMonobankInvoiceResponse> {
    try {
      this.logger.debug('Trying to create invoice with payload:', dto);

      const response = await this.axiosInstance.post(
        ENDPOINTS.INVOICE_CREATE,
        dto,
        {
          headers: this.createHeaders(dto.token),
        },
      );

      this.logger.debug('Invoice created: ', response.data);

      const { invoiceId, pageUrl } = response.data;

      return { invoiceId, pageUrl };
    } catch (error) {
      this.logger.error('Failed to create invoice:', error);
      throw new InternalServerErrorException(
        `Failed to create invoice: ${error.message}`,
      );
    }
  }

  public async getPublicKey(token: string): Promise<string | undefined> {
    try {
      const response = await this.axiosInstance.get(ENDPOINTS.PUBLIC_KEY, {
        headers: this.createHeaders(token),
      });

      return response.data.key;
    } catch (error) {
      this.logger.error('Failed to get public key:', error);
      throw new InternalServerErrorException(
        `Failed to get public key: ${error.message}`,
      );
    }
  }
}
