import { DistributionData, YouTubeVideoInfo } from "../types";

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = cleanUrl.match(regExp);
  return match ? match[1] : null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

export function getPlatformComposerUrl(
  platformId: string,
  content: {
    title?: string;
    url?: string;
    text?: string;
    hashtags?: string[];
  }
): string {
  const targetUrl = content.url ? content.url.trim() : "";
  let text = (content.text || "").trim();
  const title = (content.title || "").trim();
  const tags = (content.hashtags || []).map((t) => t.replace(/^#/, "").trim()).filter(Boolean).join(",");

  // Check if text already contains any URL to guarantee no duplicate links
  const hasAnyLinkInText = /https?:\/\//i.test(text);

  switch (platformId) {
    case "x":
    case "twitter": {
      // If text already has a URL, only pass the text without appending &url parameter (prevents Twitter duplicate link bug)
      if (hasAnyLinkInText) {
        const encodedText = encodeURIComponent(text);
        return `https://x.com/intent/tweet?text=${encodedText}${tags ? `&hashtags=${encodeURIComponent(tags)}` : ""}`;
      } else {
        const encodedText = encodeURIComponent(text);
        const encodedUrl = targetUrl ? `&url=${encodeURIComponent(targetUrl)}` : "";
        return `https://x.com/intent/tweet?text=${encodedText}${encodedUrl}${tags ? `&hashtags=${encodeURIComponent(tags)}` : ""}`;
      }
    }
    case "facebook": {
      const encodedUrl = encodeURIComponent(targetUrl);
      // For Facebook, include the full rich text quote (headline, narrative, discussion, cta, hashtags, keywords)
      const quoteText = text || title;
      const encodedQuote = encodeURIComponent(quoteText);
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}`;
    }
    case "reddit": {
      const encodedTitle = encodeURIComponent(title || text.slice(0, 120));
      const encodedUrl = encodeURIComponent(targetUrl);
      const encodedText = encodeURIComponent(hasAnyLinkInText ? text : `${text}\n\n${targetUrl}`);
      return `https://www.reddit.com/submit?title=${encodedTitle}&text=${encodedText}${targetUrl && !hasAnyLinkInText ? `&url=${encodedUrl}` : ""}`;
    }
    case "linkedin": {
      const encodedUrl = encodeURIComponent(targetUrl);
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
    case "instagram": {
      // Instagram direct web entry
      return `https://www.instagram.com/`;
    }
    case "tiktok": {
      return `https://www.tiktok.com/upload`;
    }
    case "snapchat": {
      return `https://web.snapchat.com/`;
    }
    case "youtube": {
      return `https://studio.youtube.com/`;
    }
    case "threads": {
      const encodedText = encodeURIComponent(hasAnyLinkInText ? text : `${text}\n\n${targetUrl}`);
      return `https://www.threads.net/intent/post?text=${encodedText}`;
    }
    case "pinterest": {
      const encodedUrl = encodeURIComponent(targetUrl);
      const encodedDesc = encodeURIComponent(text.slice(0, 400));
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDesc}`;
    }
    case "whatsapp": {
      const shareMsg = encodeURIComponent(hasAnyLinkInText ? text : `${text}\n\n${targetUrl}`);
      return `https://api.whatsapp.com/send?text=${shareMsg}`;
    }
    case "telegram": {
      const encodedUrl = encodeURIComponent(targetUrl);
      const encodedText = encodeURIComponent(text);
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    }
    default:
      return targetUrl || "https://youtube.com";
  }
}

/**
 * Format 100% complete, rich 1-click social packages containing full metadata
 * with EXACTLY ONE YouTube link per package.
 */
export function formatSingleLinkSocialPackages(
  video: YouTubeVideoInfo,
  data: DistributionData,
  customState?: {
    xSingle?: string;
    fbHeadline?: string;
    fbBody?: string;
    fbDiscussion?: string;
    fbCta?: string;
    igCaption?: string;
    igHashtags?: string[];
    tiktokHook?: string;
    tiktokCaption?: string;
    tiktokSound?: string;
    linkedinHeadline?: string;
    linkedinBody?: string;
    linkedinTakeaways?: string[];
    snapchatCaption?: string;
    snapchatHook?: string;
    snapchatPrompt?: string;
    redditTitle?: string;
    redditBody?: string;
    redditTldr?: string;
  }
) {
  const ytLink = video.standardWatchUrl || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : "");

  // 1. Twitter / X Package (Single Link Guaranteed)
  const rawX = customState?.xSingle || data.xPackage.viralSingleTweet;
  // Clean any pre-existing links inside x text to prevent duplicate links
  const cleanedX = rawX.replace(/https?:\/\/[^\s]+/g, "").trim();
  const xPackageText = ytLink ? `${cleanedX}\n\n${ytLink}` : cleanedX;

  // 2. Facebook Package (Headline + Full Narrative + Discussion Starter + CTA + Hashtags + Keyword Clusters + EXACTLY ONE YouTube Link)
  const fbHeadline = (customState?.fbHeadline || data.facebookPackage?.postHeadline || video.title).trim();
  const fbBody = (customState?.fbBody || data.facebookPackage?.bodyStory || "").trim();
  const fbDisc = (customState?.fbDiscussion || data.facebookPackage?.discussionStarter || "").trim();
  const fbCta = (customState?.fbCta || data.facebookPackage?.callToAction || "").trim();
  const fbHashtags = (data.facebookPackage?.hashtags || []).map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
  const fbKeywords = (data.youtubeSeo?.primaryKeywords || []).slice(0, 8).map((k) => `#${k.replace(/\s+/g, "")}`).join(" ");

  const facebookPackageText = [
    `🔥 ${fbHeadline}`,
    "",
    fbBody,
    fbDisc ? `\n💬 Discussion:\n${fbDisc}` : "",
    fbCta ? `\n👉 ${fbCta}` : "",
    ytLink ? `\n📺 Watch the full video here: ${ytLink}` : "",
    "",
    fbHashtags ? `Tags: ${fbHashtags} ${fbKeywords}` : (fbKeywords ? `Tags: ${fbKeywords}` : ""),
  ]
    .filter(Boolean)
    .join("\n");

  // 3. Instagram Package (Caption + Carousel Breakdown + High Volume / Niche Hashtags + 1 YouTube Link)
  const igCaption = (customState?.igCaption || data.instagramPackage?.reelCaption || "").trim();
  const igTags = customState?.igHashtags || data.instagramPackage?.highVolumeHashtags || (data.instagramPackage as any)?.hashtags || [];
  const igSlides = ((data.instagramPackage as any)?.carouselSlides || [])
    .map((s: any) => `• Slide ${s.slideNumber}: ${s.headline} - ${s.bodyBullet}`)
    .join("\n");

  const instagramPackageText = [
    igCaption,
    igSlides ? `\n📌 Carousel Summary:\n${igSlides}` : "",
    ytLink ? `\n🔗 Link in bio & full video here: ${ytLink}` : "",
    "",
    Array.isArray(igTags) && igTags.length > 0 ? igTags.map((t: string) => (t.startsWith("#") ? t : `#${t}`)).join(" ") : "",
  ]
    .filter(Boolean)
    .join("\n");

  // 4. TikTok Package (Retention Hook + Punchy Caption + Screen Overlays + Audio Vibe + SEO Search Terms + 1 YouTube Link)
  const ttHook = (customState?.tiktokHook || data.tiktokPackage?.retentionHookOpener || "").trim();
  const ttCaption = (customState?.tiktokCaption || data.tiktokPackage?.punchyCaption || "").trim();
  const ttSound = (customState?.tiktokSound || (data.tiktokPackage as any)?.soundAudioStrategy || data.tiktokPackage?.trendingSoundVibe || "").trim();
  const ttOverlays = (Array.isArray((data.tiktokPackage as any)?.screenTextHooks) ? (data.tiktokPackage as any).screenTextHooks : [data.tiktokPackage?.textOnScreenOverlay]).filter(Boolean);
  const ttSearchTerms = (data.tiktokPackage?.seoKeywordSearchTags || []).map((t) => `#${t.replace(/\s+/g, "")}`).join(" ");

  const tiktokPackageText = [
    ttHook ? `⚡ 3-Second Hook: "${ttHook}"` : "",
    "",
    ttCaption,
    ttOverlays.length > 0 ? `\n📱 On-Screen Text Badges:\n${ttOverlays.map((o: string) => `• "${o}"`).join("\n")}` : "",
    ttSound ? `\n🎵 Recommended Sound Vibe: ${ttSound}` : "",
    ytLink ? `\n🎬 Full YouTube Video: ${ytLink}` : "",
    "",
    ttSearchTerms ? `Search Terms: ${ttSearchTerms}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // 5. LinkedIn Package (Headline Hook + Executive Post Content + Key Takeaways + Hashtags + 1 YouTube Link)
  const liHeadline = (customState?.linkedinHeadline || data.linkedinPackage?.headlineHook || "").trim();
  const liBody = (customState?.linkedinBody || data.linkedinPackage?.executivePostContent || "").trim();
  const liTakeaways = customState?.linkedinTakeaways || data.linkedinPackage?.keyTakeaways || [];
  const liTags = (data.linkedinPackage?.hashtags || []).map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");

  const linkedinPackageText = [
    liHeadline ? `🎯 ${liHeadline}` : "",
    "",
    liBody,
    Array.isArray(liTakeaways) && liTakeaways.length > 0 ? `\nKey Takeaways:\n${liTakeaways.map((k) => `• ${k}`).join("\n")}` : "",
    ytLink ? `\n🎥 Watch the complete breakdown on YouTube: ${ytLink}` : "",
    "",
    liTags,
  ]
    .filter(Boolean)
    .join("\n");

  // 6. Snapchat Package (Spotlight Caption + Story Hook + Interactive Sticker Prompt + 1 YouTube Link)
  const scCaption = (customState?.snapchatCaption || data.snapchatPackage?.spotlightCaption || "").trim();
  const scHook = (customState?.snapchatHook || data.snapchatPackage?.storyScriptHook || "").trim();
  const scPrompt = (customState?.snapchatPrompt || data.snapchatPackage?.interactiveStickerPrompt || "").trim();
  const scBadges = (data.snapchatPackage?.visualTextOverlayBadges || []).join(" | ");

  const snapchatPackageText = [
    scCaption,
    scHook ? `\n⚡ Story Hook: "${scHook}"` : "",
    scPrompt ? `\n📊 Interactive Sticker Poll: "${scPrompt}"` : "",
    scBadges ? `\n🏷️ Overlay Badges: ${scBadges}` : "",
    ytLink ? `\n👆 Swipe up / Watch full video: ${ytLink}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // 7. Reddit Package (Title + Markdown Content + TL;DR + 1 YouTube Link)
  const rdTitle = (customState?.redditTitle || data.redditPackage.postTitle || video.title).trim();
  const rdBody = (customState?.redditBody || data.redditPackage.markdownBodyContent || "").trim();
  const rdTldr = (customState?.redditTldr || data.redditPackage.tldrSummary || "").trim();

  const redditPackageText = [
    `Title: ${rdTitle}`,
    "",
    rdBody,
    rdTldr ? `\n**TL;DR**: ${rdTldr}` : "",
    ytLink ? `\n**Full Source Video**: ${ytLink}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    x: xPackageText,
    facebook: facebookPackageText,
    instagram: instagramPackageText,
    tiktok: tiktokPackageText,
    linkedin: linkedinPackageText,
    snapchat: snapchatPackageText,
    reddit: redditPackageText,
  };
}

export function formatCompleteCampaignMarkdown(
  video: YouTubeVideoInfo,
  data: DistributionData
): string {
  const mindstorm = data.mindstormMatrix || ({} as any);
  const ytSeo = data.youtubeSeo || ({} as any);
  const fb = data.facebookPackage || ({} as any);
  const xPkg = data.xPackage || ({} as any);
  const ig = data.instagramPackage || ({} as any);
  const tt = data.tiktokPackage || ({} as any);
  const red = data.redditPackage || ({} as any);
  const sc = data.snapchatPackage || ({} as any);
  const li = data.linkedinPackage || ({} as any);

  return `# Evolution Studio: Multi-Platform Distribution Campaign
**Ingested Video**: ${video.title}  
**Source URL**: ${video.standardWatchUrl}  
**Creator**: ${video.author}  
**Generated At**: ${new Date().toISOString()}  

---

## ⚡ Mindstorm Technology Viral Matrix
- **Viral Velocity Score**: ${mindstorm.viralScore || 92}/100 (Grade: ${mindstorm.overallGrade || "A+"})
- **Retention Multiplier**: ${mindstorm.retentionEstimate || "2.8x"}
- **Engagement Multiplier**: ${mindstorm.engagementMultiplier || "3.4x"}

### Velocity Drivers:
${(mindstorm.velocityDrivers || []).map((d: any) => `- **${d.driver}** (${d.rating}): ${d.impactDescription}`).join("\n")}

### Psychological Drivers:
${(mindstorm.psychologyTriggers || []).map((p: any) => `- **${p.name}** [Strength: ${p.strength}%]: ${p.description}`).join("\n")}

### Repurposing Vectors:
${(mindstorm.repurposingVectors || []).map((r: any) => `#### [${r.angleType}] ${r.angle}\n- **Viral Hook**: "${r.hook}"\n- **Target Audience**: ${r.targetAudience}`).join("\n\n")}

### Micro-Clips Repurposing Factory:
${(mindstorm.microClips || []).map((c: any) => `#### Clip ${c.clipNumber}: ${c.title} (${c.timestampRange})\n- **Hook**: ${c.viralHook}\n- **Script**: ${c.shortFormScript}\n- **Audio Vibe**: ${c.recommendedAudioMood}`).join("\n\n")}

---

## 🎬 YouTube Master SEO Package
### High-CTR Title Options:
${(ytSeo.titleOptions || []).map((t: any, idx: number) => `${idx + 1}. **${t.title}** (CTR Score: ${t.ctrScore}/100 | Angle: ${t.angle})`).join("\n")}

### SEO Description:
\`\`\`
${ytSeo.seoDescription || ""}
\`\`\`

### Hashtags:
${(ytSeo.hashtagCloud || []).join(" ")}

### Suggested Timestamps:
${(ytSeo.suggestedTimestamps || []).map((ts: any) => `- ${ts.time} - ${ts.label}`).join("\n")}

### Pinned Comment Strategy:
> ${ytSeo.pinnedCommentDraft || ""}

---

## 🌐 Facebook Distribution Package
**Headline**: ${fb.postHeadline || ""}  
**Hook**: ${fb.hookSentence || ""}  

\`\`\`
${fb.bodyStory || ""}

${fb.discussionStarter || ""}

${fb.callToAction || ""}
\`\`\`

**Hashtags**: ${(fb.hashtags || []).join(" ")}  
**Comment Link Placement**: ${fb.commentLinkStrategy || ""}  
**Optimal Posting Window**: ${fb.bestPostingWindow || ""}  

---

## 🐦 X (Twitter) Distribution Package
### Single Viral Tweet:
\`\`\`
${xPkg.viralSingleTweet || ""}
\`\`\`

### 5-Tweet High-Value Thread:
**Opener**: ${xPkg.threadOpeningHook || ""}

${(xPkg.threadTweets || []).map((t: string, i: number) => `**Tweet ${i + 1}**:\n${t}`).join("\n\n")}

**Tags & Cashtags**: ${(xPkg.hashtagsAndCashtags || []).join(" ")}  
**Optimal Window**: ${xPkg.bestPostingWindow || ""}  

---

## 📸 Instagram Distribution Package
### Reels Caption:
\`\`\`
${ig.reelCaption || ""}
\`\`\`

### Feed Caption:
\`\`\`
${ig.feedPostCaption || ""}
\`\`\`

**First 3s Hook**: "${ig.firstThreeSecondsHook || ""}"  
**Call To Action**: "${ig.callToAction || ""}"  
**High Volume Tags**: ${(ig.highVolumeHashtags || []).join(" ")}  
**Niche Tags**: ${(ig.nicheHashtags || []).join(" ")}  
**Micro Targeted**: ${(ig.microTargetHashtags || []).join(" ")}  
**SEO Alt-Text**: ${ig.seoAltText || ""}  

---

## 🎵 TikTok Distribution Package
**Retention Hook Opener**: "${tt.retentionHookOpener || ""}"  
**On-Screen Text Badge**: "${tt.textOnScreenOverlay || ""}"  
**Caption**:
\`\`\`
${tt.punchyCaption || ""}
\`\`\`
**Trending Sound Vibe**: ${tt.trendingSoundVibe || ""}  
**SEO Search Terms**: ${(tt.seoKeywordSearchTags || []).join(", ")}  
**Search Insight Terms**: ${(tt.creatorSearchInsightTerms || []).join(", ")}  

---

## 🤖 Reddit Distribution Package
**Post Title**: ${red.postTitle || ""}  
**Recommended Subreddits**: ${(red.recommendedSubreddits || []).join(", ")}  

\`\`\`markdown
${red.markdownBodyContent || ""}

**TL;DR**: ${red.tldrSummary || ""}

${red.discussionPrompt || ""}
\`\`\`

**Anti-Ban Guidance**: ${red.antiBanPostingTips || ""}  

---

## 👻 Snapchat Distribution Package
**Spotlight Caption**: ${sc.spotlightCaption || ""}  
**Story Hook Script**: ${sc.storyScriptHook || ""}  
**Text Badges**: ${(sc.visualTextOverlayBadges || []).join(" | ")}  
**Sticker Prompt**: ${sc.interactiveStickerPrompt || ""}  
**Swipe Up CTA**: ${sc.swipeUpCallToAction || ""}  

---

## 💼 LinkedIn Distribution Package
**Headline**: ${li.headlineHook || ""}  

\`\`\`
${li.executivePostContent || ""}

Key Takeaways:
${(li.keyTakeaways || []).map((k: string) => `• ${k}`).join("\n")}
\`\`\`

**Hashtags**: ${(li.hashtags || []).join(" ")}  
**Best Window**: ${li.bestPostingWindow || ""}  
`;
}
