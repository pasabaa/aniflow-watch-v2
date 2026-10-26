import { unflatten } from 'devalue';

export interface UpstreamNode {
  type: 'data' | 'error' | 'redirect';
  data?: unknown[];
  status?: number;
  error?: unknown;
  location?: string;
}

export interface UpstreamPayload {
  nodes?: (UpstreamNode | null)[];
  type?: string;
  data?: unknown[];
}

/**
 * Decodes SvelteKit/devalue serialized payloads from upstream.
 * - Handles payload.nodes array finding the last 'data' node
 * - Unflattens serialized devalue data structure
 * - Throws if the response indicates error or redirect
 */
export function decodeNodes<T>(payload: unknown): T {
  if (!payload || typeof payload !== 'object') {
    throw new Error('INVALID_PAYLOAD: Expected object');
  }

  const p = payload as UpstreamPayload;

  if (Array.isArray(p.nodes)) {
    const errorNode = p.nodes.findLast((n) => n?.type === 'error');
    if (errorNode) {
      throw new Error(`UPSTREAM_ERROR_NODE: ${JSON.stringify(errorNode.error || errorNode.status || 'unknown')}`);
    }

    const redirectNode = p.nodes.findLast((n) => n?.type === 'redirect');
    if (redirectNode) {
      throw new Error(`UPSTREAM_REDIRECT_NODE: ${redirectNode.location || 'unknown'}`);
    }

    const dataNode = p.nodes.findLast((n) => n?.type === 'data');
    if (!dataNode || !dataNode.data) {
      throw new Error('NODE_NOT_DATA');
    }

    return unflatten(dataNode.data) as T;
  }

  // Fallback if direct { type: 'data', data: [...] }
  if (p.type === 'data' && Array.isArray(p.data)) {
    return unflatten(p.data) as T;
  }

  // Fallback if data is already raw array passed to unflatten
  if (Array.isArray(payload)) {
    return unflatten(payload) as T;
  }

  // Fallback if already an unflattened object
  return payload as T;
}
