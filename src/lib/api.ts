const API_BASE = '';

interface ApiError {
  error: string | string[];
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    console.log('[API] Request:', { method: options.method || 'GET', url });
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      });

      console.log('[API] Response:', { status: response.status, url });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        const errorMessage = typeof error.error === 'string' ? error.error : 'Request failed';
        console.error('[API] Error:', errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('[API] Fetch failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    return this.request<{ ok: boolean; user: { id: string; email: string } }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async register(email: string, password: string) {
    return this.request<{ ok: boolean; user: { id: string; email: string } }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async logout() {
    return this.request<{ ok: boolean }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request<{ user: { id: string; email: string; createdAt: string } }>(
      '/api/auth/me'
    );
  }

  async getTransaction(transactionId: string) {
    return this.request<{
      ok: boolean;
      claimable: boolean;
      error?: string;
      transaction?: {
        id: string;
        status: string;
        expiresAt: string;
      };
      figure?: {
        id: string;
        title: string;
        imageUrl?: string;
        description?: string;
        price?: number;
      };
      series?: {
        id: string;
        title: string;
        coverUrl?: string;
      };
    }>(`/api/scan/transaction/${transactionId}`);
  }

  async claimFigure(transactionId: string) {
    return this.request<{
      ok: boolean;
      status: string;
      alreadyOwned?: boolean;
      error?: string;
      figure?: {
        id: string;
        title: string;
      };
      seriesId?: string;
    }>('/api/scan/claim', {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  }

  async startReading(params: { figureId?: string; volumeId?: string; volumeNo: number }) {
    return this.request<{
      jwt: string;
      sessionId: string;
      contentAsset: {
        id: string;
        title: string;
        volumeNo: number;
        coverUrl: string;
        fileUrl: string;
      };
    }>('/api/read/start', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async sendHeartbeat(sessionId: string) {
    return this.request<{ ok: boolean; expiresAt: string }>(
      '/api/read/heartbeat',
      {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      }
    );
  }

  async stopReading(sessionId: string) {
    return this.request<{ ok: boolean }>('/api/read/stop', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async startLoan(figureId: string, days: number) {
    return this.request<{
      ok: boolean;
      uniqueUrl: string;
      token: string;
      expiresAt: string;
    }>('/api/loan/start', {
      method: 'POST',
      body: JSON.stringify({ figureId, days, agree: true }),
    });
  }

  async activateLoan(token?: string, urlSlug?: string) {
    return this.request<{ ok: boolean; figureId: string }>(
      '/api/loan/activate',
      {
        method: 'POST',
        body: JSON.stringify({ token, urlSlug }),
      }
    );
  }

  async endLoan(figureId: string) {
    return this.request<{ ok: boolean }>('/api/loan/end', {
      method: 'POST',
      body: JSON.stringify({ figureId }),
    });
  }

  async getProducts() {
    return this.request<{
      products: Array<{
        id: string;
        title: string;
        price: number;
        imageUrl: string;
        badges?: any;
      }>;
    }>('/api/goods/products');
  }

  async getProduct(id: string) {
    return this.request<{
      product: {
        id: string;
        title: string;
        price: number;
        imageUrl: string;
        badges?: any;
      };
    }>(`/api/goods/products/${id}`);
  }

  async addToCart(productId: string, qty: number = 1) {
    return this.request<{ ok: boolean }>('/api/goods/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, qty }),
    });
  }

  async removeFromCart(productId: string) {
    return this.request<{ ok: boolean }>('/api/goods/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async getCart() {
    return this.request<{
      cart: {
        items: Array<{
          id: string;
          qty: number;
          product: {
            id: string;
            title: string;
            price: number;
            imageUrl: string;
          };
        }>;
      };
    }>('/api/goods/cart');
  }

  async getNews(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<{
      news: Array<{
        id: string;
        title: string;
        date: string;
        thumbnailUrl: string;
        body: string;
      }>;
    }>(`/api/news${query}`);
  }

  async getNewsItem(id: string) {
    return this.request<{
      news: {
        id: string;
        title: string;
        date: string;
        thumbnailUrl: string;
        body: string;
      };
    }>(`/api/news/${id}`);
  }

  async getEvents() {
    return this.request<{
      events: Array<{
        id: string;
        title: string;
        date: string;
        location: string;
        thumbnailUrl: string;
        body: string;
      }>;
    }>('/api/events');
  }

  async getEvent(id: string) {
    return this.request<{
      event: {
        id: string;
        title: string;
        date: string;
        location: string;
        thumbnailUrl: string;
        body: string;
      };
    }>(`/api/events/${id}`);
  }

  async handleNfcTap(tagUid: string, signature: string, timestamp: string) {
    return this.request<{
      ok: boolean;
      action: 'login_required' | 'not_owner' | 'redirect_to_series';
      figure: {
        id: string;
        title: string;
        seriesId: string;
        seriesTitle: string;
        imageUrl?: string;
      };
      latestVolume?: {
        volumeId: string;
        volumeNo: number;
        currentPage: number;
      };
    }>(`/api/tap?u=${tagUid}&sig=${signature}&ts=${timestamp}`);
  }

  async getSeries() {
    return this.request<{
      ok: boolean;
      series: Array<{
        id: string;
        title: string;
        description?: string;
        author?: string;
        genre?: string;
        coverUrl?: string;
        averageRating: number;
        reviewCount: number;
        volumeCount: number;
      }>;
    }>('/api/series');
  }

  async getSeriesDetail(id: string) {
    return this.request<{
      ok: boolean;
      series: {
        id: string;
        title: string;
        description?: string;
        author?: string;
        genre?: string;
        coverUrl?: string;
        averageRating: number;
        volumes: Array<{
          id: string;
          volumeNo: number;
          title: string;
          coverUrl: string;
          price?: number;
          releaseDate?: string;
          pageCount?: number;
        }>;
        figures: Array<{
          id: string;
          title: string;
          imageUrl?: string;
          price?: number;
        }>;
        reviews: Array<{
          id: string;
          rating: number;
          comment?: string;
          createdAt: string;
          user: {
            id: string;
            email: string;
          };
        }>;
      };
      userOwnedFigures: Array<any>;
      userOwnedVolumes: Array<{
        id: string;
        volumeId: string;
        currentPage: number;
        lastReadAt?: string;
        volume: {
          id: string;
          volumeNo: number;
          title: string;
        };
      }>;
      userReview?: {
        id: string;
        rating: number;
        comment?: string;
      };
      autoPurchaseEnabled: boolean;
    }>(`/api/series/${id}`);
  }

  async postReview(seriesId: string, rating: number, comment?: string) {
    return this.request<{
      ok: boolean;
      review: {
        id: string;
        rating: number;
        comment?: string;
        createdAt: string;
      };
    }>(`/api/series/${seriesId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async setAutoPurchase(seriesId: string, enabled: boolean, emailNotification: boolean = true) {
    return this.request<{
      ok: boolean;
      settings: {
        enabled: boolean;
        emailNotification: boolean;
      };
    }>(`/api/series/${seriesId}/auto-purchase`, {
      method: 'POST',
      body: JSON.stringify({ enabled, emailNotification }),
    });
  }

  async getOwnedSeries() {
    return this.request<{
      ok: boolean;
      series: Array<{
        id: string;
        title: string;
        coverUrl?: string;
        volumes: Array<any>;
        figures: Array<any>;
      }>;
    }>('/api/series/user/owned');
  }

  async getCatalogSeries() {
    return this.request<{
      ok: boolean;
      series: Array<{
        id: string;
        title: string;
        description?: string;
        author?: string;
        genre?: string;
        coverUrl?: string;
        isOwned: boolean;
        volumes: Array<any>;
        figures: Array<any>;
        ownedFigures: Array<any>;
      }>;
    }>('/api/series/catalog/all');
  }

  async purchaseVolume(volumeId: string) {
    return this.request<{
      ok: boolean;
      ownership: {
        id: string;
        volumeId: string;
        currentPage: number;
      };
      message: string;
    }>(`/api/volumes/${volumeId}/purchase`, {
      method: 'POST',
    });
  }

  async updateVolumeProgress(volumeId: string, currentPage: number) {
    return this.request<{
      ok: boolean;
      ownership: {
        id: string;
        volumeId: string;
        currentPage: number;
        lastReadAt: string;
      };
    }>(`/api/volumes/${volumeId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ currentPage }),
    });
  }

  async getVolume(volumeId: string) {
    return this.request<{
      ok: boolean;
      volume: {
        id: string;
        seriesId: string;
        volumeNo: number;
        title: string;
        coverUrl: string;
        price?: number;
        pageCount?: number;
      };
      owned: boolean;
      ownership?: {
        currentPage: number;
        lastReadAt?: string;
      };
    }>(`/api/volumes/${volumeId}`);
  }
}

export const api = new ApiClient();
