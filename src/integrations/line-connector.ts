/**
 * KTV Working Drone Thailand - LINE Integration Connector
 * Thailand's primary communication channel (54M users)
 * Handles client messaging, booking requests, status updates
 *
 * Connects: CRM → LINE → Job Lifecycle → Notifications
 */

// ── LINE Message Types ─────────────────────────────────────

export type LineMessageType = 'text' | 'template' | 'flex' | 'image' | 'location';
export type LineEventType = 'message' | 'follow' | 'unfollow' | 'postback' | 'booking';

export interface LineMessage {
  id: string;
  userId: string;
  type: LineMessageType;
  content: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  relatedJobId?: string;
  relatedLeadId?: string;
}

export interface LineUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  linkedClientId?: string;
  linkedLeadId?: string;
  language: 'th' | 'en';
  registeredAt: Date;
  lastActivity: Date;
}

export interface LineNotification {
  id: string;
  userId: string;
  type: 'job-update' | 'invoice' | 'delivery' | 'weather-alert' | 'schedule-reminder' | 'nps-survey';
  message: string;
  sentAt: Date;
  read: boolean;
}

// ── LINE Connector ─────────────────────────────────────────

export class LineConnector {
  private users: Map<string, LineUser> = new Map();
  private messages: LineMessage[] = [];
  private notifications: LineNotification[] = [];
  private webhookHandlers: Map<LineEventType, ((event: Record<string, unknown>) => Promise<void>)[]> = new Map();

  // ── User Management ──────────────────────────────────────

  registerUser(data: Partial<LineUser> & { userId: string; displayName: string }): LineUser {
    const user: LineUser = {
      userId: data.userId,
      displayName: data.displayName,
      pictureUrl: data.pictureUrl,
      linkedClientId: data.linkedClientId,
      linkedLeadId: data.linkedLeadId,
      language: data.language ?? 'th',
      registeredAt: new Date(),
      lastActivity: new Date(),
    };
    this.users.set(user.userId, user);
    return user;
  }

  linkUserToClient(userId: string, clientId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    user.linkedClientId = clientId;
    return true;
  }

  linkUserToLead(userId: string, leadId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    user.linkedLeadId = leadId;
    return true;
  }

  // ── Messaging ────────────────────────────────────────────

  sendMessage(userId: string, content: string, type: LineMessageType = 'text'): LineMessage {
    const msg: LineMessage = {
      id: `LMSG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type,
      content,
      timestamp: new Date(),
      direction: 'outbound',
    };
    this.messages.push(msg);
    return msg;
  }

  receiveMessage(userId: string, content: string, type: LineMessageType = 'text'): LineMessage {
    const msg: LineMessage = {
      id: `LMSG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type,
      content,
      timestamp: new Date(),
      direction: 'inbound',
    };
    this.messages.push(msg);

    // Update last activity
    const user = this.users.get(userId);
    if (user) user.lastActivity = new Date();

    return msg;
  }

  // ── Notifications ────────────────────────────────────────

  sendJobUpdate(userId: string, jobId: string, stage: string): LineNotification {
    const stageMessages: Record<string, { th: string; en: string }> = {
      'site-assessment': { th: 'ทีมงานจะเข้าสำรวจพื้นที่ของท่าน', en: 'Our team will visit your site for assessment' },
      'quotation': { th: 'ใบเสนอราคาพร้อมแล้ว', en: 'Your quotation is ready' },
      'contract': { th: 'สัญญาบริการพร้อมลงนาม', en: 'Service agreement ready for signing' },
      'pre-flight': { th: 'กำลังเตรียมอุปกรณ์สำหรับปฏิบัติงาน', en: 'Preparing equipment for your service' },
      'mission-execution': { th: 'โดรนกำลังปฏิบัติงาน ณ สถานที่ของท่าน', en: 'Drone operations in progress at your site' },
      'delivery': { th: 'ผลงานพร้อมดาวน์โหลดแล้ว', en: 'Your deliverables are ready for download' },
      'invoicing': { th: 'ใบแจ้งหนี้ถูกส่งแล้ว', en: 'Invoice has been sent' },
    };

    const user = this.users.get(userId);
    const lang = user?.language ?? 'th';
    const msg = stageMessages[stage]?.[lang] ?? `Job ${jobId}: ${stage}`;

    return this.createNotification(userId, 'job-update', msg);
  }

  sendDeliveryNotification(userId: string, portalUrl: string): LineNotification {
    const user = this.users.get(userId);
    const lang = user?.language ?? 'th';
    const msg = lang === 'th'
      ? `ผลงานของท่านพร้อมดาวน์โหลดแล้วที่ ${portalUrl}`
      : `Your deliverables are ready for download at ${portalUrl}`;
    return this.createNotification(userId, 'delivery', msg);
  }

  sendScheduleReminder(userId: string, date: string, serviceName: string): LineNotification {
    const user = this.users.get(userId);
    const lang = user?.language ?? 'th';
    const msg = lang === 'th'
      ? `แจ้งเตือน: บริการ ${serviceName} นัดหมายวันที่ ${date}`
      : `Reminder: ${serviceName} scheduled for ${date}`;
    return this.createNotification(userId, 'schedule-reminder', msg);
  }

  sendNpsSurvey(userId: string): LineNotification {
    const user = this.users.get(userId);
    const lang = user?.language ?? 'th';
    const msg = lang === 'th'
      ? 'กรุณาให้คะแนนความพึงพอใจ (0-10): ท่านจะแนะนำบริการของเราให้ผู้อื่นหรือไม่?'
      : 'Rate your experience (0-10): How likely are you to recommend our service?';
    return this.createNotification(userId, 'nps-survey', msg);
  }

  sendWeatherAlert(userId: string, message: string): LineNotification {
    return this.createNotification(userId, 'weather-alert', message);
  }

  private createNotification(userId: string, type: LineNotification['type'], message: string): LineNotification {
    const notification: LineNotification = {
      id: `LNOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type,
      message,
      sentAt: new Date(),
      read: false,
    };
    this.notifications.push(notification);
    return notification;
  }

  // ── Webhook Handling ─────────────────────────────────────

  onEvent(eventType: LineEventType, handler: (event: Record<string, unknown>) => Promise<void>): void {
    const handlers = this.webhookHandlers.get(eventType) ?? [];
    handlers.push(handler);
    this.webhookHandlers.set(eventType, handlers);
  }

  async handleWebhook(eventType: LineEventType, event: Record<string, unknown>): Promise<void> {
    const handlers = this.webhookHandlers.get(eventType) ?? [];
    await Promise.all(handlers.map(h => h(event)));
  }

  // ── Analytics ────────────────────────────────────────────

  getStats(): {
    totalUsers: number;
    linkedClients: number;
    totalMessages: number;
    inboundMessages: number;
    outboundMessages: number;
    totalNotifications: number;
    unreadNotifications: number;
  } {
    const msgs = this.messages;
    const notifs = this.notifications;
    return {
      totalUsers: this.users.size,
      linkedClients: Array.from(this.users.values()).filter(u => u.linkedClientId).length,
      totalMessages: msgs.length,
      inboundMessages: msgs.filter(m => m.direction === 'inbound').length,
      outboundMessages: msgs.filter(m => m.direction === 'outbound').length,
      totalNotifications: notifs.length,
      unreadNotifications: notifs.filter(n => !n.read).length,
    };
  }
}
