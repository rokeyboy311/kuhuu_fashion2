/**
 * Image URL helpers — all images are served from PostgreSQL via backend API
 */

const isProd = import.meta.env.PROD;
const DEFAULT_API_URL = isProd
  ? 'https://kuhuu-fashion2.onrender.com/api/v1'
  : 'http://localhost:5000/api/v1';

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export function getProductImageUrl(imageId: string): string {
  return `${API_URL}/images/${imageId}`;
}

export function getProductThumbnailUrl(imageId: string): string {
  return `${API_URL}/images/${imageId}/thumb`;
}

export function getBannerImageUrl(bannerId: string): string {
  return `${API_URL}/images/banner/${bannerId}`;
}

export function getBannerThumbUrl(bannerId: string): string {
  return `${API_URL}/images/banner/${bannerId}/thumb`;
}

export function getInstagramImageUrl(postId: string): string {
  return `${API_URL}/images/instagram/${postId}`;
}

export function getInstagramThumbUrl(postId: string): string {
  return `${API_URL}/images/instagram/${postId}/thumb`;
}

/** Placeholder gradient for when no image exists */
export const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f5f4f2'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ccc' font-size='14' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E`;
