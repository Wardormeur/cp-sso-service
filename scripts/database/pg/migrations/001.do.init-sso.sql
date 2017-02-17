CREATE TABLE IF NOT EXISTS sys_entity
(
  id character varying NOT NULL,
  base character varying,
  name character varying,
  fields character varying,
  "zone" character varying,
  seneca json,
  CONSTRAINT pk_sys_entity_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS cd_app(
  id character varying NOT NULL,
  creator_id character varying NOT NULL,
  name character varying NOT NULL,
  url character varying NOT NULL,
  callback_url character varying,
  icon_url character varying,
  TOS_url character varying,
  privacy_url character varying,
  secret_key character varying,
  fields text[],
  transparent boolean,
  created_at timestamp NOT NULL,
  CONSTRAINT pk_cd_app PRIMARY KEY (id),
  CONSTRAINT unq_cd_app_secret_key UNIQUE(secret_key)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS cd_app_approval(
  id character varying NOT NULL,
  app_id character varying NOT NULL REFERENCES cd_app(id),
  user_id character varying NOT NULL,
  token character varying,
  authorization_code character varying NOT NULL,
  expires_at timestamp NOT NULL,
  max_history integer,
  created_at timestamp NOT NULL,
  CONSTRAINT pk_cd_app_approval PRIMARY KEY (id),
  CONSTRAINT unq_cd_app_approval UNIQUE(app_id, user_id),
  CONSTRAINT unq_cd_approval_token UNIQUE(token),
  CONSTRAINT unq_cd_approval_auth_code UNIQUE(authorization_code)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS cd_app_usage(
  id character varying NOT NULL,
  approval_id character varying NOT NULL REFERENCES cd_app_approval(id),
  time timestamp NOT NULL,
  CONSTRAINT pk_app_usage PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
