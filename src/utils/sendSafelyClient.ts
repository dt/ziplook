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

export interface PackageFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  createdDate: string;
  fileUploaded?: string;
  // Add other file properties as needed
}

export interface PackageInfo {
  packageId: string;
  packageCode: string;
  packageSender?: string;
  files: PackageFile[];
  // Add other package properties as needed
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
  public async makeRequest<T = any>(
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
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();

    // Check for SendSafely-specific error responses that still return HTTP 200
    if (responseData.response && responseData.response !== 'SUCCESS') {
      // Show the actual API response
      throw new Error(`API response: "${responseData.response}", message: "${responseData.message || 'No message provided'}"`);
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

  /**
   * Generate PBKDF2 checksum for SendSafely API authentication
   */
  private async generateChecksum(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: encoder.encode(salt),
        iterations: 1024
      },
      key,
      256
    );

    return Array.from(new Uint8Array(bits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Get download URLs for file segments
   *
   * IMPORTANT:
   * - Segment numbering starts at 1 (segment 0 is invalid)
   * - endSegment parameter is REQUIRED for all requests
   */
  async getDownloadUrls(
    packageId: string,
    fileId: string,
    keyCode: string,
    packageCode: string,
    startSegment: number = 1, // SendSafely segments start at 1
    endSegment?: number
  ): Promise<Array<{ part: number; url: string }>> {
    try {
      const checksum = await this.generateChecksum(keyCode, packageCode);

      // Always include both startSegment and endSegment
      const body: any = { checksum, startSegment };
      if (endSegment !== undefined) {
        body.endSegment = endSegment;
      } else {
        // Default to requesting just a few segments for testing
        body.endSegment = startSegment + 24; // SendSafely typically returns up to 25 segments per request
      }

      const response = await this.makeRequest<any>(
        'POST',
        `/api/v2.0/package/${encodeURIComponent(packageId)}/file/${encodeURIComponent(fileId)}/download-urls/`,
        body
      );

      // Handle different response formats
      if (response.downloadUrls) {
        return response.downloadUrls;
      } else if (response.data?.downloadUrls) {
        return response.data.downloadUrls;
      } else {
        throw new Error(`Unexpected download URLs response format: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error('Failed to get download URLs:', error);
      throw error;
    }
  }

  /**
   * Get package information and file listing using packageCode and keyCode
   */
  async getPackageInfo(packageCode: string): Promise<PackageInfo> {
    console.log(`Attempting to get package info for packageCode: ${packageCode}`);

    try {
      // Add 1 second delay to prevent modal blinking
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try using packageCode directly as packageId
      const response = await this.makeRequest<SendSafelyResponse<PackageInfo>>(
        'GET',
        `/api/v2.0/package/${packageCode}`
      );

      console.log('Package response:', response);

      // Check if the response has the package data directly or in a data field
      if ((response as any).packageId && (response as any).files) {
        // Package info is directly in the response
        return response as any as PackageInfo;
      } else if (response.data) {
        // Package info is in the data field
        return response.data;
      } else {
        // Show what we actually got from the API
        throw new Error(`Unexpected API response format: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error('Package info request failed:', error);
      throw error;
    }
  }
}

/**
 * Parse SendSafely URL to extract package/recipient info
 */
export function parseSendSafelyUrl(url: string): { packageCode: string; keyCode: string; baseUrl: string } | null {
  try {
    // Return null for empty or invalid URLs
    if (!url || typeof url !== 'string' || !url.trim()) {
      return null;
    }

    const urlObj = new URL(url.trim());
    const searchParams = urlObj.searchParams;

    // Get keycode from hash fragment (after #keycode=) - case insensitive
    const hash = urlObj.hash;
    const keyCodeMatch = hash.match(/#keycode=([^&]+)/i); // Must start with # for fragment, case insensitive
    const keyCode = keyCodeMatch ? keyCodeMatch[1] : null;
    if (!keyCode) {
      return null;
    }

    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

    // Get packageCode from query params
    const packageCode = searchParams.get('packageCode');
    if (packageCode) {
      return { packageCode, keyCode, baseUrl };
    }
    return null;
  } catch (error) {
    console.log('Error parsing SendSafely URL:', error);
    return null;
  }
}

/**
 * Convenience function to create a SendSafely client instance
 */
export function createSendSafelyClient(baseUrl: string, apiKey: string, apiSecret: string): SendSafelyClient {
  return new SendSafelyClient(baseUrl, apiKey, apiSecret);
}