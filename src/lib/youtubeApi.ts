// YouTube Data API v3 Service (OAuth & Public)

export interface RealYouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  uploadsPlaylistId: string;
  publishedAt: string;
}

export interface RealYouTubeVideo {
  id: string;
  videoId?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  tags?: string[];
  watchUrl: string;
}

export interface YouTubeApiDiagnostic {
  isApiDisabled: boolean;
  enablementUrl?: string;
  projectId?: string;
  errorMessage: string;
}

export function parseYouTubeApiError(errorText: string): YouTubeApiDiagnostic {
  const isApiDisabled =
    errorText.includes("YouTube Data API v3 has not been used") ||
    errorText.includes("it is disabled") ||
    errorText.includes("SERVICE_DISABLED") ||
    errorText.includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT");

  const projectMatch = errorText.match(/project\s+(\d+)/i) || errorText.match(/project=(\d+)/i);
  const projectId = projectMatch ? projectMatch[1] : undefined;

  const urlMatch = errorText.match(/(https:\/\/console\.[^\s]+overview\?[^\s]+)/i);
  const enablementUrl = urlMatch
    ? urlMatch[1]
    : projectId
    ? `https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=${projectId}`
    : "https://console.developers.google.com/apis/api/youtube.googleapis.com/overview";

  return {
    isApiDisabled,
    enablementUrl,
    projectId,
    errorMessage: errorText,
  };
}

/**
 * Fetch authenticated user's YouTube channels using OAuth access token
 */
export async function fetchMyYouTubeChannels(accessToken: string): Promise<RealYouTubeChannel[]> {
  try {
    const url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&mine=true";
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const rawMessage = err.error?.message || `YouTube API HTTP ${res.status}`;
      if (
        res.status === 401 ||
        rawMessage.includes("invalid authentication credentials") ||
        rawMessage.includes("UNAUTHENTICATED")
      ) {
        console.warn("YouTube OAuth token expired or invalid in channels query; clearing cached token.");
        try {
          sessionStorage.removeItem("evolution_yt_oauth_token_v1");
          localStorage.removeItem("evolution_yt_oauth_token_v1");
          window.dispatchEvent(new CustomEvent("evolution_yt_token_expired"));
        } catch {}
        return [];
      }
      throw new Error(rawMessage);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item: any) => {
      const snippet = item.snippet || {};
      const stats = item.statistics || {};
      const content = item.contentDetails || {};
      const branding = item.brandingSettings || {};

      const rawSubs = parseInt(stats.subscriberCount || "0", 10);
      let formattedSubs = `${rawSubs}`;
      if (rawSubs >= 1_000_000) {
        formattedSubs = (rawSubs / 1_000_000).toFixed(2) + "M";
      } else if (rawSubs >= 1_000) {
        formattedSubs = (rawSubs / 1_000).toFixed(1) + "K";
      }

      return {
        id: item.id,
        title: snippet.title || "My YouTube Channel",
        description: snippet.description || "",
        customUrl: snippet.customUrl ? (snippet.customUrl.startsWith("@") ? snippet.customUrl : `@${snippet.customUrl}`) : `@${item.id}`,
        avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "",
        bannerUrl: branding.image?.bannerExternalUrl || "",
        subscriberCount: formattedSubs,
        videoCount: stats.videoCount || "0",
        viewCount: parseInt(stats.viewCount || "0", 10).toLocaleString(),
        uploadsPlaylistId: content.relatedPlaylists?.uploads || "",
        publishedAt: snippet.publishedAt || "",
      };
    });
  } catch (error: any) {
    console.warn("fetchMyYouTubeChannels notice:", error.message);
    throw error;
  }
}

/**
 * Fetch uploaded videos from user's uploads playlist
 */
