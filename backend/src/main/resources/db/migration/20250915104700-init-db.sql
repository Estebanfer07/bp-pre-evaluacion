CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE IF NOT EXISTS gender AS ENUM(
    'MALE',
    'FEMALE',
    'OTHER'
);

CREATE TYPE IF NOT EXISTS client_state AS ENUM(
    'ACTIVE',
    'INACTIVE'
);

CREATE TYPE IF NOT EXISTS movement_type AS ENUM(
    'DEPOSIT',
    'WITHDRAWAL',
    'TRANSFER'
);

CREATE TYPE IF NOT EXISTS account_type AS ENUM(
    'AHO',
    'CTE'
);

CREATE TYPE IF NOT EXISTS account_state AS ENUM(
    'ACTIVE',
    'INACTIVE'
);

CREATE TABLE people(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    gender gender NOT NULL,
    age integer NOT NULL,
    identification varchar(10) NOT NULL UNIQUE,
    address varchar(255) NOT NULL,
    phone varchar(25) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE clients(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id uuid NOT NULL REFERENCES person(id),
    password varchar(255) NOT NULL,
    state client_state NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_number char(12) NOT NULL UNIQUE,
    type account_type NOT NULL,
    balance numeric(15, 2),
    state account_state NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE movements(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES account(id),
    date timestamp with time zone NOT NULL,
    movement_type movement_type NOT NULL,
    amount numeric(15, 2) NOT NULL,
    balance numeric(15, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

