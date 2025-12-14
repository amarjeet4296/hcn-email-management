import { format, parseISO, isValid } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, 'MMM dd, yyyy');
    }
    return date;
  } catch {
    return date;
  }
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return format(parsedDate, 'MMM dd, yyyy HH:mm');
    }
    return date;
  } catch {
    return date;
  }
}

export function getStatusColor(status: string): string {
  const statusLower = status?.toLowerCase();

  switch (statusLower) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'vouchered':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getIssueColor(issue: string | undefined): string {
  if (!issue) return 'bg-gray-100 text-gray-800';

  const issueLower = issue.toLowerCase();

  if (issueLower.includes('critical')) {
    return 'bg-red-100 text-red-800';
  } else if (issueLower.includes('non')) {
    return 'bg-orange-100 text-orange-800';
  }

  return 'bg-gray-100 text-gray-800';
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
