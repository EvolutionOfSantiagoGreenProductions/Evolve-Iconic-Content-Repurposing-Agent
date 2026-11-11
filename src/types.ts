export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  author: string;
  authorUrl: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
  standardWatchUrl: string;
  embedUrl: string;
  originalDescription?: string;
  originalKeywords?: string[];
  category?: string;
  durationSeconds?: string;
  viewCount?: string;
}

export interface TitleOption {
  title: string;
  ctrScore: number; // 0 - 10, e.g. 9.6
  angle: string;
  projectedCtrLift?: string; // e.g. "+128% CTR Velocity"
  ctrReasoning?: string;
}

export interface SuggestedTimestamp {
  time: string;
  label: string;
}

export interface ThumbnailConcept {
  conceptName: string;
  visualComposition: string;
  textOverlayBadge: string;
  contrastColors: string;
  ctrScore: number | string; // 0 - 10, e.g. 9.4
  ctrReasoning: string;
  imagePrompt: string;
  generatedImageUrl?: string;
  aspectRatio?: string;
  colorTheme?: string;
  compositionStyle?: string;
  badgePosition?: string;
  displayedTitle?: string;
  kgGroundingTag?: string;
  videoThumbnailUrl?: string;
  useVideoBackdrop?: boolean;
  viralHeadline?: string;
  showViralArrow?: boolean;
  viralArrowText?: string;
  showCuriosityStamp?: boolean;
  curiosityStampText?: string;
  verifiedDataMetric?: string;
  observableDataStudy?: string;
  behavioralTrigger?: string;
  retentionCorrelation?: string;
  sampleSizeTested?: string;
}

export interface YouTubeSeoPackage {
  detectedContentType?: string; // e.g., "Song Remix / Flip", "Late Night Radio Show / Audio Drama", "Producer Breakdown", "Dr. Dre / West Coast Type Beat"
  contentTypeConfidence?: number; // 0 - 100
  originalTitleCtrScore?: number; // 0 - 10, e.g. 4.2
  originalTitleCtrReasoning?: string;
  titleOptions: TitleOption[];
  seoDescription: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  hashtagCloud: string[];
  suggestedTimestamps: SuggestedTimestamp[];
  pinnedCommentDraft: string;
  thumbnailConcepts: ThumbnailConcept[];
  kgEntityTags?: string[];
  schemaOrgSnippet?: string;
  mindstormKgTripletsUsed?: string[];
}

export interface VelocityDriver {
  driver: string;
  rating: string;
  impactDescription: string;
}

export interface PsychologyTrigger {
  name: string;
  description: string;
  strength: number; // 0 - 100
}

export interface RepurposingVector {
  angle: string;
  angleType: string;
  hook: string;
  targetAudience: string;
}

export interface SearchIntentAnalysis {
  primaryIntent: string;
  evergreenScore: number; // 0 - 100
  trendVelocity: string;
  searchVolumeForecast: string;
  keywordDifficulty: string;
}

export interface MicroClip {
  clipNumber: number;
  title: string;
  timestampRange: string;
  viralHook: string;
  shortFormScript: string;
  recommendedAudioMood: string;
}

export interface MindstormMatrix {
  viralScore: number; // 0 - 100
  overallGrade: string;
  retentionEstimate: string;
  engagementMultiplier: string;
  velocityDrivers: VelocityDriver[];
  psychologyTriggers: PsychologyTrigger[];
  repurposingVectors: RepurposingVector[];
  searchIntentAnalysis: SearchIntentAnalysis;
  microClips: MicroClip[];
  kgCentroidAlignment?: {
    primaryCentroid: string;
    semanticClusterMatch: number;
    authorityGapAnalysis: string;
  };
}

export interface FacebookPackage {
  postHeadline: string;
  hookSentence: string;
  bodyStory: string;
  discussionStarter: string;
  callToAction: string;
  commentLinkStrategy: string;
  hashtags: string[];
  bestPostingWindow: string;
}

export interface XPackage {
  viralSingleTweet: string;
  threadOpeningHook: string;
  threadTweets: string[];
  hashtagsAndCashtags: string[];
  quoteTweetSuggestions: string[];
  bestPostingWindow: string;
}

