CREATE TABLE stock_prices (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    ticker     VARCHAR(20)   NOT NULL,
    price      DECIMAL(19,4) NOT NULL,
    fetched_at DATETIME(3)   NOT NULL,
    CONSTRAINT pk_stock_prices PRIMARY KEY (id)
);

CREATE INDEX idx_stock_prices_ticker_fetched
    ON stock_prices (ticker, fetched_at DESC);

CREATE TABLE price_update_errors (
    id            BIGINT      NOT NULL AUTO_INCREMENT,
    ticker        VARCHAR(20) NOT NULL,
    error_message TEXT,
    occurred_at   DATETIME(3) NOT NULL,
    CONSTRAINT pk_price_update_errors PRIMARY KEY (id)
);
