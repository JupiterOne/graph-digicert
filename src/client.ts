import { retry } from '@lifeomic/attempt';
import nodeFetch, { Request } from 'node-fetch';

import {
  DigiCertAccount,
  CommonResponse,
  ResourceKey,
  IterateApiCallback,
  DigiCertUser,
  DigiCertOrder,
} from './types';
import { URLSearchParams } from 'url';
import { IntegrationConfig } from './config';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

const API_BASE_URL = 'https://www.digicert.com/services/v2';

// The Services API accepts a 'X-DC-DEVKEY' header for authenticating
// all requests.
//
// ref: https://dev.digicert.com/authentication/
interface RequiredHeaders {
  'X-DC-DEVKEY': string;
}

/**
 * Services Api
 */
export class ServicesClient {
  readonly requiredHeaders: RequiredHeaders;
  readonly logger: IntegrationLogger;

  constructor(config: IntegrationConfig, logger: IntegrationLogger) {
    // add api to required headers which will be used
    // in all fetch requests from this client
    this.requiredHeaders = {
      'X-DC-DEVKEY': config.apiKey,
    };
    this.logger = logger;
  }

  /**
   * Get Account Details
   *
   * ref: https://dev.digicert.com/services-api/account/account-details/
   */
  getAccountDetails(): Promise<DigiCertAccount> {
    return this.executeAPIRequestWithRetries<DigiCertAccount>('/account');
  }

  /**
   * Lists _all_ orders
   *
   * ref: https://dev.digicert.com/services-api/orders/list-orders/
   */
  async iterateOrders(
    callback: (data: DigiCertOrder) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi<'orders', DigiCertOrder>(
      async (orders) => {
        for (const order of orders) {
          await callback(order);
        }
      },
      '/order/certificate',
      'orders',
    );
  }

  /**
   * Lists _all_ users
   *
   * ref: https://dev.digicert.com/services-api/users/list-users/
   */
  async iterateUsers(
    callback: (data: DigiCertUser) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi<'users', DigiCertUser>(
      async (users) => {
        for (const user of users) {
          await callback(user);
        }
      },
      '/user',
      'users',
    );
  }

  /**
   * Lists _all_ domains
   *
   * ref: https://dev.digicert.com/services-api/domains/list-domains/
   */
  // TODO: add domains

  public async verifyAuthentication(): Promise<void> {
    await this.getAccountDetails();
  }

  public async iterateApi<T extends ResourceKey, U>(
    cb: IterateApiCallback<U>,
    urlPath: string,
    resourceKey: ResourceKey,
  ) {
    const defaultLimit = 1;
    let hasNext = true;
    let offset = 0;

    do {
      const response = await this.executeAPIRequestWithRetries<
        CommonResponse<T, U>
      >(urlPath, {
        offset: String(offset),
        limit: String(defaultLimit),
      });

      if (!response[resourceKey]) return null;

      offset = offset + response[resourceKey].length;
      hasNext = offset !== response.page.total;

      await cb(response[resourceKey]);
    } while (hasNext);
  }

  private executeAPIRequestWithRetries<T>(
    url: string,
    queryParams: { [param: string]: string | string[] } = {},
    request?: Omit<Request, 'url'>,
  ): Promise<T> {
    return retry(
      async () => {
        const qs = new URLSearchParams(queryParams).toString();
        const endpoint = `${API_BASE_URL}${url}${qs ? '?' + qs : ''}`;
        const response = await nodeFetch(endpoint, {
          ...request,
          headers: {
            ...this.requiredHeaders,
            ...request?.headers,
          },
        });

        if (response.ok) {
          return response.json();
        } else {
          let reponseErrorMessage = '';
          try {
            const responseErrors = (await response.json()).errors;

            if (responseErrors) {
              reponseErrorMessage = responseErrors[0].message;
            }
          } catch (err) {
            this.logger.warn('Unable to parse response errors');
          }
          throw new IntegrationProviderAPIError({
            status: response.status,
            statusText: reponseErrorMessage || response.statusText,
            endpoint: endpoint,
          });
        }
      },
      {
        maxAttempts: 10,
        delay: 200,
        factor: 2,
        jitter: true,
        handleError: (err, attemptContext) => {
          const errorProps = {
            status: err.status,
            statusText: err.statusText,
            endpoint: err.endpoint,
          };

          if (
            (errorProps.status >= 400 && errorProps.status < 500) ||
            errorProps.status === 404
          ) {
            attemptContext.abort();
            throw new IntegrationProviderAuthorizationError(errorProps);
          }

          throw new IntegrationProviderAPIError(errorProps);
        },
      },
    );
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): ServicesClient {
  return new ServicesClient(config, logger);
}
