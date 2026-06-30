export const Config = {
  // How many minutes before a medication time to show it as "due"
  MED_REMINDER_WINDOW_MINUTES: 30,

  // How many hours after scheduled time a missed medication becomes an alert
  MED_MISSED_ALERT_HOURS: 1,

  // How many hours after scheduled time a missed check-in becomes an alert
  CHECKIN_MISSED_ALERT_HOURS: 2,

  // How many days of wellness data to show in the trend chart
  WELLNESS_CHART_DAYS: 30,

  // How many hours of activity to show in the activity feed by default
  ACTIVITY_FEED_HOURS: 24,

  // Minimum SOS button size in dp
  SOS_MIN_SIZE: 64,

  // Recommended SOS button size in dp
  SOS_RECOMMENDED_SIZE: 80,

  // Minimum touch target size for elder screens (dp)
  ELDER_TOUCH_TARGET: 56,

  // Minimum font size for elder body text (sp)
  ELDER_FONT_BODY: 20,

  // Minimum font size for elder headings (sp)
  ELDER_FONT_HEADING: 30,

  // Declining trend threshold — number of consecutive bad checkins to trigger warning
  DECLINING_TREND_DAYS: 3,
}
