import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatRelativeDate(timestamp: number | Date): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch {
    return '';
  }
}

export function formatDate(timestamp: number | Date, pattern = 'dd MMM yyyy'): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return format(date, pattern, { locale: es });
  } catch {
    return '';
  }
}

export function formatTimecode(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '-';
  return new Intl.NumberFormat('es-ES').format(num);
}
