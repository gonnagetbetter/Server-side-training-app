import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import axios from 'axios';
import { MONOBANK_CONFIG } from './constants';
import { IMonobankConfig } from './interface/monobank-config.interface';
import { IMonobankInvoiceResponse } from './interface/monobank-invoice-response.interface';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class MonobankClient {
  private logger = new Logger(MonobankClient.name);

  constructor(
    @Inject(MONOBANK_CONFIG) private readonly config: IMonobankConfig,
  ) {
    this.config = config;
  }

  public async invoiceCreate(
    dto: CreateInvoiceDto,
  ): Promise<IMonobankInvoiceResponse> {
    try {
      this.logger.debug('Trying to create invoice with payload:', dto);

      const token = dto.token;

      const response = await axios.post(
        `${this.config.apiUrl}/api/merchant/invoice/create`,
        dto,
        {
          headers: {
            'X-Token': token,
          },
        },
      );

      this.logger.debug('Invoice created: ', response.data);

      const { invoiceId, pageUrl } = response.data;

      return { invoiceId, pageUrl };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(e.message);
    }
  }

  public async getPublicKey(token: string): Promise<string | undefined> {
    try {
      const response = await axios.get(
        `${this.config.apiUrl}/api/merchant/pubkey`,
        {
          headers: {
            'X-Token': token,
          },
        },
      );
      if (response.data.key) {
        return response.data.key;
      }
      return undefined;
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(e.message);
    }
  }
}
