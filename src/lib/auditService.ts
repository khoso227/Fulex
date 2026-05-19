import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDoc, 
  doc 
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum AuditAction {
  UPDATE_USER_ROLE = 'UPDATE_USER_ROLE',
  UPDATE_GLOBAL_SETTINGS = 'UPDATE_GLOBAL_SETTINGS',
  STATION_MODERATION = 'STATION_MODERATION',
  PURGE_AUDIT_LOGS = 'PURGE_AUDIT_LOGS',
}

interface AuditLog {
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  targetId: string;
  previousValue: any;
  newValue: any;
  timestamp: any;
}

export async function logAdminAction(
  action: AuditAction,
  targetId: string,
  previousValue: any,
  newValue: any
) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const auditLogsCollection = collection(db, 'auditLogs');
    await addDoc(auditLogsCollection, {
      adminId: user.uid,
      adminEmail: user.email || 'unknown',
      action,
      targetId,
      previousValue,
      newValue,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
    // We don't throw here to avoid blocking the main action if logging fails, 
    // although in a strict system you might want to.
  }
}
