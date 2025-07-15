interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customCode?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

interface ShortenOptions {
  customCode?: string;
  expirationDays?: number;
}

interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  topUrls: (ShortenedUrl & {
    clickDetails: Array<{
      timestamp: string;
      source: string;
      country: string;
      device: string;
      userAgent: string;
    }>;
  })[];
  clickHistory: { date: string; clicks: number }[];
  detailedAnalytics: {
    clicksBySource: Record<string, number>;
    clicksByCountry: Record<string, number>;
    clicksByDevice: Record<string, number>;
    clicksByHour: Record<string, number>;
  };
}

class UrlService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  private mockData: ShortenedUrl[] = [];

  private generateShortCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async shortenUrl(originalUrl: string, options: ShortenOptions = {}): Promise<ShortenedUrl> {
    try {
      // Validate URL
      if (!this.isValidUrl(originalUrl)) {
        throw new Error('Invalid URL provided');
      }

      // Check if custom code is already taken
      if (options.customCode) {
        const existingUrl = this.mockData.find(url => url.shortCode === options.customCode);
        if (existingUrl) {
          throw new Error('Custom shortcode is already taken');
        }
      }

      // Generate or use custom shortcode
      const shortCode = options.customCode || this.generateShortCode();
      const shortUrl = `${window.location.origin}/${shortCode}`;

      // Calculate expiration date
      let expiresAt: string | undefined;
      if (options.expirationDays) {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + options.expirationDays);
        expiresAt = expDate.toISOString();
      }

      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl,
        shortCode,
        shortUrl,
        customCode: options.customCode,
        clicks: 0,
        createdAt: new Date().toISOString(),
        expiresAt,
        isActive: true,
      };

      // In a real app, this would be an API call
      // For now, we'll store in localStorage and memory
      this.mockData.unshift(newUrl);
      this.saveToLocalStorage();

      return newUrl;
    } catch (error) {
      throw error;
    }
  }

  async getUserUrls(): Promise<ShortenedUrl[]> {
    try {
      // Load from localStorage for persistence
      this.loadFromLocalStorage();
      return this.mockData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch user URLs:', error);
      return [];
    }
  }

  async getUrlByShortCode(shortCode: string): Promise<ShortenedUrl | null> {
    try {
      this.loadFromLocalStorage();
      const url = this.mockData.find(u => u.shortCode === shortCode && u.isActive);
      
      if (url) {
        // Check if URL has expired
        if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
          url.isActive = false;
          this.saveToLocalStorage();
          return null;
        }
        
        // Increment click count
        url.clicks++;
        this.saveToLocalStorage();
        
        return url;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get URL by short code:', error);
      return null;
    }
  }

  async deleteUrl(id: string): Promise<void> {
    try {
      this.loadFromLocalStorage();
      this.mockData = this.mockData.filter(url => url.id !== id);
      this.saveToLocalStorage();
    } catch (error) {
      throw new Error('Failed to delete URL');
    }
  }

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      this.loadFromLocalStorage();
      
      const totalUrls = this.mockData.length;
      const totalClicks = this.mockData.reduce((sum, url) => sum + url.clicks, 0);
      
      // Generate mock click details for each URL
      const topUrls = [...this.mockData]
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10)
        .map(url => ({
          ...url,
          clickDetails: this.generateMockClickDetails(url.clicks)
        }));

      // Generate mock click history for the last 30 days
      const clickHistory = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const clicks = Math.floor(Math.random() * 50); // Mock data
        clickHistory.push({ date: dateStr, clicks });
      }

      // Generate detailed analytics
      const mockSources = ['direct', 'google.com', 'facebook.com', 'twitter.com', 'linkedin.com'];
      const mockCountries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Japan', 'Australia'];
      const mockDevices = ['Desktop', 'Mobile', 'Tablet'];
      
      const detailedAnalytics = {
        clicksBySource: mockSources.reduce((acc, source) => {
          acc[source] = Math.floor(Math.random() * 100);
          return acc;
        }, {} as Record<string, number>),
        
        clicksByCountry: mockCountries.reduce((acc, country) => {
          acc[country] = Math.floor(Math.random() * 50);
          return acc;
        }, {} as Record<string, number>),
        
        clicksByDevice: mockDevices.reduce((acc, device) => {
          acc[device] = Math.floor(Math.random() * 80);
          return acc;
        }, {} as Record<string, number>),
        
        clicksByHour: Array.from({ length: 24 }, (_, i) => i).reduce((acc, hour) => {
          acc[hour.toString()] = Math.floor(Math.random() * 20);
          return acc;
        }, {} as Record<string, number>)
      };

      return {
        totalUrls,
        totalClicks,
        topUrls,
        clickHistory,
        detailedAnalytics,
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return {
        totalUrls: 0,
        totalClicks: 0,
        topUrls: [],
        clickHistory: [],
        detailedAnalytics: {
          clicksBySource: {},
          clicksByCountry: {},
          clicksByDevice: {},
          clicksByHour: {},
        },
      };
    }
  }

  private generateMockClickDetails(clickCount: number) {
    const sources = ['direct', 'google.com', 'facebook.com', 'twitter.com', 'linkedin.com'];
    const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    ];

    return Array.from({ length: Math.min(clickCount, 100) }, () => ({
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)]
    }));
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('shortenedUrls', JSON.stringify(this.mockData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('shortenedUrls');
      if (stored) {
        this.mockData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this.mockData = [];
    }
  }
}

export const urlService = new UrlService();
export type { ShortenedUrl, AnalyticsData };