export interface InstagramPackage {
  reelCaption: string;
  feedPostCaption: string;
  firstThreeSecondsHook: string;
  callToAction: string;
  highVolumeHashtags: string[];
  nicheHashtags: string[];
  microTargetHashtags: string[];
  seoAltText: string;
  bestPostingWindow: string;
}

export interface TikTokPackage {
  retentionHookOpener: string;
  punchyCaption: string;
  textOnScreenOverlay: string;
  trendingSoundVibe: string;
  seoKeywordSearchTags: string[];
  creatorSearchInsightTerms: string[];
  bestPostingWindow: string;
}

export interface RedditPackage {
  postTitle: string;
  markdownBodyContent: string;
  tldrSummary: string;
  discussionPrompt: string;
  recommendedSubreddits: string[];
  antiBanPostingTips: string;
}

export interface SnapchatPackage {
  spotlightCaption: string;
  storyScriptHook: string;
  visualTextOverlayBadges: string[];
  interactiveStickerPrompt: string;
  swipeUpCallToAction: string;
}

export interface LinkedInPackage {
  headlineHook: string;
  executivePostContent: string;
  keyTakeaways: string[];
  hashtags: string[];
  bestPostingWindow: string;
}

export interface SledgehammerKGSynopsis {
  dominantKGNodesHit: string[];
  channelStrategyApplied: string;
  semanticConversionRating: string;
  authorityBooster: string;
}

export interface DistributionData {
  summaryOverview: string;
  youtubeSeo: YouTubeSeoPackage;
  mindstormMatrix: MindstormMatrix;
  facebookPackage: FacebookPackage;
  xPackage: XPackage;
  instagramPackage: InstagramPackage;
  tiktokPackage: TikTokPackage;
  redditPackage: RedditPackage;
  snapchatPackage: SnapchatPackage;
  linkedinPackage: LinkedInPackage;
  sledgehammerKGSynopsis?: SledgehammerKGSynopsis;
}

// ==================== YOUTUBE CHANNEL SYNC & KG TYPES ====================

export interface YouTubeChannelProfile {
  channelId: string;
  handle: string; // e.g. "@AliAbdaal"
  title: string;
  description: string;
  customUrl: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscriberCount: string;
  videoCount: string;
  viewCount?: string;
  nicheCategory: string;
  authorityGrade: string; // e.g. "A+ (Top 0.8% KG Authority)"
  algorithmicResonance: number; // 0 - 100
  syncedAt: string;
  verifiedBadge: boolean;
}

export interface ChannelWorkingStrategy {
  id: string;
  name: string; // e.g., "Negative Curiosity Inversion", "High-Stakes Stakes-First Pacing"
  hookFormula: string; // e.g., "Why [Common Truth] is actually ruining your [Goal]..."
  retentionMultiplier: string; // e.g., "+44% 30s Retention Lift"
  avgConversionVelocity: string; // e.g., "9.2% Click-Through Rate"
  psychologicalDriver: string; // e.g., "Status Anxiety & Cognitive Dissonance"
  bestPerformingFormat: string; // e.g., "12-18 min Deep-Dive Case Study"
  actionableDirective: string; // e.g., "Lead with the failure result in first 3 seconds before introducing solution."
}

export interface SemanticIdNode {
  nodeId: string;
  name: string;
  mid: string; // Google KG MID e.g. "/m/019_rr" or "kg:/m/0268w"
  tripletRelation: string; // e.g., "[Entity: Generative AI] -> [Empowers: Autonomous Workflow] -> [Yields: 10x Velocity]"
  resonanceScore: number; // 0 - 100
  semanticRole: "Primary Centroid" | "High-Intent Modifier" | "Conversion Anchor" | "Viral Velocity Node";
  searchIntentContext: string;
}

export interface KGNodeCluster {
  id: string;
  clusterName: string; // e.g., "AI Systems & Autonomous Agents Cluster"
  centroidEntity: string; // e.g., "Artificial Intelligence (mid: /m/019_rr)"
  entityMid: string;
  authorityWeight: number; // 0 - 100
  semanticResonance: number; // 0 - 100
  searchVelocity: "Hyper-Surging" | "High Evergreen" | "Exponential" | "Steady High Demand";
  semanticIdNodes: SemanticIdNode[];
  schemaOrgEntityTags: string[];
  untappedSearchGaps: string[];
}

