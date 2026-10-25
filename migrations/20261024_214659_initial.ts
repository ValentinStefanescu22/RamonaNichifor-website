import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_universes_release" AS ENUM('available', 'soon');
  CREATE TYPE "public"."enum_universes_home_window" AS ENUM('meadow', 'scene', 'creature');
  CREATE TYPE "public"."enum_universes_creature" AS ENUM('buburuza', 'tantar', 'musca');
  CREATE TYPE "public"."enum_universes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__universes_v_version_home_window" AS ENUM('meadow', 'scene', 'creature');
  CREATE TYPE "public"."enum__universes_v_version_creature" AS ENUM('buburuza', 'tantar', 'musca');
  CREATE TYPE "public"."enum__universes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__universes_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_books_formats_status" AS ENUM('available', 'soon', 'planned');
  CREATE TYPE "public"."enum_books_age_group" AS ENUM('copii', 'adolescenti', 'adulti');
  CREATE TYPE "public"."enum_books_release" AS ENUM('published', 'soon', 'writing');
  CREATE TYPE "public"."enum_books_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__books_v_version_formats_status" AS ENUM('available', 'soon', 'planned');
  CREATE TYPE "public"."enum__books_v_version_age_group" AS ENUM('copii', 'adolescenti', 'adulti');
  CREATE TYPE "public"."enum__books_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__books_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_products_kind" AS ENUM('semn-de-carte', 'carti-de-joc', 'puzzle', 'joc-de-familie');
  CREATE TYPE "public"."enum_products_release" AS ENUM('available', 'soon');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_kind" AS ENUM('semn-de-carte', 'carti-de-joc', 'puzzle', 'joc-de-familie');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_artworks_kind" AS ENUM('original', 'print');
  CREATE TYPE "public"."enum_artworks_availability" AS ENUM('preorder', 'sold', 'onRequest');
  CREATE TYPE "public"."enum_artworks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artworks_v_version_kind" AS ENUM('original', 'print');
  CREATE TYPE "public"."enum__artworks_v_version_availability" AS ENUM('preorder', 'sold', 'onRequest');
  CREATE TYPE "public"."enum__artworks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artworks_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_events_kind" AS ENUM('atelier-pictura', 'lansare', 'autografe', 'atelier-citit');
  CREATE TYPE "public"."enum_events_timing" AS ENUM('upcoming', 'past');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_kind" AS ENUM('atelier-pictura', 'lansare', 'autografe', 'atelier-citit');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_projects_stage" AS ENUM('idee', 'in-pregatire', 'in-desfasurare', 'incheiat');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_legal_pages_kind" AS ENUM('privacy', 'terms');
  CREATE TYPE "public"."enum_legal_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_version_kind" AS ENUM('privacy', 'terms');
  CREATE TYPE "public"."enum__legal_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_counselling_page_formats_kind" AS ENUM('online', 'inPerson');
  CREATE TYPE "public"."enum_counselling_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__counselling_page_v_version_formats_kind" AS ENUM('online', 'inPerson');
  CREATE TYPE "public"."enum__counselling_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__counselling_page_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_published_locale" AS ENUM('ro', 'en');
  CREATE TABLE "universes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_universes_release" DEFAULT 'soon',
  	"order" numeric DEFAULT 0,
  	"tint_light" varchar,
  	"tint_mid" varchar,
  	"tint_deep" varchar,
  	"home_window" "enum_universes_home_window" DEFAULT 'creature',
  	"scene_id" integer,
  	"creature" "enum_universes_creature",
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_universes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "universes_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"book_title" varchar,
  	"hook" varchar,
  	"story" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "universes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"books_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_universes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_status" "enum_universes_release" DEFAULT 'soon',
  	"version_order" numeric DEFAULT 0,
  	"version_tint_light" varchar,
  	"version_tint_mid" varchar,
  	"version_tint_deep" varchar,
  	"version_home_window" "enum__universes_v_version_home_window" DEFAULT 'creature',
  	"version_scene_id" integer,
  	"version_creature" "enum__universes_v_version_creature",
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__universes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__universes_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_universes_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_book_title" varchar,
  	"version_hook" varchar,
  	"version_story" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_universes_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"books_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "books_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"status" "enum_books_formats_status" DEFAULT 'soon'
  );
  
  CREATE TABLE "books_store_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"store" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "books_leaf_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "books_leaf_pages_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "books" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"age_group" "enum_books_age_group" DEFAULT 'copii',
  	"status" "enum_books_release" DEFAULT 'writing',
  	"cover_id" integer,
  	"year" numeric,
  	"pages" numeric,
  	"isbn" varchar,
  	"universe_id" integer,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_books_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "books_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"subtitle" varchar,
  	"blurb" jsonb,
  	"format" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_books_v_version_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"status" "enum__books_v_version_formats_status" DEFAULT 'soon',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_books_v_version_store_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"store" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_books_v_version_leaf_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_books_v_version_leaf_pages_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_books_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_age_group" "enum__books_v_version_age_group" DEFAULT 'copii',
  	"version_status" "enum_books_release" DEFAULT 'writing',
  	"version_cover_id" integer,
  	"version_year" numeric,
  	"version_pages" numeric,
  	"version_isbn" varchar,
  	"version_universe_id" integer,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__books_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__books_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_books_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_subtitle" varchar,
  	"version_blurb" jsonb,
  	"version_format" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specs_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_products_kind",
  	"status" "enum_products_release" DEFAULT 'soon',
  	"universe_id" integer,
  	"price" numeric,
  	"external_link" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"description" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_products_v_version_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__products_v_version_kind",
  	"version_status" "enum_products_release" DEFAULT 'soon',
  	"version_universe_id" integer,
  	"version_price" numeric,
  	"version_external_link" varchar,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "artworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_artworks_kind" DEFAULT 'original',
  	"availability" "enum_artworks_availability" DEFAULT 'preorder',
  	"size" varchar,
  	"year" numeric,
  	"price" numeric,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_artworks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "artworks_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"technique" varchar,
  	"description" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "artworks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_artworks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__artworks_v_version_kind" DEFAULT 'original',
  	"version_availability" "enum__artworks_v_version_availability" DEFAULT 'preorder',
  	"version_size" varchar,
  	"version_year" numeric,
  	"version_price" numeric,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__artworks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__artworks_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_artworks_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_technique" varchar,
  	"version_description" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_artworks_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_events_kind",
  	"starts_at" timestamp(3) with time zone,
  	"online" boolean,
  	"image_id" integer,
  	"status" "enum_events_timing" DEFAULT 'upcoming',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar,
  	"place" varchar,
  	"audience" varchar,
  	"sign_up_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__events_v_version_kind",
  	"version_starts_at" timestamp(3) with time zone,
  	"version_online" boolean,
  	"version_image_id" integer,
  	"version_status" "enum_events_timing" DEFAULT 'upcoming',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar,
  	"version_place" varchar,
  	"version_audience" varchar,
  	"version_sign_up_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"status" "enum_projects_stage" DEFAULT 'idee',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_status" "enum_projects_stage" DEFAULT 'idee',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "partners_locales" (
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_url" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partners_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_partners_v_locales" (
  	"version_line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_legal_pages_kind",
  	"last_updated" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "legal_pages_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_legal_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__legal_pages_v_version_kind",
  	"version_last_updated" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__legal_pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_legal_pages_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"illustration" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_sm_url" varchar,
  	"sizes_sm_width" numeric,
  	"sizes_sm_height" numeric,
  	"sizes_sm_mime_type" varchar,
  	"sizes_sm_filesize" numeric,
  	"sizes_sm_filename" varchar,
  	"sizes_md_url" varchar,
  	"sizes_md_width" numeric,
  	"sizes_md_height" numeric,
  	"sizes_md_mime_type" varchar,
  	"sizes_md_filesize" numeric,
  	"sizes_md_filename" varchar,
  	"sizes_lg_url" varchar,
  	"sizes_lg_width" numeric,
  	"sizes_lg_height" numeric,
  	"sizes_lg_mime_type" varchar,
  	"sizes_lg_filesize" numeric,
  	"sizes_lg_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"universes_id" integer,
  	"books_id" integer,
  	"products_id" integer,
  	"artworks_id" integer,
  	"events_id" integer,
  	"projects_id" integer,
  	"partners_id" integer,
  	"legal_pages_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_manifesto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_manifesto_locales" (
  	"before" varchar,
  	"emphasis" varchar,
  	"after" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Ramona Nichifor',
  	"home_featured_book_id" integer,
  	"portrait_id" integer,
  	"contacts_email" varchar,
  	"contacts_whatsapp_href" varchar,
  	"contacts_whatsapp_number" varchar,
  	"contacts_instagram_href" varchar,
  	"contacts_instagram_handle" varchar,
  	"contacts_facebook_href" varchar,
  	"contacts_facebook_handle" varchar,
  	"seo_share_image_id" integer,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"roles" varchar,
  	"roles_short" varchar,
  	"souls" varchar,
  	"whisper" varchar,
  	"intro" varchar,
  	"series" varchar,
  	"series_lead" varchar,
  	"pillars_books_title" varchar,
  	"pillars_books_line" varchar,
  	"pillars_art_title" varchar,
  	"pillars_art_line" varchar,
  	"pillars_counselling_title" varchar,
  	"pillars_counselling_line" varchar,
  	"art_teaser_title" varchar,
  	"art_teaser_lead" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer
  );
  
  CREATE TABLE "_site_settings_v_version_manifesto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_manifesto_locales" (
  	"before" varchar,
  	"emphasis" varchar,
  	"after" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_version_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar DEFAULT 'Ramona Nichifor',
  	"version_home_featured_book_id" integer,
  	"version_portrait_id" integer,
  	"version_contacts_email" varchar,
  	"version_contacts_whatsapp_href" varchar,
  	"version_contacts_whatsapp_number" varchar,
  	"version_contacts_instagram_href" varchar,
  	"version_contacts_instagram_handle" varchar,
  	"version_contacts_facebook_href" varchar,
  	"version_contacts_facebook_handle" varchar,
  	"version_seo_share_image_id" integer,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_settings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_settings_v_locales" (
  	"version_roles" varchar,
  	"version_roles_short" varchar,
  	"version_souls" varchar,
  	"version_whisper" varchar,
  	"version_intro" varchar,
  	"version_series" varchar,
  	"version_series_lead" varchar,
  	"version_pillars_books_title" varchar,
  	"version_pillars_books_line" varchar,
  	"version_pillars_art_title" varchar,
  	"version_pillars_art_line" varchar,
  	"version_pillars_counselling_title" varchar,
  	"version_pillars_counselling_line" varchar,
  	"version_art_teaser_title" varchar,
  	"version_art_teaser_lead" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer
  );
  
  CREATE TABLE "counselling_page_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_counselling_page_formats_kind"
  );
  
  CREATE TABLE "counselling_page_formats_locales" (
  	"title" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"minutes" numeric,
  	"price_eur" numeric
  );
  
  CREATE TABLE "counselling_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_faq_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_counselling_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "counselling_page_locales" (
  	"teaser_title" varchar,
  	"teaser_lead" varchar,
  	"intro" jsonb,
  	"approach" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__counselling_page_v_version_formats_kind",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_formats_locales" (
  	"title" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"minutes" numeric,
  	"price_eur" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_faq_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__counselling_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__counselling_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_counselling_page_v_locales" (
  	"version_teaser_title" varchar,
  	"version_teaser_lead" varchar,
  	"version_intro" jsonb,
  	"version_approach" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"portrait_id" integer,
  	"_status" "enum_about_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_portrait_id" integer,
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__about_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_about_page_v_locales" (
  	"version_bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "universes" ADD CONSTRAINT "universes_scene_id_media_id_fk" FOREIGN KEY ("scene_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universes" ADD CONSTRAINT "universes_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universes_locales" ADD CONSTRAINT "universes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universes_rels" ADD CONSTRAINT "universes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universes_rels" ADD CONSTRAINT "universes_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "universes_rels" ADD CONSTRAINT "universes_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_universes_v" ADD CONSTRAINT "_universes_v_parent_id_universes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."universes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_universes_v" ADD CONSTRAINT "_universes_v_version_scene_id_media_id_fk" FOREIGN KEY ("version_scene_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_universes_v" ADD CONSTRAINT "_universes_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_universes_v_locales" ADD CONSTRAINT "_universes_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_universes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_universes_v_rels" ADD CONSTRAINT "_universes_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_universes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_universes_v_rels" ADD CONSTRAINT "_universes_v_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_universes_v_rels" ADD CONSTRAINT "_universes_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_formats" ADD CONSTRAINT "books_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_store_links" ADD CONSTRAINT "books_store_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_leaf_pages" ADD CONSTRAINT "books_leaf_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books_leaf_pages" ADD CONSTRAINT "books_leaf_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_leaf_pages_locales" ADD CONSTRAINT "books_leaf_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_leaf_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books_locales" ADD CONSTRAINT "books_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_v_version_formats" ADD CONSTRAINT "_books_v_version_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_v_version_store_links" ADD CONSTRAINT "_books_v_version_store_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_v_version_leaf_pages" ADD CONSTRAINT "_books_v_version_leaf_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v_version_leaf_pages" ADD CONSTRAINT "_books_v_version_leaf_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_v_version_leaf_pages_locales" ADD CONSTRAINT "_books_v_version_leaf_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_v_version_leaf_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_parent_id_books_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_universe_id_universes_id_fk" FOREIGN KEY ("version_universe_id") REFERENCES "public"."universes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v_locales" ADD CONSTRAINT "_books_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_locales" ADD CONSTRAINT "products_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs" ADD CONSTRAINT "_products_v_version_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_locales" ADD CONSTRAINT "_products_v_version_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_universe_id_universes_id_fk" FOREIGN KEY ("version_universe_id") REFERENCES "public"."universes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_locales" ADD CONSTRAINT "artworks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_parent_id_artworks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_locales" ADD CONSTRAINT "_artworks_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_rels" ADD CONSTRAINT "_artworks_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_rels" ADD CONSTRAINT "_artworks_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_locales" ADD CONSTRAINT "partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_locales" ADD CONSTRAINT "_partners_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_locales" ADD CONSTRAINT "legal_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v" ADD CONSTRAINT "_legal_pages_v_parent_id_legal_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_locales" ADD CONSTRAINT "_legal_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_universes_fk" FOREIGN KEY ("universes_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_manifesto" ADD CONSTRAINT "site_settings_manifesto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_manifesto_locales" ADD CONSTRAINT "site_settings_manifesto_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_manifesto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_same_as" ADD CONSTRAINT "site_settings_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_featured_book_id_books_id_fk" FOREIGN KEY ("home_featured_book_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_manifesto" ADD CONSTRAINT "_site_settings_v_version_manifesto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_manifesto_locales" ADD CONSTRAINT "_site_settings_v_version_manifesto_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_manifesto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_same_as" ADD CONSTRAINT "_site_settings_v_version_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_home_featured_book_id_books_id_fk" FOREIGN KEY ("version_home_featured_book_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_seo_share_image_id_media_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_formats" ADD CONSTRAINT "counselling_page_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_formats_locales" ADD CONSTRAINT "counselling_page_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_sessions" ADD CONSTRAINT "counselling_page_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_steps" ADD CONSTRAINT "counselling_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_steps_locales" ADD CONSTRAINT "counselling_page_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_faq" ADD CONSTRAINT "counselling_page_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_faq_locales" ADD CONSTRAINT "counselling_page_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_locales" ADD CONSTRAINT "counselling_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_formats" ADD CONSTRAINT "_counselling_page_v_version_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_formats_locales" ADD CONSTRAINT "_counselling_page_v_version_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_sessions" ADD CONSTRAINT "_counselling_page_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_steps" ADD CONSTRAINT "_counselling_page_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_steps_locales" ADD CONSTRAINT "_counselling_page_v_version_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_faq" ADD CONSTRAINT "_counselling_page_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_faq_locales" ADD CONSTRAINT "_counselling_page_v_version_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_locales" ADD CONSTRAINT "_counselling_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_highlights" ADD CONSTRAINT "about_page_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_highlights_locales" ADD CONSTRAINT "about_page_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_highlights" ADD CONSTRAINT "_about_page_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_highlights_locales" ADD CONSTRAINT "_about_page_v_version_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_locales" ADD CONSTRAINT "_about_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "universes_scene_idx" ON "universes" USING btree ("scene_id");
  CREATE INDEX "universes_seo_seo_image_idx" ON "universes" USING btree ("seo_image_id");
  CREATE INDEX "universes_updated_at_idx" ON "universes" USING btree ("updated_at");
  CREATE INDEX "universes_created_at_idx" ON "universes" USING btree ("created_at");
  CREATE INDEX "universes__status_idx" ON "universes" USING btree ("_status");
  CREATE UNIQUE INDEX "universes_slug_idx" ON "universes_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "universes_locales_locale_parent_id_unique" ON "universes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "universes_locales_parent_id_idx" ON "universes_locales" USING btree ("_parent_id");
  CREATE INDEX "universes_rels_order_idx" ON "universes_rels" USING btree ("order");
  CREATE INDEX "universes_rels_parent_idx" ON "universes_rels" USING btree ("parent_id");
  CREATE INDEX "universes_rels_path_idx" ON "universes_rels" USING btree ("path");
  CREATE INDEX "universes_rels_books_id_idx" ON "universes_rels" USING btree ("books_id");
  CREATE INDEX "universes_rels_products_id_idx" ON "universes_rels" USING btree ("products_id");
  CREATE INDEX "_universes_v_parent_idx" ON "_universes_v" USING btree ("parent_id");
  CREATE INDEX "_universes_v_version_version_scene_idx" ON "_universes_v" USING btree ("version_scene_id");
  CREATE INDEX "_universes_v_version_seo_version_seo_image_idx" ON "_universes_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_universes_v_version_version_updated_at_idx" ON "_universes_v" USING btree ("version_updated_at");
  CREATE INDEX "_universes_v_version_version_created_at_idx" ON "_universes_v" USING btree ("version_created_at");
  CREATE INDEX "_universes_v_version_version__status_idx" ON "_universes_v" USING btree ("version__status");
  CREATE INDEX "_universes_v_created_at_idx" ON "_universes_v" USING btree ("created_at");
  CREATE INDEX "_universes_v_updated_at_idx" ON "_universes_v" USING btree ("updated_at");
  CREATE INDEX "_universes_v_snapshot_idx" ON "_universes_v" USING btree ("snapshot");
  CREATE INDEX "_universes_v_published_locale_idx" ON "_universes_v" USING btree ("published_locale");
  CREATE INDEX "_universes_v_latest_idx" ON "_universes_v" USING btree ("latest");
  CREATE INDEX "_universes_v_version_version_slug_idx" ON "_universes_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_universes_v_locales_locale_parent_id_unique" ON "_universes_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_universes_v_locales_parent_id_idx" ON "_universes_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_universes_v_rels_order_idx" ON "_universes_v_rels" USING btree ("order");
  CREATE INDEX "_universes_v_rels_parent_idx" ON "_universes_v_rels" USING btree ("parent_id");
  CREATE INDEX "_universes_v_rels_path_idx" ON "_universes_v_rels" USING btree ("path");
  CREATE INDEX "_universes_v_rels_books_id_idx" ON "_universes_v_rels" USING btree ("books_id");
  CREATE INDEX "_universes_v_rels_products_id_idx" ON "_universes_v_rels" USING btree ("products_id");
  CREATE INDEX "books_formats_order_idx" ON "books_formats" USING btree ("_order");
  CREATE INDEX "books_formats_parent_id_idx" ON "books_formats" USING btree ("_parent_id");
  CREATE INDEX "books_store_links_order_idx" ON "books_store_links" USING btree ("_order");
  CREATE INDEX "books_store_links_parent_id_idx" ON "books_store_links" USING btree ("_parent_id");
  CREATE INDEX "books_leaf_pages_order_idx" ON "books_leaf_pages" USING btree ("_order");
  CREATE INDEX "books_leaf_pages_parent_id_idx" ON "books_leaf_pages" USING btree ("_parent_id");
  CREATE INDEX "books_leaf_pages_image_idx" ON "books_leaf_pages" USING btree ("image_id");
  CREATE UNIQUE INDEX "books_leaf_pages_locales_locale_parent_id_unique" ON "books_leaf_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "books_leaf_pages_locales_parent_id_idx" ON "books_leaf_pages_locales" USING btree ("_parent_id");
  CREATE INDEX "books_cover_idx" ON "books" USING btree ("cover_id");
  CREATE INDEX "books_universe_idx" ON "books" USING btree ("universe_id");
  CREATE INDEX "books_seo_seo_image_idx" ON "books" USING btree ("seo_image_id");
  CREATE INDEX "books_updated_at_idx" ON "books" USING btree ("updated_at");
  CREATE INDEX "books_created_at_idx" ON "books" USING btree ("created_at");
  CREATE INDEX "books__status_idx" ON "books" USING btree ("_status");
  CREATE UNIQUE INDEX "books_slug_idx" ON "books_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "books_locales_locale_parent_id_unique" ON "books_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "books_locales_parent_id_idx" ON "books_locales" USING btree ("_parent_id");
  CREATE INDEX "_books_v_version_formats_order_idx" ON "_books_v_version_formats" USING btree ("_order");
  CREATE INDEX "_books_v_version_formats_parent_id_idx" ON "_books_v_version_formats" USING btree ("_parent_id");
  CREATE INDEX "_books_v_version_store_links_order_idx" ON "_books_v_version_store_links" USING btree ("_order");
  CREATE INDEX "_books_v_version_store_links_parent_id_idx" ON "_books_v_version_store_links" USING btree ("_parent_id");
  CREATE INDEX "_books_v_version_leaf_pages_order_idx" ON "_books_v_version_leaf_pages" USING btree ("_order");
  CREATE INDEX "_books_v_version_leaf_pages_parent_id_idx" ON "_books_v_version_leaf_pages" USING btree ("_parent_id");
  CREATE INDEX "_books_v_version_leaf_pages_image_idx" ON "_books_v_version_leaf_pages" USING btree ("image_id");
  CREATE UNIQUE INDEX "_books_v_version_leaf_pages_locales_locale_parent_id_unique" ON "_books_v_version_leaf_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_books_v_version_leaf_pages_locales_parent_id_idx" ON "_books_v_version_leaf_pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_books_v_parent_idx" ON "_books_v" USING btree ("parent_id");
  CREATE INDEX "_books_v_version_version_cover_idx" ON "_books_v" USING btree ("version_cover_id");
  CREATE INDEX "_books_v_version_version_universe_idx" ON "_books_v" USING btree ("version_universe_id");
  CREATE INDEX "_books_v_version_seo_version_seo_image_idx" ON "_books_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_books_v_version_version_updated_at_idx" ON "_books_v" USING btree ("version_updated_at");
  CREATE INDEX "_books_v_version_version_created_at_idx" ON "_books_v" USING btree ("version_created_at");
  CREATE INDEX "_books_v_version_version__status_idx" ON "_books_v" USING btree ("version__status");
  CREATE INDEX "_books_v_created_at_idx" ON "_books_v" USING btree ("created_at");
  CREATE INDEX "_books_v_updated_at_idx" ON "_books_v" USING btree ("updated_at");
  CREATE INDEX "_books_v_snapshot_idx" ON "_books_v" USING btree ("snapshot");
  CREATE INDEX "_books_v_published_locale_idx" ON "_books_v" USING btree ("published_locale");
  CREATE INDEX "_books_v_latest_idx" ON "_books_v" USING btree ("latest");
  CREATE INDEX "_books_v_version_version_slug_idx" ON "_books_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_books_v_locales_locale_parent_id_unique" ON "_books_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_books_v_locales_parent_id_idx" ON "_books_v_locales" USING btree ("_parent_id");
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_locales_locale_parent_id_unique" ON "products_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_locales_parent_id_idx" ON "products_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "products_universe_idx" ON "products" USING btree ("universe_id");
  CREATE INDEX "products_seo_seo_image_idx" ON "products" USING btree ("seo_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_version_specs_order_idx" ON "_products_v_version_specs" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_parent_id_idx" ON "_products_v_version_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_locales_locale_parent_id_unique" ON "_products_v_version_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_locales_parent_id_idx" ON "_products_v_version_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_universe_idx" ON "_products_v" USING btree ("version_universe_id");
  CREATE INDEX "_products_v_version_seo_version_seo_image_idx" ON "_products_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "artworks_seo_seo_image_idx" ON "artworks" USING btree ("seo_image_id");
  CREATE INDEX "artworks_updated_at_idx" ON "artworks" USING btree ("updated_at");
  CREATE INDEX "artworks_created_at_idx" ON "artworks" USING btree ("created_at");
  CREATE INDEX "artworks__status_idx" ON "artworks" USING btree ("_status");
  CREATE UNIQUE INDEX "artworks_slug_idx" ON "artworks_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "artworks_locales_locale_parent_id_unique" ON "artworks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "artworks_locales_parent_id_idx" ON "artworks_locales" USING btree ("_parent_id");
  CREATE INDEX "artworks_rels_order_idx" ON "artworks_rels" USING btree ("order");
  CREATE INDEX "artworks_rels_parent_idx" ON "artworks_rels" USING btree ("parent_id");
  CREATE INDEX "artworks_rels_path_idx" ON "artworks_rels" USING btree ("path");
  CREATE INDEX "artworks_rels_media_id_idx" ON "artworks_rels" USING btree ("media_id");
  CREATE INDEX "_artworks_v_parent_idx" ON "_artworks_v" USING btree ("parent_id");
  CREATE INDEX "_artworks_v_version_seo_version_seo_image_idx" ON "_artworks_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_artworks_v_version_version_updated_at_idx" ON "_artworks_v" USING btree ("version_updated_at");
  CREATE INDEX "_artworks_v_version_version_created_at_idx" ON "_artworks_v" USING btree ("version_created_at");
  CREATE INDEX "_artworks_v_version_version__status_idx" ON "_artworks_v" USING btree ("version__status");
  CREATE INDEX "_artworks_v_created_at_idx" ON "_artworks_v" USING btree ("created_at");
  CREATE INDEX "_artworks_v_updated_at_idx" ON "_artworks_v" USING btree ("updated_at");
  CREATE INDEX "_artworks_v_snapshot_idx" ON "_artworks_v" USING btree ("snapshot");
  CREATE INDEX "_artworks_v_published_locale_idx" ON "_artworks_v" USING btree ("published_locale");
  CREATE INDEX "_artworks_v_latest_idx" ON "_artworks_v" USING btree ("latest");
  CREATE INDEX "_artworks_v_version_version_slug_idx" ON "_artworks_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_artworks_v_locales_locale_parent_id_unique" ON "_artworks_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_artworks_v_locales_parent_id_idx" ON "_artworks_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_rels_order_idx" ON "_artworks_v_rels" USING btree ("order");
  CREATE INDEX "_artworks_v_rels_parent_idx" ON "_artworks_v_rels" USING btree ("parent_id");
  CREATE INDEX "_artworks_v_rels_path_idx" ON "_artworks_v_rels" USING btree ("path");
  CREATE INDEX "_artworks_v_rels_media_id_idx" ON "_artworks_v_rels" USING btree ("media_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "events_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_locales_parent_id_idx" ON "_events_v_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_locales_parent_id_idx" ON "_projects_v_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE UNIQUE INDEX "partners_locales_locale_parent_id_unique" ON "partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_locales_parent_id_idx" ON "partners_locales" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_snapshot_idx" ON "_partners_v" USING btree ("snapshot");
  CREATE INDEX "_partners_v_published_locale_idx" ON "_partners_v" USING btree ("published_locale");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_partners_v_locales_locale_parent_id_unique" ON "_partners_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_partners_v_locales_parent_id_idx" ON "_partners_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_pages_kind_idx" ON "legal_pages" USING btree ("kind");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE INDEX "legal_pages__status_idx" ON "legal_pages" USING btree ("_status");
  CREATE UNIQUE INDEX "legal_pages_locales_locale_parent_id_unique" ON "legal_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "legal_pages_locales_parent_id_idx" ON "legal_pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_legal_pages_v_parent_idx" ON "_legal_pages_v" USING btree ("parent_id");
  CREATE INDEX "_legal_pages_v_version_version_kind_idx" ON "_legal_pages_v" USING btree ("version_kind");
  CREATE INDEX "_legal_pages_v_version_version_updated_at_idx" ON "_legal_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_pages_v_version_version_created_at_idx" ON "_legal_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_pages_v_version_version__status_idx" ON "_legal_pages_v" USING btree ("version__status");
  CREATE INDEX "_legal_pages_v_created_at_idx" ON "_legal_pages_v" USING btree ("created_at");
  CREATE INDEX "_legal_pages_v_updated_at_idx" ON "_legal_pages_v" USING btree ("updated_at");
  CREATE INDEX "_legal_pages_v_snapshot_idx" ON "_legal_pages_v" USING btree ("snapshot");
  CREATE INDEX "_legal_pages_v_published_locale_idx" ON "_legal_pages_v" USING btree ("published_locale");
  CREATE INDEX "_legal_pages_v_latest_idx" ON "_legal_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_legal_pages_v_locales_locale_parent_id_unique" ON "_legal_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_legal_pages_v_locales_parent_id_idx" ON "_legal_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_sm_sizes_sm_filename_idx" ON "media" USING btree ("sizes_sm_filename");
  CREATE INDEX "media_sizes_md_sizes_md_filename_idx" ON "media" USING btree ("sizes_md_filename");
  CREATE INDEX "media_sizes_lg_sizes_lg_filename_idx" ON "media" USING btree ("sizes_lg_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_universes_id_idx" ON "payload_locked_documents_rels" USING btree ("universes_id");
  CREATE INDEX "payload_locked_documents_rels_books_id_idx" ON "payload_locked_documents_rels" USING btree ("books_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_artworks_id_idx" ON "payload_locked_documents_rels" USING btree ("artworks_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_manifesto_order_idx" ON "site_settings_manifesto" USING btree ("_order");
  CREATE INDEX "site_settings_manifesto_parent_id_idx" ON "site_settings_manifesto" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_manifesto_locales_locale_parent_id_unique" ON "site_settings_manifesto_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_manifesto_locales_parent_id_idx" ON "site_settings_manifesto_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_same_as_order_idx" ON "site_settings_same_as" USING btree ("_order");
  CREATE INDEX "site_settings_same_as_parent_id_idx" ON "site_settings_same_as" USING btree ("_parent_id");
  CREATE INDEX "site_settings_home_home_featured_book_idx" ON "site_settings" USING btree ("home_featured_book_id");
  CREATE INDEX "site_settings_portrait_idx" ON "site_settings" USING btree ("portrait_id");
  CREATE INDEX "site_settings_seo_seo_share_image_idx" ON "site_settings" USING btree ("seo_share_image_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_artworks_id_idx" ON "site_settings_rels" USING btree ("artworks_id");
  CREATE INDEX "_site_settings_v_version_manifesto_order_idx" ON "_site_settings_v_version_manifesto" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_manifesto_parent_id_idx" ON "_site_settings_v_version_manifesto" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_settings_v_version_manifesto_locales_locale_parent_id_" ON "_site_settings_v_version_manifesto_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_manifesto_locales_parent_id_idx" ON "_site_settings_v_version_manifesto_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_same_as_order_idx" ON "_site_settings_v_version_same_as" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_same_as_parent_id_idx" ON "_site_settings_v_version_same_as" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_home_version_home_featured_book_idx" ON "_site_settings_v" USING btree ("version_home_featured_book_id");
  CREATE INDEX "_site_settings_v_version_version_portrait_idx" ON "_site_settings_v" USING btree ("version_portrait_id");
  CREATE INDEX "_site_settings_v_version_seo_version_seo_share_image_idx" ON "_site_settings_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_locales_parent_id_idx" ON "_site_settings_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_rels_order_idx" ON "_site_settings_v_rels" USING btree ("order");
  CREATE INDEX "_site_settings_v_rels_parent_idx" ON "_site_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_site_settings_v_rels_path_idx" ON "_site_settings_v_rels" USING btree ("path");
  CREATE INDEX "_site_settings_v_rels_artworks_id_idx" ON "_site_settings_v_rels" USING btree ("artworks_id");
  CREATE INDEX "counselling_page_formats_order_idx" ON "counselling_page_formats" USING btree ("_order");
  CREATE INDEX "counselling_page_formats_parent_id_idx" ON "counselling_page_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_formats_locales_locale_parent_id_unique" ON "counselling_page_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_formats_locales_parent_id_idx" ON "counselling_page_formats_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_sessions_order_idx" ON "counselling_page_sessions" USING btree ("_order");
  CREATE INDEX "counselling_page_sessions_parent_id_idx" ON "counselling_page_sessions" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_steps_order_idx" ON "counselling_page_steps" USING btree ("_order");
  CREATE INDEX "counselling_page_steps_parent_id_idx" ON "counselling_page_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_steps_locales_locale_parent_id_unique" ON "counselling_page_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_steps_locales_parent_id_idx" ON "counselling_page_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_faq_order_idx" ON "counselling_page_faq" USING btree ("_order");
  CREATE INDEX "counselling_page_faq_parent_id_idx" ON "counselling_page_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_faq_locales_locale_parent_id_unique" ON "counselling_page_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_faq_locales_parent_id_idx" ON "counselling_page_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page__status_idx" ON "counselling_page" USING btree ("_status");
  CREATE UNIQUE INDEX "counselling_page_locales_locale_parent_id_unique" ON "counselling_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_locales_parent_id_idx" ON "counselling_page_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_formats_order_idx" ON "_counselling_page_v_version_formats" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_formats_parent_id_idx" ON "_counselling_page_v_version_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_formats_locales_locale_parent_id" ON "_counselling_page_v_version_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_formats_locales_parent_id_idx" ON "_counselling_page_v_version_formats_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_sessions_order_idx" ON "_counselling_page_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_sessions_parent_id_idx" ON "_counselling_page_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_steps_order_idx" ON "_counselling_page_v_version_steps" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_steps_parent_id_idx" ON "_counselling_page_v_version_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_steps_locales_locale_parent_id_u" ON "_counselling_page_v_version_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_steps_locales_parent_id_idx" ON "_counselling_page_v_version_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_faq_order_idx" ON "_counselling_page_v_version_faq" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_faq_parent_id_idx" ON "_counselling_page_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_faq_locales_locale_parent_id_uni" ON "_counselling_page_v_version_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_faq_locales_parent_id_idx" ON "_counselling_page_v_version_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_version__status_idx" ON "_counselling_page_v" USING btree ("version__status");
  CREATE INDEX "_counselling_page_v_created_at_idx" ON "_counselling_page_v" USING btree ("created_at");
  CREATE INDEX "_counselling_page_v_updated_at_idx" ON "_counselling_page_v" USING btree ("updated_at");
  CREATE INDEX "_counselling_page_v_snapshot_idx" ON "_counselling_page_v" USING btree ("snapshot");
  CREATE INDEX "_counselling_page_v_published_locale_idx" ON "_counselling_page_v" USING btree ("published_locale");
  CREATE INDEX "_counselling_page_v_latest_idx" ON "_counselling_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_counselling_page_v_locales_locale_parent_id_unique" ON "_counselling_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_locales_parent_id_idx" ON "_counselling_page_v_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_highlights_order_idx" ON "about_page_highlights" USING btree ("_order");
  CREATE INDEX "about_page_highlights_parent_id_idx" ON "about_page_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_highlights_locales_locale_parent_id_unique" ON "about_page_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_highlights_locales_parent_id_idx" ON "about_page_highlights_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_portrait_idx" ON "about_page" USING btree ("portrait_id");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_locales_parent_id_idx" ON "about_page_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_highlights_order_idx" ON "_about_page_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_highlights_parent_id_idx" ON "_about_page_v_version_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_about_page_v_version_highlights_locales_locale_parent_id_un" ON "_about_page_v_version_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_page_v_version_highlights_locales_parent_id_idx" ON "_about_page_v_version_highlights_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_version_portrait_idx" ON "_about_page_v" USING btree ("version_portrait_id");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_snapshot_idx" ON "_about_page_v" USING btree ("snapshot");
  CREATE INDEX "_about_page_v_published_locale_idx" ON "_about_page_v" USING btree ("published_locale");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_about_page_v_locales_locale_parent_id_unique" ON "_about_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_page_v_locales_parent_id_idx" ON "_about_page_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "universes" CASCADE;
  DROP TABLE "universes_locales" CASCADE;
  DROP TABLE "universes_rels" CASCADE;
  DROP TABLE "_universes_v" CASCADE;
  DROP TABLE "_universes_v_locales" CASCADE;
  DROP TABLE "_universes_v_rels" CASCADE;
  DROP TABLE "books_formats" CASCADE;
  DROP TABLE "books_store_links" CASCADE;
  DROP TABLE "books_leaf_pages" CASCADE;
  DROP TABLE "books_leaf_pages_locales" CASCADE;
  DROP TABLE "books" CASCADE;
  DROP TABLE "books_locales" CASCADE;
  DROP TABLE "_books_v_version_formats" CASCADE;
  DROP TABLE "_books_v_version_store_links" CASCADE;
  DROP TABLE "_books_v_version_leaf_pages" CASCADE;
  DROP TABLE "_books_v_version_leaf_pages_locales" CASCADE;
  DROP TABLE "_books_v" CASCADE;
  DROP TABLE "_books_v_locales" CASCADE;
  DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_specs_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_specs" CASCADE;
  DROP TABLE "_products_v_version_specs_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "artworks" CASCADE;
  DROP TABLE "artworks_locales" CASCADE;
  DROP TABLE "artworks_rels" CASCADE;
  DROP TABLE "_artworks_v" CASCADE;
  DROP TABLE "_artworks_v_locales" CASCADE;
  DROP TABLE "_artworks_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partners_locales" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_locales" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "legal_pages_locales" CASCADE;
  DROP TABLE "_legal_pages_v" CASCADE;
  DROP TABLE "_legal_pages_v_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_manifesto" CASCADE;
  DROP TABLE "site_settings_manifesto_locales" CASCADE;
  DROP TABLE "site_settings_same_as" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "_site_settings_v_version_manifesto" CASCADE;
  DROP TABLE "_site_settings_v_version_manifesto_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_same_as" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP TABLE "_site_settings_v_rels" CASCADE;
  DROP TABLE "counselling_page_formats" CASCADE;
  DROP TABLE "counselling_page_formats_locales" CASCADE;
  DROP TABLE "counselling_page_sessions" CASCADE;
  DROP TABLE "counselling_page_steps" CASCADE;
  DROP TABLE "counselling_page_steps_locales" CASCADE;
  DROP TABLE "counselling_page_faq" CASCADE;
  DROP TABLE "counselling_page_faq_locales" CASCADE;
  DROP TABLE "counselling_page" CASCADE;
  DROP TABLE "counselling_page_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_formats" CASCADE;
  DROP TABLE "_counselling_page_v_version_formats_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_sessions" CASCADE;
  DROP TABLE "_counselling_page_v_version_steps" CASCADE;
  DROP TABLE "_counselling_page_v_version_steps_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_faq" CASCADE;
  DROP TABLE "_counselling_page_v_version_faq_locales" CASCADE;
  DROP TABLE "_counselling_page_v" CASCADE;
  DROP TABLE "_counselling_page_v_locales" CASCADE;
  DROP TABLE "about_page_highlights" CASCADE;
  DROP TABLE "about_page_highlights_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "_about_page_v_version_highlights" CASCADE;
  DROP TABLE "_about_page_v_version_highlights_locales" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "_about_page_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_universes_release";
  DROP TYPE "public"."enum_universes_home_window";
  DROP TYPE "public"."enum_universes_creature";
  DROP TYPE "public"."enum_universes_status";
  DROP TYPE "public"."enum__universes_v_version_home_window";
  DROP TYPE "public"."enum__universes_v_version_creature";
  DROP TYPE "public"."enum__universes_v_version_status";
  DROP TYPE "public"."enum__universes_v_published_locale";
  DROP TYPE "public"."enum_books_formats_status";
  DROP TYPE "public"."enum_books_age_group";
  DROP TYPE "public"."enum_books_release";
  DROP TYPE "public"."enum_books_status";
  DROP TYPE "public"."enum__books_v_version_formats_status";
  DROP TYPE "public"."enum__books_v_version_age_group";
  DROP TYPE "public"."enum__books_v_version_status";
  DROP TYPE "public"."enum__books_v_published_locale";
  DROP TYPE "public"."enum_products_kind";
  DROP TYPE "public"."enum_products_release";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_kind";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_artworks_kind";
  DROP TYPE "public"."enum_artworks_availability";
  DROP TYPE "public"."enum_artworks_status";
  DROP TYPE "public"."enum__artworks_v_version_kind";
  DROP TYPE "public"."enum__artworks_v_version_availability";
  DROP TYPE "public"."enum__artworks_v_version_status";
  DROP TYPE "public"."enum__artworks_v_published_locale";
  DROP TYPE "public"."enum_events_kind";
  DROP TYPE "public"."enum_events_timing";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_kind";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_projects_stage";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum__partners_v_published_locale";
  DROP TYPE "public"."enum_legal_pages_kind";
  DROP TYPE "public"."enum_legal_pages_status";
  DROP TYPE "public"."enum__legal_pages_v_version_kind";
  DROP TYPE "public"."enum__legal_pages_v_version_status";
  DROP TYPE "public"."enum__legal_pages_v_published_locale";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";
  DROP TYPE "public"."enum_counselling_page_formats_kind";
  DROP TYPE "public"."enum_counselling_page_status";
  DROP TYPE "public"."enum__counselling_page_v_version_formats_kind";
  DROP TYPE "public"."enum__counselling_page_v_version_status";
  DROP TYPE "public"."enum__counselling_page_v_published_locale";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum__about_page_v_published_locale";`)
}
