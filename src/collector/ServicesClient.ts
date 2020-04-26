import { retry } from '@lifeomic/attempt';
import nodeFetch, { Request } from 'node-fetch';

import { retryableRequestError, fatalRequestError } from './error';
import {
  ListDomainResponse,
  PaginationInput,
  DigiCertAccount,
  ListOrderResponse,
} from './types';
import { URLSearchParams } from 'url';

const API_BASE_URL = 'https://www.digicert.com/services/v2';

// The Services API accepts a 'X-DC-DEVKEY' header for authenticating
// all requests.
//
// ref: https://dev.digicert.com/authentication/
interface RequiredHeaders {
  'X-DC-DEVKEY': string;
}

interface ServicesClientInput {
  apiKey: string;
}

/**
 * Services Api
 */
export class ServicesClient {
  readonly requiredHeaders: RequiredHeaders;

  constructor({ apiKey }: ServicesClientInput) {
    // add api to required headers which will be used
    // in all fetch requests from this client
    this.requiredHeaders = {
      'X-DC-DEVKEY': apiKey,
    };
  }

  /**
   * Get Account Details
   *
   * ref: https://dev.digicert.com/services-api/account/account-details/
   */
  getAccountDetails(): Promise<DigiCertAccount> {
    return this.fetch('/account');
  }

  /**
   * Lists _all_ domains
   *
   * ref: https://dev.digicert.com/services-api/domains/list-domains/
   */
  iterateDomains(pagination?: PaginationInput): Promise<ListDomainResponse> {
    return this.fetch('/domain', { ...pagination, includeValidation: 'true' });
  }

  /**
   * Lists _all_ orders
   *
   * ref: https://dev.digicert.com/services-api/orders/list-orders/
   */
  iterateOrders(pagination?: PaginationInput): Promise<ListOrderResponse> {
    return this.fetch('/order/certificate', { ...pagination });
  }

  fetch<T = object>(
    url: string,
    queryParams: { [param: string]: string | string[] } = {},
    request?: Omit<Request, 'url'>,
  ): Promise<T> {
    return retry(
      async () => {
        const qs = new URLSearchParams(queryParams).toString();
        const response = await nodeFetch(
          `${API_BASE_URL}${url}${qs ? '?' + qs : ''}`,
          {
            ...request,
            headers: {
              ...this.requiredHeaders,
              ...request?.headers,
            },
          },
        );

        /**
         * We are working with a json api, so just return the parsed data.
         */
        if (response.ok) {
          return response.json() as T;
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(response);
        } else {
          throw fatalRequestError(response);
        }
      },
      {
        maxAttempts: 10,
        delay: 200,
        factor: 2,
        jitter: true,
        handleError: (err, context) => {
          if (!err.retryable) {
            // can't retry this? just abort
            context.abort();
          }
        },
      },
    );
  }
}

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}
