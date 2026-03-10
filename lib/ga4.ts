/**
 * Google Analytics 4 Event Tracking
 * Tracks key user actions: signup, topic selection, PDF download, etc.
 * SECURITY: No PII in event names or parameters
 */

export function trackEvent(eventName: string, parameters?: Record<string, string | number>) {
  if (typeof window === 'undefined') return

  // Check if gtag is available
  if (typeof window.gtag === 'undefined') {
    console.warn('GA4 not initialized yet')
    return
  }

  window.gtag('event', eventName, parameters || {})
}

/**
 * Track user signup/registration
 */
export function trackSignup(plan: 'free' | 'pro' | 'premium') {
  trackEvent('sign_up', {
    method: 'email',
    plan,
  })
}

/**
 * Track topic selection
 */
export function trackTopicSelected(topic: string) {
  trackEvent('topic_selected', {
    topic_name: topic,
  })
}

/**
 * Track PDF download
 */
export function trackPDFDownload(topics: string) {
  trackEvent('pdf_download', {
    topic_count: topics.split(',').length,
  })
}

/**
 * Track newsletter subscription
 */
export function trackSubscription(plan: 'pro' | 'premium') {
  trackEvent('subscription', {
    plan,
  })
}

/**
 * Track referral share
 */
export function trackReferralShare() {
  trackEvent('referral_share', {})
}

/**
 * Track email signup
 */
export function trackEmailSignup() {
  trackEvent('email_signup', {})
}

/**
 * Track app installation
 */
export function trackAppInstall() {
  trackEvent('app_install', {})
}

/**
 * Track timetable customization
 */
export function trackTimetableEdit() {
  trackEvent('timetable_edit', {})
}

/**
 * Track recommendation viewed
 */
export function trackRecommendationView(topic: string, confidence: number) {
  trackEvent('recommendation_view', {
    topic,
    confidence,
  })
}

/**
 * Track recommendation accepted
 */
export function trackRecommendationAccept(topic: string) {
  trackEvent('recommendation_accept', {
    topic,
  })
}

/**
 * Track recommendation dismissed
 */
export function trackRecommendationDismiss(topic: string) {
  trackEvent('recommendation_dismiss', {
    topic,
  })
}

/**
 * Track delivery time optimization viewed
 */
export function trackDeliveryTimeView(currentTime: string, suggestedTime: string) {
  trackEvent('delivery_time_view', {
    current_time: currentTime,
    suggested_time: suggestedTime,
  })
}

/**
 * Track delivery time optimization applied
 */
export function trackDeliveryTimeApply(newTime: string) {
  trackEvent('delivery_time_apply', {
    new_time: newTime,
  })
}

/**
 * Track delivery time dismissed
 */
export function trackDeliveryTimeDismiss() {
  trackEvent('delivery_time_dismiss', {})
}

/**
 * Track analytics dashboard view
 */
export function trackAnalyticsDashboardView() {
  trackEvent('analytics_dashboard_view', {})
}

/**
 * Track analytics period change
 */
export function trackAnalyticsPeriodChange(days: number) {
  trackEvent('analytics_period_change', {
    period_days: days,
  })
}

/**
 * Track analytics metric click
 */
export function trackAnalyticsMetricClick(metric: string) {
  trackEvent('analytics_metric_click', {
    metric,
  })
}

/**
 * Declare gtag global type
 */
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, any>) => void
    dataLayer?: any[]
  }
}
