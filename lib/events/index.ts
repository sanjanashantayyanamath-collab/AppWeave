import { PlatformEvent } from '@/types/platform';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export type EventHandler = (event: PlatformEvent) => void;

class PlatformEventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  async publish(event: Omit<PlatformEvent, 'id' | 'created_at'>): Promise<PlatformEvent> {
    const fullEvent: PlatformEvent = {
      ...event,
      id: 'event-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    // If Supabase is configured, write to events table
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        if (supabase) {
          await supabase.from('events').insert({
            id: fullEvent.id,
            org_id: fullEvent.org_id,
            type: fullEvent.type,
            payload: fullEvent.payload,
          });
        }
      } catch (err) {
        console.error('Failed writing event to Supabase', err);
      }
    }

    // In-memory notify
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(fullEvent);
        } catch (e) {
          console.error('Error in event handler:', e);
        }
      });
    }

    // Broadcast across windows if in browser
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('appweave:event', {
          detail: fullEvent,
        })
      );
    }

    return fullEvent;
  }
}

export const eventBus = new PlatformEventBus();
