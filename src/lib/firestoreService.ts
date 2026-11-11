import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "./firebase";
import {
  IngestionHistoryItem,
  CustomEndpoint,
  ChannelIntelligenceData,
  PushedAssetRecord,
} from "../types";

export interface UserSettings {
  activeChannelHandle?: string;
  isTurboActive?: boolean;
  defaultNiche?: string;
  defaultTone?: string;
  updatedAt?: string;
}

// ==================== FIRESTORE DATA SANITIZER ====================
// Firestore setDoc/updateDoc strictly rejects 'undefined' in any field.
// This recursive sanitizer removes any keys with undefined values across all nested levels.
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === "object") {
    if (data instanceof Date) {
      return data.toISOString() as unknown as T;
    }
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(data as Record<string, any>)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned as T;
  }
  return data;
}

// ==================== HISTORY PERSISTENCE ====================

export async function saveHistoryItemToFirestore(
  userId: string,
  item: IngestionHistoryItem
): Promise<void> {
  try {
    const sanitized = sanitizeForFirestore(item);
    const historyDocRef = doc(db, "users", userId, "history", item.id);
    await setDoc(historyDocRef, sanitized, { merge: true });
  } catch (error) {
    console.error("Error saving history item to Firestore:", error);
    throw error;
  }
}

export async function deleteHistoryItemFromFirestore(
  userId: string,
  itemId: string
): Promise<void> {
  try {
    const historyDocRef = doc(db, "users", userId, "history", itemId);
    await deleteDoc(historyDocRef);
  } catch (error) {
    console.error("Error deleting history item from Firestore:", error);
    throw error;
  }
}

export async function clearHistoryInFirestore(userId: string): Promise<void> {
  try {
    const historyColRef = collection(db, "users", userId, "history");
    const snapshot = await getDocs(historyColRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing history in Firestore:", error);
    throw error;
  }
}

export function subscribeToUserHistory(
  userId: string,
  callback: (items: IngestionHistoryItem[]) => void
): () => void {
  const historyColRef = collection(db, "users", userId, "history");
  const q = query(historyColRef, orderBy("timestamp", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: IngestionHistoryItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as IngestionHistoryItem);
      });
      callback(items);
    },
    (error) => {
      console.warn("Firestore history snapshot error:", error);
    }
  );
}

// ==================== ENDPOINTS PERSISTENCE ====================

export async function saveEndpointsToFirestore(
  userId: string,
  endpoints: CustomEndpoint[]
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    const sanitized = sanitizeForFirestore({ endpoints, updatedAt: new Date().toISOString() });
    await setDoc(userDocRef, sanitized, { merge: true });
  } catch (error) {
    console.error("Error saving endpoints to Firestore:", error);
    throw error;
  }
}

export function subscribeToUserEndpoints(
  userId: string,
  callback: (endpoints: CustomEndpoint[]) => void
): () => void {
  const userDocRef = doc(db, "users", userId);

  return onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.endpoints && Array.isArray(data.endpoints)) {
          callback(data.endpoints as CustomEndpoint[]);
        }
      }
    },
    (error) => {
      console.warn("Firestore endpoints snapshot error:", error);
    }
  );
}

// ==================== CHANNEL PERSISTENCE ====================

export async function saveChannelToFirestore(
  userId: string,
  channel: ChannelIntelligenceData
): Promise<void> {
  try {
    const channelId = channel.profile.handle.replace("@", "") || "default_channel";
    const channelDocRef = doc(db, "users", userId, "channels", channelId);
    const sanitizedChannel = sanitizeForFirestore(channel);
    await setDoc(channelDocRef, sanitizedChannel, { merge: true });

    // Also update active channel in user settings
    await setDoc(
      doc(db, "users", userId),
      {
        activeChannelHandle: channel.profile.handle,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving channel to Firestore:", error);
    throw error;
  }
}

export function subscribeToUserChannels(
  userId: string,
  callback: (channels: ChannelIntelligenceData[]) => void
): () => void {
  const channelsColRef = collection(db, "users", userId, "channels");

  return onSnapshot(
    channelsColRef,
    (snapshot) => {
      const channels: ChannelIntelligenceData[] = [];
      snapshot.forEach((docSnap) => {
        channels.push(docSnap.data() as ChannelIntelligenceData);
      });
      callback(channels);
    },
    (error) => {
      console.warn("Firestore channels snapshot error:", error);
    }
  );
}

// ==================== USER SETTINGS & PROFILE ====================

export async function saveUserSettingsToFirestore(
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    const sanitized = sanitizeForFirestore({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(userDocRef, sanitized, { merge: true });
  } catch (error) {
    console.error("Error saving user settings to Firestore:", error);
  }
}

export async function getUserSettingsFromFirestore(
  userId: string
): Promise<UserSettings | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error getting user settings from Firestore:", error);
    return null;
  }
}

// ==================== PUSHED ASSETS LOGGER PERSISTENCE ====================

export async function savePushedAssetToFirestore(
  userId: string,
  asset: PushedAssetRecord
): Promise<void> {
  try {
    const sanitized = sanitizeForFirestore(asset);
    const assetDocRef = doc(db, "users", userId, "pushedAssets", asset.id);
    await setDoc(assetDocRef, sanitized, { merge: true });
  } catch (error) {
    console.error("Error saving pushed asset to Firestore:", error);
    // Local storage fallback
    try {
      const existing = JSON.parse(localStorage.getItem("iconic_pushed_assets") || "[]");
      const filtered = existing.filter((a: any) => a.id !== asset.id);
      localStorage.setItem("iconic_pushed_assets", JSON.stringify([asset, ...filtered]));
    } catch (e) {
      console.warn("Local storage fallback failed:", e);
    }
  }
}

export function subscribeToUserPushedAssets(
  userId: string,
  callback: (assets: PushedAssetRecord[]) => void
): () => void {
  const assetsColRef = collection(db, "users", userId, "pushedAssets");
  const q = query(assetsColRef, orderBy("timestamp", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const assets: PushedAssetRecord[] = [];
      snapshot.forEach((docSnap) => {
        assets.push(docSnap.data() as PushedAssetRecord);
      });
      callback(assets);
    },
    (error) => {
      console.warn("Firestore pushedAssets snapshot error, using local fallback:", error);
      try {
        const local = JSON.parse(localStorage.getItem("iconic_pushed_assets") || "[]");
        callback(local);
      } catch {
        callback([]);
      }
    }
  );
}

export async function deletePushedAssetFromFirestore(
  userId: string,
  assetId: string
): Promise<void> {
  try {
    const assetDocRef = doc(db, "users", userId, "pushedAssets", assetId);
    await deleteDoc(assetDocRef);
  } catch (error) {
    console.error("Error deleting pushed asset from Firestore:", error);
  }
}

