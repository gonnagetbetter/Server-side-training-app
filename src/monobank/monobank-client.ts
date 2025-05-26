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
      console.error(e);
      let errorMessage: string;
      const responseData = e.response.data;

      if (responseData.errCode && responseData.errText) {
        const { errCode, errText } = e.responseData;

        errorMessage = `Error creating invoice: ${errText} (code: ${errCode})`;
      } else {
        errorMessage = e.message;
      }

      this.logger.error(e);
      this.logger.error(errorMessage);

      throw new InternalServerErrorException(errorMessage);
    }
  }

  public async getPublicKey(token: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.config.apiUrl}/api/merchant/pubkey`,
        {
          headers: {
            'X-Token': token,
          },
        },
      );

      return response.data.key;
    } catch (e) {
      let errorMessage: string;
      const responseData = e.response.data;

      if (responseData.errCode && responseData.errText) {
        const { errCode, errText } = responseData;

        errorMessage = `Error getting public key: ${errText} (code: ${errCode})`;
      } else {
        errorMessage = e.message;
      }

      this.logger.error(e);
      this.logger.error(errorMessage);

      throw new InternalServerErrorException(errorMessage);
    }
  }
}
