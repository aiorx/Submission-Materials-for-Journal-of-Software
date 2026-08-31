// Aided with basic GitHub coding tools
export type WebhookEvent = "taskCreated" | "taskUpdated" | "taskDeleted";

interface IWebhook {
  id: string;
  url: string;
  events: WebhookEvent[];
}

export class WebhookManager {
  private webhooks: IWebhook[] = [];

  registerWebhook(url: string, events: WebhookEvent[]): void {
    const id = Math.random().toString(36).slice(2);
    this.webhooks.push({ id, url, events });
  }

  removeWebhook(webhookId: string): void {
    this.webhooks = this.webhooks.filter((w) => w.id !== webhookId);
  }

  async triggerWebhook(event: WebhookEvent, data: unknown): Promise<void> {
    for (const w of this.webhooks) {
      if (w.events.includes(event)) {
        try {
          await fetch(w.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event, data }),
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Webhook送信失敗:", e);
        }
      }
    }
  }
}
