export interface VideoPerformance {
    name: string
    utm: string
    cost: number
    publishLink: string
    publishDate: string
    paidDate: string
    trackingLink: string
    videoId: string | null
    watchUrl: string | null
    medium: string
    viewsSheet: number
    viewsLive: number | null
    signupsSheet: number
    signupsTotal: number
    signupsUtm: number
    signupsSelfReported: number
    clicksTotal: number
    clicksDub: number
    youtubeError?: string
}

export interface PerformanceResponse {
    videos: VideoPerformance[]
    signupsYoutubeReferrer: number
    syncLastRunAt: string | null
    syncFailedAt: string | null
    signupEvent: string
    earliestPublishDate: string | null
    fetchedAt: string
    errors: string[]
}
