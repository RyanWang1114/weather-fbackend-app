-- Run against the database selected by DB_NAME in backend/.env.
-- Existing tables are left unchanged; this is initial setup, not a migration.
CREATE TABLE IF NOT EXISTS weather_queries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    location VARCHAR(255) NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    temperature DECIMAL(8, 2) NULL,
    weather_data JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