export interface ChannelAudiencePersona {
  coreAvatar: string;
  viewerPainPoints: string[];
  highConvertingTriggers: string[];
  bannedTabooPhrases: string[];
  idealContentPacing: string;
}

export interface ChannelIntelligenceData {
  profile: YouTubeChannelProfile;
  workingStrategies: ChannelWorkingStrategy[];
  kgNodeClusters: KGNodeCluster[];
  audiencePersona: ChannelAudiencePersona;
  overallSledgehammerScore: number; // 0 - 100
  topRecommendation: string;
  recentUploads?: {
    id: string;
    videoId?: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    watchUrl: string;
  }[];
}

// ==================== INGESTION & ENDPOINT TYPES ====================

export interface IngestionHistoryItem {
  id: string;
  video: YouTubeVideoInfo;
  data: DistributionData;
  timestamp: string;
  targetNiche: string;
  tone: string;
  syncedChannelHandle?: string;
  turboCharged?: boolean;
}

export interface CustomEndpoint {
  id: string;
  name: string;
  url: string;
  method: "POST" | "PUT";
  authHeader?: string;
  customHeaders?: Record<string, string>;
  enabled: boolean;
  notes?: string;
  lastDispatch?: {
    success: boolean;
    timestamp: string;
    statusCode?: number;
    responsePreview?: string;
  };
}

export type PlatformId =
  | "youtube"
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "reddit"
  | "snapchat"
  | "linkedin"
  | "mindstorm"
  | "kg_clusters"
  | "custom"
  | "iconic_clipper"
  | "keyword_discovery"
  | "asset_logger";

// ==================== ICONIC CLIPPER & MINDSTORM SHORTS ====================

export type ShortsTransitionType =
  | "whip_pan_right"
  | "whip_pan_left"
  | "glitch_cut"
  | "zoom_punch"
  | "flash_fade"
  | "beat_drop_slice"
  | "vhs_tear"
  | "cross_dissolve"
  | "lens_flare"
  | "rgb_split";

export type ShortsVisualEffectType =
  | "none"
  | "diamond_glints"
  | "crt_scanlines"
  | "bass_pulse"
  | "film_grain"
  | "cyber_neon"
  | "golden_vignette";

export type CaptionFontFamily =
  | "Impact"
  | "Montserrat"
  | "Bebas Neue"
  | "Outfit"
  | "Anton"
  | "Permanent Marker"
  | "Roboto Mono"
  | "Inter"
  | "Syne";

export type CaptionAnimationStyle =
  | "karaoke_bounce"
  | "word_pop"
  | "glow_pulse"
  | "kinetic_slide"
  | "typewriter"
  | "static";

export type CaptionPosition = "top_safe" | "upper_third" | "center" | "lower_third";

export interface ShortsClipSegment {
  id: string;
  startTime: number; // in seconds e.g. 14
  endTime: number; // in seconds e.g. 38
  timestampLabel: string; // e.g. "0:14 - 0:38"
  label: string; // e.g. "The 808 Drop & Vocal Sample Reversal"
  keyMoment: string;
  audioSyncCue: string;
  isLocked?: boolean;
}

export interface PlatformShortsMetadata {
  youtube: {
    title: string;
    description: string;
    hashtags: string[];
    pinnedComment: string;
  };
  tiktok: {
    hookOpener: string;
    punchyCaption: string;
    textOverlay: string;
    trendingSoundVibe: string;
    searchKeywords: string[];
  };
  instagram: {
    reelCaption: string;
    firstThreeSecHook: string;
    hashtags: string[];
    audioAttribution: string;
  };
  facebook: {
    headline: string;
    narrativeStory: string;
    discussionStarter: string;
    callToAction: string;
    hashtags: string[];
  };
}

