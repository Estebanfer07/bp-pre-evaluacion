CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE IF NOT EXISTS account_type AS ENUM(
    'AHO',
    'CTE'
);

CREATE TYPE IF NOT EXISTS account_state AS ENUM(
    'ACTIVE',
    'INACTIVE'
);

CREATE TABLE account(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_number char(12) NOT NULL UNIQUE,
    type account_type NOT NULL,
    balance numeric(15, 2),
    state account_state NOT NULL
);

