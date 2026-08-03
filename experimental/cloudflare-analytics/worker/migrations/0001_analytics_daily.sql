CREATE TABLE IF NOT EXISTS analytics_daily (
  date TEXT NOT NULL,
  tool_id TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  event_name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  PRIMARY KEY (date, tool_id, category, event_name)
);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_tool_date ON analytics_daily(tool_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_event_date ON analytics_daily(event_name, date);
