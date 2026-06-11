CREATE TABLE watchlist_items (
    id      CHAR(36)     NOT NULL,
    user_id CHAR(36)     NOT NULL,
    ticker  VARCHAR(10)  NOT NULL,
    name    VARCHAR(255) NOT NULL,
    cik     VARCHAR(20)  NOT NULL,
    CONSTRAINT pk_watchlist_items PRIMARY KEY (id),
    CONSTRAINT fk_watchlist_items_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT uq_watchlist_items_user_ticker UNIQUE (user_id, ticker)
);
