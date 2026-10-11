-- HeavyFuel Sales Analytics
-- TimescaleDB hypertable for tracking product sales over time.
-- Future use: AI-powered admin analytics and sales insights.

CREATE TABLE IF NOT EXISTS sales_events (
    time          TIMESTAMPTZ NOT NULL,
    order_id      TEXT NOT NULL,
    product_id    TEXT NOT NULL,
    quantity      INTEGER NOT NULL,
    total_amount  NUMERIC(10, 2) NOT NULL
) WITH (
    tsdb.hypertable,
    tsdb.segmentby = 'product_id',
    tsdb.orderby = 'time DESC'
);