export interface ShortsVariation {
  variationId: "A" | "B" | "C";
  angleName: string; // e.g., "Curiosity Inversion Hook", "Sensory Climax & Drop", "Deep Dive Masterclass"
  hookHeadline: string; // e.g., "Wait for the climax at 0:12..."
  onScreenHookOverlay: string; // e.g., "THIS IS WHY NOBODY GATES THIS 🤯"
  overlayStyle: "neon_amber" | "cyber_crimson" | "matte_gold" | "toxic_emerald" | "purple_haze" | "diamond_cyan";
  soundDesignVibe: string; // e.g., "High-Velocity Dynamic Beat with Crisp Transient Cues"
  fullShortsScript: string;
  ctrScore: number; // 0.0 - 10.0, e.g. 9.8
  ctrReasoning: string;
  projectedRetentionLift: string; // e.g., "+82% 15s Retention"
  suggestedHashtags: string[];
  youtubeTitle: string; // e.g., "Why this track broke the internet #Shorts"
  youtubeDescription: string;
  platforms?: PlatformShortsMetadata;
}

export interface IconicClipperPackage {
  videoId: string;
  sourceVideoTitle: string;
  detectedArchetype: string;
  detectedContentType?: string;
  sourceDurationSeconds?: number;
  segments: ShortsClipSegment[];
  selectedTransition: ShortsTransitionType;
  transitionDurationMs: number; // e.g. 350ms
  visualEffect?: ShortsVisualEffectType;
  variations: [ShortsVariation, ShortsVariation, ShortsVariation];
  generatedAt: string;
}

// ==================== INTELLIGENT KEYWORD DISCOVERY ====================

export type GroundedKeywordCategory = "trending" | "heating_up" | "outlier";

export interface GroundedKeyword {
  id: string;
  keyword: string;
  searchVolume: string; // e.g. "94.5K / mo"
  searchVolumeExact: number;
  competitionScore: number; // 0 - 100
  competitionLabel: "Low" | "Medium" | "High" | "Ultra-Low (Breakout)";
  trendVelocityLift: string; // e.g. "+380% YoY"
  category: GroundedKeywordCategory;
  kgEntityMid: string; // e.g. "/m/04rlf"
  entityRelation: string; // e.g. "[Topic: Hip Hop Beatmaking] -> [Entity: Sound Synthesis]"
  relevanceScore: number; // 0 - 100
  actionableContentIdea: string; // e.g. "Create a 30s Short demonstrating this exact 808 slide technique."
  isAddedToTags?: boolean;
}

export interface KeywordDiscoveryResult {
  queryTopic: string;
  niche: string;
  primaryEntityCentroid: string;
  totalAnalyzed: number;
  keywords: GroundedKeyword[];
  generatedAt: string;
}

// ==================== ASSET LOGGER & PERFORMANCE TRACKER (BEFORE/AFTER ENGINE) ====================

export type PushedAssetType =
  | "youtube_seo"
  | "youtube_thumbnail"
  | "iconic_shorts_clip"
  | "social_one_click_post";

export type PlatformDestination =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "x"
  | "reddit"
  | "linkedin"
  | "snapchat"
  | "threads";

export interface ViewersMetrics {
  totalViews: number;
  uniqueViewers: number;
  returningViewers: number;
  velocityViewsPerHour: number;
  geographicTopRegion: string;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number; // percentage, e.g. 6.8
  likeToViewRatio: number; // percentage, e.g. 7.9
}

export interface ViewingBehaviorMetrics {
  avgViewDurationSec: number; // in seconds
  avgViewPercentage: number; // e.g. 68.2
  retention15s: number; // % retained at 15 sec
  retention30s: number; // % retained at 30 sec
  completionRate: number; // % watching to end
  dropOffPoint: string; // e.g. "0:48 (Hook Shift)"
}

export interface VideoPerformanceMetrics {
  ctr: number; // % click through rate e.g. 11.2
  impressions: number;
  algorithmScore: number; // 0 - 100
  searchRankAvg: number; // average ranking position, e.g. 2.1
  browseFeaturesMultiplier: string; // e.g. "+340% Home Feed Delivery"
}

