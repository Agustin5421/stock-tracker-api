CREATE TABLE portfolios (
    id      CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    CONSTRAINT pk_portfolios PRIMARY KEY (id),
    CONSTRAINT fk_portfolios_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE positions (
    id           CHAR(36)    NOT NULL,
    portfolio_id CHAR(36)    NOT NULL,
    ticker       VARCHAR(10) NOT NULL,
    quantity     INT         NOT NULL,
    CONSTRAINT pk_positions PRIMARY KEY (id),
    CONSTRAINT uq_positions_portfolio_ticker UNIQUE (portfolio_id, ticker),
    CONSTRAINT fk_positions_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
);

CREATE TABLE operations (
    id           CHAR(36)       NOT NULL,
    portfolio_id CHAR(36)       NOT NULL,
    type         VARCHAR(4)     NOT NULL,
    ticker       VARCHAR(10)    NOT NULL,
    quantity     INT            NOT NULL,
    price        DECIMAL(19, 4) NOT NULL,
    executed_at  DATETIME       NOT NULL,
    CONSTRAINT pk_operations PRIMARY KEY (id),
    CONSTRAINT fk_operations_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
);
