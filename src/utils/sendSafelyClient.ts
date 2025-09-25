/**
 * SendSafely REST API Client
 *
 * Implements SendSafely's HMAC-SHA256 authentication for browser use
 * Authentication format: HmacSHA256(API_SECRET, API_KEY + URL_PATH + TIMESTAMP + REQUEST_BODY)
 */

export interface SendSafelyConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

export interface UserInfo {
  email: string;
  // Add other user properties as needed
}

export interface SendSafelyResponse<T = any> {
  response: string;
  message?: string;
  data?: T;
  email?: string; // Some endpoints return email directly
}

export class SendSafelyClient {
  private config: SendSafelyConfig;

  constructor(baseUrl: string, apiKey: string, apiSecret: string) {
    this.config = {
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      apiKey,
      apiSecret,
    };
  }

  /**
   * Generate SendSafely timestamp in the required format
   */
  private generateTimestamp(): string {
    const time = new Date().toISOString();
    return time.substring(0, 19) + '+0000';
  }

  /**
   * Generate HMAC-SHA256 signature for SendSafely API authentication
   */
  private async generateSignature(
    urlPath: string,
    timestamp: string,
    requestBody: string = ''
  ): Promise<string> {
    const signatureData = this.config.apiKey + urlPath + timestamp + requestBody;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.config.apiSecret);
    const messageData = encoder.encode(signatureData);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);

    // Convert signature to hex
    const signatureArray = new Uint8Array(signature);
    return Array.from(signatureArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Make an authenticated request to the SendSafely API
   */
  private async makeRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    urlPath: string,
    body?: any
  ): Promise<T> {
    const timestamp = this.generateTimestamp();
    const requestBody = body ? JSON.stringify(body) : '';
    const signature = await this.generateSignature(urlPath, timestamp, requestBody);

    const url = `${this.config.baseUrl}${urlPath}`;

    const headers: Record<string, string> = {
      'ss-api-key': this.config.apiKey,
      'ss-request-signature': signature,
      'ss-request-timestamp': timestamp,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody || undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendSafely API Error (${response.status}): ${errorText}`);
    }

    const responseData = await response.json();

    // Check for SendSafely-specific error responses that still return HTTP 200
    if (responseData.response === 'FAIL' || responseData.response === 'ERROR') {
      throw new Error(`SendSafely API Error: ${responseData.message || 'Authentication failed'}`);
    }

    return responseData;
  }

  /**
   * Verify API credentials by calling the user endpoint
   */
  async verifyCredentials(): Promise<UserInfo> {
    const response = await this.makeRequest<SendSafelyResponse<UserInfo>>('GET', '/api/v2.0/user');

    // We must get a real email address - no fallbacks, no assumptions
    if (response.email) {
      return { email: response.email };
    } else if (response.data?.email) {
      return { email: response.data.email };
    } else {
      throw new Error('Authentication failed: No email address in response');
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(): Promise<UserInfo> {
    return this.verifyCredentials();
  }
}

/**
 * Convenience function to create a SendSafely client instance
 */
export function createSendSafelyClient(baseUrl: string, apiKey: string, apiSecret: string): SendSafelyClient {
  return new SendSafelyClient(baseUrl, apiKey, apiSecret);
}