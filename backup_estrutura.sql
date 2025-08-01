--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgmq; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgmq;


ALTER SCHEMA pgmq OWNER TO postgres;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: util; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA util;


ALTER SCHEMA util OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA extensions;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: http; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;


--
-- Name: EXTENSION http; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION http IS 'HTTP client for PostgreSQL, allows web page retrieval inside the database.';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgmq; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgmq WITH SCHEMA pgmq;


--
-- Name: EXTENSION pgmq; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgmq IS 'A lightweight message queue. Like AWS SQS and RSMQ but on Postgres.';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: queue_length(text); Type: FUNCTION; Schema: pgmq; Owner: postgres
--

CREATE FUNCTION pgmq.queue_length(queue_name text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$

DECLARE

    length BIGINT;

BEGIN

    EXECUTE FORMAT('SELECT COUNT(*) FROM pgmq.%I', queue_name) INTO length;

    RETURN length;

END;

$$;


ALTER FUNCTION pgmq.queue_length(queue_name text) OWNER TO postgres;

--
-- Name: analyze_cluster_content_gaps(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.analyze_cluster_content_gaps(target_blog_id uuid DEFAULT NULL::uuid, min_search_volume integer DEFAULT 1000, max_difficulty integer DEFAULT 70) RETURNS TABLE(keyword_id uuid, keyword character varying, search_volume integer, difficulty integer, gap_type character varying, opportunity_score numeric, suggested_cluster_title character varying, existing_clusters_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH keyword_cluster_analysis AS (
        SELECT 
            mk.id,
            mk.keyword,
            mk.msv,
            mk.kw_difficulty,
            COUNT(c.id) as cluster_count,
            -- Score de oportunidade baseado em volume vs dificuldade vs satura├º├úo
            ROUND(
                (mk.msv::DECIMAL / 10000) * -- Volume normalizado
                ((100 - mk.kw_difficulty) / 100.0) * -- Facilidade
                (CASE 
                    WHEN COUNT(c.id) = 0 THEN 2.0  -- Sem conte├║do = oportunidade m├íxima
                    WHEN COUNT(c.id) = 1 THEN 1.5  -- Pouco conte├║do = boa oportunidade
                    WHEN COUNT(c.id) <= 3 THEN 1.0 -- Conte├║do moderado
                    ELSE 0.5 -- Muito conte├║do = baixa oportunidade
                END), 2
            ) as opp_score
        FROM main_keywords mk
        LEFT JOIN content_opportunities_clusters c ON mk.id = c.main_keyword_id
            AND (target_blog_id IS NULL OR c.blog_id = target_blog_id)
        WHERE mk.msv >= min_search_volume
        AND mk.kw_difficulty <= max_difficulty
        AND (target_blog_id IS NULL OR mk.blog_id = target_blog_id)
        GROUP BY mk.id, mk.keyword, mk.msv, mk.kw_difficulty
    )
    SELECT 
        kca.id,
        kca.keyword::VARCHAR(500),
        kca.msv,
        kca.kw_difficulty,
        CASE 
            WHEN kca.cluster_count = 0 THEN 'Sem Conte├║do'
            WHEN kca.cluster_count = 1 THEN 'Pouco Conte├║do'
            WHEN kca.cluster_count <= 3 THEN 'Conte├║do Moderado'
            ELSE 'Muito Conte├║do'
        END::VARCHAR(50),
        kca.opp_score,
        -- Sugest├úo de t├¡tulo para cluster
        (CASE 
            WHEN kca.keyword ILIKE '%como%' THEN 'Como ' || INITCAP(kca.keyword) || ': Guia Completo'
            WHEN kca.keyword ILIKE '%melhor%' THEN INITCAP(kca.keyword) || ': An├ílise e Compara├º├úo'
            WHEN kca.keyword ILIKE '%pre├ºo%' OR kca.keyword ILIKE '%valor%' THEN INITCAP(kca.keyword) || ': Guia de Pre├ºos e Onde Comprar'
            WHEN kca.keyword ILIKE '%review%' OR kca.keyword ILIKE '%an├ílise%' THEN INITCAP(kca.keyword) || ': Review Completa e Opini├úo'
            ELSE INITCAP(kca.keyword) || ': Tudo Que Voc├¬ Precisa Saber'
        END)::VARCHAR(500),
        kca.cluster_count::INTEGER
    FROM keyword_cluster_analysis kca
    WHERE kca.opp_score > 0.5 -- S├│ oportunidades relevantes
    ORDER BY kca.opp_score DESC, kca.msv DESC;
END;
$$;


ALTER FUNCTION public.analyze_cluster_content_gaps(target_blog_id uuid, min_search_volume integer, max_difficulty integer) OWNER TO postgres;

--
-- Name: analyze_content_gaps(uuid, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.analyze_content_gaps(p_blog_id uuid, gap_threshold double precision DEFAULT 0.7) RETURNS TABLE(keyword text, msv integer, difficulty integer, has_content boolean, similar_content_count integer, opportunity_score numeric)
    LANGUAGE sql
    AS $$

  WITH keyword_content_analysis AS (

    SELECT 

      mk.keyword,

      mk.msv,

      mk.kw_difficulty,

      EXISTS(

        SELECT 1 FROM public.content_posts cp 

        WHERE cp.blog_id = p_blog_id 

        AND cp.focus_keyword = mk.keyword

      ) as has_content,

      (

        SELECT COUNT(*)

        FROM public.content_posts cp

        WHERE cp.blog_id = p_blog_id

        AND cp.embedding IS NOT NULL

        AND EXISTS(

          SELECT 1 FROM public.keyword_variations kv

          WHERE kv.main_keyword_id = mk.id

          AND kv.embedding IS NOT NULL

          AND 1 - (cp.embedding <=> kv.embedding) > gap_threshold

        )

      ) as similar_content_count,

      calculate_keyword_opportunity_score(mk.msv, mk.kw_difficulty, mk.cpc) as opportunity_score

    FROM public.main_keywords mk

    WHERE mk.blog_id = p_blog_id

  )

  SELECT 

    kca.keyword,

    kca.msv,

    kca.kw_difficulty,

    kca.has_content,

    kca.similar_content_count,

    kca.opportunity_score

  FROM keyword_content_analysis kca

  WHERE NOT kca.has_content

    AND kca.similar_content_count < 2

  ORDER BY kca.opportunity_score DESC, kca.msv DESC;

$$;


ALTER FUNCTION public.analyze_content_gaps(p_blog_id uuid, gap_threshold double precision) OWNER TO postgres;

--
-- Name: analyze_content_gaps(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.analyze_content_gaps(target_blog_id uuid, min_msv integer DEFAULT 100, max_difficulty integer DEFAULT 50) RETURNS TABLE(keyword_id uuid, keyword character varying, msv integer, kw_difficulty integer, opportunity_count bigint, content_gap_score numeric, recommendation text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mk.id as keyword_id,
        mk.keyword,
        mk.msv,
        mk.kw_difficulty,
        COUNT(coc.id) as opportunity_count,
        
        -- Score de gap baseado em MSV alto, dificuldade baixa e poucas opportunities
        CASE 
            WHEN mk.msv IS NOT NULL AND mk.kw_difficulty IS NOT NULL THEN
                (mk.msv / 1000.0) + (100 - mk.kw_difficulty) - (COUNT(coc.id) * 10)
            WHEN mk.msv IS NOT NULL THEN
                (mk.msv / 1000.0) - (COUNT(coc.id) * 10)
            ELSE
                50 - (COUNT(coc.id) * 10)
        END as content_gap_score,
        
        -- Recomenda├º├úo baseada no gap
        CASE 
            WHEN COUNT(coc.id) = 0 THEN 'ALTA PRIORIDADE: Nenhum conte├║do para esta keyword'
            WHEN COUNT(coc.id) = 1 THEN 'M├ëDIA PRIORIDADE: Apenas 1 conte├║do existente'
            WHEN COUNT(coc.id) <= 3 THEN 'BAIXA PRIORIDADE: Poucos conte├║dos existentes'
            ELSE 'SATURADO: Muitos conte├║dos j├í existem'
        END as recommendation
        
    FROM main_keywords mk
    LEFT JOIN content_opportunities_categories coc ON mk.id = coc.main_keyword_id
    WHERE mk.blog_id = target_blog_id
        AND (mk.msv IS NULL OR mk.msv >= min_msv)
        AND (mk.kw_difficulty IS NULL OR mk.kw_difficulty <= max_difficulty)
    GROUP BY mk.id, mk.keyword, mk.msv, mk.kw_difficulty
    ORDER BY content_gap_score DESC;
END;
$$;


ALTER FUNCTION public.analyze_content_gaps(target_blog_id uuid, min_msv integer, max_difficulty integer) OWNER TO postgres;

--
-- Name: auto_assign_keyword_to_cluster(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_assign_keyword_to_cluster() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- S├│ atribuir se main_keyword_id n├úo foi especificado
    IF NEW.main_keyword_id IS NULL THEN
        NEW.main_keyword_id := find_best_keyword_for_cluster(
            NEW.title,
            NEW.description,
            NEW.target_keywords,
            NEW.blog_id
        );
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_assign_keyword_to_cluster() OWNER TO postgres;

--
-- Name: auto_assign_keyword_to_opportunity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_assign_keyword_to_opportunity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Se main_keyword_id n├úo foi fornecido, encontrar automaticamente
    IF NEW.main_keyword_id IS NULL THEN
        NEW.main_keyword_id := find_best_keyword_for_opportunity(NEW.title, NEW.blog_id);
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_assign_keyword_to_opportunity() OWNER TO postgres;

--
-- Name: calculate_keyword_opportunity_score(integer, integer, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_keyword_opportunity_score(p_msv integer, p_difficulty integer, p_cpc numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $$

DECLARE

  msv_score DECIMAL(5,2) := 0;

  difficulty_score DECIMAL(5,2) := 0;

  cpc_score DECIMAL(5,2) := 0;

  final_score DECIMAL(5,2);

BEGIN

  -- Score baseado no MSV (0-40 pontos)

  CASE 

    WHEN p_msv >= 10000 THEN msv_score := 40;

    WHEN p_msv >= 5000 THEN msv_score := 30;

    WHEN p_msv >= 1000 THEN msv_score := 20;

    WHEN p_msv >= 100 THEN msv_score := 10;

    ELSE msv_score := 5;

  END CASE;

  

  -- Score baseado na dificuldade (0-30 pontos, invertido)

  CASE 

    WHEN p_difficulty <= 20 THEN difficulty_score := 30;

    WHEN p_difficulty <= 40 THEN difficulty_score := 20;

    WHEN p_difficulty <= 60 THEN difficulty_score := 10;

    WHEN p_difficulty <= 80 THEN difficulty_score := 5;

    ELSE difficulty_score := 0;

  END CASE;

  

  -- Score baseado no CPC (0-30 pontos)

  CASE 

    WHEN p_cpc >= 5.00 THEN cpc_score := 30;

    WHEN p_cpc >= 2.00 THEN cpc_score := 20;

    WHEN p_cpc >= 1.00 THEN cpc_score := 15;

    WHEN p_cpc >= 0.50 THEN cpc_score := 10;

    ELSE cpc_score := 5;

  END CASE;

  

  final_score := msv_score + difficulty_score + cpc_score;

  

  RETURN LEAST(final_score, 100.00);

END;

$$;


ALTER FUNCTION public.calculate_keyword_opportunity_score(p_msv integer, p_difficulty integer, p_cpc numeric) OWNER TO postgres;

--
-- Name: calculate_keyword_opportunity_score(integer, integer, numeric, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_keyword_opportunity_score(msv integer, kw_difficulty integer, cpc numeric, competition character varying, search_intent character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    msv_score numeric;
    difficulty_score numeric;
    cpc_score numeric;
    competition_score numeric;
    intent_score numeric;
    final_score numeric;
BEGIN
    -- MSV Score (0-40 points)
    msv_score = CASE
        WHEN msv IS NULL THEN 0
        WHEN msv <= 50 THEN 5
        WHEN msv <= 500 THEN 15
        WHEN msv <= 5000 THEN 30
        ELSE 40
    END;

    -- Difficulty Score (0-25 points, inverted)
    difficulty_score = CASE
        WHEN kw_difficulty IS NULL THEN 12.5
        ELSE 25 * (1 - (LEAST(kw_difficulty, 100) / 100.0))
    END;

    -- CPC Score (0-15 points)
    cpc_score = CASE
        WHEN cpc IS NULL OR cpc <= 0 THEN 0
        WHEN cpc <= 1 THEN 5
        WHEN cpc <= 10 THEN 10
        ELSE 15
    END;

    -- Competition Score (0-10 points)
    competition_score = CASE
        WHEN competition IS NULL THEN 5
        WHEN competition = 'LOW' THEN 10
        WHEN competition = 'MEDIUM' THEN 5
        ELSE 0
    END;

    -- Search Intent Score (0-10 points)
    intent_score = CASE
        WHEN search_intent IS NULL THEN 5
        WHEN search_intent IN ('transactional', 'commercial') THEN 10
        WHEN search_intent = 'informational' THEN 7
        ELSE 5
    END;

    -- Calculate final score (0-100)
    final_score = msv_score + difficulty_score + cpc_score + competition_score + intent_score;

    RETURN ROUND(final_score::numeric, 2);
END;
$$;


ALTER FUNCTION public.calculate_keyword_opportunity_score(msv integer, kw_difficulty integer, cpc numeric, competition character varying, search_intent character varying) OWNER TO postgres;

--
-- Name: call_util_keyword_variation_content(record); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.call_util_keyword_variation_content(input_record record) RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM set_config('search_path', 'util, public, extensions', true);
  RETURN util.keyword_variation_content(input_record);
END;
$$;


ALTER FUNCTION public.call_util_keyword_variation_content(input_record record) OWNER TO postgres;

--
-- Name: check_embeddings_stats(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_embeddings_stats() RETURNS TABLE(table_name text, total_records bigint, with_embeddings bigint, without_embeddings bigint, percentage_complete numeric)
    LANGUAGE sql
    AS $$

  SELECT 'keyword_variations'::TEXT as table_name,

         COUNT(*) as total_records,

         COUNT(embedding) as with_embeddings,

         COUNT(*) - COUNT(embedding) as without_embeddings,

         ROUND(COUNT(embedding) * 100.0 / NULLIF(COUNT(*), 0), 2) as percentage_complete

  FROM public.keyword_variations

  

  UNION ALL

  

  SELECT 'keyword_clusters'::TEXT as table_name,

         COUNT(*) as total_records,

         COUNT(embedding) as with_embeddings,

         COUNT(*) - COUNT(embedding) as without_embeddings,

         ROUND(COUNT(embedding) * 100.0 / NULLIF(COUNT(*), 0), 2) as percentage_complete

  FROM public.keyword_clusters

  

  UNION ALL

  

  SELECT 'content_opportunities_clusters'::TEXT as table_name,

         COUNT(*) as total_records,

         COUNT(embedding) as with_embeddings,

         COUNT(*) - COUNT(embedding) as without_embeddings,

         ROUND(COUNT(embedding) * 100.0 / NULLIF(COUNT(*), 0), 2) as percentage_complete

  FROM public.content_opportunities_clusters

  

  UNION ALL

  

  SELECT 'content_opportunities_categories'::TEXT as table_name,

         COUNT(*) as total_records,

         COUNT(embedding) as with_embeddings,

         COUNT(*) - COUNT(embedding) as without_embeddings,

         ROUND(COUNT(embedding) * 100.0 / NULLIF(COUNT(*), 0), 2) as percentage_complete

  FROM public.content_opportunities_categories

  

  UNION ALL

  

  SELECT 'content_posts'::TEXT as table_name,

         COUNT(*) as total_records,

         COUNT(embedding) as with_embeddings,

         COUNT(*) - COUNT(embedding) as without_embeddings,

         ROUND(COUNT(embedding) * 100.0 / NULLIF(COUNT(*), 0), 2) as percentage_complete

  FROM public.content_posts;

$$;


ALTER FUNCTION public.check_embeddings_stats() OWNER TO postgres;

--
-- Name: check_vector_indexes_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_vector_indexes_status() RETURNS TABLE(index_name text, table_name text, index_size text, is_valid boolean)
    LANGUAGE sql
    AS $$

  SELECT 

    i.indexname as index_name,

    i.tablename as table_name,

    pg_size_pretty(pg_relation_size(i.indexname::regclass)) as index_size,

    idx.indisvalid as is_valid

  FROM pg_indexes i

  JOIN pg_class c ON c.relname = i.indexname

  JOIN pg_index idx ON idx.indexrelid = c.oid

  WHERE i.indexname LIKE '%_embedding'

    AND i.schemaname = 'public'

  ORDER BY i.tablename, i.indexname;

$$;


ALTER FUNCTION public.check_vector_indexes_status() OWNER TO postgres;

--
-- Name: cluster_keywords_content(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cluster_keywords_content(input_record jsonb) RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT input_record->>'keyword_variations';
$$;


ALTER FUNCTION public.cluster_keywords_content(input_record jsonb) OWNER TO postgres;

--
-- Name: content_opportunity_category_content(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.content_opportunity_category_content(input_record jsonb) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $$
BEGIN
  RETURN COALESCE(input_record->>'title', '') || ' ' ||
         COALESCE(input_record->>'description', '');
END;
$$;


ALTER FUNCTION public.content_opportunity_category_content(input_record jsonb) OWNER TO postgres;

--
-- Name: content_opportunity_cluster_content(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.content_opportunity_cluster_content(input_record jsonb) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    combined_text text;
    target_keywords_text text;
BEGIN
    -- Convert target_keywords array to text
    target_keywords_text := array_to_string(
        ARRAY(
            SELECT jsonb_array_elements_text(COALESCE(input_record->'target_keywords', '[]'::jsonb))
        ),
        ' '
    );

    -- Combine all relevant fields
    combined_text := COALESCE(input_record->>'title', '') || ' ' ||
                    COALESCE(input_record->>'description', '') || ' ' ||
                    COALESCE(input_record->>'final_title', '') || ' ' ||
                    COALESCE(input_record->>'final_description', '') || ' ' ||
                    COALESCE(input_record->>'content_type', '') || ' ' ||
                    COALESCE(target_keywords_text, '');
    
    RETURN combined_text;
END;
$$;


ALTER FUNCTION public.content_opportunity_cluster_content(input_record jsonb) OWNER TO postgres;

--
-- Name: content_post_content(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.content_post_content(input_record jsonb) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $$
BEGIN
  RETURN COALESCE(input_record->>'title', '') || ' ' ||
         COALESCE(input_record->>'excerpt', '') || ' ' ||
         COALESCE(LEFT(input_record->>'content', 8000), '');
END;
$$;


ALTER FUNCTION public.content_post_content(input_record jsonb) OWNER TO postgres;

--
-- Name: delete_related_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_related_data() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Quando um post ├® deletado, limpa dados relacionados
    IF TG_TABLE_NAME = 'content_posts' THEN
        DELETE FROM public.post_categories WHERE post_id = OLD.id;
        DELETE FROM public.post_tags WHERE post_id = OLD.id;
        DELETE FROM public.post_meta WHERE post_id = OLD.id;
        UPDATE public.media_assets SET post_id = NULL WHERE post_id = OLD.id;
    END IF;
    
    -- Quando uma keyword principal ├® deletada, limpa clusters relacionados
    IF TG_TABLE_NAME = 'main_keywords' THEN
        UPDATE public.keyword_clusters 
        SET main_keyword_id = NULL 
        WHERE main_keyword_id = OLD.id;
    END IF;
    
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.delete_related_data() OWNER TO postgres;

--
-- Name: detect_semantic_duplicates(double precision, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.detect_semantic_duplicates(similarity_threshold double precision DEFAULT 0.95, table_name text DEFAULT 'keyword_variations'::text) RETURNS TABLE(id1 uuid, id2 uuid, text1 text, text2 text, similarity double precision)
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF table_name = 'keyword_variations' THEN
    RETURN QUERY
    SELECT 
      kv1.id as id1,
      kv2.id as id2,
      kv1.keyword as text1,
      kv2.keyword as text2,
      1 - (kv1.embedding <=> kv2.embedding) as similarity
    FROM public.keyword_variations kv1
    JOIN public.keyword_variations kv2 ON kv1.id < kv2.id
    WHERE kv1.embedding IS NOT NULL 
      AND kv2.embedding IS NOT NULL
      AND 1 - (kv1.embedding <=> kv2.embedding) > similarity_threshold;
  ELSIF table_name = 'content_posts' THEN
    RETURN QUERY
    SELECT 
      cp1.id as id1,
      cp2.id as id2,
      cp1.title::text as text1,  -- Explicitly cast to text
      cp2.title::text as text2,  -- Explicitly cast to text
      1 - (cp1.embedding <=> cp2.embedding) as similarity
    FROM public.content_posts cp1
    JOIN public.content_posts cp2 ON cp1.id < cp2.id
    WHERE cp1.embedding IS NOT NULL 
      AND cp2.embedding IS NOT NULL
      AND 1 - (cp1.embedding <=> cp2.embedding) > similarity_threshold;
  END IF;
END;
$$;


ALTER FUNCTION public.detect_semantic_duplicates(similarity_threshold double precision, table_name text) OWNER TO postgres;

--
-- Name: find_best_keyword_for_cluster(text, text, text[], uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_best_keyword_for_cluster(cluster_title text, cluster_description text DEFAULT NULL::text, cluster_target_keywords text[] DEFAULT NULL::text[], cluster_blog_id uuid DEFAULT NULL::uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    best_keyword_id UUID;
    keyword_record RECORD;
    best_score DECIMAL := 0;
    current_score DECIMAL;
    title_similarity DECIMAL;
    desc_similarity DECIMAL;
    keywords_similarity DECIMAL;
    combined_text TEXT;
    keyword_text TEXT;
BEGIN
    -- Combinar textos do cluster para an├ílise
    combined_text := LOWER(COALESCE(cluster_title, ''));
    IF cluster_description IS NOT NULL THEN
        combined_text := combined_text || ' ' || LOWER(cluster_description);
    END IF;
    
    -- Adicionar target_keywords se existirem
    IF cluster_target_keywords IS NOT NULL AND array_length(cluster_target_keywords, 1) > 0 THEN
        combined_text := combined_text || ' ' || LOWER(array_to_string(cluster_target_keywords, ' '));
    END IF;
    
    -- Buscar a melhor keyword
    FOR keyword_record IN 
        SELECT id, keyword, msv, kw_difficulty, blog_id
        FROM main_keywords 
        WHERE (cluster_blog_id IS NULL OR blog_id = cluster_blog_id)
        AND keyword IS NOT NULL
        AND LENGTH(TRIM(keyword)) > 0
    LOOP
        keyword_text := LOWER(keyword_record.keyword);
        
        -- Calcular similaridade do t├¡tulo (peso 40%)
        title_similarity := CASE 
            WHEN cluster_title ILIKE '%' || keyword_text || '%' OR keyword_text ILIKE '%' || LOWER(cluster_title) || '%' THEN 1.0
            WHEN similarity(LOWER(cluster_title), keyword_text) > 0.3 THEN similarity(LOWER(cluster_title), keyword_text)
            ELSE 0.0
        END;
        
        -- Calcular similaridade da descri├º├úo (peso 20%)
        desc_similarity := CASE 
            WHEN cluster_description IS NULL THEN 0.0
            WHEN cluster_description ILIKE '%' || keyword_text || '%' OR keyword_text ILIKE '%' || LOWER(cluster_description) || '%' THEN 0.8
            WHEN similarity(LOWER(cluster_description), keyword_text) > 0.2 THEN similarity(LOWER(cluster_description), keyword_text)
            ELSE 0.0
        END;
        
        -- Calcular similaridade com target_keywords (peso 30%)
        keywords_similarity := 0.0;
        IF cluster_target_keywords IS NOT NULL THEN
            FOR i IN 1..array_length(cluster_target_keywords, 1) LOOP
                IF LOWER(cluster_target_keywords[i]) ILIKE '%' || keyword_text || '%' OR 
                   keyword_text ILIKE '%' || LOWER(cluster_target_keywords[i]) || '%' THEN
                    keywords_similarity := 1.0;
                    EXIT;
                ELSIF similarity(LOWER(cluster_target_keywords[i]), keyword_text) > keywords_similarity THEN
                    keywords_similarity := similarity(LOWER(cluster_target_keywords[i]), keyword_text);
                END IF;
            END LOOP;
        END IF;
        
        -- Calcular score combinado
        current_score := (title_similarity * 0.4) + (desc_similarity * 0.2) + (keywords_similarity * 0.3);
        
        -- Bonus por volume de busca (peso 7%)
        IF keyword_record.msv > 0 THEN
            current_score := current_score + (LEAST(keyword_record.msv::DECIMAL / 100000, 1.0) * 0.07);
        END IF;
        
        -- Bonus por facilidade (peso 3% - quanto menor a dificuldade, melhor)
        IF keyword_record.kw_difficulty > 0 THEN
            current_score := current_score + ((100 - keyword_record.kw_difficulty) / 100.0 * 0.03);
        END IF;
        
        -- Atualizar melhor match
        IF current_score > best_score THEN
            best_score := current_score;
            best_keyword_id := keyword_record.id;
        END IF;
    END LOOP;
    
    RETURN best_keyword_id;
END;
$$;


ALTER FUNCTION public.find_best_keyword_for_cluster(cluster_title text, cluster_description text, cluster_target_keywords text[], cluster_blog_id uuid) OWNER TO postgres;

--
-- Name: find_best_keyword_for_opportunity(text, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_best_keyword_for_opportunity(opportunity_title text, opportunity_blog_id uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    best_keyword_id UUID;
    best_score FLOAT := 0;
    keyword_record RECORD;
    current_score FLOAT;
BEGIN
    -- Iterar sobre todas as keywords do mesmo blog
    FOR keyword_record IN 
        SELECT id, keyword, msv, kw_difficulty 
        FROM main_keywords 
        WHERE blog_id = opportunity_blog_id
    LOOP
        -- Calcular score baseado em:
        -- 1. Similaridade do texto (usando similarity do pg_trgm se dispon├¡vel, sen├úo position)
        -- 2. Volume de busca (MSV)
        -- 3. Dificuldade (menor ├® melhor)
        
        current_score := 0;
        
        -- Score de similaridade (50% do peso)
        IF position(lower(keyword_record.keyword) in lower(opportunity_title)) > 0 THEN
            current_score := current_score + 50;
        ELSIF position(lower(split_part(keyword_record.keyword, ' ', 1)) in lower(opportunity_title)) > 0 THEN
            current_score := current_score + 25;
        END IF;
        
        -- Score de MSV (30% do peso) - normalizado
        IF keyword_record.msv IS NOT NULL AND keyword_record.msv > 0 THEN
            current_score := current_score + (30 * LEAST(keyword_record.msv / 10000.0, 1));
        END IF;
        
        -- Score de dificuldade (20% do peso) - invertido (menor dificuldade = melhor)
        IF keyword_record.kw_difficulty IS NOT NULL THEN
            current_score := current_score + (20 * (1 - (keyword_record.kw_difficulty / 100.0)));
        ELSE
            current_score := current_score + 10; -- Score neutro se n├úo tem dificuldade
        END IF;
        
        -- Atualizar melhor keyword se o score for maior
        IF current_score > best_score THEN
            best_score := current_score;
            best_keyword_id := keyword_record.id;
        END IF;
    END LOOP;
    
    RETURN best_keyword_id;
END;
$$;


ALTER FUNCTION public.find_best_keyword_for_opportunity(opportunity_title text, opportunity_blog_id uuid) OWNER TO postgres;

--
-- Name: find_similar_clusters(extensions.vector, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_similar_clusters(query_embedding extensions.vector, match_threshold double precision DEFAULT 0.8, match_count integer DEFAULT 10) RETURNS TABLE(id uuid, cluster_name text, similarity double precision)
    LANGUAGE sql
    AS $$

  SELECT 

    kc.id,

    kc.cluster_name,

    1 - (kc.embedding <=> query_embedding) as similarity

  FROM public.keyword_clusters kc

  WHERE kc.embedding IS NOT NULL

    AND 1 - (kc.embedding <=> query_embedding) > match_threshold

  ORDER BY kc.embedding <=> query_embedding

  LIMIT match_count;

$$;


ALTER FUNCTION public.find_similar_clusters(query_embedding extensions.vector, match_threshold double precision, match_count integer) OWNER TO postgres;

--
-- Name: find_similar_keywords(extensions.vector, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_similar_keywords(query_embedding extensions.vector, match_threshold double precision DEFAULT 0.8, match_count integer DEFAULT 10) RETURNS TABLE(id uuid, keyword text, similarity double precision)
    LANGUAGE sql
    AS $$

  SELECT 

    kv.id,

    kv.keyword,

    1 - (kv.embedding <=> query_embedding) as similarity

  FROM public.keyword_variations kv

  WHERE kv.embedding IS NOT NULL

    AND 1 - (kv.embedding <=> query_embedding) > match_threshold

  ORDER BY kv.embedding <=> query_embedding

  LIMIT match_count;

$$;


ALTER FUNCTION public.find_similar_keywords(query_embedding extensions.vector, match_threshold double precision, match_count integer) OWNER TO postgres;

--
-- Name: find_similar_posts(extensions.vector, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_similar_posts(query_embedding extensions.vector, match_threshold double precision DEFAULT 0.8, match_count integer DEFAULT 10) RETURNS TABLE(id uuid, title text, similarity double precision)
    LANGUAGE sql
    AS $$

  SELECT 

    cp.id,

    cp.title,

    1 - (cp.embedding <=> query_embedding) as similarity

  FROM public.content_posts cp

  WHERE cp.embedding IS NOT NULL

    AND 1 - (cp.embedding <=> query_embedding) > match_threshold

  ORDER BY cp.embedding <=> query_embedding

  LIMIT match_count;

$$;


ALTER FUNCTION public.find_similar_posts(query_embedding extensions.vector, match_threshold double precision, match_count integer) OWNER TO postgres;

--
-- Name: generate_cluster_opportunities_from_gaps(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_cluster_opportunities_from_gaps(target_blog_id uuid, max_opportunities integer DEFAULT 10, min_search_volume integer DEFAULT 1000) RETURNS TABLE(generated_count integer, message text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    gap_record RECORD;
    inserted_count INTEGER := 0;
    cluster_uuid UUID;
BEGIN
    -- Buscar gaps com maior potencial
    FOR gap_record IN 
        SELECT * FROM analyze_cluster_content_gaps(target_blog_id, min_search_volume, 70)
        WHERE gap_type IN ('Sem Conte├║do', 'Pouco Conte├║do')
        ORDER BY opportunity_score DESC
        LIMIT max_opportunities
    LOOP
        -- Gerar UUID para o cluster
        cluster_uuid := gen_random_uuid();
        
        -- Inserir nova oportunidade de cluster
        INSERT INTO content_opportunities_clusters (
            blog_id,
            cluster_id,
            title,
            description,
            content_type,
            priority_score,
            estimated_traffic,
            difficulty_score,
            status,
            target_keywords,
            main_keyword_id,
            notes
        ) VALUES (
            target_blog_id,
            cluster_uuid,
            gap_record.suggested_cluster_title,
            'Conte├║do gerado automaticamente baseado em an├ílise de gaps de keywords. Keyword principal: ' || gap_record.keyword || ' (MSV: ' || gap_record.search_volume || ', Dificuldade: ' || gap_record.difficulty || ')',
            'article',
            gap_record.opportunity_score,
            ROUND(gap_record.search_volume * (100 - gap_record.difficulty) / 100.0),
            gap_record.difficulty,
            'identified',
            ARRAY[gap_record.keyword],
            gap_record.keyword_id,
            'Oportunidade identificada em ' || CURRENT_DATE || ' via an├ílise automatizada de gaps. Score: ' || gap_record.opportunity_score
        );
        
        inserted_count := inserted_count + 1;
    END LOOP;
    
    RETURN QUERY SELECT 
        inserted_count,
        CASE 
            WHEN inserted_count = 0 THEN 'Nenhuma nova oportunidade de cluster foi identificada com os crit├®rios especificados.'
            WHEN inserted_count = 1 THEN 'Foi gerada 1 nova oportunidade de cluster baseada em an├ílise de gaps.'
            ELSE 'Foram geradas ' || inserted_count || ' novas oportunidades de cluster baseadas em an├ílise de gaps.'
        END;
END;
$$;


ALTER FUNCTION public.generate_cluster_opportunities_from_gaps(target_blog_id uuid, max_opportunities integer, min_search_volume integer) OWNER TO postgres;

--
-- Name: generate_opportunities_from_gaps(uuid, numeric, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_opportunities_from_gaps(target_blog_id uuid, min_gap_score numeric DEFAULT 40, max_opportunities integer DEFAULT 10) RETURNS TABLE(created_opportunity_id uuid, keyword_used character varying, generated_title text, estimated_score numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    gap_record RECORD;
    new_opportunity_id UUID;
    generated_title TEXT;
    category_id UUID;
    opportunities_created INTEGER := 0;
BEGIN
    -- Buscar uma categoria padr├úo para o blog (primeira categoria encontrada)
    SELECT id INTO category_id 
    FROM keyword_categories 
    WHERE blog_id = target_blog_id 
    LIMIT 1;
    
    -- Se n├úo encontrar categoria, usar NULL (pode ser ajustado depois)
    IF category_id IS NULL THEN
        RAISE NOTICE 'Nenhuma categoria encontrada para o blog. Opportunities ser├úo criadas sem categoria.';
    END IF;
    
    -- Iterar sobre keywords com gaps altos
    FOR gap_record IN 
        SELECT * FROM analyze_content_gaps(target_blog_id, 0, 100)
        WHERE content_gap_score >= min_gap_score
        ORDER BY content_gap_score DESC
        LIMIT max_opportunities
    LOOP
        -- Gerar t├¡tulo baseado na keyword
        generated_title := CASE 
            WHEN gap_record.keyword LIKE '%como%' THEN
                gap_record.keyword || ': Guia Completo e Passo a Passo'
            WHEN gap_record.keyword LIKE '%melhor%' OR gap_record.keyword LIKE '%melhores%' THEN
                gap_record.keyword || ' 2025: An├ílise Completa e Comparativo'
            WHEN gap_record.keyword LIKE '%o que ├®%' OR gap_record.keyword LIKE '%que ├®%' THEN
                gap_record.keyword || ': Tudo o Que Voc├¬ Precisa Saber'
            ELSE
                initcap(gap_record.keyword) || ': Guia Essencial e Dicas Importantes'
        END;
        
        -- Inserir nova opportunity
        INSERT INTO content_opportunities_categories (
            blog_id,
            category_id,
            title,
            description,
            priority_score,
            estimated_traffic,
            difficulty_score,
            status,
            main_keyword_id,
            notes
        ) VALUES (
            target_blog_id,
            category_id,
            generated_title,
            'Oportunidade gerada automaticamente baseada em an├ílise de gaps de conte├║do para a keyword: ' || gap_record.keyword,
            gap_record.content_gap_score,
            COALESCE(gap_record.msv, 0),
            COALESCE(gap_record.kw_difficulty, 50),
            'identified',
            gap_record.keyword_id,
            'Gerado automaticamente em ' || NOW()::TEXT || ' - Gap Score: ' || gap_record.content_gap_score::TEXT
        ) RETURNING id INTO new_opportunity_id;
        
        opportunities_created := opportunities_created + 1;
        
        -- Retornar informa├º├Áes da opportunity criada
        RETURN QUERY SELECT 
            new_opportunity_id,
            gap_record.keyword,
            generated_title,
            gap_record.content_gap_score;
    END LOOP;
    
    RAISE NOTICE 'Criadas % novas opportunities baseadas em gaps de conte├║do', opportunities_created;
    
    RETURN;
END;
$$;


ALTER FUNCTION public.generate_opportunities_from_gaps(target_blog_id uuid, min_gap_score numeric, max_opportunities integer) OWNER TO postgres;

--
-- Name: get_niche_statistics(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_niche_statistics() RETURNS TABLE(niche text, total_blogs bigint, total_keywords bigint, avg_msv numeric, avg_difficulty numeric, avg_cpc numeric)
    LANGUAGE sql
    AS $$

  SELECT 

    b.niche,

    COUNT(DISTINCT b.id) as total_blogs,

    COUNT(mk.id) as total_keywords,

    ROUND(AVG(mk.msv), 2) as avg_msv,

    ROUND(AVG(mk.kw_difficulty), 2) as avg_difficulty,

    ROUND(AVG(mk.cpc), 2) as avg_cpc

  FROM public.blogs b

  LEFT JOIN public.main_keywords mk ON b.id = mk.blog_id

  WHERE b.niche IS NOT NULL

  GROUP BY b.niche

  ORDER BY total_keywords DESC;

$$;


ALTER FUNCTION public.get_niche_statistics() OWNER TO postgres;

--
-- Name: get_openai_api_key_from_vault(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_openai_api_key_from_vault() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$

BEGIN

  RETURN (

    SELECT decrypted_secret

    FROM vault.decrypted_secrets

    WHERE name = 'openai_api_key'

    LIMIT 1

  );

END;

$$;


ALTER FUNCTION public.get_openai_api_key_from_vault() OWNER TO postgres;

--
-- Name: hybrid_search_posts(text, extensions.vector, uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.hybrid_search_posts(search_query text, query_embedding extensions.vector DEFAULT NULL::extensions.vector, blog_id_filter uuid DEFAULT NULL::uuid, match_count integer DEFAULT 10) RETURNS TABLE(id uuid, title text, excerpt text, similarity double precision, text_rank double precision, combined_score double precision)
    LANGUAGE sql
    AS $$

  WITH text_search AS (

    SELECT 

      cp.id,

      cp.title,

      cp.excerpt,

      ts_rank(

        to_tsvector('portuguese', cp.title || ' ' || COALESCE(cp.excerpt, '') || ' ' || COALESCE(cp.content, '')), 

        plainto_tsquery('portuguese', search_query)

      ) as text_rank

    FROM public.content_posts cp

    WHERE (blog_id_filter IS NULL OR cp.blog_id = blog_id_filter)

      AND to_tsvector('portuguese', cp.title || ' ' || COALESCE(cp.excerpt, '') || ' ' || COALESCE(cp.content, '')) 

          @@ plainto_tsquery('portuguese', search_query)

  ),

  semantic_search AS (

    SELECT 

      cp.id,

      1 - (cp.embedding <=> query_embedding) as similarity

    FROM public.content_posts cp

    WHERE query_embedding IS NOT NULL 

      AND cp.embedding IS NOT NULL

      AND (blog_id_filter IS NULL OR cp.blog_id = blog_id_filter)

  )

  SELECT 

    COALESCE(ts.id, ss.id) as id,

    ts.title,

    ts.excerpt,

    COALESCE(ss.similarity, 0) as similarity,

    COALESCE(ts.text_rank, 0) as text_rank,

    (COALESCE(ss.similarity, 0) * 0.6 + COALESCE(ts.text_rank, 0) * 0.4) as combined_score

  FROM text_search ts

  FULL OUTER JOIN semantic_search ss ON ts.id = ss.id

  ORDER BY combined_score DESC

  LIMIT match_count;

$$;


ALTER FUNCTION public.hybrid_search_posts(search_query text, query_embedding extensions.vector, blog_id_filter uuid, match_count integer) OWNER TO postgres;

--
-- Name: inserir_variacao_keyword(uuid, text, character varying, integer, integer, numeric, character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.inserir_variacao_keyword(p_main_keyword_id uuid, p_keyword text, p_variation_type character varying, p_msv integer, p_kw_difficulty integer, p_cpc numeric, p_competition character varying, p_search_intent character varying, p_answer text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.keyword_variations (
        main_keyword_id,
        keyword,
        variation_type,
        msv,
        kw_difficulty,
        cpc,
        competition,
        search_intent,
        answer
        -- As colunas 'id', 'created_at', 'updated_at', e 'embedding' s├úo
        -- preenchidas automaticamente por defaults ou triggers.
    )
    VALUES (
        p_main_keyword_id,
        p_keyword,
        p_variation_type,
        p_msv,
        p_kw_difficulty,
        p_cpc,
        p_competition,
        p_search_intent,
        p_answer
    )
    -- Esta ├® a parte crucial que resolve o seu problema:
    -- Se a combina├º├úo de (main_keyword_id, keyword) j├í existir,
    -- n├úo fa├ºa nada e n├úo gere um erro.
    ON CONFLICT (main_keyword_id, keyword) DO NOTHING;
END;
$$;


ALTER FUNCTION public.inserir_variacao_keyword(p_main_keyword_id uuid, p_keyword text, p_variation_type character varying, p_msv integer, p_kw_difficulty integer, p_cpc numeric, p_competition character varying, p_search_intent character varying, p_answer text) OWNER TO postgres;

--
-- Name: is_special_msv(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_special_msv(msv integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN msv IN (1, 10, 100, 1000, 10000);
END;
$$;


ALTER FUNCTION public.is_special_msv(msv integer) OWNER TO postgres;

--
-- Name: keyword_cluster_content(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.keyword_cluster_content(input_record jsonb) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $$
BEGIN
  RETURN COALESCE(input_record->>'cluster_name', '') || ' ' ||
         COALESCE(input_record->>'description', '');
END;
$$;


ALTER FUNCTION public.keyword_cluster_content(input_record jsonb) OWNER TO postgres;

--
-- Name: keyword_variation_content(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.keyword_variation_content(input_record jsonb) RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN COALESCE(input_record->>'keyword', '') || ' ' ||
         COALESCE(input_record->>'variation_type', '') || ' ' ||
         COALESCE(input_record->>'search_intent', '') || ' ' ||
         COALESCE(input_record->>'competition', '');
END;
$$;


ALTER FUNCTION public.keyword_variation_content(input_record jsonb) OWNER TO postgres;

--
-- Name: mark_keyword_as_used(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.mark_keyword_as_used() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    IF NEW.focus_keyword IS NOT NULL THEN

        UPDATE public.main_keywords 

        SET is_used = true 

        WHERE keyword = NEW.focus_keyword 

          AND blog_id = NEW.blog_id;

    END IF;

    RETURN NEW;

END;

$$;


ALTER FUNCTION public.mark_keyword_as_used() OWNER TO postgres;

--
-- Name: match_documents(extensions.vector, integer, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.match_documents(query_embedding extensions.vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb) RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
    LANGUAGE plpgsql
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION public.match_documents(query_embedding extensions.vector, match_count integer, filter jsonb) OWNER TO postgres;

--
-- Name: recommend_keywords_for_post(uuid, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.recommend_keywords_for_post(p_post_id uuid, similarity_threshold double precision DEFAULT 0.8, max_recommendations integer DEFAULT 10) RETURNS TABLE(keyword text, variation_type text, msv integer, difficulty integer, similarity double precision, opportunity_score numeric)
    LANGUAGE sql
    AS $$

  SELECT 

    kv.keyword,

    kv.variation_type,

    kv.msv,

    kv.kw_difficulty,

    1 - (cp.embedding <=> kv.embedding) as similarity,

    calculate_keyword_opportunity_score(kv.msv, kv.kw_difficulty, kv.cpc) as opportunity_score

  FROM public.content_posts cp

  JOIN public.keyword_variations kv ON 1 - (cp.embedding <=> kv.embedding) > similarity_threshold

  JOIN public.main_keywords mk ON kv.main_keyword_id = mk.id

  WHERE cp.id = p_post_id

    AND cp.embedding IS NOT NULL

    AND kv.embedding IS NOT NULL

    AND mk.blog_id = cp.blog_id

    AND NOT mk.is_used

  ORDER BY similarity DESC, opportunity_score DESC

  LIMIT max_recommendations;

$$;


ALTER FUNCTION public.recommend_keywords_for_post(p_post_id uuid, similarity_threshold double precision, max_recommendations integer) OWNER TO postgres;

--
-- Name: search_similar_keyword_variations(uuid, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_similar_keyword_variations(p_main_keyword_id uuid, p_similarity_threshold double precision DEFAULT 0.7, p_limit integer DEFAULT 10) RETURNS TABLE(variation_keyword text, variation_type character varying, similarity double precision, msv integer, kw_difficulty integer, search_intent character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH main_kw AS (
        SELECT keyword, embedding
        FROM main_keywords
        WHERE id = p_main_keyword_id
    ),
    similar_variations AS (
        SELECT 
            kv.keyword as variation_keyword,
            kv.variation_type,
            1 - (kv.embedding <=> mk.embedding) as similarity,
            kv.msv,
            kv.kw_difficulty,
            kv.search_intent
        FROM keyword_variations kv
        CROSS JOIN main_kw mk
        WHERE kv.main_keyword_id = p_main_keyword_id
        AND 1 - (kv.embedding <=> mk.embedding) >= p_similarity_threshold
        ORDER BY similarity DESC
        LIMIT p_limit
    )
    SELECT * FROM similar_variations;
END;
$$;


ALTER FUNCTION public.search_similar_keyword_variations(p_main_keyword_id uuid, p_similarity_threshold double precision, p_limit integer) OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: validate_keyword_variations(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validate_keyword_variations() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    -- Normaliza keyword para lowercase

    NEW.keyword := LOWER(TRIM(NEW.keyword));

    

    -- Valida MSV (permite valores negativos do DataForSEO)

    IF NEW.msv IS NOT NULL AND NEW.msv < -1000 THEN

        RAISE WARNING 'MSV muito baixo para keyword %: %', NEW.keyword, NEW.msv;

    END IF;

    

    -- Valida CPC

    IF NEW.cpc IS NOT NULL AND NEW.cpc < 0 THEN

        NEW.cpc := 0;

    END IF;

    

    RETURN NEW;

END;

$$;


ALTER FUNCTION public.validate_keyword_variations() OWNER TO postgres;

--
-- Name: validate_post_categories(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validate_post_categories() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    -- Normaliza nome da categoria

    NEW.category_name := TRIM(NEW.category_name);

    

    -- Verifica se a categoria n├úo est├í vazia

    IF NEW.category_name = '' THEN

        RAISE EXCEPTION 'Nome da categoria n├úo pode estar vazio';

    END IF;

    

    RETURN NEW;

END;

$$;


ALTER FUNCTION public.validate_post_categories() OWNER TO postgres;

--
-- Name: validate_post_tags(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validate_post_tags() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    -- Normaliza nome da tag

    NEW.tag_name := TRIM(NEW.tag_name);

    

    -- Verifica se a tag n├úo est├í vazia

    IF NEW.tag_name = '' THEN

        RAISE EXCEPTION 'Nome da tag n├úo pode estar vazio';

    END IF;

    

    RETURN NEW;

END;

$$;


ALTER FUNCTION public.validate_post_tags() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: check_embedding_queue_status(); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.check_embedding_queue_status() RETURNS TABLE(queue_name text, queue_length bigint, oldest_msg_age_seconds bigint, newest_msg_age_seconds bigint)
    LANGUAGE sql
    AS $$

  SELECT

    'embedding_jobs'::TEXT AS queue_name,

    (SELECT COUNT(*) FROM pgmq.q_embedding_jobs) AS queue_length, -- Contagem direta

    EXTRACT(EPOCH FROM (NOW() - MIN(q.enqueued_at)))::BIGINT AS oldest_msg_age_seconds,

    EXTRACT(EPOCH FROM (NOW() - MAX(q.enqueued_at)))::BIGINT AS newest_msg_age_seconds

  FROM pgmq.q_embedding_jobs q -- Adicionado alias para clareza

  WHERE q.enqueued_at IS NOT NULL;

$$;


ALTER FUNCTION util.check_embedding_queue_status() OWNER TO postgres;

--
-- Name: check_failed_embedding_jobs(); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.check_failed_embedding_jobs() RETURNS TABLE(msg_id bigint, message jsonb, enqueued_at timestamp with time zone, read_ct integer)
    LANGUAGE sql
    AS $$

  SELECT 

    msg_id,

    message,

    enqueued_at,

    read_ct

  FROM pgmq.q_embedding_jobs

  WHERE read_ct > 3

  ORDER BY enqueued_at DESC;

$$;


ALTER FUNCTION util.check_failed_embedding_jobs() OWNER TO postgres;

--
-- Name: cleanup_old_embedding_jobs(integer); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.cleanup_old_embedding_jobs(older_than_hours integer DEFAULT 24) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$

DECLARE

  deleted_count BIGINT;

BEGIN

  SELECT COUNT(*) INTO deleted_count

  FROM pgmq.q_embedding_jobs

  WHERE enqueued_at < NOW() - (older_than_hours || ' hours')::INTERVAL;

  

  PERFORM pgmq.delete('embedding_jobs', msg_id)

  FROM pgmq.q_embedding_jobs

  WHERE enqueued_at < NOW() - (older_than_hours || ' hours')::INTERVAL;

  

  RETURN deleted_count;

END;

$$;


ALTER FUNCTION util.cleanup_old_embedding_jobs(older_than_hours integer) OWNER TO postgres;

--
-- Name: invoke_edge_function(text, jsonb, integer); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.invoke_edge_function(function_name text, body jsonb, timeout_milliseconds integer DEFAULT 300000) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
DECLARE
  project_url_val TEXT;
  service_role_key_val TEXT;
  supabase_url TEXT;
  edge_function_url TEXT;
BEGIN
  -- Get project URL from Vault
  SELECT decrypted_secret INTO project_url_val
  FROM vault.decrypted_secrets
  WHERE vault.decrypted_secrets.name = 'project_url' -- Qualifying the column "name"
  LIMIT 1;

  IF project_url_val IS NULL THEN
    RAISE EXCEPTION 'Secret "project_url" not found in Vault.';
  END IF;

  -- Get Service Role Key from Vault
  SELECT decrypted_secret INTO service_role_key_val
  FROM vault.decrypted_secrets
  WHERE vault.decrypted_secrets.name = 'service_role_key' -- Qualifying the column "name"
  LIMIT 1; -- Added LIMIT 1 for safety in case of duplicates

  IF service_role_key_val IS NULL THEN
    RAISE EXCEPTION 'Secret "service_role_key" not found in Vault.';
  END IF;

  supabase_url := project_url_val;
  edge_function_url := supabase_url || '/functions/v1/' || function_name; -- Using the renamed parameter

  RAISE NOTICE 'Invoking Edge Function: %', edge_function_url;
  RAISE NOTICE 'With payload: %', body::text;

  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key_val,
      'apikey', service_role_key_val
    ),
    body := body,
    timeout_milliseconds := timeout_milliseconds
  );
END;
$$;


ALTER FUNCTION util.invoke_edge_function(function_name text, body jsonb, timeout_milliseconds integer) OWNER TO postgres;

--
-- Name: process_embedding_jobs(integer); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.process_embedding_jobs(batch_size integer DEFAULT 10) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$

DECLARE

  job RECORD;

  jobs JSONB[] := '{}';

  job_ids BIGINT[] := '{}';

BEGIN

  FOR job IN 

    SELECT * FROM pgmq.read('embedding_jobs', batch_size, 30)

  LOOP

    jobs := jobs || job.message;

    job_ids := job_ids || job.msg_id;

  END LOOP;

  

  IF array_length(jobs, 1) > 0 THEN

    PERFORM util.invoke_edge_function(

      'generate-embeddings',

      jsonb_build_object('jobs', jobs)

    );

    

    PERFORM pgmq.delete('embedding_jobs', job_id)

    FROM unnest(job_ids) AS job_id;

  END IF;

END;

$$;


ALTER FUNCTION util.process_embedding_jobs(batch_size integer) OWNER TO postgres;

--
-- Name: project_url(); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.project_url() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
DECLARE
  secret_value TEXT;
BEGIN
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE vault.decrypted_secrets.name = 'project_url' -- CORRIGIDO
  LIMIT 1;

  IF secret_value IS NULL THEN
    RAISE EXCEPTION 'Segredo "project_url" n├úo encontrado no Vault na fun├º├úo util.project_url().';
  END IF;

  RETURN secret_value;
END;
$$;


ALTER FUNCTION util.project_url() OWNER TO postgres;

--
-- Name: queue_embeddings(); Type: FUNCTION; Schema: util; Owner: postgres
--

CREATE FUNCTION util.queue_embeddings() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$ 

DECLARE

  content_function TEXT := TG_ARGV[0];

  embedding_column TEXT := TG_ARGV[1];

BEGIN

  PERFORM pgmq.send(

    queue_name => 'embedding_jobs',

    msg => jsonb_build_object(

      'id', NEW.id,

      'schema', TG_TABLE_SCHEMA,

      'table', TG_TABLE_NAME,

      'contentFunction', content_function,

      'embeddingColumn', embedding_column

    )

  );

  

  RETURN NEW;

END;

$$;


ALTER FUNCTION util.queue_embeddings() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: a_embedding_jobs; Type: TABLE; Schema: pgmq; Owner: postgres
--

CREATE TABLE pgmq.a_embedding_jobs (
    msg_id bigint NOT NULL,
    read_ct integer DEFAULT 0 NOT NULL,
    enqueued_at timestamp with time zone DEFAULT now() NOT NULL,
    archived_at timestamp with time zone DEFAULT now() NOT NULL,
    vt timestamp with time zone NOT NULL,
    message jsonb
);


ALTER TABLE pgmq.a_embedding_jobs OWNER TO postgres;

--
-- Name: q_embedding_jobs; Type: TABLE; Schema: pgmq; Owner: postgres
--

CREATE TABLE pgmq.q_embedding_jobs (
    msg_id bigint NOT NULL,
    read_ct integer DEFAULT 0 NOT NULL,
    enqueued_at timestamp with time zone DEFAULT now() NOT NULL,
    vt timestamp with time zone NOT NULL,
    message jsonb
);


ALTER TABLE pgmq.q_embedding_jobs OWNER TO postgres;

--
-- Name: q_embedding_jobs_msg_id_seq; Type: SEQUENCE; Schema: pgmq; Owner: postgres
--

ALTER TABLE pgmq.q_embedding_jobs ALTER COLUMN msg_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME pgmq.q_embedding_jobs_msg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: analytics_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    post_id uuid,
    metric_type character varying(100) NOT NULL,
    metric_value numeric(15,2) NOT NULL,
    metric_date date NOT NULL,
    additional_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.analytics_metrics OWNER TO postgres;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    bio text,
    avatar_url text,
    social_links jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    parent_id uuid,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.blog_categories OWNER TO postgres;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blogs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    domain character varying(255) NOT NULL,
    niche text,
    description text,
    settings jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.blogs OWNER TO postgres;

--
-- Name: post_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_categories (
    post_id uuid NOT NULL,
    category_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.post_categories OWNER TO postgres;

--
-- Name: blog_categories_usage; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.blog_categories_usage AS
 SELECT b.name AS blog_name,
    bc.name AS category_name,
    count(pc.post_id) AS posts_count,
    bc.is_active,
    bc.sort_order
   FROM ((public.blogs b
     JOIN public.blog_categories bc ON ((b.id = bc.blog_id)))
     LEFT JOIN public.post_categories pc ON (((bc.name)::text = (pc.category_name)::text)))
  WHERE (b.is_active = true)
  GROUP BY b.id, b.name, bc.id, bc.name, bc.is_active, bc.sort_order
  ORDER BY b.name, (count(pc.post_id)) DESC;


ALTER VIEW public.blog_categories_usage OWNER TO postgres;

--
-- Name: blog_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    color character varying(7),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.blog_tags OWNER TO postgres;

--
-- Name: post_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_tags (
    post_id uuid NOT NULL,
    tag_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.post_tags OWNER TO postgres;

--
-- Name: blog_tags_usage; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.blog_tags_usage AS
 SELECT b.name AS blog_name,
    bt.name AS tag_name,
    count(pt.post_id) AS posts_count,
    bt.is_active,
    bt.color
   FROM ((public.blogs b
     JOIN public.blog_tags bt ON ((b.id = bt.blog_id)))
     LEFT JOIN public.post_tags pt ON (((bt.name)::text = (pt.tag_name)::text)))
  WHERE (b.is_active = true)
  GROUP BY b.id, b.name, bt.id, bt.name, bt.is_active, bt.color
  ORDER BY b.name, (count(pt.post_id)) DESC;


ALTER VIEW public.blog_tags_usage OWNER TO postgres;

--
-- Name: keyword_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keyword_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    keyword_variation_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.keyword_categories OWNER TO postgres;

--
-- Name: keyword_variations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keyword_variations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    main_keyword_id uuid NOT NULL,
    keyword text NOT NULL,
    variation_type character varying(50),
    msv integer,
    kw_difficulty integer,
    cpc numeric(10,2),
    competition character varying(50),
    search_intent character varying(50),
    embedding extensions.vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    answer text,
    CONSTRAINT keyword_variations_competition_check CHECK (((competition)::text = ANY ((ARRAY['LOW'::character varying, 'MEDIUM'::character varying, 'HIGH'::character varying])::text[]))),
    CONSTRAINT keyword_variations_kw_difficulty_check CHECK (((kw_difficulty >= 0) AND (kw_difficulty <= 100))),
    CONSTRAINT keyword_variations_search_intent_check CHECK (((search_intent)::text = ANY ((ARRAY['informational'::character varying, 'navigational'::character varying, 'commercial'::character varying, 'transactional'::character varying])::text[]))),
    CONSTRAINT keyword_variations_variation_type_check CHECK (((variation_type)::text = ANY ((ARRAY['related'::character varying, 'suggestion'::character varying, 'idea'::character varying, 'autocomplete'::character varying, 'subtopic'::character varying, 'people_also_ask'::character varying])::text[])))
);


ALTER TABLE public.keyword_variations OWNER TO postgres;

--
-- Name: main_keywords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.main_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    keyword character varying(500) NOT NULL,
    msv integer,
    kw_difficulty integer,
    cpc numeric(10,2),
    competition character varying(50),
    search_intent character varying(50),
    is_used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    location character varying DEFAULT 'Brazil'::character varying,
    language character varying DEFAULT 'Portuguese'::character varying,
    "Search_limit" smallint DEFAULT '100'::smallint,
    CONSTRAINT main_keywords_competition_check CHECK (((competition)::text = ANY ((ARRAY['LOW'::character varying, 'MEDIUM'::character varying, 'HIGH'::character varying])::text[]))),
    CONSTRAINT main_keywords_kw_difficulty_check CHECK (((kw_difficulty >= 0) AND (kw_difficulty <= 100))),
    CONSTRAINT main_keywords_search_intent_check CHECK (((search_intent)::text = ANY ((ARRAY['informational'::character varying, 'navigational'::character varying, 'commercial'::character varying, 'transactional'::character varying])::text[])))
);


ALTER TABLE public.main_keywords OWNER TO postgres;

--
-- Name: categorized_keywords; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.categorized_keywords AS
 SELECT kc.id AS category_id,
    kc.name AS category_name,
    kc.description AS category_description,
    kc.created_at AS category_created_at,
    kc.updated_at AS category_updated_at,
    b.id AS blog_id,
    b.name AS blog_name,
    b.niche AS blog_niche,
    mk.id AS main_keyword_id,
    mk.keyword AS main_keyword,
    mk.msv AS main_keyword_msv,
    mk.kw_difficulty AS main_keyword_difficulty,
    mk.cpc AS main_keyword_cpc,
    mk.competition AS main_keyword_competition,
    mk.search_intent AS main_keyword_search_intent,
    mk.is_used AS main_keyword_is_used,
    kv.id AS keyword_variation_id,
    kv.keyword AS variation_keyword,
    kv.variation_type,
    kv.msv,
    kv.kw_difficulty,
    kv.cpc,
    kv.competition,
    kv.search_intent,
    kv.created_at AS variation_created_at,
    kv.updated_at AS variation_updated_at
   FROM (((public.keyword_categories kc
     JOIN public.blogs b ON ((kc.blog_id = b.id)))
     JOIN public.keyword_variations kv ON ((kc.keyword_variation_id = kv.id)))
     JOIN public.main_keywords mk ON ((kv.main_keyword_id = mk.id)))
  WHERE ((kc.keyword_variation_id IS NOT NULL) AND (b.is_active = true));


ALTER VIEW public.categorized_keywords OWNER TO postgres;

--
-- Name: cluster_keywords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cluster_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cluster_id uuid NOT NULL,
    keyword_variations text NOT NULL,
    embedding extensions.vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.cluster_keywords OWNER TO postgres;

--
-- Name: keyword_clusters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keyword_clusters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    cluster_name character varying(255) NOT NULL,
    description text,
    cluster_score numeric(5,2),
    embedding extensions.vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    main_keyword_id uuid
);


ALTER TABLE public.keyword_clusters OWNER TO postgres;

--
-- Name: content_cluster_opportunities; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.content_cluster_opportunities AS
 WITH cluster_keywords AS (
         SELECT ck_1.cluster_id,
            ck_1.keyword_variations,
            ck_1.embedding,
            kc.cluster_name,
            kc.description AS cluster_description,
            kc.blog_id,
            kc.main_keyword_id,
            b.name AS blog_name,
            mk.keyword AS main_keyword,
            mk.msv AS main_keyword_msv,
            mk.kw_difficulty AS main_keyword_difficulty,
            mk.search_intent AS main_keyword_intent,
            mk.cpc AS main_keyword_cpc
           FROM (((public.cluster_keywords ck_1
             JOIN public.keyword_clusters kc ON ((ck_1.cluster_id = kc.id)))
             JOIN public.blogs b ON ((kc.blog_id = b.id)))
             LEFT JOIN public.main_keywords mk ON ((kc.main_keyword_id = mk.id)))
        ), cluster_metrics AS (
         SELECT cluster_keywords.cluster_id,
            count(*) AS total_keywords,
            avg(cluster_keywords.main_keyword_msv) AS avg_msv,
            avg(cluster_keywords.main_keyword_difficulty) AS avg_difficulty,
            avg(cluster_keywords.main_keyword_cpc) AS avg_cpc,
            mode() WITHIN GROUP (ORDER BY cluster_keywords.main_keyword_intent) AS dominant_intent,
            array_agg(DISTINCT cluster_keywords.keyword_variations) AS all_variations
           FROM cluster_keywords
          GROUP BY cluster_keywords.cluster_id
        )
 SELECT ck.cluster_id,
    ck.keyword_variations,
    ck.embedding,
    ck.cluster_name,
    ck.cluster_description,
    ck.blog_id,
    ck.main_keyword_id,
    ck.blog_name,
    ck.main_keyword,
    ck.main_keyword_msv,
    ck.main_keyword_difficulty,
    ck.main_keyword_intent,
    ck.main_keyword_cpc,
    cm.total_keywords,
    cm.avg_msv,
    cm.avg_difficulty,
    cm.avg_cpc,
    cm.dominant_intent,
    cm.all_variations,
    public.calculate_keyword_opportunity_score((cm.avg_msv)::integer, (cm.avg_difficulty)::integer, cm.avg_cpc) AS opportunity_score
   FROM (cluster_keywords ck
     JOIN cluster_metrics cm ON ((ck.cluster_id = cm.cluster_id)))
  ORDER BY (public.calculate_keyword_opportunity_score((cm.avg_msv)::integer, (cm.avg_difficulty)::integer, cm.avg_cpc)) DESC;


ALTER VIEW public.content_cluster_opportunities OWNER TO postgres;

--
-- Name: content_cluster_opportunities_no_embedding; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.content_cluster_opportunities_no_embedding AS
 SELECT cluster_id,
    cluster_name,
    cluster_description,
    blog_id,
    blog_name,
    main_keyword_id,
    main_keyword,
    main_keyword_msv,
    main_keyword_difficulty,
    main_keyword_intent,
    main_keyword_cpc,
    keyword_variations,
    total_keywords,
    avg_msv,
    avg_difficulty,
    avg_cpc,
    dominant_intent,
    all_variations,
    opportunity_score
   FROM public.content_cluster_opportunities
  ORDER BY opportunity_score DESC;


ALTER VIEW public.content_cluster_opportunities_no_embedding OWNER TO postgres;

--
-- Name: content_opportunities_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_opportunities_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    category_id uuid NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    priority_score numeric(5,2) DEFAULT 0,
    estimated_traffic integer DEFAULT 0,
    difficulty_score numeric(5,2) DEFAULT 0,
    status character varying(50) DEFAULT 'identified'::character varying,
    target_keywords text[],
    content_outline text,
    notes text,
    assigned_to uuid,
    due_date date,
    embedding extensions.vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    main_keyword_id uuid,
    CONSTRAINT content_opportunities_categories_status_check CHECK (((status)::text = ANY ((ARRAY['identified'::character varying, 'planned'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.content_opportunities_categories OWNER TO postgres;

--
-- Name: COLUMN content_opportunities_categories.main_keyword_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.content_opportunities_categories.main_keyword_id IS 'Refer├¬ncia para a keyword principal desta oportunidade de conte├║do';


--
-- Name: content_opportunities_clusters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_opportunities_clusters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    cluster_id uuid NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    content_type character varying(100) DEFAULT 'article'::character varying,
    priority_score numeric(5,2) DEFAULT 0,
    estimated_traffic integer DEFAULT 0,
    difficulty_score numeric(5,2) DEFAULT 0,
    status character varying(50) DEFAULT 'identified'::character varying,
    target_keywords text[],
    content_outline text,
    notes text,
    assigned_to uuid,
    due_date date,
    embedding extensions.vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    final_title character varying,
    final_description text,
    main_keyword_id uuid,
    CONSTRAINT content_opportunities_clusters_status_check CHECK (((status)::text = ANY ((ARRAY['identified'::character varying, 'planned'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.content_opportunities_clusters OWNER TO postgres;

--
-- Name: content_opportunities_clusters_expanded; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.content_opportunities_clusters_expanded AS
 SELECT coc.id,
    coc.title,
    coc.description,
    coc.content_type,
    coc.target_keywords,
    coc.content_outline,
    coc.notes,
    coc.status,
    coc.estimated_traffic,
    coc.difficulty_score,
    coc.priority_score,
    coc.due_date,
    coc.created_at,
    coc.updated_at,
    b.id AS blog_id,
    b.name AS blog_name,
    b.niche AS blog_niche,
    kc.id AS cluster_id,
    kc.cluster_name,
    kc.description AS cluster_description,
    kc.main_keyword_id,
    a.id AS author_id,
    a.name AS author_name,
    a.email AS author_email,
    mk.keyword AS main_keyword,
    mk.msv AS main_keyword_msv,
    mk.kw_difficulty AS main_keyword_difficulty,
    mk.search_intent AS main_keyword_intent
   FROM ((((public.content_opportunities_clusters coc
     LEFT JOIN public.blogs b ON ((coc.blog_id = b.id)))
     LEFT JOIN public.keyword_clusters kc ON ((coc.cluster_id = kc.id)))
     LEFT JOIN public.authors a ON ((coc.assigned_to = a.id)))
     LEFT JOIN public.main_keywords mk ON ((kc.main_keyword_id = mk.id)))
  ORDER BY coc.priority_score DESC NULLS LAST, coc.created_at DESC;


ALTER VIEW public.content_opportunities_clusters_expanded OWNER TO postgres;

--
-- Name: content_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    author_id uuid NOT NULL,
    title character varying(500) NOT NULL,
    slug character varying(500),
    excerpt text,
    content text,
    status character varying(50) DEFAULT 'draft'::character varying,
    featured_image_url text,
    seo_title character varying(500),
    seo_description text,
    focus_keyword character varying(255),
    readability_score integer,
    seo_score integer,
    word_count integer DEFAULT 0,
    reading_time integer DEFAULT 0,
    scheduled_at timestamp with time zone,
    published_at timestamp with time zone,
    embedding extensions.vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    wordpress_post_id smallint,
    CONSTRAINT content_posts_readability_score_check CHECK (((readability_score >= 0) AND (readability_score <= 100))),
    CONSTRAINT content_posts_seo_score_check CHECK (((seo_score >= 0) AND (seo_score <= 100))),
    CONSTRAINT content_posts_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'review'::character varying, 'scheduled'::character varying, 'published'::character varying, 'archived'::character varying])::text[])))
);


ALTER TABLE public.content_posts OWNER TO postgres;

--
-- Name: document_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_metadata (
    id text NOT NULL,
    title text,
    url text,
    created_at timestamp without time zone DEFAULT now(),
    schema text
);


ALTER TABLE public.document_metadata OWNER TO postgres;

--
-- Name: document_rows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_rows (
    id integer NOT NULL,
    dataset_id text,
    row_data jsonb
);


ALTER TABLE public.document_rows OWNER TO postgres;

--
-- Name: document_rows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.document_rows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_rows_id_seq OWNER TO postgres;

--
-- Name: document_rows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.document_rows_id_seq OWNED BY public.document_rows.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id bigint NOT NULL,
    content text,
    metadata jsonb,
    embedding extensions.vector(1536)
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: executive_dashboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.executive_dashboard AS
 SELECT b.name AS blog_name,
    b.niche,
    count(DISTINCT mk.id) AS total_keywords,
    count(DISTINCT kv.id) AS total_variations,
    count(DISTINCT kc.id) AS total_clusters,
    count(DISTINCT cp.id) AS total_posts,
    count(DISTINCT
        CASE
            WHEN ((cp.status)::text = 'published'::text) THEN cp.id
            ELSE NULL::uuid
        END) AS published_posts,
    count(DISTINCT
        CASE
            WHEN (mk.is_used = true) THEN mk.id
            ELSE NULL::uuid
        END) AS used_keywords,
    round(avg(mk.msv), 0) AS avg_msv,
    round(avg(mk.kw_difficulty), 1) AS avg_difficulty,
    round(avg(mk.cpc), 2) AS avg_cpc,
    (count(DISTINCT coc.id) + count(DISTINCT cocat.id)) AS total_opportunities
   FROM ((((((public.blogs b
     LEFT JOIN public.main_keywords mk ON ((b.id = mk.blog_id)))
     LEFT JOIN public.keyword_variations kv ON ((mk.id = kv.main_keyword_id)))
     LEFT JOIN public.keyword_clusters kc ON ((b.id = kc.blog_id)))
     LEFT JOIN public.content_posts cp ON ((b.id = cp.blog_id)))
     LEFT JOIN public.content_opportunities_clusters coc ON ((b.id = coc.blog_id)))
     LEFT JOIN public.content_opportunities_categories cocat ON ((b.id = cocat.blog_id)))
  WHERE (b.is_active = true)
  GROUP BY b.id, b.name, b.niche
  ORDER BY (count(DISTINCT mk.id)) DESC;


ALTER VIEW public.executive_dashboard OWNER TO postgres;

--
-- Name: serp_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.serp_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    main_keyword_id uuid NOT NULL,
    "position" integer NOT NULL,
    title text,
    url text,
    description text,
    domain character varying(255),
    type character varying(50) DEFAULT 'organic'::character varying,
    features jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT serp_results_position_check CHECK (("position" > 0))
);


ALTER TABLE public.serp_results OWNER TO postgres;

--
-- Name: keyword_categorization_metrics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.keyword_categorization_metrics AS
 SELECT kv.id AS keyword_variation_id,
    kv.main_keyword_id,
    mk.blog_id,
    b.name AS blog_name,
    b.niche AS blog_niche,
    mk.keyword AS main_keyword,
    kv.keyword AS variation_keyword,
    kv.variation_type,
    kv.search_intent,
    kv.msv,
    kv.kw_difficulty,
    kv.competition,
    kv.cpc,
        CASE
            WHEN (kv.msv IS NULL) THEN 'unknown'::text
            WHEN public.is_special_msv(kv.msv) THEN 'special'::text
            WHEN (kv.msv = 0) THEN 'zero'::text
            WHEN ((kv.msv > 0) AND (kv.msv <= 50)) THEN 'very_low'::text
            WHEN ((kv.msv > 50) AND (kv.msv <= 500)) THEN 'low'::text
            WHEN ((kv.msv > 500) AND (kv.msv <= 5000)) THEN 'medium'::text
            ELSE 'high'::text
        END AS msv_level,
        CASE
            WHEN (kv.kw_difficulty IS NULL) THEN 'unknown'::text
            WHEN ((kv.kw_difficulty >= 0) AND (kv.kw_difficulty <= 20)) THEN 'very_low'::text
            WHEN ((kv.kw_difficulty > 20) AND (kv.kw_difficulty <= 40)) THEN 'low'::text
            WHEN ((kv.kw_difficulty > 40) AND (kv.kw_difficulty <= 60)) THEN 'medium'::text
            WHEN ((kv.kw_difficulty > 60) AND (kv.kw_difficulty <= 80)) THEN 'high'::text
            ELSE 'very_high'::text
        END AS difficulty_level,
        CASE
            WHEN ((kv.cpc IS NULL) OR (kv.cpc <= (0)::numeric)) THEN 'none'::text
            WHEN ((kv.cpc > (0)::numeric) AND (kv.cpc <= (1)::numeric)) THEN 'low'::text
            WHEN ((kv.cpc > (1)::numeric) AND (kv.cpc <= (10)::numeric)) THEN 'medium'::text
            WHEN ((kv.cpc > (10)::numeric) AND (kv.cpc <= (50)::numeric)) THEN 'high'::text
            ELSE 'very_high'::text
        END AS cpc_level,
    public.calculate_keyword_opportunity_score(kv.msv, kv.kw_difficulty, kv.cpc, kv.competition, kv.search_intent) AS opportunity_score,
    ( SELECT count(*) AS count
           FROM (public.keyword_variations kv2
             JOIN public.main_keywords mk2 ON ((kv2.main_keyword_id = mk2.id)))
          WHERE (mk2.blog_id = mk.blog_id)) AS total_blog_keywords,
    ( SELECT count(*) AS count
           FROM public.keyword_variations kv3
          WHERE (kv3.main_keyword_id = mk.id)) AS total_variations,
    ( SELECT count(*) AS count
           FROM public.keyword_variations kv3
          WHERE ((kv3.main_keyword_id = mk.id) AND ((kv3.search_intent)::text = 'transactional'::text))) AS transactional_variations,
    ( SELECT count(*) AS count
           FROM public.keyword_variations kv3
          WHERE ((kv3.main_keyword_id = mk.id) AND ((kv3.search_intent)::text = 'commercial'::text))) AS commercial_variations,
    ( SELECT count(*) AS count
           FROM public.serp_results sr
          WHERE (sr.main_keyword_id = mk.id)) AS serp_results_count,
    ( SELECT avg(sr."position") AS avg
           FROM public.serp_results sr
          WHERE (sr.main_keyword_id = mk.id)) AS avg_serp_position,
    ( SELECT count(*) AS count
           FROM public.serp_results sr
          WHERE ((sr.main_keyword_id = mk.id) AND (sr."position" <= 10))) AS top_10_serp_count,
    kv.created_at,
        CASE
            WHEN mk.is_used THEN 'used'::text
            ELSE 'available'::text
        END AS main_keyword_status
   FROM ((public.keyword_variations kv
     JOIN public.main_keywords mk ON ((kv.main_keyword_id = mk.id)))
     JOIN public.blogs b ON ((mk.blog_id = b.id)))
  WHERE ((b.is_active = true) AND (NOT mk.is_used));


ALTER VIEW public.keyword_categorization_metrics OWNER TO postgres;

--
-- Name: keyword_clustering_metrics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.keyword_clustering_metrics AS
 WITH keyword_stats AS (
         SELECT keyword_variations.main_keyword_id,
            count(*) AS variation_count,
            count(DISTINCT keyword_variations.search_intent) AS distinct_intents,
            mode() WITHIN GROUP (ORDER BY keyword_variations.search_intent) AS dominant_intent,
            avg(keyword_variations.msv) AS avg_msv,
            avg(keyword_variations.kw_difficulty) AS avg_difficulty,
            avg(keyword_variations.cpc) AS avg_cpc
           FROM public.keyword_variations
          GROUP BY keyword_variations.main_keyword_id
        )
 SELECT kv.id AS variation_id,
    kv.main_keyword_id,
    mk.blog_id,
    kv.keyword AS variation_keyword,
    mk.keyword AS main_keyword,
    kv.variation_type,
    kv.search_intent,
    kv.msv,
    kv.kw_difficulty,
    kv.cpc,
    kv.competition,
    kv.embedding,
    ks.variation_count,
    ks.distinct_intents,
    ks.dominant_intent,
    ks.avg_msv,
    ks.avg_difficulty,
    ks.avg_cpc,
        CASE
            WHEN (kv.msv IS NULL) THEN 'unknown'::text
            WHEN (kv.msv = 0) THEN 'zero'::text
            WHEN ((kv.msv > 0) AND (kv.msv <= 50)) THEN 'very_low'::text
            WHEN ((kv.msv > 50) AND (kv.msv <= 500)) THEN 'low'::text
            WHEN ((kv.msv > 500) AND (kv.msv <= 5000)) THEN 'medium'::text
            ELSE 'high'::text
        END AS msv_level,
        CASE
            WHEN (kv.kw_difficulty IS NULL) THEN 'unknown'::text
            WHEN ((kv.kw_difficulty >= 0) AND (kv.kw_difficulty <= 20)) THEN 'very_low'::text
            WHEN ((kv.kw_difficulty > 20) AND (kv.kw_difficulty <= 40)) THEN 'low'::text
            WHEN ((kv.kw_difficulty > 40) AND (kv.kw_difficulty <= 60)) THEN 'medium'::text
            WHEN ((kv.kw_difficulty > 60) AND (kv.kw_difficulty <= 80)) THEN 'high'::text
            ELSE 'very_high'::text
        END AS difficulty_level,
        CASE
            WHEN ((kv.cpc IS NULL) OR (kv.cpc <= (0)::numeric)) THEN 'none'::text
            WHEN ((kv.cpc > (0)::numeric) AND (kv.cpc <= (1)::numeric)) THEN 'low'::text
            WHEN ((kv.cpc > (1)::numeric) AND (kv.cpc <= (10)::numeric)) THEN 'medium'::text
            WHEN ((kv.cpc > (10)::numeric) AND (kv.cpc <= (50)::numeric)) THEN 'high'::text
            ELSE 'very_high'::text
        END AS cpc_level,
    kc.id AS current_cluster_id,
    kv.created_at,
    kv.updated_at
   FROM (((public.keyword_variations kv
     JOIN public.main_keywords mk ON ((kv.main_keyword_id = mk.id)))
     LEFT JOIN keyword_stats ks ON ((kv.main_keyword_id = ks.main_keyword_id)))
     LEFT JOIN public.keyword_clusters kc ON ((kv.main_keyword_id = kc.main_keyword_id)));


ALTER VIEW public.keyword_clustering_metrics OWNER TO postgres;

--
-- Name: keyword_metrics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.keyword_metrics AS
 WITH categorized_variations AS (
         SELECT DISTINCT keyword_categories.keyword_variation_id
           FROM public.keyword_categories
          WHERE (keyword_categories.keyword_variation_id IS NOT NULL)
        )
 SELECT kv.id AS keyword_variation_id,
    kv.main_keyword_id,
    mk.blog_id,
    b.name AS blog_name,
    b.niche AS blog_niche,
    mk.keyword AS main_keyword,
    kv.keyword AS variation_keyword,
    kv.variation_type,
    kv.search_intent,
    kv.msv,
    kv.kw_difficulty,
    kv.competition,
    kv.cpc,
    kc.id AS category_id,
    kc.name AS category_name,
    kc.description AS category_description,
        CASE
            WHEN (kv.msv IS NULL) THEN 'unknown'::text
            WHEN public.is_special_msv(kv.msv) THEN 'special'::text
            WHEN (kv.msv = 0) THEN 'zero'::text
            WHEN ((kv.msv > 0) AND (kv.msv <= 50)) THEN 'very_low'::text
            WHEN ((kv.msv > 50) AND (kv.msv <= 500)) THEN 'low'::text
            WHEN ((kv.msv > 500) AND (kv.msv <= 5000)) THEN 'medium'::text
            ELSE 'high'::text
        END AS msv_level,
        CASE
            WHEN (kv.kw_difficulty IS NULL) THEN 'unknown'::text
            WHEN ((kv.kw_difficulty >= 0) AND (kv.kw_difficulty <= 20)) THEN 'very_low'::text
            WHEN ((kv.kw_difficulty > 20) AND (kv.kw_difficulty <= 40)) THEN 'low'::text
            WHEN ((kv.kw_difficulty > 40) AND (kv.kw_difficulty <= 60)) THEN 'medium'::text
            WHEN ((kv.kw_difficulty > 60) AND (kv.kw_difficulty <= 80)) THEN 'high'::text
            ELSE 'very_high'::text
        END AS difficulty_level,
        CASE
            WHEN ((kv.cpc IS NULL) OR (kv.cpc <= (0)::numeric)) THEN 'none'::text
            WHEN ((kv.cpc > (0)::numeric) AND (kv.cpc <= (1)::numeric)) THEN 'low'::text
            WHEN ((kv.cpc > (1)::numeric) AND (kv.cpc <= (10)::numeric)) THEN 'medium'::text
            WHEN ((kv.cpc > (10)::numeric) AND (kv.cpc <= (50)::numeric)) THEN 'high'::text
            ELSE 'very_high'::text
        END AS cpc_level,
    public.calculate_keyword_opportunity_score(kv.msv, kv.kw_difficulty, kv.cpc, kv.competition, kv.search_intent) AS opportunity_score,
    ( SELECT count(*) AS count
           FROM (public.keyword_variations kv2
             JOIN public.main_keywords mk2 ON ((kv2.main_keyword_id = mk2.id)))
          WHERE (mk2.blog_id = mk.blog_id)) AS total_blog_keywords,
    ( SELECT count(*) AS count
           FROM public.keyword_variations kv3
          WHERE (kv3.main_keyword_id = mk.id)) AS total_variations,
    ( SELECT count(*) AS count
           FROM public.keyword_variations kv3
          WHERE ((kv3.main_keyword_id = mk.id) AND ((kv3.search_intent)::text = 'transactional'::text))) AS transactional_variations,
    ( SELECT count(*) AS count
           FROM public.keyword_variations kv3
          WHERE ((kv3.main_keyword_id = mk.id) AND ((kv3.search_intent)::text = 'commercial'::text))) AS commercial_variations,
    ( SELECT count(*) AS count
           FROM public.serp_results sr
          WHERE (sr.main_keyword_id = mk.id)) AS serp_results_count,
    ( SELECT avg(sr."position") AS avg
           FROM public.serp_results sr
          WHERE (sr.main_keyword_id = mk.id)) AS avg_serp_position,
    ( SELECT count(*) AS count
           FROM public.serp_results sr
          WHERE ((sr.main_keyword_id = mk.id) AND (sr."position" <= 10))) AS top_10_serp_count,
    kv.created_at AS variation_created_at,
    kv.updated_at AS variation_updated_at,
        CASE
            WHEN mk.is_used THEN 'used'::text
            ELSE 'available'::text
        END AS main_keyword_status,
        CASE
            WHEN (cv.keyword_variation_id IS NOT NULL) THEN true
            ELSE false
        END AS is_categorized
   FROM ((((public.keyword_variations kv
     JOIN public.main_keywords mk ON ((kv.main_keyword_id = mk.id)))
     JOIN public.blogs b ON ((mk.blog_id = b.id)))
     LEFT JOIN categorized_variations cv ON ((kv.id = cv.keyword_variation_id)))
     LEFT JOIN public.keyword_categories kc ON ((kv.id = kc.keyword_variation_id)))
  WHERE (b.is_active = true);


ALTER VIEW public.keyword_metrics OWNER TO postgres;

--
-- Name: keyword_opportunities; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.keyword_opportunities AS
 SELECT b.name AS blog_name,
    mk.keyword,
    mk.msv,
    mk.kw_difficulty,
    mk.cpc,
    mk.competition,
    mk.search_intent,
    mk.is_used,
    public.calculate_keyword_opportunity_score(mk.msv, mk.kw_difficulty, mk.cpc) AS opportunity_score,
    count(kv.id) AS variations_count,
    count(sr.id) AS serp_results_count,
        CASE
            WHEN ((mk.msv >= 1000) AND (mk.kw_difficulty <= 30)) THEN 'High Priority'::text
            WHEN ((mk.msv >= 500) AND (mk.kw_difficulty <= 50)) THEN 'Medium Priority'::text
            ELSE 'Low Priority'::text
        END AS priority_level
   FROM (((public.blogs b
     JOIN public.main_keywords mk ON ((b.id = mk.blog_id)))
     LEFT JOIN public.keyword_variations kv ON ((mk.id = kv.main_keyword_id)))
     LEFT JOIN public.serp_results sr ON ((mk.id = sr.main_keyword_id)))
  WHERE (b.is_active = true)
  GROUP BY b.id, b.name, mk.id, mk.keyword, mk.msv, mk.kw_difficulty, mk.cpc, mk.competition, mk.search_intent, mk.is_used
  ORDER BY (public.calculate_keyword_opportunity_score(mk.msv, mk.kw_difficulty, mk.cpc)) DESC, mk.msv DESC;


ALTER VIEW public.keyword_opportunities OWNER TO postgres;

--
-- Name: media_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    blog_id uuid NOT NULL,
    post_id uuid,
    filename text,
    original_filename text,
    file_path text,
    file_url text,
    file_type text,
    file_size bigint,
    mime_type text,
    alt_text text,
    caption text,
    metadata jsonb DEFAULT '{}'::jsonb,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.media_assets OWNER TO postgres;

--
-- Name: niche_overview; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.niche_overview AS
 SELECT niche,
    total_blogs,
    total_keywords,
    avg_msv,
    avg_difficulty,
    avg_cpc
   FROM public.get_niche_statistics() get_niche_statistics(niche, total_blogs, total_keywords, avg_msv, avg_difficulty, avg_cpc);


ALTER VIEW public.niche_overview OWNER TO postgres;

--
-- Name: post_meta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_meta (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    meta_key character varying(255) NOT NULL,
    meta_value text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.post_meta OWNER TO postgres;

--
-- Name: production_pipeline; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.production_pipeline AS
 SELECT b.name AS blog_name,
    cp.title,
    cp.status,
    cp.word_count,
    cp.seo_score,
    cp.readability_score,
    a.name AS author_name,
    cp.scheduled_at,
    cp.published_at,
    cp.created_at,
        CASE
            WHEN ((cp.status)::text = 'draft'::text) THEN EXTRACT(days FROM (now() - cp.created_at))
            WHEN ((cp.status)::text = 'review'::text) THEN EXTRACT(days FROM (now() - cp.updated_at))
            WHEN ((cp.status)::text = 'scheduled'::text) THEN EXTRACT(days FROM (cp.scheduled_at - now()))
            ELSE NULL::numeric
        END AS days_in_status
   FROM ((public.blogs b
     JOIN public.content_posts cp ON ((b.id = cp.blog_id)))
     JOIN public.authors a ON ((cp.author_id = a.id)))
  WHERE (b.is_active = true)
  ORDER BY
        CASE cp.status
            WHEN 'review'::text THEN 1
            WHEN 'scheduled'::text THEN 2
            WHEN 'draft'::text THEN 3
            ELSE 4
        END, cp.updated_at DESC;


ALTER VIEW public.production_pipeline OWNER TO postgres;

--
-- Name: serp_competition_analysis; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.serp_competition_analysis AS
 SELECT b.name AS blog_name,
    mk.keyword,
    mk.msv,
    mk.kw_difficulty,
    count(sr.id) AS total_results,
    count(DISTINCT sr.domain) AS unique_domains,
    round(avg(sr."position"), 1) AS avg_position,
    count(
        CASE
            WHEN (sr."position" <= 3) THEN 1
            ELSE NULL::integer
        END) AS top_3_results,
    count(
        CASE
            WHEN (sr."position" <= 10) THEN 1
            ELSE NULL::integer
        END) AS top_10_results,
    top_d.top_domains
   FROM (((public.blogs b
     JOIN public.main_keywords mk ON ((b.id = mk.blog_id)))
     LEFT JOIN public.serp_results sr ON ((mk.id = sr.main_keyword_id)))
     LEFT JOIN LATERAL ( SELECT array_agg(sub.domain ORDER BY sub.min_pos) AS top_domains
           FROM ( SELECT s.domain,
                    min(s."position") AS min_pos
                   FROM public.serp_results s
                  WHERE ((s.main_keyword_id = mk.id) AND (s.domain IS NOT NULL))
                  GROUP BY s.domain
                  ORDER BY (min(s."position"))
                 LIMIT 5) sub) top_d ON (true))
  WHERE (b.is_active = true)
  GROUP BY b.id, b.name, mk.id, mk.keyword, mk.msv, mk.kw_difficulty, top_d.top_domains
 HAVING (count(sr.id) > 0)
  ORDER BY mk.msv DESC, mk.kw_difficulty;


ALTER VIEW public.serp_competition_analysis OWNER TO postgres;

--
-- Name: vw_content_opportunities_clusters_with_keywords; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_content_opportunities_clusters_with_keywords AS
 SELECT c.id,
    c.blog_id,
    c.cluster_id,
    c.title,
    c.description,
    c.content_type,
    c.priority_score,
    c.estimated_traffic,
    c.difficulty_score,
    c.status,
    c.target_keywords,
    c.content_outline,
    c.notes,
    c.assigned_to,
    c.due_date,
    c.created_at,
    c.updated_at,
    c.final_title,
    c.final_description,
    c.main_keyword_id,
    mk.keyword AS main_keyword,
    mk.msv AS keyword_search_volume,
    mk.kw_difficulty AS keyword_difficulty,
    mk.cpc AS keyword_cpc,
    mk.competition AS keyword_competition,
        CASE
            WHEN (mk.id IS NOT NULL) THEN round(((((
            CASE
                WHEN ((c.title)::text ~~* (('%'::text || (mk.keyword)::text) || '%'::text)) THEN 40
                WHEN ((mk.keyword)::text ~~* (('%'::text || (c.title)::text) || '%'::text)) THEN 35
                ELSE 20
            END +
            CASE
                WHEN (mk.msv >= 100000) THEN 30
                WHEN (mk.msv >= 50000) THEN 25
                WHEN (mk.msv >= 10000) THEN 20
                WHEN (mk.msv >= 1000) THEN 15
                ELSE 10
            END) +
            CASE
                WHEN (mk.kw_difficulty <= 20) THEN 20
                WHEN (mk.kw_difficulty <= 40) THEN 15
                WHEN (mk.kw_difficulty <= 60) THEN 10
                WHEN (mk.kw_difficulty <= 80) THEN 5
                ELSE 2
            END) +
            CASE
                WHEN ((c.target_keywords IS NOT NULL) AND (EXISTS ( SELECT 1
                   FROM unnest(c.target_keywords) tk(tk)
                  WHERE ((tk.tk ~~* (('%'::text || (mk.keyword)::text) || '%'::text)) OR ((mk.keyword)::text ~~* (('%'::text || tk.tk) || '%'::text)))))) THEN 10
                ELSE 0
            END))::numeric, 1)
            ELSE (0)::numeric
        END AS keyword_match_score,
        CASE
            WHEN ((mk.msv IS NOT NULL) AND (mk.kw_difficulty IS NOT NULL)) THEN round((((mk.msv * (100 - mk.kw_difficulty)))::numeric / 100.0))
            ELSE (c.estimated_traffic)::numeric
        END AS calculated_traffic_potential,
        CASE
            WHEN ((mk.msv >= 50000) AND (mk.kw_difficulty <= 40)) THEN 'Alta'::text
            WHEN ((mk.msv >= 10000) AND (mk.kw_difficulty <= 60)) THEN 'M├®dia'::text
            WHEN (mk.msv >= 1000) THEN 'Baixa'::text
            ELSE 'Muito Baixa'::text
        END AS priority_classification
   FROM (public.content_opportunities_clusters c
     LEFT JOIN public.main_keywords mk ON ((c.main_keyword_id = mk.id)));


ALTER VIEW public.vw_content_opportunities_clusters_with_keywords OWNER TO postgres;

--
-- Name: vw_content_opportunities_with_keywords; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_content_opportunities_with_keywords AS
 SELECT coc.id,
    coc.blog_id,
    coc.category_id,
    coc.title,
    coc.description,
    coc.priority_score,
    coc.estimated_traffic,
    coc.difficulty_score,
    coc.status,
    coc.target_keywords,
    coc.content_outline,
    coc.notes,
    coc.assigned_to,
    coc.due_date,
    coc.created_at,
    coc.updated_at,
    coc.main_keyword_id,
    mk.keyword AS main_keyword,
    mk.msv AS keyword_msv,
    mk.kw_difficulty AS keyword_difficulty,
    mk.cpc AS keyword_cpc,
    mk.competition AS keyword_competition,
    mk.search_intent AS keyword_search_intent,
    mk.is_used AS keyword_is_used,
    b.name AS blog_name,
    kc.name AS category_name,
    a.name AS assigned_author_name,
    a.email AS assigned_author_email,
        CASE
            WHEN ((mk.msv IS NOT NULL) AND (mk.kw_difficulty IS NOT NULL)) THEN ((LEAST(((mk.msv)::numeric / 1000.0), (100)::numeric) + ((100 - mk.kw_difficulty))::numeric) / (2)::numeric)
            WHEN (mk.msv IS NOT NULL) THEN LEAST(((mk.msv)::numeric / 1000.0), (100)::numeric)
            WHEN (mk.kw_difficulty IS NOT NULL) THEN ((100 - mk.kw_difficulty))::numeric
            ELSE (50)::numeric
        END AS calculated_opportunity_score
   FROM ((((public.content_opportunities_categories coc
     LEFT JOIN public.main_keywords mk ON ((coc.main_keyword_id = mk.id)))
     LEFT JOIN public.blogs b ON ((coc.blog_id = b.id)))
     LEFT JOIN public.keyword_categories kc ON ((coc.category_id = kc.id)))
     LEFT JOIN public.authors a ON ((coc.assigned_to = a.id)));


ALTER VIEW public.vw_content_opportunities_with_keywords OWNER TO postgres;

--
-- Name: vw_identified_content_opportunities; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_identified_content_opportunities AS
 SELECT coc.id AS opportunity_id,
    coc.blog_id,
    coc.category_id,
    coc.title,
    coc.description,
    coc.priority_score,
    coc.estimated_traffic,
    coc.difficulty_score,
    coc.status,
    coc.content_outline,
    coc.notes,
    coc.assigned_to,
    coc.due_date,
    coc.created_at AS opportunity_created_at,
    coc.updated_at AS opportunity_updated_at,
    kv.keyword,
    kv.id AS keyword_variation_id,
    kv.main_keyword_id,
    kv.variation_type,
    kv.msv,
    kv.kw_difficulty,
    kv.cpc,
    kv.competition,
    kv.search_intent,
    kv.answer,
    kc.name AS category_name,
    kc.description AS category_description
   FROM ((public.content_opportunities_categories coc
     JOIN public.keyword_categories kc ON ((coc.category_id = kc.id)))
     JOIN public.keyword_variations kv ON ((kc.keyword_variation_id = kv.id)))
  WHERE ((coc.status)::text = 'identified'::text);


ALTER VIEW public.vw_identified_content_opportunities OWNER TO postgres;

--
-- Name: VIEW vw_identified_content_opportunities; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.vw_identified_content_opportunities IS 'View que combina oportunidades de conte├║do (status "identified") com suas keyword_variations associadas. A jun├º├úo ├® feita atrav├®s da tabela intermedi├íria "keyword_categories".';


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: document_rows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_rows ALTER COLUMN id SET DEFAULT nextval('public.document_rows_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: a_embedding_jobs a_embedding_jobs_pkey; Type: CONSTRAINT; Schema: pgmq; Owner: postgres
--

ALTER TABLE ONLY pgmq.a_embedding_jobs
    ADD CONSTRAINT a_embedding_jobs_pkey PRIMARY KEY (msg_id);


--
-- Name: q_embedding_jobs q_embedding_jobs_pkey; Type: CONSTRAINT; Schema: pgmq; Owner: postgres
--

ALTER TABLE ONLY pgmq.q_embedding_jobs
    ADD CONSTRAINT q_embedding_jobs_pkey PRIMARY KEY (msg_id);


--
-- Name: analytics_metrics analytics_metrics_blog_id_post_id_metric_type_metric_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_metrics
    ADD CONSTRAINT analytics_metrics_blog_id_post_id_metric_type_metric_date_key UNIQUE (blog_id, post_id, metric_type, metric_date);


--
-- Name: analytics_metrics analytics_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_metrics
    ADD CONSTRAINT analytics_metrics_pkey PRIMARY KEY (id);


--
-- Name: authors authors_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_email_key UNIQUE (email);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_blog_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_blog_id_name_key UNIQUE (blog_id, name);


--
-- Name: blog_categories blog_categories_blog_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_blog_id_slug_key UNIQUE (blog_id, slug);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_tags blog_tags_blog_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_tags
    ADD CONSTRAINT blog_tags_blog_id_name_key UNIQUE (blog_id, name);


--
-- Name: blog_tags blog_tags_blog_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_tags
    ADD CONSTRAINT blog_tags_blog_id_slug_key UNIQUE (blog_id, slug);


--
-- Name: blog_tags blog_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_tags
    ADD CONSTRAINT blog_tags_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_domain_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_domain_key UNIQUE (domain);


--
-- Name: blogs blogs_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_name_key UNIQUE (name);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: cluster_keywords cluster_keywords_cluster_id_keyword_variations_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cluster_keywords
    ADD CONSTRAINT cluster_keywords_cluster_id_keyword_variations_key UNIQUE (cluster_id, keyword_variations);


--
-- Name: cluster_keywords cluster_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cluster_keywords
    ADD CONSTRAINT cluster_keywords_pkey PRIMARY KEY (id);


--
-- Name: content_opportunities_categories content_opportunities_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_categories
    ADD CONSTRAINT content_opportunities_categories_pkey PRIMARY KEY (id);


--
-- Name: content_opportunities_clusters content_opportunities_clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_clusters
    ADD CONSTRAINT content_opportunities_clusters_pkey PRIMARY KEY (id);


--
-- Name: content_posts content_posts_blog_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_posts
    ADD CONSTRAINT content_posts_blog_id_slug_key UNIQUE (blog_id, slug);


--
-- Name: content_posts content_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_posts
    ADD CONSTRAINT content_posts_pkey PRIMARY KEY (id);


--
-- Name: document_metadata document_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_metadata
    ADD CONSTRAINT document_metadata_pkey PRIMARY KEY (id);


--
-- Name: document_rows document_rows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_rows
    ADD CONSTRAINT document_rows_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: keyword_categories keyword_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_categories
    ADD CONSTRAINT keyword_categories_pkey PRIMARY KEY (id);


--
-- Name: keyword_clusters keyword_clusters_blog_id_cluster_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_clusters
    ADD CONSTRAINT keyword_clusters_blog_id_cluster_name_key UNIQUE (blog_id, cluster_name);


--
-- Name: keyword_clusters keyword_clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_clusters
    ADD CONSTRAINT keyword_clusters_pkey PRIMARY KEY (id);


--
-- Name: keyword_variations keyword_variations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_variations
    ADD CONSTRAINT keyword_variations_pkey PRIMARY KEY (id);


--
-- Name: main_keywords main_keywords_blog_id_keyword_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.main_keywords
    ADD CONSTRAINT main_keywords_blog_id_keyword_key UNIQUE (blog_id, keyword);


--
-- Name: main_keywords main_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.main_keywords
    ADD CONSTRAINT main_keywords_pkey PRIMARY KEY (id);


--
-- Name: media_assets media_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_pkey PRIMARY KEY (id);


--
-- Name: post_categories post_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_pkey PRIMARY KEY (post_id, category_name);


--
-- Name: post_meta post_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_meta
    ADD CONSTRAINT post_meta_pkey PRIMARY KEY (id);


--
-- Name: post_meta post_meta_post_id_meta_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_meta
    ADD CONSTRAINT post_meta_post_id_meta_key_key UNIQUE (post_id, meta_key);


--
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_name);


--
-- Name: serp_results serp_results_main_keyword_id_position_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serp_results
    ADD CONSTRAINT serp_results_main_keyword_id_position_type_key UNIQUE (main_keyword_id, "position", type);


--
-- Name: serp_results serp_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serp_results
    ADD CONSTRAINT serp_results_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: archived_at_idx_embedding_jobs; Type: INDEX; Schema: pgmq; Owner: postgres
--

CREATE INDEX archived_at_idx_embedding_jobs ON pgmq.a_embedding_jobs USING btree (archived_at);


--
-- Name: q_embedding_jobs_vt_idx; Type: INDEX; Schema: pgmq; Owner: postgres
--

CREATE INDEX q_embedding_jobs_vt_idx ON pgmq.q_embedding_jobs USING btree (vt);


--
-- Name: idx_analytics_blog_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_blog_date ON public.analytics_metrics USING btree (blog_id, metric_date DESC);


--
-- Name: idx_analytics_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_blog_id ON public.analytics_metrics USING btree (blog_id);


--
-- Name: idx_analytics_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_date ON public.analytics_metrics USING btree (metric_date DESC);


--
-- Name: idx_analytics_post_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_post_date ON public.analytics_metrics USING btree (post_id, metric_date DESC);


--
-- Name: idx_analytics_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_post_id ON public.analytics_metrics USING btree (post_id);


--
-- Name: idx_analytics_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_type ON public.analytics_metrics USING btree (metric_type);


--
-- Name: idx_authors_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_authors_email ON public.authors USING btree (email);


--
-- Name: idx_authors_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_authors_is_active ON public.authors USING btree (is_active);


--
-- Name: idx_blog_categories_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_categories_blog_id ON public.blog_categories USING btree (blog_id);


--
-- Name: idx_blog_categories_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_categories_is_active ON public.blog_categories USING btree (is_active);


--
-- Name: idx_blog_categories_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_categories_parent_id ON public.blog_categories USING btree (parent_id);


--
-- Name: idx_blog_categories_sort_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_categories_sort_order ON public.blog_categories USING btree (sort_order);


--
-- Name: idx_blog_tags_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_tags_blog_id ON public.blog_tags USING btree (blog_id);


--
-- Name: idx_blog_tags_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_tags_is_active ON public.blog_tags USING btree (is_active);


--
-- Name: idx_blogs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blogs_created_at ON public.blogs USING btree (created_at);


--
-- Name: idx_blogs_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blogs_is_active ON public.blogs USING btree (is_active);


--
-- Name: idx_blogs_niche; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blogs_niche ON public.blogs USING btree (niche);


--
-- Name: idx_cluster_keywords_cluster; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cluster_keywords_cluster ON public.cluster_keywords USING btree (cluster_id);


--
-- Name: idx_cluster_keywords_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cluster_keywords_keyword ON public.cluster_keywords USING btree (keyword_variations);


--
-- Name: idx_coc_blog_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coc_blog_status ON public.content_opportunities_categories USING btree (blog_id, status);


--
-- Name: idx_coc_priority_score; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coc_priority_score ON public.content_opportunities_categories USING btree (priority_score DESC);


--
-- Name: idx_content_opportunities_clusters_main_keyword_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opportunities_clusters_main_keyword_id ON public.content_opportunities_clusters USING btree (main_keyword_id);


--
-- Name: idx_content_opportunities_main_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opportunities_main_keyword ON public.content_opportunities_categories USING btree (main_keyword_id);


--
-- Name: idx_content_opps_categories_assigned_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_categories_assigned_to ON public.content_opportunities_categories USING btree (assigned_to);


--
-- Name: idx_content_opps_categories_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_categories_blog_id ON public.content_opportunities_categories USING btree (blog_id);


--
-- Name: idx_content_opps_categories_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_categories_category_id ON public.content_opportunities_categories USING btree (category_id);


--
-- Name: idx_content_opps_categories_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_categories_due_date ON public.content_opportunities_categories USING btree (due_date);


--
-- Name: idx_content_opps_categories_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_categories_embedding ON public.content_opportunities_categories USING hnsw (embedding extensions.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_content_opps_categories_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_categories_status ON public.content_opportunities_categories USING btree (status);


--
-- Name: idx_content_opps_clusters_assigned_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_assigned_to ON public.content_opportunities_clusters USING btree (assigned_to);


--
-- Name: idx_content_opps_clusters_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_blog_id ON public.content_opportunities_clusters USING btree (blog_id);


--
-- Name: idx_content_opps_clusters_cluster_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_cluster_id ON public.content_opportunities_clusters USING btree (cluster_id);


--
-- Name: idx_content_opps_clusters_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_due_date ON public.content_opportunities_clusters USING btree (due_date);


--
-- Name: idx_content_opps_clusters_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_embedding ON public.content_opportunities_clusters USING hnsw (embedding extensions.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_content_opps_clusters_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_priority ON public.content_opportunities_clusters USING btree (priority_score DESC);


--
-- Name: idx_content_opps_clusters_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_opps_clusters_status ON public.content_opportunities_clusters USING btree (status);


--
-- Name: idx_content_posts_author_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_author_id ON public.content_posts USING btree (author_id);


--
-- Name: idx_content_posts_author_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_author_status ON public.content_posts USING btree (author_id, status);


--
-- Name: idx_content_posts_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_blog_id ON public.content_posts USING btree (blog_id);


--
-- Name: idx_content_posts_blog_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_blog_published ON public.content_posts USING btree (blog_id, published_at DESC);


--
-- Name: idx_content_posts_blog_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_blog_status ON public.content_posts USING btree (blog_id, status);


--
-- Name: idx_content_posts_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_embedding ON public.content_posts USING hnsw (embedding extensions.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_content_posts_focus_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_focus_keyword ON public.content_posts USING btree (focus_keyword);


--
-- Name: idx_content_posts_published_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_published_at ON public.content_posts USING btree (published_at DESC);


--
-- Name: idx_content_posts_scheduled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_scheduled_at ON public.content_posts USING btree (scheduled_at);


--
-- Name: idx_content_posts_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_slug ON public.content_posts USING btree (slug);


--
-- Name: idx_content_posts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_posts_status ON public.content_posts USING btree (status);


--
-- Name: idx_keyword_categories_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_categories_blog_id ON public.keyword_categories USING btree (blog_id);


--
-- Name: idx_keyword_categories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_categories_name ON public.keyword_categories USING btree (name);


--
-- Name: idx_keyword_categories_variation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_categories_variation_id ON public.keyword_categories USING btree (keyword_variation_id);


--
-- Name: idx_keyword_clusters_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_clusters_blog_id ON public.keyword_clusters USING btree (blog_id);


--
-- Name: idx_keyword_clusters_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_clusters_embedding ON public.keyword_clusters USING hnsw (embedding extensions.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_keyword_clusters_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_clusters_name ON public.keyword_clusters USING btree (cluster_name);


--
-- Name: idx_keyword_clusters_score; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_clusters_score ON public.keyword_clusters USING btree (cluster_score DESC);


--
-- Name: idx_keyword_variations_competition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_competition ON public.keyword_variations USING btree (competition);


--
-- Name: idx_keyword_variations_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_embedding ON public.keyword_variations USING hnsw (embedding extensions.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_keyword_variations_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_keyword ON public.keyword_variations USING btree (keyword);


--
-- Name: idx_keyword_variations_main_keyword_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_main_keyword_id ON public.keyword_variations USING btree (main_keyword_id);


--
-- Name: idx_keyword_variations_main_msv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_main_msv ON public.keyword_variations USING btree (main_keyword_id, msv DESC);


--
-- Name: idx_keyword_variations_main_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_main_type ON public.keyword_variations USING btree (main_keyword_id, variation_type);


--
-- Name: idx_keyword_variations_msv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_msv ON public.keyword_variations USING btree (msv DESC);


--
-- Name: idx_keyword_variations_search_intent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_search_intent ON public.keyword_variations USING btree (search_intent);


--
-- Name: idx_keyword_variations_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keyword_variations_type ON public.keyword_variations USING btree (variation_type);


--
-- Name: idx_main_keywords_blog_difficulty; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_blog_difficulty ON public.main_keywords USING btree (blog_id, kw_difficulty);


--
-- Name: idx_main_keywords_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_blog_id ON public.main_keywords USING btree (blog_id);


--
-- Name: idx_main_keywords_blog_msv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_blog_msv ON public.main_keywords USING btree (blog_id, msv DESC);


--
-- Name: idx_main_keywords_blog_used; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_blog_used ON public.main_keywords USING btree (blog_id, is_used);


--
-- Name: idx_main_keywords_competition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_competition ON public.main_keywords USING btree (competition);


--
-- Name: idx_main_keywords_difficulty; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_difficulty ON public.main_keywords USING btree (kw_difficulty);


--
-- Name: idx_main_keywords_is_used; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_is_used ON public.main_keywords USING btree (is_used);


--
-- Name: idx_main_keywords_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_keyword ON public.main_keywords USING btree (keyword);


--
-- Name: idx_main_keywords_msv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_msv ON public.main_keywords USING btree (msv DESC);


--
-- Name: idx_main_keywords_search_intent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_main_keywords_search_intent ON public.main_keywords USING btree (search_intent);


--
-- Name: idx_media_assets_blog_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_assets_blog_id ON public.media_assets USING btree (blog_id);


--
-- Name: idx_media_assets_file_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_assets_file_type ON public.media_assets USING btree (file_type);


--
-- Name: idx_media_assets_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_assets_is_featured ON public.media_assets USING btree (is_featured);


--
-- Name: idx_media_assets_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_assets_post_id ON public.media_assets USING btree (post_id);


--
-- Name: idx_post_categories_category_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_categories_category_name ON public.post_categories USING btree (category_name);


--
-- Name: idx_post_categories_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_categories_post_id ON public.post_categories USING btree (post_id);


--
-- Name: idx_post_meta_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_meta_key ON public.post_meta USING btree (meta_key);


--
-- Name: idx_post_meta_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_meta_post_id ON public.post_meta USING btree (post_id);


--
-- Name: idx_post_tags_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_tags_post_id ON public.post_tags USING btree (post_id);


--
-- Name: idx_post_tags_tag_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_post_tags_tag_name ON public.post_tags USING btree (tag_name);


--
-- Name: idx_serp_results_domain; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_serp_results_domain ON public.serp_results USING btree (domain);


--
-- Name: idx_serp_results_keyword_position; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_serp_results_keyword_position ON public.serp_results USING btree (main_keyword_id, "position");


--
-- Name: idx_serp_results_main_keyword_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_serp_results_main_keyword_id ON public.serp_results USING btree (main_keyword_id);


--
-- Name: idx_serp_results_position; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_serp_results_position ON public.serp_results USING btree ("position");


--
-- Name: idx_serp_results_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_serp_results_type ON public.serp_results USING btree (type);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: authors trigger_authors_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_authors_updated_at BEFORE UPDATE ON public.authors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_opportunities_categories trigger_auto_assign_keyword; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auto_assign_keyword BEFORE INSERT ON public.content_opportunities_categories FOR EACH ROW EXECUTE FUNCTION public.auto_assign_keyword_to_opportunity();


--
-- Name: content_opportunities_clusters trigger_auto_assign_keyword_to_cluster; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auto_assign_keyword_to_cluster BEFORE INSERT ON public.content_opportunities_clusters FOR EACH ROW EXECUTE FUNCTION public.auto_assign_keyword_to_cluster();


--
-- Name: blog_categories trigger_blog_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_tags trigger_blog_tags_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_blog_tags_updated_at BEFORE UPDATE ON public.blog_tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blogs trigger_blogs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cluster_keywords trigger_cluster_keywords_embedding_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_cluster_keywords_embedding_insert AFTER INSERT ON public.cluster_keywords FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('cluster_keywords_content', 'embedding');


--
-- Name: cluster_keywords trigger_cluster_keywords_embedding_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_cluster_keywords_embedding_update AFTER UPDATE OF keyword_variations ON public.cluster_keywords FOR EACH ROW WHEN ((old.keyword_variations IS DISTINCT FROM new.keyword_variations)) EXECUTE FUNCTION util.queue_embeddings('cluster_keywords_content', 'embedding');


--
-- Name: cluster_keywords trigger_cluster_keywords_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_cluster_keywords_updated_at BEFORE UPDATE ON public.cluster_keywords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_opportunities_categories trigger_content_opportunities_categories_embedding_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_opportunities_categories_embedding_insert BEFORE INSERT ON public.content_opportunities_categories FOR EACH ROW WHEN ((new.embedding IS NULL)) EXECUTE FUNCTION util.queue_embeddings('content_opportunity_category_content', 'embedding');


--
-- Name: content_opportunities_categories trigger_content_opportunities_categories_embedding_update_queue; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_opportunities_categories_embedding_update_queue BEFORE UPDATE ON public.content_opportunities_categories FOR EACH ROW WHEN ((((old.title)::text IS DISTINCT FROM (new.title)::text) OR (old.description IS DISTINCT FROM new.description))) EXECUTE FUNCTION util.queue_embeddings('content_opportunity_category_content', 'embedding');


--
-- Name: content_opportunities_categories trigger_content_opportunities_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_opportunities_categories_updated_at BEFORE UPDATE ON public.content_opportunities_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_opportunities_clusters trigger_content_opportunities_clusters_embedding_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_opportunities_clusters_embedding_insert AFTER INSERT ON public.content_opportunities_clusters FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('content_opportunity_cluster_content', 'embedding');


--
-- Name: content_opportunities_clusters trigger_content_opportunities_clusters_embedding_update_queue; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_opportunities_clusters_embedding_update_queue AFTER UPDATE OF title, description, content_type, target_keywords ON public.content_opportunities_clusters FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION util.queue_embeddings('content_opportunity_cluster_content', 'embedding');


--
-- Name: content_opportunities_clusters trigger_content_opportunities_clusters_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_opportunities_clusters_updated_at BEFORE UPDATE ON public.content_opportunities_clusters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_posts trigger_content_posts_embedding_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_posts_embedding_insert AFTER INSERT ON public.content_posts FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('public.content_post_content', 'embedding');


--
-- Name: content_posts trigger_content_posts_embedding_update_queue; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_posts_embedding_update_queue AFTER UPDATE ON public.content_posts FOR EACH ROW WHEN ((((old.title)::text IS DISTINCT FROM (new.title)::text) OR (old.content IS DISTINCT FROM new.content) OR (old.excerpt IS DISTINCT FROM new.excerpt))) EXECUTE FUNCTION util.queue_embeddings('public.content_post_content', 'embedding');


--
-- Name: content_posts trigger_content_posts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_content_posts_updated_at BEFORE UPDATE ON public.content_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: main_keywords trigger_delete_related_data_keywords; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_delete_related_data_keywords BEFORE DELETE ON public.main_keywords FOR EACH ROW EXECUTE FUNCTION public.delete_related_data();


--
-- Name: content_posts trigger_delete_related_data_posts; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_delete_related_data_posts BEFORE DELETE ON public.content_posts FOR EACH ROW EXECUTE FUNCTION public.delete_related_data();


--
-- Name: keyword_categories trigger_keyword_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_categories_updated_at BEFORE UPDATE ON public.keyword_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: keyword_clusters trigger_keyword_clusters_embedding_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_clusters_embedding_insert AFTER INSERT ON public.keyword_clusters FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('public.keyword_cluster_content', 'embedding');


--
-- Name: keyword_clusters trigger_keyword_clusters_embedding_update_queue; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_clusters_embedding_update_queue AFTER UPDATE ON public.keyword_clusters FOR EACH ROW WHEN ((((old.cluster_name)::text IS DISTINCT FROM (new.cluster_name)::text) OR (old.description IS DISTINCT FROM new.description))) EXECUTE FUNCTION util.queue_embeddings('public.keyword_cluster_content', 'embedding');


--
-- Name: keyword_clusters trigger_keyword_clusters_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_clusters_updated_at BEFORE UPDATE ON public.keyword_clusters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: keyword_variations trigger_keyword_variations_embedding_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_variations_embedding_insert AFTER INSERT ON public.keyword_variations FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('util.keyword_variation_content', 'embedding');


--
-- Name: keyword_variations trigger_keyword_variations_embedding_update_queue; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_variations_embedding_update_queue AFTER UPDATE ON public.keyword_variations FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION util.queue_embeddings('util.keyword_variation_content', 'embedding');


--
-- Name: keyword_variations trigger_keyword_variations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_keyword_variations_updated_at BEFORE UPDATE ON public.keyword_variations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: main_keywords trigger_main_keywords_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_main_keywords_updated_at BEFORE UPDATE ON public.main_keywords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_posts trigger_mark_keyword_as_used; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_mark_keyword_as_used AFTER INSERT OR UPDATE ON public.content_posts FOR EACH ROW EXECUTE FUNCTION public.mark_keyword_as_used();


--
-- Name: media_assets trigger_media_assets_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_media_assets_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: post_meta trigger_post_meta_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_post_meta_updated_at BEFORE UPDATE ON public.post_meta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: serp_results trigger_serp_results_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_serp_results_updated_at BEFORE UPDATE ON public.serp_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: keyword_variations trigger_validate_keyword_variations; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_validate_keyword_variations BEFORE INSERT OR UPDATE ON public.keyword_variations FOR EACH ROW EXECUTE FUNCTION public.validate_keyword_variations();


--
-- Name: post_categories trigger_validate_post_categories; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_validate_post_categories BEFORE INSERT OR UPDATE ON public.post_categories FOR EACH ROW EXECUTE FUNCTION public.validate_post_categories();


--
-- Name: post_tags trigger_validate_post_tags; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_validate_post_tags BEFORE INSERT OR UPDATE ON public.post_tags FOR EACH ROW EXECUTE FUNCTION public.validate_post_tags();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: analytics_metrics analytics_metrics_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_metrics
    ADD CONSTRAINT analytics_metrics_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: analytics_metrics analytics_metrics_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_metrics
    ADD CONSTRAINT analytics_metrics_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.content_posts(id) ON DELETE CASCADE;


--
-- Name: blog_categories blog_categories_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: blog_categories blog_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.blog_categories(id) ON DELETE SET NULL;


--
-- Name: blog_tags blog_tags_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_tags
    ADD CONSTRAINT blog_tags_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: cluster_keywords cluster_keywords_cluster_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cluster_keywords
    ADD CONSTRAINT cluster_keywords_cluster_id_fkey FOREIGN KEY (cluster_id) REFERENCES public.keyword_clusters(id) ON DELETE CASCADE;


--
-- Name: content_opportunities_categories content_opportunities_categories_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_categories
    ADD CONSTRAINT content_opportunities_categories_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: content_opportunities_categories content_opportunities_categories_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_categories
    ADD CONSTRAINT content_opportunities_categories_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: content_opportunities_categories content_opportunities_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_categories
    ADD CONSTRAINT content_opportunities_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.keyword_categories(id) ON DELETE CASCADE;


--
-- Name: content_opportunities_categories content_opportunities_categories_main_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_categories
    ADD CONSTRAINT content_opportunities_categories_main_keyword_id_fkey FOREIGN KEY (main_keyword_id) REFERENCES public.main_keywords(id);


--
-- Name: content_opportunities_clusters content_opportunities_clusters_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_clusters
    ADD CONSTRAINT content_opportunities_clusters_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: content_opportunities_clusters content_opportunities_clusters_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_clusters
    ADD CONSTRAINT content_opportunities_clusters_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: content_opportunities_clusters content_opportunities_clusters_cluster_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_clusters
    ADD CONSTRAINT content_opportunities_clusters_cluster_id_fkey FOREIGN KEY (cluster_id) REFERENCES public.keyword_clusters(id) ON DELETE CASCADE;


--
-- Name: content_opportunities_clusters content_opportunities_clusters_main_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_opportunities_clusters
    ADD CONSTRAINT content_opportunities_clusters_main_keyword_id_fkey FOREIGN KEY (main_keyword_id) REFERENCES public.main_keywords(id);


--
-- Name: content_posts content_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_posts
    ADD CONSTRAINT content_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE RESTRICT;


--
-- Name: content_posts content_posts_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_posts
    ADD CONSTRAINT content_posts_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: document_rows document_rows_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_rows
    ADD CONSTRAINT document_rows_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.document_metadata(id);


--
-- Name: keyword_categories keyword_categories_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_categories
    ADD CONSTRAINT keyword_categories_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: keyword_categories keyword_categories_keyword_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_categories
    ADD CONSTRAINT keyword_categories_keyword_variation_id_fkey FOREIGN KEY (keyword_variation_id) REFERENCES public.keyword_variations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: keyword_clusters keyword_clusters_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_clusters
    ADD CONSTRAINT keyword_clusters_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: keyword_clusters keyword_clusters_main_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_clusters
    ADD CONSTRAINT keyword_clusters_main_keyword_id_fkey FOREIGN KEY (main_keyword_id) REFERENCES public.main_keywords(id) ON DELETE SET NULL;


--
-- Name: keyword_variations keyword_variations_main_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keyword_variations
    ADD CONSTRAINT keyword_variations_main_keyword_id_fkey FOREIGN KEY (main_keyword_id) REFERENCES public.main_keywords(id) ON DELETE CASCADE;


--
-- Name: main_keywords main_keywords_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.main_keywords
    ADD CONSTRAINT main_keywords_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: media_assets media_assets_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: media_assets media_assets_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.content_posts(id) ON DELETE SET NULL;


--
-- Name: post_categories post_categories_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.content_posts(id) ON DELETE CASCADE;


--
-- Name: post_meta post_meta_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_meta
    ADD CONSTRAINT post_meta_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.content_posts(id) ON DELETE CASCADE;


--
-- Name: post_tags post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.content_posts(id) ON DELETE CASCADE;


--
-- Name: serp_results serp_results_main_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serp_results
    ADD CONSTRAINT serp_results_main_keyword_id_fkey FOREIGN KEY (main_keyword_id) REFERENCES public.main_keywords(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: main_keywords Permitir atualiza├º├úo de palavras-chave principais para usu├ír; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir atualiza├º├úo de palavras-chave principais para usu├ír" ON public.main_keywords FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = blog_id)) WITH CHECK (true);


--
-- Name: main_keywords Permitir exclus├úo de palavras-chave principais para usu├írios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir exclus├úo de palavras-chave principais para usu├írios" ON public.main_keywords FOR DELETE TO authenticated USING (true);


--
-- Name: main_keywords Permitir exclus├úo de palavras-chave principais para usu├írios ; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir exclus├úo de palavras-chave principais para usu├írios " ON public.main_keywords FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = blog_id));


--
-- Name: main_keywords Permitir inser├º├úo de palavras-chave principais para usu├írios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir inser├º├úo de palavras-chave principais para usu├írios" ON public.main_keywords FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: main_keywords Permitir sele├º├úo de palavras-chave principais para usu├írios ; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir sele├º├úo de palavras-chave principais para usu├írios " ON public.main_keywords FOR SELECT TO authenticated USING (true);


--
-- Name: main_keywords; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.main_keywords ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA util; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA util TO service_role;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION ghstore_in(cstring); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_in(cstring) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_out(extensions.ghstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_out(extensions.ghstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_in(cstring, oid, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_in(cstring, oid, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_out(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_out(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_recv(internal, oid, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_recv(internal, oid, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_send(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_send(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_typmod_in(cstring[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_typmod_in(cstring[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_in(cstring); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_in(cstring) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_out(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_out(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_recv(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_recv(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_send(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_send(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_subscript_handler(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_subscript_handler(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_in(cstring, oid, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_in(cstring, oid, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_out(extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_out(extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_recv(internal, oid, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_recv(internal, oid, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_send(extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_send(extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_typmod_in(cstring[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_typmod_in(cstring[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_in(cstring, oid, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_in(cstring, oid, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_out(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_out(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_recv(internal, oid, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_recv(internal, oid, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_send(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_send(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_typmod_in(cstring[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_typmod_in(cstring[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gtrgm_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO service_role;


--
-- Name: FUNCTION gtrgm_out(public.gtrgm); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO service_role;


--
-- Name: FUNCTION array_to_halfvec(real[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_halfvec(real[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_sparsevec(real[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_sparsevec(real[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_vector(real[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_vector(real[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_halfvec(double precision[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_halfvec(double precision[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_sparsevec(double precision[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_sparsevec(double precision[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_vector(double precision[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_vector(double precision[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_halfvec(integer[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_halfvec(integer[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_sparsevec(integer[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_sparsevec(integer[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_vector(integer[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_vector(integer[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_halfvec(numeric[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_halfvec(numeric[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_sparsevec(numeric[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_sparsevec(numeric[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION array_to_vector(numeric[], integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.array_to_vector(numeric[], integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore(text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore(text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_to_float4(extensions.halfvec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_to_float4(extensions.halfvec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec(extensions.halfvec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec(extensions.halfvec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_to_sparsevec(extensions.halfvec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_to_sparsevec(extensions.halfvec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_to_vector(extensions.halfvec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_to_vector(extensions.halfvec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_to_json(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_to_json(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_to_jsonb(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_to_jsonb(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_to_halfvec(extensions.sparsevec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_to_halfvec(extensions.sparsevec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec(extensions.sparsevec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec(extensions.sparsevec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_to_vector(extensions.sparsevec, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_to_vector(extensions.sparsevec, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_to_float4(extensions.vector, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_to_float4(extensions.vector, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_to_halfvec(extensions.vector, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_to_halfvec(extensions.vector, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_to_sparsevec(extensions.vector, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_to_sparsevec(extensions.vector, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector(extensions.vector, integer, boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector(extensions.vector, integer, boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION akeys(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.akeys(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION avals(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.avals(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION binary_quantize(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.binary_quantize(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION binary_quantize(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.binary_quantize(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION bytea_to_text(data bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.bytea_to_text(data bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION cosine_distance(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.cosine_distance(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION cosine_distance(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.cosine_distance(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION cosine_distance(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.cosine_distance(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION defined(extensions.hstore, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.defined(extensions.hstore, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION delete(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.delete(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION delete(extensions.hstore, text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.delete(extensions.hstore, text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION delete(extensions.hstore, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.delete(extensions.hstore, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION each(hs extensions.hstore, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.each(hs extensions.hstore, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION exist(extensions.hstore, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.exist(extensions.hstore, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION exists_all(extensions.hstore, text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.exists_all(extensions.hstore, text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION exists_any(extensions.hstore, text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.exists_any(extensions.hstore, text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION fetchval(extensions.hstore, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.fetchval(extensions.hstore, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION ghstore_compress(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_compress(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_consistent(internal, extensions.hstore, smallint, oid, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_consistent(internal, extensions.hstore, smallint, oid, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_decompress(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_decompress(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_options(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_options(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_penalty(internal, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_penalty(internal, internal, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_picksplit(internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_picksplit(internal, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_same(extensions.ghstore, extensions.ghstore, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_same(extensions.ghstore, extensions.ghstore, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ghstore_union(internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ghstore_union(internal, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gin_consistent_hstore(internal, smallint, extensions.hstore, integer, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_consistent_hstore(internal, smallint, extensions.hstore, integer, internal, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gin_extract_hstore(extensions.hstore, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_extract_hstore(extensions.hstore, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gin_extract_hstore_query(extensions.hstore, internal, smallint, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_extract_hstore_query(extensions.hstore, internal, smallint, internal, internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION halfvec_accum(double precision[], extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_accum(double precision[], extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_add(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_add(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_avg(double precision[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_avg(double precision[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_cmp(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_cmp(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_combine(double precision[], double precision[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_combine(double precision[], double precision[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_concat(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_concat(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_eq(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_eq(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_ge(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_ge(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_gt(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_gt(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_l2_squared_distance(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_l2_squared_distance(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_le(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_le(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_lt(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_lt(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_mul(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_mul(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_ne(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_ne(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_negative_inner_product(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_negative_inner_product(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_spherical_distance(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_spherical_distance(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION halfvec_sub(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.halfvec_sub(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hamming_distance(bit, bit); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hamming_distance(bit, bit) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION hnsw_bit_support(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hnsw_bit_support(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hnsw_halfvec_support(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hnsw_halfvec_support(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hnsw_sparsevec_support(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hnsw_sparsevec_support(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hnswhandler(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hnswhandler(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hs_concat(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hs_concat(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hs_contained(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hs_contained(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hs_contains(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hs_contains(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore(record); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore(record) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore(text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore(text[], text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_cmp(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_cmp(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_eq(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_eq(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_ge(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_ge(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_gt(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_gt(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_hash(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_hash(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_hash_extended(extensions.hstore, bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_hash_extended(extensions.hstore, bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_le(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_le(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_lt(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_lt(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_ne(extensions.hstore, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_ne(extensions.hstore, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_to_array(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_to_array(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_to_json_loose(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_to_json_loose(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_to_jsonb_loose(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_to_jsonb_loose(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_to_matrix(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_to_matrix(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hstore_version_diag(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hstore_version_diag(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http(request extensions.http_request); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http(request extensions.http_request) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_delete(uri character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_delete(uri character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_delete(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_delete(uri character varying, content character varying, content_type character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_get(uri character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_get(uri character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_get(uri character varying, data jsonb); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_get(uri character varying, data jsonb) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_head(uri character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_head(uri character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_header(field character varying, value character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_header(field character varying, value character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_list_curlopt(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_list_curlopt() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_patch(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_patch(uri character varying, content character varying, content_type character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_post(uri character varying, data jsonb); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_post(uri character varying, data jsonb) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_post(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_post(uri character varying, content character varying, content_type character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_put(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_put(uri character varying, content character varying, content_type character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_reset_curlopt(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_reset_curlopt() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION http_set_curlopt(curlopt character varying, value character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.http_set_curlopt(curlopt character varying, value character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION inner_product(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.inner_product(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION inner_product(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.inner_product(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION inner_product(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.inner_product(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION isdefined(extensions.hstore, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.isdefined(extensions.hstore, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION isexists(extensions.hstore, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.isexists(extensions.hstore, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ivfflat_bit_support(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ivfflat_bit_support(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ivfflat_halfvec_support(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ivfflat_halfvec_support(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION ivfflathandler(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.ivfflathandler(internal) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION jaccard_distance(bit, bit); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.jaccard_distance(bit, bit) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l1_distance(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l1_distance(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l1_distance(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l1_distance(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l1_distance(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l1_distance(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_distance(extensions.halfvec, extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_distance(extensions.halfvec, extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_distance(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_distance(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_distance(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_distance(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_norm(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_norm(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_norm(extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_norm(extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_normalize(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_normalize(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_normalize(extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_normalize(extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION l2_normalize(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.l2_normalize(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION populate_record(anyelement, extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.populate_record(anyelement, extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION skeys(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.skeys(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION slice(extensions.hstore, text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.slice(extensions.hstore, text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION slice_array(extensions.hstore, text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.slice_array(extensions.hstore, text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_cmp(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_cmp(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_eq(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_eq(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_ge(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_ge(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_gt(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_gt(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_l2_squared_distance(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_l2_squared_distance(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_le(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_le(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_lt(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_lt(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_ne(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_ne(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sparsevec_negative_inner_product(extensions.sparsevec, extensions.sparsevec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sparsevec_negative_inner_product(extensions.sparsevec, extensions.sparsevec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION subvector(extensions.halfvec, integer, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.subvector(extensions.halfvec, integer, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION subvector(extensions.vector, integer, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.subvector(extensions.vector, integer, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION svals(extensions.hstore); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.svals(extensions.hstore) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION tconvert(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.tconvert(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION text_to_bytea(data text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.text_to_bytea(data text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION urlencode(string bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.urlencode(string bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION urlencode(data jsonb); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.urlencode(data jsonb) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION urlencode(string character varying); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.urlencode(string character varying) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION vector_accum(double precision[], extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_accum(double precision[], extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_add(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_add(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_avg(double precision[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_avg(double precision[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_cmp(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_cmp(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_combine(double precision[], double precision[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_combine(double precision[], double precision[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_concat(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_concat(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_dims(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_dims(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_dims(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_dims(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_eq(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_eq(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_ge(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_ge(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_gt(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_gt(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_l2_squared_distance(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_l2_squared_distance(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_le(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_le(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_lt(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_lt(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_mul(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_mul(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_ne(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_ne(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_negative_inner_product(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_negative_inner_product(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_norm(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_norm(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_spherical_distance(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_spherical_distance(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION vector_sub(extensions.vector, extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.vector_sub(extensions.vector, extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION analyze_cluster_content_gaps(target_blog_id uuid, min_search_volume integer, max_difficulty integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.analyze_cluster_content_gaps(target_blog_id uuid, min_search_volume integer, max_difficulty integer) TO anon;
GRANT ALL ON FUNCTION public.analyze_cluster_content_gaps(target_blog_id uuid, min_search_volume integer, max_difficulty integer) TO authenticated;
GRANT ALL ON FUNCTION public.analyze_cluster_content_gaps(target_blog_id uuid, min_search_volume integer, max_difficulty integer) TO service_role;


--
-- Name: FUNCTION analyze_content_gaps(p_blog_id uuid, gap_threshold double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.analyze_content_gaps(p_blog_id uuid, gap_threshold double precision) TO anon;
GRANT ALL ON FUNCTION public.analyze_content_gaps(p_blog_id uuid, gap_threshold double precision) TO authenticated;
GRANT ALL ON FUNCTION public.analyze_content_gaps(p_blog_id uuid, gap_threshold double precision) TO service_role;


--
-- Name: FUNCTION analyze_content_gaps(target_blog_id uuid, min_msv integer, max_difficulty integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.analyze_content_gaps(target_blog_id uuid, min_msv integer, max_difficulty integer) TO anon;
GRANT ALL ON FUNCTION public.analyze_content_gaps(target_blog_id uuid, min_msv integer, max_difficulty integer) TO authenticated;
GRANT ALL ON FUNCTION public.analyze_content_gaps(target_blog_id uuid, min_msv integer, max_difficulty integer) TO service_role;


--
-- Name: FUNCTION auto_assign_keyword_to_cluster(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_assign_keyword_to_cluster() TO anon;
GRANT ALL ON FUNCTION public.auto_assign_keyword_to_cluster() TO authenticated;
GRANT ALL ON FUNCTION public.auto_assign_keyword_to_cluster() TO service_role;


--
-- Name: FUNCTION auto_assign_keyword_to_opportunity(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_assign_keyword_to_opportunity() TO anon;
GRANT ALL ON FUNCTION public.auto_assign_keyword_to_opportunity() TO authenticated;
GRANT ALL ON FUNCTION public.auto_assign_keyword_to_opportunity() TO service_role;


--
-- Name: FUNCTION calculate_keyword_opportunity_score(p_msv integer, p_difficulty integer, p_cpc numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_keyword_opportunity_score(p_msv integer, p_difficulty integer, p_cpc numeric) TO anon;
GRANT ALL ON FUNCTION public.calculate_keyword_opportunity_score(p_msv integer, p_difficulty integer, p_cpc numeric) TO authenticated;
GRANT ALL ON FUNCTION public.calculate_keyword_opportunity_score(p_msv integer, p_difficulty integer, p_cpc numeric) TO service_role;


--
-- Name: FUNCTION calculate_keyword_opportunity_score(msv integer, kw_difficulty integer, cpc numeric, competition character varying, search_intent character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_keyword_opportunity_score(msv integer, kw_difficulty integer, cpc numeric, competition character varying, search_intent character varying) TO anon;
GRANT ALL ON FUNCTION public.calculate_keyword_opportunity_score(msv integer, kw_difficulty integer, cpc numeric, competition character varying, search_intent character varying) TO authenticated;
GRANT ALL ON FUNCTION public.calculate_keyword_opportunity_score(msv integer, kw_difficulty integer, cpc numeric, competition character varying, search_intent character varying) TO service_role;


--
-- Name: FUNCTION call_util_keyword_variation_content(input_record record); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.call_util_keyword_variation_content(input_record record) TO anon;
GRANT ALL ON FUNCTION public.call_util_keyword_variation_content(input_record record) TO authenticated;
GRANT ALL ON FUNCTION public.call_util_keyword_variation_content(input_record record) TO service_role;


--
-- Name: FUNCTION check_embeddings_stats(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_embeddings_stats() TO anon;
GRANT ALL ON FUNCTION public.check_embeddings_stats() TO authenticated;
GRANT ALL ON FUNCTION public.check_embeddings_stats() TO service_role;


--
-- Name: FUNCTION check_vector_indexes_status(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_vector_indexes_status() TO anon;
GRANT ALL ON FUNCTION public.check_vector_indexes_status() TO authenticated;
GRANT ALL ON FUNCTION public.check_vector_indexes_status() TO service_role;


--
-- Name: FUNCTION cluster_keywords_content(input_record jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cluster_keywords_content(input_record jsonb) TO anon;
GRANT ALL ON FUNCTION public.cluster_keywords_content(input_record jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.cluster_keywords_content(input_record jsonb) TO service_role;


--
-- Name: FUNCTION content_opportunity_category_content(input_record jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.content_opportunity_category_content(input_record jsonb) TO anon;
GRANT ALL ON FUNCTION public.content_opportunity_category_content(input_record jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.content_opportunity_category_content(input_record jsonb) TO service_role;


--
-- Name: FUNCTION content_opportunity_cluster_content(input_record jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.content_opportunity_cluster_content(input_record jsonb) TO anon;
GRANT ALL ON FUNCTION public.content_opportunity_cluster_content(input_record jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.content_opportunity_cluster_content(input_record jsonb) TO service_role;


--
-- Name: FUNCTION content_post_content(input_record jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.content_post_content(input_record jsonb) TO anon;
GRANT ALL ON FUNCTION public.content_post_content(input_record jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.content_post_content(input_record jsonb) TO service_role;


--
-- Name: FUNCTION delete_related_data(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_related_data() TO anon;
GRANT ALL ON FUNCTION public.delete_related_data() TO authenticated;
GRANT ALL ON FUNCTION public.delete_related_data() TO service_role;


--
-- Name: FUNCTION detect_semantic_duplicates(similarity_threshold double precision, table_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.detect_semantic_duplicates(similarity_threshold double precision, table_name text) TO anon;
GRANT ALL ON FUNCTION public.detect_semantic_duplicates(similarity_threshold double precision, table_name text) TO authenticated;
GRANT ALL ON FUNCTION public.detect_semantic_duplicates(similarity_threshold double precision, table_name text) TO service_role;


--
-- Name: FUNCTION find_best_keyword_for_cluster(cluster_title text, cluster_description text, cluster_target_keywords text[], cluster_blog_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_best_keyword_for_cluster(cluster_title text, cluster_description text, cluster_target_keywords text[], cluster_blog_id uuid) TO anon;
GRANT ALL ON FUNCTION public.find_best_keyword_for_cluster(cluster_title text, cluster_description text, cluster_target_keywords text[], cluster_blog_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.find_best_keyword_for_cluster(cluster_title text, cluster_description text, cluster_target_keywords text[], cluster_blog_id uuid) TO service_role;


--
-- Name: FUNCTION find_best_keyword_for_opportunity(opportunity_title text, opportunity_blog_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_best_keyword_for_opportunity(opportunity_title text, opportunity_blog_id uuid) TO anon;
GRANT ALL ON FUNCTION public.find_best_keyword_for_opportunity(opportunity_title text, opportunity_blog_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.find_best_keyword_for_opportunity(opportunity_title text, opportunity_blog_id uuid) TO service_role;


--
-- Name: FUNCTION find_similar_clusters(query_embedding extensions.vector, match_threshold double precision, match_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_similar_clusters(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO anon;
GRANT ALL ON FUNCTION public.find_similar_clusters(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.find_similar_clusters(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO service_role;


--
-- Name: FUNCTION find_similar_keywords(query_embedding extensions.vector, match_threshold double precision, match_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_similar_keywords(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO anon;
GRANT ALL ON FUNCTION public.find_similar_keywords(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.find_similar_keywords(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO service_role;


--
-- Name: FUNCTION find_similar_posts(query_embedding extensions.vector, match_threshold double precision, match_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_similar_posts(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO anon;
GRANT ALL ON FUNCTION public.find_similar_posts(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.find_similar_posts(query_embedding extensions.vector, match_threshold double precision, match_count integer) TO service_role;


--
-- Name: FUNCTION generate_cluster_opportunities_from_gaps(target_blog_id uuid, max_opportunities integer, min_search_volume integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_cluster_opportunities_from_gaps(target_blog_id uuid, max_opportunities integer, min_search_volume integer) TO anon;
GRANT ALL ON FUNCTION public.generate_cluster_opportunities_from_gaps(target_blog_id uuid, max_opportunities integer, min_search_volume integer) TO authenticated;
GRANT ALL ON FUNCTION public.generate_cluster_opportunities_from_gaps(target_blog_id uuid, max_opportunities integer, min_search_volume integer) TO service_role;


--
-- Name: FUNCTION generate_opportunities_from_gaps(target_blog_id uuid, min_gap_score numeric, max_opportunities integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_opportunities_from_gaps(target_blog_id uuid, min_gap_score numeric, max_opportunities integer) TO anon;
GRANT ALL ON FUNCTION public.generate_opportunities_from_gaps(target_blog_id uuid, min_gap_score numeric, max_opportunities integer) TO authenticated;
GRANT ALL ON FUNCTION public.generate_opportunities_from_gaps(target_blog_id uuid, min_gap_score numeric, max_opportunities integer) TO service_role;


--
-- Name: FUNCTION get_niche_statistics(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_niche_statistics() TO anon;
GRANT ALL ON FUNCTION public.get_niche_statistics() TO authenticated;
GRANT ALL ON FUNCTION public.get_niche_statistics() TO service_role;


--
-- Name: FUNCTION get_openai_api_key_from_vault(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_openai_api_key_from_vault() TO anon;
GRANT ALL ON FUNCTION public.get_openai_api_key_from_vault() TO authenticated;
GRANT ALL ON FUNCTION public.get_openai_api_key_from_vault() TO service_role;


--
-- Name: FUNCTION gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gin_extract_value_trgm(text, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO service_role;


--
-- Name: FUNCTION gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_compress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_consistent(internal, text, smallint, oid, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_decompress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_distance(internal, text, smallint, oid, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_options(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_penalty(internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_picksplit(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_same(public.gtrgm, public.gtrgm, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_union(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO service_role;


--
-- Name: FUNCTION hybrid_search_posts(search_query text, query_embedding extensions.vector, blog_id_filter uuid, match_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.hybrid_search_posts(search_query text, query_embedding extensions.vector, blog_id_filter uuid, match_count integer) TO anon;
GRANT ALL ON FUNCTION public.hybrid_search_posts(search_query text, query_embedding extensions.vector, blog_id_filter uuid, match_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.hybrid_search_posts(search_query text, query_embedding extensions.vector, blog_id_filter uuid, match_count integer) TO service_role;


--
-- Name: FUNCTION inserir_variacao_keyword(p_main_keyword_id uuid, p_keyword text, p_variation_type character varying, p_msv integer, p_kw_difficulty integer, p_cpc numeric, p_competition character varying, p_search_intent character varying, p_answer text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.inserir_variacao_keyword(p_main_keyword_id uuid, p_keyword text, p_variation_type character varying, p_msv integer, p_kw_difficulty integer, p_cpc numeric, p_competition character varying, p_search_intent character varying, p_answer text) TO anon;
GRANT ALL ON FUNCTION public.inserir_variacao_keyword(p_main_keyword_id uuid, p_keyword text, p_variation_type character varying, p_msv integer, p_kw_difficulty integer, p_cpc numeric, p_competition character varying, p_search_intent character varying, p_answer text) TO authenticated;
GRANT ALL ON FUNCTION public.inserir_variacao_keyword(p_main_keyword_id uuid, p_keyword text, p_variation_type character varying, p_msv integer, p_kw_difficulty integer, p_cpc numeric, p_competition character varying, p_search_intent character varying, p_answer text) TO service_role;


--
-- Name: FUNCTION is_special_msv(msv integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_special_msv(msv integer) TO anon;
GRANT ALL ON FUNCTION public.is_special_msv(msv integer) TO authenticated;
GRANT ALL ON FUNCTION public.is_special_msv(msv integer) TO service_role;


--
-- Name: FUNCTION keyword_cluster_content(input_record jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.keyword_cluster_content(input_record jsonb) TO anon;
GRANT ALL ON FUNCTION public.keyword_cluster_content(input_record jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.keyword_cluster_content(input_record jsonb) TO service_role;


--
-- Name: FUNCTION keyword_variation_content(input_record jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.keyword_variation_content(input_record jsonb) TO anon;
GRANT ALL ON FUNCTION public.keyword_variation_content(input_record jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.keyword_variation_content(input_record jsonb) TO service_role;


--
-- Name: FUNCTION mark_keyword_as_used(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.mark_keyword_as_used() TO anon;
GRANT ALL ON FUNCTION public.mark_keyword_as_used() TO authenticated;
GRANT ALL ON FUNCTION public.mark_keyword_as_used() TO service_role;


--
-- Name: FUNCTION match_documents(query_embedding extensions.vector, match_count integer, filter jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.match_documents(query_embedding extensions.vector, match_count integer, filter jsonb) TO anon;
GRANT ALL ON FUNCTION public.match_documents(query_embedding extensions.vector, match_count integer, filter jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.match_documents(query_embedding extensions.vector, match_count integer, filter jsonb) TO service_role;


--
-- Name: FUNCTION recommend_keywords_for_post(p_post_id uuid, similarity_threshold double precision, max_recommendations integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.recommend_keywords_for_post(p_post_id uuid, similarity_threshold double precision, max_recommendations integer) TO anon;
GRANT ALL ON FUNCTION public.recommend_keywords_for_post(p_post_id uuid, similarity_threshold double precision, max_recommendations integer) TO authenticated;
GRANT ALL ON FUNCTION public.recommend_keywords_for_post(p_post_id uuid, similarity_threshold double precision, max_recommendations integer) TO service_role;


--
-- Name: FUNCTION search_similar_keyword_variations(p_main_keyword_id uuid, p_similarity_threshold double precision, p_limit integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_similar_keyword_variations(p_main_keyword_id uuid, p_similarity_threshold double precision, p_limit integer) TO anon;
GRANT ALL ON FUNCTION public.search_similar_keyword_variations(p_main_keyword_id uuid, p_similarity_threshold double precision, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.search_similar_keyword_variations(p_main_keyword_id uuid, p_similarity_threshold double precision, p_limit integer) TO service_role;


--
-- Name: FUNCTION set_limit(real); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.set_limit(real) TO postgres;
GRANT ALL ON FUNCTION public.set_limit(real) TO anon;
GRANT ALL ON FUNCTION public.set_limit(real) TO authenticated;
GRANT ALL ON FUNCTION public.set_limit(real) TO service_role;


--
-- Name: FUNCTION show_limit(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.show_limit() TO postgres;
GRANT ALL ON FUNCTION public.show_limit() TO anon;
GRANT ALL ON FUNCTION public.show_limit() TO authenticated;
GRANT ALL ON FUNCTION public.show_limit() TO service_role;


--
-- Name: FUNCTION show_trgm(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.show_trgm(text) TO postgres;
GRANT ALL ON FUNCTION public.show_trgm(text) TO anon;
GRANT ALL ON FUNCTION public.show_trgm(text) TO authenticated;
GRANT ALL ON FUNCTION public.show_trgm(text) TO service_role;


--
-- Name: FUNCTION similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity(text, text) TO service_role;


--
-- Name: FUNCTION similarity_dist(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO service_role;


--
-- Name: FUNCTION similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_dist_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION validate_keyword_variations(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.validate_keyword_variations() TO anon;
GRANT ALL ON FUNCTION public.validate_keyword_variations() TO authenticated;
GRANT ALL ON FUNCTION public.validate_keyword_variations() TO service_role;


--
-- Name: FUNCTION validate_post_categories(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.validate_post_categories() TO anon;
GRANT ALL ON FUNCTION public.validate_post_categories() TO authenticated;
GRANT ALL ON FUNCTION public.validate_post_categories() TO service_role;


--
-- Name: FUNCTION validate_post_tags(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.validate_post_tags() TO anon;
GRANT ALL ON FUNCTION public.validate_post_tags() TO authenticated;
GRANT ALL ON FUNCTION public.validate_post_tags() TO service_role;


--
-- Name: FUNCTION word_similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_dist_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION check_embedding_queue_status(); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.check_embedding_queue_status() TO service_role;


--
-- Name: FUNCTION check_failed_embedding_jobs(); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.check_failed_embedding_jobs() TO service_role;


--
-- Name: FUNCTION cleanup_old_embedding_jobs(older_than_hours integer); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.cleanup_old_embedding_jobs(older_than_hours integer) TO service_role;


--
-- Name: FUNCTION invoke_edge_function(function_name text, body jsonb, timeout_milliseconds integer); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.invoke_edge_function(function_name text, body jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION process_embedding_jobs(batch_size integer); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.process_embedding_jobs(batch_size integer) TO service_role;


--
-- Name: FUNCTION project_url(); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.project_url() TO service_role;


--
-- Name: FUNCTION queue_embeddings(); Type: ACL; Schema: util; Owner: postgres
--

GRANT ALL ON FUNCTION util.queue_embeddings() TO service_role;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION avg(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.avg(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION avg(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.avg(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sum(extensions.halfvec); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sum(extensions.halfvec) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sum(extensions.vector); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sum(extensions.vector) TO postgres WITH GRANT OPTION;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE a_embedding_jobs; Type: ACL; Schema: pgmq; Owner: postgres
--

GRANT SELECT ON TABLE pgmq.a_embedding_jobs TO pg_monitor;


--
-- Name: TABLE q_embedding_jobs; Type: ACL; Schema: pgmq; Owner: postgres
--

GRANT SELECT ON TABLE pgmq.q_embedding_jobs TO pg_monitor;


--
-- Name: SEQUENCE q_embedding_jobs_msg_id_seq; Type: ACL; Schema: pgmq; Owner: postgres
--

GRANT SELECT ON SEQUENCE pgmq.q_embedding_jobs_msg_id_seq TO pg_monitor;


--
-- Name: TABLE analytics_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.analytics_metrics TO anon;
GRANT ALL ON TABLE public.analytics_metrics TO authenticated;
GRANT ALL ON TABLE public.analytics_metrics TO service_role;


--
-- Name: TABLE authors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.authors TO anon;
GRANT ALL ON TABLE public.authors TO authenticated;
GRANT ALL ON TABLE public.authors TO service_role;


--
-- Name: TABLE blog_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.blog_categories TO anon;
GRANT ALL ON TABLE public.blog_categories TO authenticated;
GRANT ALL ON TABLE public.blog_categories TO service_role;


--
-- Name: TABLE blogs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.blogs TO anon;
GRANT ALL ON TABLE public.blogs TO authenticated;
GRANT ALL ON TABLE public.blogs TO service_role;


--
-- Name: TABLE post_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_categories TO anon;
GRANT ALL ON TABLE public.post_categories TO authenticated;
GRANT ALL ON TABLE public.post_categories TO service_role;


--
-- Name: TABLE blog_categories_usage; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.blog_categories_usage TO anon;
GRANT ALL ON TABLE public.blog_categories_usage TO authenticated;
GRANT ALL ON TABLE public.blog_categories_usage TO service_role;


--
-- Name: TABLE blog_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.blog_tags TO anon;
GRANT ALL ON TABLE public.blog_tags TO authenticated;
GRANT ALL ON TABLE public.blog_tags TO service_role;


--
-- Name: TABLE post_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_tags TO anon;
GRANT ALL ON TABLE public.post_tags TO authenticated;
GRANT ALL ON TABLE public.post_tags TO service_role;


--
-- Name: TABLE blog_tags_usage; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.blog_tags_usage TO anon;
GRANT ALL ON TABLE public.blog_tags_usage TO authenticated;
GRANT ALL ON TABLE public.blog_tags_usage TO service_role;


--
-- Name: TABLE keyword_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_categories TO anon;
GRANT ALL ON TABLE public.keyword_categories TO authenticated;
GRANT ALL ON TABLE public.keyword_categories TO service_role;


--
-- Name: TABLE keyword_variations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_variations TO anon;
GRANT ALL ON TABLE public.keyword_variations TO authenticated;
GRANT ALL ON TABLE public.keyword_variations TO service_role;


--
-- Name: TABLE main_keywords; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.main_keywords TO anon;
GRANT ALL ON TABLE public.main_keywords TO authenticated;
GRANT ALL ON TABLE public.main_keywords TO service_role;


--
-- Name: TABLE categorized_keywords; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categorized_keywords TO anon;
GRANT ALL ON TABLE public.categorized_keywords TO authenticated;
GRANT ALL ON TABLE public.categorized_keywords TO service_role;


--
-- Name: TABLE cluster_keywords; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cluster_keywords TO anon;
GRANT ALL ON TABLE public.cluster_keywords TO authenticated;
GRANT ALL ON TABLE public.cluster_keywords TO service_role;


--
-- Name: TABLE keyword_clusters; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_clusters TO anon;
GRANT ALL ON TABLE public.keyword_clusters TO authenticated;
GRANT ALL ON TABLE public.keyword_clusters TO service_role;


--
-- Name: TABLE content_cluster_opportunities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_cluster_opportunities TO anon;
GRANT ALL ON TABLE public.content_cluster_opportunities TO authenticated;
GRANT ALL ON TABLE public.content_cluster_opportunities TO service_role;


--
-- Name: TABLE content_cluster_opportunities_no_embedding; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_cluster_opportunities_no_embedding TO anon;
GRANT ALL ON TABLE public.content_cluster_opportunities_no_embedding TO authenticated;
GRANT ALL ON TABLE public.content_cluster_opportunities_no_embedding TO service_role;


--
-- Name: TABLE content_opportunities_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_opportunities_categories TO anon;
GRANT ALL ON TABLE public.content_opportunities_categories TO authenticated;
GRANT ALL ON TABLE public.content_opportunities_categories TO service_role;


--
-- Name: TABLE content_opportunities_clusters; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_opportunities_clusters TO anon;
GRANT ALL ON TABLE public.content_opportunities_clusters TO authenticated;
GRANT ALL ON TABLE public.content_opportunities_clusters TO service_role;


--
-- Name: TABLE content_opportunities_clusters_expanded; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_opportunities_clusters_expanded TO anon;
GRANT ALL ON TABLE public.content_opportunities_clusters_expanded TO authenticated;
GRANT ALL ON TABLE public.content_opportunities_clusters_expanded TO service_role;


--
-- Name: TABLE content_posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_posts TO anon;
GRANT ALL ON TABLE public.content_posts TO authenticated;
GRANT ALL ON TABLE public.content_posts TO service_role;


--
-- Name: TABLE document_metadata; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_metadata TO anon;
GRANT ALL ON TABLE public.document_metadata TO authenticated;
GRANT ALL ON TABLE public.document_metadata TO service_role;


--
-- Name: TABLE document_rows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_rows TO anon;
GRANT ALL ON TABLE public.document_rows TO authenticated;
GRANT ALL ON TABLE public.document_rows TO service_role;


--
-- Name: SEQUENCE document_rows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.document_rows_id_seq TO anon;
GRANT ALL ON SEQUENCE public.document_rows_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.document_rows_id_seq TO service_role;


--
-- Name: TABLE documents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.documents TO anon;
GRANT ALL ON TABLE public.documents TO authenticated;
GRANT ALL ON TABLE public.documents TO service_role;


--
-- Name: SEQUENCE documents_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.documents_id_seq TO anon;
GRANT ALL ON SEQUENCE public.documents_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.documents_id_seq TO service_role;


--
-- Name: TABLE executive_dashboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.executive_dashboard TO anon;
GRANT ALL ON TABLE public.executive_dashboard TO authenticated;
GRANT ALL ON TABLE public.executive_dashboard TO service_role;


--
-- Name: TABLE serp_results; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.serp_results TO anon;
GRANT ALL ON TABLE public.serp_results TO authenticated;
GRANT ALL ON TABLE public.serp_results TO service_role;


--
-- Name: TABLE keyword_categorization_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_categorization_metrics TO anon;
GRANT ALL ON TABLE public.keyword_categorization_metrics TO authenticated;
GRANT ALL ON TABLE public.keyword_categorization_metrics TO service_role;


--
-- Name: TABLE keyword_clustering_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_clustering_metrics TO anon;
GRANT ALL ON TABLE public.keyword_clustering_metrics TO authenticated;
GRANT ALL ON TABLE public.keyword_clustering_metrics TO service_role;


--
-- Name: TABLE keyword_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_metrics TO anon;
GRANT ALL ON TABLE public.keyword_metrics TO authenticated;
GRANT ALL ON TABLE public.keyword_metrics TO service_role;


--
-- Name: TABLE keyword_opportunities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.keyword_opportunities TO anon;
GRANT ALL ON TABLE public.keyword_opportunities TO authenticated;
GRANT ALL ON TABLE public.keyword_opportunities TO service_role;


--
-- Name: TABLE media_assets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.media_assets TO anon;
GRANT ALL ON TABLE public.media_assets TO authenticated;
GRANT ALL ON TABLE public.media_assets TO service_role;


--
-- Name: TABLE niche_overview; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.niche_overview TO anon;
GRANT ALL ON TABLE public.niche_overview TO authenticated;
GRANT ALL ON TABLE public.niche_overview TO service_role;


--
-- Name: TABLE post_meta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_meta TO anon;
GRANT ALL ON TABLE public.post_meta TO authenticated;
GRANT ALL ON TABLE public.post_meta TO service_role;


--
-- Name: TABLE production_pipeline; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.production_pipeline TO anon;
GRANT ALL ON TABLE public.production_pipeline TO authenticated;
GRANT ALL ON TABLE public.production_pipeline TO service_role;


--
-- Name: TABLE serp_competition_analysis; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.serp_competition_analysis TO anon;
GRANT ALL ON TABLE public.serp_competition_analysis TO authenticated;
GRANT ALL ON TABLE public.serp_competition_analysis TO service_role;


--
-- Name: TABLE vw_content_opportunities_clusters_with_keywords; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vw_content_opportunities_clusters_with_keywords TO anon;
GRANT ALL ON TABLE public.vw_content_opportunities_clusters_with_keywords TO authenticated;
GRANT ALL ON TABLE public.vw_content_opportunities_clusters_with_keywords TO service_role;


--
-- Name: TABLE vw_content_opportunities_with_keywords; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vw_content_opportunities_with_keywords TO anon;
GRANT ALL ON TABLE public.vw_content_opportunities_with_keywords TO authenticated;
GRANT ALL ON TABLE public.vw_content_opportunities_with_keywords TO service_role;


--
-- Name: TABLE vw_identified_content_opportunities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vw_identified_content_opportunities TO anon;
GRANT ALL ON TABLE public.vw_identified_content_opportunities TO authenticated;
GRANT ALL ON TABLE public.vw_identified_content_opportunities TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgmq; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA pgmq GRANT SELECT ON SEQUENCES TO pg_monitor;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgmq; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA pgmq GRANT SELECT ON TABLES TO pg_monitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