export async function fetchMyUploadedVideos(
  accessToken: string,
  uploadsPlaylistId: string,
  maxResults = 24
): Promise<RealYouTubeVideo[]> {
  try {
    if (!uploadsPlaylistId || !accessToken) {
      return [];
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const rawMessage = err.error?.message || `YouTube API HTTP ${res.status}`;
      if (
        res.status === 401 ||
        rawMessage.includes("invalid authentication credentials") ||
        rawMessage.includes("UNAUTHENTICATED")
      ) {
        console.warn("YouTube OAuth token expired or invalid; clearing cached token.");
        try {
          sessionStorage.removeItem("evolution_yt_oauth_token_v1");
          localStorage.removeItem("evolution_yt_oauth_token_v1");
          window.dispatchEvent(new CustomEvent("evolution_yt_token_expired"));
        } catch {}
        return [];
      }
      throw new Error(rawMessage);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item: any) => {
      const snippet = item.snippet || {};
      const videoId = item.contentDetails?.videoId || snippet.resourceId?.videoId;
      const thumbnails = snippet.thumbnails || {};
      const bestThumbnail =
        thumbnails.maxres?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        thumbnails.default?.url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return {
        id: videoId,
        title: snippet.title || `Video ${videoId}`,
        description: snippet.description || "",
        thumbnailUrl: bestThumbnail,
        publishedAt: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : "",
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch (error: any) {
    console.warn("fetchMyUploadedVideos notice:", error?.message || error);
    return [];
  }
}

/**
 * Update video metadata (Title, Description, Tags) directly on YouTube using YouTube Data API v3
 */
export async function updateYouTubeVideoMetadata(
  accessToken: string,
  rawVideoIdOrUrl: string,
  updateData: {
    title: string;
    description: string;
    tags?: string[];
    categoryId?: string;
  }
): Promise<{ success: boolean; data?: any; error?: string; diagnostic?: YouTubeApiDiagnostic }> {
  try {
    if (!accessToken) {
      return {
        success: false,
        error: "Missing YouTube OAuth access token. Please sign in with your Google account.",
      };
    }

    // Sanitize and extract clean 11-char video ID from any format (URL, ID, embed link)
    let videoId = rawVideoIdOrUrl ? rawVideoIdOrUrl.trim() : "";
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = videoId.match(regExp);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    if (!videoId || videoId.length < 5) {
      return {
        success: false,
        error: "Invalid or missing YouTube Video ID. Please ensure you are viewing a valid YouTube video.",
      };
    }

    // 1. Get current video details to preserve required fields (categoryId, snippet structure)
    const getUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${videoId}`;
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!getRes.ok) {
      const err = await getRes.json().catch(() => ({}));
      const rawError = err.error?.message || `YouTube API fetch failed (HTTP ${getRes.status})`;
      const diag = parseYouTubeApiError(rawError);
      
      let userFriendlyError = rawError;
      if (getRes.status === 401 || rawError.includes("UNAUTHENTICATED") || rawError.includes("invalid_grant")) {
        userFriendlyError = "Your Google OAuth session has expired or lacks YouTube permissions. Please sign in again.";
      } else if (getRes.status === 403) {
        if (diag.isApiDisabled) {
          userFriendlyError = `YouTube Data API v3 needs to be enabled in your Google Cloud Project. Visit: ${diag.enablementUrl || "https://console.developers.google.com"}`;
        } else {
          userFriendlyError = "Permission denied. Make sure your signed-in Google account has manager/owner access to this YouTube channel.";
        }
      }

      return {
        success: false,
        error: userFriendlyError,
        diagnostic: diag,
      };
    }

    const getData = await getRes.json();
    const existingVideo = getData.items?.[0];
    if (!existingVideo) {
      return {
        success: false,
        error: `Video "${videoId}" was not found or is not owned by the currently authenticated YouTube account. Please ensure you are signed in to the account that uploaded this video.`,
      };
    }

    const currentSnippet = existingVideo.snippet || {};

    // 2. Prepare payload for videos.update
    // Clean and validate tags (YouTube limits tags to 500 total chars)
    let cleanTags = updateData.tags && updateData.tags.length > 0 ? updateData.tags : currentSnippet.tags || [];
    if (cleanTags) {
      cleanTags = cleanTags.map(t => t.replace(/^#/, "").trim()).filter(Boolean).slice(0, 25);
    }

    const updatedPayload = {
      id: videoId,
      snippet: {
        ...currentSnippet,
        title: updateData.title ? updateData.title.slice(0, 100) : currentSnippet.title,
        description: updateData.description || currentSnippet.description,
        tags: cleanTags,
        categoryId: updateData.categoryId || currentSnippet.categoryId || "22", // Default to People & Blogs (22)
      },
    };

    // 3. Send PUT request to YouTube Data API
    const putUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet`;
    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updatedPayload),
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      const rawError = err.error?.message || `Failed to update YouTube video (HTTP ${putRes.status})`;
      const diag = parseYouTubeApiError(rawError);

      let userFriendlyError = rawError;
      if (putRes.status === 403) {
        userFriendlyError = "Forbidden: The authenticated Google user does not have permission to edit this video. Please switch to the channel owner account.";
      }

      return {
        success: false,
        error: userFriendlyError,
        diagnostic: diag,
      };
    }

    const result = await putRes.json();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateYouTubeVideoMetadata error:", error);
    return { success: false, error: error.message || "Failed to update YouTube video." };
  }
}

/**
 * Pushes custom generated thumbnail to YouTube video via YouTube Data API
 */
export async function setYouTubeVideoThumbnail(
  accessToken: string,
  rawVideoIdOrUrl: string,
  imageDataUrl: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!accessToken) {
      return {
        success: false,
        error: "Missing YouTube OAuth access token. Please connect your Google account.",
      };
    }

    let videoId = rawVideoIdOrUrl ? rawVideoIdOrUrl.trim() : "";
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = videoId.match(regExp);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    if (!videoId || videoId.length < 5) {
      return {
        success: false,
        error: "Invalid or missing YouTube Video ID.",
      };
    }

    // Call our server-side proxy which handles image MIME decoding, JPEG/PNG binary conversion, and upload to Google YouTube
    const res = await fetch("/api/youtube/thumbnail/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        videoId,
        imageDataUrl,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Thumbnail upload failed (HTTP ${res.status})`,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (err: any) {
    console.error("setYouTubeVideoThumbnail error:", err);
    return { success: false, error: err.message || "Failed to push thumbnail to YouTube." };
  }
}

/**
 * Live performance audit comparing video baseline with current observable metrics
 */
export async function auditYouTubeVideoMetrics(
  accessToken: string | null,
  rawVideoIdOrUrl: string,
  baselineViews: number = 0
): Promise<{
  success: boolean;
  metrics?: {
    currentViews: number;
    currentLikes: number;
    currentComments: number;
    viewVelocityGain: string;
    observedCtrLift: string;
    algorithmicStatus: "Exploding Velocity" | "Solid Momentum" | "Needs Iteration" | "Evergreen Indexing";
    aiEvolutionInsight: string;
    recommendedNextAction: string;
    liveMetrics?: any;
  };
  error?: string;
}> {
  try {
    let videoId = rawVideoIdOrUrl ? rawVideoIdOrUrl.trim() : "";
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = videoId.match(regExp);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    const res = await fetch("/api/youtube/video/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken,
        videoId,
        baselineViews,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Failed to audit video metrics.",
      };
    }

    return {
      success: true,
      metrics: data.metrics,
    };
  } catch (err: any) {
    console.error("auditYouTubeVideoMetrics error:", err);
    return { success: false, error: err.message || "Failed to audit video metrics." };
  }
}

