
CREATE TABLE IF NOT EXISTS public.db_version (
    version numeric NOT NULL,
    id smallint NOT NULL
);


CREATE SEQUENCE IF NOT EXISTS public.db_version_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE IF NOT EXISTS public.organizations (
    organization_name character varying NOT NULL,
    organization_id bigint NOT NULL,
    organization_key character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.organization_organization_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.users (
    user_id bigint NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL,
    organization_id bigint,
    fullname character varying NOT NULL
);


CREATE SEQUENCE IF NOT EXISTS public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY public.db_version ALTER COLUMN id SET DEFAULT nextval('public.db_version_id_seq'::regclass);

ALTER TABLE ONLY public.organizations ALTER COLUMN organization_id SET DEFAULT nextval('public.organization_organization_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);

ALTER TABLE ONLY public.db_version
    DROP CONSTRAINT IF EXISTS db_version_pkey;
ALTER TABLE ONLY public.db_version
    ADD CONSTRAINT db_version_pkey PRIMARY KEY (id);

--
-- Name: organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    DROP CONSTRAINT IF EXISTS organization_pkey;
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organization_pkey PRIMARY KEY (organization_id);

ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS organizations_email_key;
ALTER TABLE public.organizations
  ADD CONSTRAINT organizations_email_key UNIQUE(email);


--
-- Name: users_organization_id_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    DROP CONSTRAINT IF EXISTS users_organization_id_email_key;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_organization_id_email_key UNIQUE (organization_id, email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    DROP CONSTRAINT IF EXISTS users_organization_id_fkey;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id);