export interface StreamingQualityMetrics {
  maxResolution: string; // e.g. "4K 2160p60" or "1080p60"
  codec: string; // e.g. "AV1 (Pro Res Quality)" or "VP9"
  bitrateStability: number; // % e.g. 99.2
  audioLufs: number; // e.g. -14.0 LUFS
  bufferHealthScore: number; // 0 - 100 e.g. 97
  qualityStatus: "Lossless Master 4K" | "Clean 1080p60" | "Standard Delivery";
}

export interface ReachMetrics {
  searchTrafficPct: number; // %
  browseTrafficPct: number; // %
  externalSocialPct: number; // %
  totalImpressions: number;
  viralitySpreadRatio: number; // e.g. 2.8x
}

export interface AudienceActivityMetrics {
  peakHours: string; // e.g. "6:00 PM - 10:00 PM EST"
  subscriberGain: number; // e.g. +86 subscribers
  sentimentScore: number; // 0 - 100 e.g. 96
  activeCommenters: number;
  communityReshareCount: number;
}

export interface ContentMetadataSnapshot {
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  thumbnailBadgeText?: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  seoScore: number; // 0 - 100
  readabilityScore: number; // 0 - 100
  keywordsCount: number;
  characterCountTitle: number;
  characterCountDescription: number;
  hookStrategy?: string;
  viewers: ViewersMetrics;
  engagement: EngagementMetrics;
  viewingBehavior: ViewingBehaviorMetrics;
  videoPerformance: VideoPerformanceMetrics;
  streamingQuality: StreamingQualityMetrics;
  reach: ReachMetrics;
  audienceActivity: AudienceActivityMetrics;
}

export interface MetricCategoryDeltas {
  overallAppMultiplier: string; // e.g. "+320% Result Multiplier"
  viewersLiftPct: number; // e.g. +210
  engagementLiftPct: number; // e.g. +315
  retentionLiftPct: number; // e.g. +78
  ctrLiftPct: number; // e.g. +195
  reachLiftPct: number; // e.g. +380
  activityLiftPct: number; // e.g. +240
  qualityImprovementNotes: string;
  keyEmpiricalWins: string[];
}

export interface TimelineDataPoint {
  timestamp: string;
  label: string; // "Baseline", "+6 Hours", "+24 Hours", "+48 Hours", "+7 Days"
  views: number;
  likes: number;
  ctr: number;
  retention: number;
  reach: number;
}

export interface PushedAssetRecord {
  id: string;
  videoId: string;
  videoTitle: string;
  channelHandle: string;
  assetType: PushedAssetType;
  platform: PlatformDestination;
  timestamp: string;
  targetNiche?: string;
  pushedPayload: {
    title?: string;
    description?: string;
    tags?: string[];
    thumbnailUrl?: string;
    thumbnailConceptName?: string;
    thumbnailBadgeText?: string;
    aspectRatio?: string;
    shortsVariation?: Partial<ShortsVariation>;
    socialCaption?: string;
  };
  baselineMetrics: {
    viewsAtPush: number;
    likesAtPush: number;
    commentsAtPush: number;
    ctrBaselineEstimate: number; // e.g. 4.2
  };
  beforeSnapshot: ContentMetadataSnapshot;
  afterSnapshot: ContentMetadataSnapshot;
  deltas: MetricCategoryDeltas;
  timelineHistory: TimelineDataPoint[];
  latestAudit?: {
    auditedAt: string;
    currentViews: number;
    currentLikes: number;
    currentComments: number;
    observedCtrLift: string; // e.g. "+148% CTR Velocity"
    viewVelocityGain: string; // e.g. "+1,840 views in 48h"
    algorithmicStatus: "Exploding Velocity" | "Solid Momentum" | "Needs Iteration" | "Evergreen Indexing";
    aiEvolutionInsight: string; // What worked and what the Mindstorm engine learned
    recommendedNextAction: string;
    liveMetrics?: {
      viewers: ViewersMetrics;
      engagement: EngagementMetrics;
      viewingBehavior: ViewingBehaviorMetrics;
      videoPerformance: VideoPerformanceMetrics;
      streamingQuality: StreamingQualityMetrics;
      reach: ReachMetrics;
      audienceActivity: AudienceActivityMetrics;
    };
  };
}

