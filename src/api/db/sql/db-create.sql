
CREATE TABLE IF NOT EXISTS db_version (
    version numeric NOT NULL,
    id serial PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS organizations (
    organization_name character varying NOT NULL,
    organization_id bigserial PRIMARY KEY,
    organization_email character varying UNIQUE,
    organization_key character varying NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id bigserial PRIMARY KEY,
    fullname character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    organization_id bigint NOT NULL REFERENCES organizations(organization_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id bigint NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL,
    organization_id bigint REFERENCES organizations(organization_id),
    fullname character varying NOT NULL,
    UNIQUE(organization_id, email)
);
