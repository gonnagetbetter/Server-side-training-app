import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { MonobankClient } from '../monobank-client';
import { MONOBANK_CONFIG } from '../constants';
import { IMonobankConfig } from '../interface/monobank-config.interface';
import * as crypto from 'crypto';

export class MonobankWebhookGuard implements CanActivate {
  constructor(
    @Inject(MonobankClient)
    private readonly monobankClient: MonobankClient,
    @Inject(MONOBANK_CONFIG) private readonly config: IMonobankConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const publicKeyBase64 = await this.monobankClient.getPublicKey(
      this.config.monobankToken,
    );
    if (!publicKeyBase64) return false;

    const signatureBase64 = request.headers['x-sign'];

    const signatureBuf = Buffer.from(signatureBase64, 'base64');
    const publicKeyBuf = Buffer.from(publicKeyBase64, 'base64');
    const verify = crypto.createVerify('sha256');

    verify.write(JSON.stringify(request.body));
    verify.end();
    const result = verify.verify(publicKeyBuf, signatureBuf);
    return result;
  }
}
