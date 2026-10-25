import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_gallery" AS ENUM('bookmarks', 'cards');
  CREATE TYPE "public"."enum_about_story_kind" AS ENUM('beat', 'question', 'closing');
  CREATE TYPE "public"."enum_books_page_format_status" AS ENUM('soon', 'planned');
  CREATE TYPE "public"."enum_books_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__books_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__books_page_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_community_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__community_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__community_page_v_published_locale" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_published_locale" AS ENUM('ro', 'en');
  CREATE TABLE "counselling_page_patterns_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_questions_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_reactions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_reactions_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_path" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_path_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_toward" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_patterns_toward_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_right_for_you_maybe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_right_for_you_maybe_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_right_for_you_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_right_for_you_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "counselling_page_right_for_you_offer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "counselling_page_right_for_you_offer_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_questions_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_reactions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_reactions_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_path" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_path_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_toward" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_patterns_toward_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_right_for_you_maybe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_right_for_you_maybe_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_right_for_you_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_right_for_you_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_counselling_page_v_version_right_for_you_offer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_counselling_page_v_version_right_for_you_offer_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_about_story_kind" DEFAULT 'beat',
  	"break_before" boolean
  );
  
  CREATE TABLE "about_page_story_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_crafts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"tint" varchar
  );
  
  CREATE TABLE "about_page_crafts_items_locales" (
  	"name" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_about_page_v_version_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_about_story_kind" DEFAULT 'beat',
  	"break_before" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_story_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_v_version_crafts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"tint" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_crafts_items_locales" (
  	"name" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "books_page_author_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "books_page_author_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "books_page_author_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_books_page_format_status" DEFAULT 'soon'
  );
  
  CREATE TABLE "books_page_author_formats_locales" (
  	"label" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "books_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_books_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "books_page_locales" (
  	"series_note" varchar,
  	"author_title" varchar,
  	"author_statement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_books_page_v_version_author_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_books_page_v_version_author_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_books_page_v_version_author_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_books_page_format_status" DEFAULT 'soon',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_books_page_v_version_author_formats_locales" (
  	"label" varchar,
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_books_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__books_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__books_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_books_page_v_locales" (
  	"version_series_note" varchar,
  	"version_author_title" varchar,
  	"version_author_statement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "community_page_partners_lead" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "community_page_partners_lead_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "community_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_community_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "community_page_locales" (
  	"title_a" varchar,
  	"title_b" varchar,
  	"tagline" varchar,
  	"lead" varchar,
  	"intro" varchar,
  	"events_title" varchar,
  	"events_lead" varchar,
  	"projects_title" varchar,
  	"projects_lead" varchar,
  	"partners_title" varchar,
  	"closing" varchar,
  	"cta_title" varchar,
  	"cta_line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_community_page_v_version_partners_lead" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_community_page_v_version_partners_lead_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_community_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__community_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__community_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_community_page_v_locales" (
  	"version_title_a" varchar,
  	"version_title_b" varchar,
  	"version_tagline" varchar,
  	"version_lead" varchar,
  	"version_intro" varchar,
  	"version_events_title" varchar,
  	"version_events_lead" varchar,
  	"version_projects_title" varchar,
  	"version_projects_lead" varchar,
  	"version_partners_title" varchar,
  	"version_closing" varchar,
  	"version_cta_title" varchar,
  	"version_cta_line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__contact_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_contact_page_v_locales" (
  	"version_tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "products_slug_idx";
  ALTER TABLE "products" ADD COLUMN "gallery" "enum_products_gallery";
  ALTER TABLE "_products_v" ADD COLUMN "version_gallery" "enum_products_gallery";
  ALTER TABLE "partners" ADD COLUMN "handle" varchar;
  ALTER TABLE "_partners_v" ADD COLUMN "version_handle" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "tagline" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "patterns_title" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "patterns_thesis" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "patterns_explain" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "patterns_change" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "patterns_closer" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "right_for_you_title" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "right_for_you_simply" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "right_for_you_here" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "right_for_you_close" varchar;
  ALTER TABLE "counselling_page_locales" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_tagline" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_patterns_title" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_patterns_thesis" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_patterns_explain" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_patterns_change" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_patterns_closer" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_right_for_you_title" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_right_for_you_simply" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_right_for_you_here" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_right_for_you_close" varchar;
  ALTER TABLE "_counselling_page_v_locales" ADD COLUMN "version_cta_title" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "title_a" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "title_b" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "role" varchar;
  ALTER TABLE "about_page_locales" ADD COLUMN "crafts_title" varchar;
  ALTER TABLE "_about_page_v_locales" ADD COLUMN "version_title_a" varchar;
  ALTER TABLE "_about_page_v_locales" ADD COLUMN "version_title_b" varchar;
  ALTER TABLE "_about_page_v_locales" ADD COLUMN "version_role" varchar;
  ALTER TABLE "_about_page_v_locales" ADD COLUMN "version_crafts_title" varchar;
  ALTER TABLE "counselling_page_patterns_questions" ADD CONSTRAINT "counselling_page_patterns_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_questions_locales" ADD CONSTRAINT "counselling_page_patterns_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_patterns_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_reactions" ADD CONSTRAINT "counselling_page_patterns_reactions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_reactions_locales" ADD CONSTRAINT "counselling_page_patterns_reactions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_patterns_reactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_path" ADD CONSTRAINT "counselling_page_patterns_path_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_path_locales" ADD CONSTRAINT "counselling_page_patterns_path_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_patterns_path"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_toward" ADD CONSTRAINT "counselling_page_patterns_toward_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_patterns_toward_locales" ADD CONSTRAINT "counselling_page_patterns_toward_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_patterns_toward"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_right_for_you_maybe" ADD CONSTRAINT "counselling_page_right_for_you_maybe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_right_for_you_maybe_locales" ADD CONSTRAINT "counselling_page_right_for_you_maybe_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_right_for_you_maybe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_right_for_you_body" ADD CONSTRAINT "counselling_page_right_for_you_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_right_for_you_body_locales" ADD CONSTRAINT "counselling_page_right_for_you_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_right_for_you_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_right_for_you_offer" ADD CONSTRAINT "counselling_page_right_for_you_offer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "counselling_page_right_for_you_offer_locales" ADD CONSTRAINT "counselling_page_right_for_you_offer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."counselling_page_right_for_you_offer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_questions" ADD CONSTRAINT "_counselling_page_v_version_patterns_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_questions_locales" ADD CONSTRAINT "_counselling_page_v_version_patterns_questions_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_patterns_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_reactions" ADD CONSTRAINT "_counselling_page_v_version_patterns_reactions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_reactions_locales" ADD CONSTRAINT "_counselling_page_v_version_patterns_reactions_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_patterns_reactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_path" ADD CONSTRAINT "_counselling_page_v_version_patterns_path_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_path_locales" ADD CONSTRAINT "_counselling_page_v_version_patterns_path_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_patterns_path"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_toward" ADD CONSTRAINT "_counselling_page_v_version_patterns_toward_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_patterns_toward_locales" ADD CONSTRAINT "_counselling_page_v_version_patterns_toward_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_patterns_toward"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_right_for_you_maybe" ADD CONSTRAINT "_counselling_page_v_version_right_for_you_maybe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_right_for_you_maybe_locales" ADD CONSTRAINT "_counselling_page_v_version_right_for_you_maybe_locales_p_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_right_for_you_maybe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_right_for_you_body" ADD CONSTRAINT "_counselling_page_v_version_right_for_you_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_right_for_you_body_locales" ADD CONSTRAINT "_counselling_page_v_version_right_for_you_body_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_right_for_you_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_right_for_you_offer" ADD CONSTRAINT "_counselling_page_v_version_right_for_you_offer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_counselling_page_v_version_right_for_you_offer_locales" ADD CONSTRAINT "_counselling_page_v_version_right_for_you_offer_locales_p_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_counselling_page_v_version_right_for_you_offer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story" ADD CONSTRAINT "about_page_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_locales" ADD CONSTRAINT "about_page_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_crafts_items" ADD CONSTRAINT "about_page_crafts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_crafts_items_locales" ADD CONSTRAINT "about_page_crafts_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_crafts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_story" ADD CONSTRAINT "_about_page_v_version_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_story_locales" ADD CONSTRAINT "_about_page_v_version_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_crafts_items" ADD CONSTRAINT "_about_page_v_version_crafts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_crafts_items_locales" ADD CONSTRAINT "_about_page_v_version_crafts_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_version_crafts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_page_author_paragraphs" ADD CONSTRAINT "books_page_author_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_page_author_paragraphs_locales" ADD CONSTRAINT "books_page_author_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_page_author_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_page_author_formats" ADD CONSTRAINT "books_page_author_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_page_author_formats_locales" ADD CONSTRAINT "books_page_author_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_page_author_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "books_page_locales" ADD CONSTRAINT "books_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_page_v_version_author_paragraphs" ADD CONSTRAINT "_books_page_v_version_author_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_page_v_version_author_paragraphs_locales" ADD CONSTRAINT "_books_page_v_version_author_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_page_v_version_author_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_page_v_version_author_formats" ADD CONSTRAINT "_books_page_v_version_author_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_page_v_version_author_formats_locales" ADD CONSTRAINT "_books_page_v_version_author_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_page_v_version_author_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_page_v_locales" ADD CONSTRAINT "_books_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_page_partners_lead" ADD CONSTRAINT "community_page_partners_lead_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."community_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_page_partners_lead_locales" ADD CONSTRAINT "community_page_partners_lead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."community_page_partners_lead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_page_locales" ADD CONSTRAINT "community_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."community_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_page_v_version_partners_lead" ADD CONSTRAINT "_community_page_v_version_partners_lead_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_community_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_page_v_version_partners_lead_locales" ADD CONSTRAINT "_community_page_v_version_partners_lead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_community_page_v_version_partners_lead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_page_v_locales" ADD CONSTRAINT "_community_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_community_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "counselling_page_patterns_questions_order_idx" ON "counselling_page_patterns_questions" USING btree ("_order");
  CREATE INDEX "counselling_page_patterns_questions_parent_id_idx" ON "counselling_page_patterns_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_patterns_questions_locales_locale_parent_id" ON "counselling_page_patterns_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_patterns_questions_locales_parent_id_idx" ON "counselling_page_patterns_questions_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_patterns_reactions_order_idx" ON "counselling_page_patterns_reactions" USING btree ("_order");
  CREATE INDEX "counselling_page_patterns_reactions_parent_id_idx" ON "counselling_page_patterns_reactions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_patterns_reactions_locales_locale_parent_id" ON "counselling_page_patterns_reactions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_patterns_reactions_locales_parent_id_idx" ON "counselling_page_patterns_reactions_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_patterns_path_order_idx" ON "counselling_page_patterns_path" USING btree ("_order");
  CREATE INDEX "counselling_page_patterns_path_parent_id_idx" ON "counselling_page_patterns_path" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_patterns_path_locales_locale_parent_id_uniq" ON "counselling_page_patterns_path_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_patterns_path_locales_parent_id_idx" ON "counselling_page_patterns_path_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_patterns_toward_order_idx" ON "counselling_page_patterns_toward" USING btree ("_order");
  CREATE INDEX "counselling_page_patterns_toward_parent_id_idx" ON "counselling_page_patterns_toward" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_patterns_toward_locales_locale_parent_id_un" ON "counselling_page_patterns_toward_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_patterns_toward_locales_parent_id_idx" ON "counselling_page_patterns_toward_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_right_for_you_maybe_order_idx" ON "counselling_page_right_for_you_maybe" USING btree ("_order");
  CREATE INDEX "counselling_page_right_for_you_maybe_parent_id_idx" ON "counselling_page_right_for_you_maybe" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_right_for_you_maybe_locales_locale_parent_i" ON "counselling_page_right_for_you_maybe_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_right_for_you_maybe_locales_parent_id_idx" ON "counselling_page_right_for_you_maybe_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_right_for_you_body_order_idx" ON "counselling_page_right_for_you_body" USING btree ("_order");
  CREATE INDEX "counselling_page_right_for_you_body_parent_id_idx" ON "counselling_page_right_for_you_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_right_for_you_body_locales_locale_parent_id" ON "counselling_page_right_for_you_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_right_for_you_body_locales_parent_id_idx" ON "counselling_page_right_for_you_body_locales" USING btree ("_parent_id");
  CREATE INDEX "counselling_page_right_for_you_offer_order_idx" ON "counselling_page_right_for_you_offer" USING btree ("_order");
  CREATE INDEX "counselling_page_right_for_you_offer_parent_id_idx" ON "counselling_page_right_for_you_offer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "counselling_page_right_for_you_offer_locales_locale_parent_i" ON "counselling_page_right_for_you_offer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "counselling_page_right_for_you_offer_locales_parent_id_idx" ON "counselling_page_right_for_you_offer_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_questions_order_idx" ON "_counselling_page_v_version_patterns_questions" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_patterns_questions_parent_id_idx" ON "_counselling_page_v_version_patterns_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_patterns_questions_locales_local" ON "_counselling_page_v_version_patterns_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_questions_locales_p_idx" ON "_counselling_page_v_version_patterns_questions_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_reactions_order_idx" ON "_counselling_page_v_version_patterns_reactions" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_patterns_reactions_parent_id_idx" ON "_counselling_page_v_version_patterns_reactions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_patterns_reactions_locales_local" ON "_counselling_page_v_version_patterns_reactions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_reactions_locales_p_idx" ON "_counselling_page_v_version_patterns_reactions_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_path_order_idx" ON "_counselling_page_v_version_patterns_path" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_patterns_path_parent_id_idx" ON "_counselling_page_v_version_patterns_path" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_patterns_path_locales_locale_par" ON "_counselling_page_v_version_patterns_path_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_path_locales_parent_idx" ON "_counselling_page_v_version_patterns_path_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_toward_order_idx" ON "_counselling_page_v_version_patterns_toward" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_patterns_toward_parent_id_idx" ON "_counselling_page_v_version_patterns_toward" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_patterns_toward_locales_locale_p" ON "_counselling_page_v_version_patterns_toward_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_patterns_toward_locales_pare_idx" ON "_counselling_page_v_version_patterns_toward_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_right_for_you_maybe_order_idx" ON "_counselling_page_v_version_right_for_you_maybe" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_right_for_you_maybe_parent_id_idx" ON "_counselling_page_v_version_right_for_you_maybe" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_right_for_you_maybe_locales_loca" ON "_counselling_page_v_version_right_for_you_maybe_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_right_for_you_maybe_locales__idx" ON "_counselling_page_v_version_right_for_you_maybe_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_right_for_you_body_order_idx" ON "_counselling_page_v_version_right_for_you_body" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_right_for_you_body_parent_id_idx" ON "_counselling_page_v_version_right_for_you_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_right_for_you_body_locales_local" ON "_counselling_page_v_version_right_for_you_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_right_for_you_body_locales_p_idx" ON "_counselling_page_v_version_right_for_you_body_locales" USING btree ("_parent_id");
  CREATE INDEX "_counselling_page_v_version_right_for_you_offer_order_idx" ON "_counselling_page_v_version_right_for_you_offer" USING btree ("_order");
  CREATE INDEX "_counselling_page_v_version_right_for_you_offer_parent_id_idx" ON "_counselling_page_v_version_right_for_you_offer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_counselling_page_v_version_right_for_you_offer_locales_loca" ON "_counselling_page_v_version_right_for_you_offer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_counselling_page_v_version_right_for_you_offer_locales__idx" ON "_counselling_page_v_version_right_for_you_offer_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_story_order_idx" ON "about_page_story" USING btree ("_order");
  CREATE INDEX "about_page_story_parent_id_idx" ON "about_page_story" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_story_locales_locale_parent_id_unique" ON "about_page_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_story_locales_parent_id_idx" ON "about_page_story_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_crafts_items_order_idx" ON "about_page_crafts_items" USING btree ("_order");
  CREATE INDEX "about_page_crafts_items_parent_id_idx" ON "about_page_crafts_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_crafts_items_locales_locale_parent_id_unique" ON "about_page_crafts_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_crafts_items_locales_parent_id_idx" ON "about_page_crafts_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_story_order_idx" ON "_about_page_v_version_story" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_story_parent_id_idx" ON "_about_page_v_version_story" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_about_page_v_version_story_locales_locale_parent_id_unique" ON "_about_page_v_version_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_page_v_version_story_locales_parent_id_idx" ON "_about_page_v_version_story_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_crafts_items_order_idx" ON "_about_page_v_version_crafts_items" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_crafts_items_parent_id_idx" ON "_about_page_v_version_crafts_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_about_page_v_version_crafts_items_locales_locale_parent_id_" ON "_about_page_v_version_crafts_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_page_v_version_crafts_items_locales_parent_id_idx" ON "_about_page_v_version_crafts_items_locales" USING btree ("_parent_id");
  CREATE INDEX "books_page_author_paragraphs_order_idx" ON "books_page_author_paragraphs" USING btree ("_order");
  CREATE INDEX "books_page_author_paragraphs_parent_id_idx" ON "books_page_author_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "books_page_author_paragraphs_locales_locale_parent_id_unique" ON "books_page_author_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "books_page_author_paragraphs_locales_parent_id_idx" ON "books_page_author_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "books_page_author_formats_order_idx" ON "books_page_author_formats" USING btree ("_order");
  CREATE INDEX "books_page_author_formats_parent_id_idx" ON "books_page_author_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "books_page_author_formats_locales_locale_parent_id_unique" ON "books_page_author_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "books_page_author_formats_locales_parent_id_idx" ON "books_page_author_formats_locales" USING btree ("_parent_id");
  CREATE INDEX "books_page__status_idx" ON "books_page" USING btree ("_status");
  CREATE UNIQUE INDEX "books_page_locales_locale_parent_id_unique" ON "books_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "books_page_locales_parent_id_idx" ON "books_page_locales" USING btree ("_parent_id");
  CREATE INDEX "_books_page_v_version_author_paragraphs_order_idx" ON "_books_page_v_version_author_paragraphs" USING btree ("_order");
  CREATE INDEX "_books_page_v_version_author_paragraphs_parent_id_idx" ON "_books_page_v_version_author_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_books_page_v_version_author_paragraphs_locales_locale_paren" ON "_books_page_v_version_author_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_books_page_v_version_author_paragraphs_locales_parent_i_idx" ON "_books_page_v_version_author_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "_books_page_v_version_author_formats_order_idx" ON "_books_page_v_version_author_formats" USING btree ("_order");
  CREATE INDEX "_books_page_v_version_author_formats_parent_id_idx" ON "_books_page_v_version_author_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_books_page_v_version_author_formats_locales_locale_parent_i" ON "_books_page_v_version_author_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_books_page_v_version_author_formats_locales_parent_id_idx" ON "_books_page_v_version_author_formats_locales" USING btree ("_parent_id");
  CREATE INDEX "_books_page_v_version_version__status_idx" ON "_books_page_v" USING btree ("version__status");
  CREATE INDEX "_books_page_v_created_at_idx" ON "_books_page_v" USING btree ("created_at");
  CREATE INDEX "_books_page_v_updated_at_idx" ON "_books_page_v" USING btree ("updated_at");
  CREATE INDEX "_books_page_v_snapshot_idx" ON "_books_page_v" USING btree ("snapshot");
  CREATE INDEX "_books_page_v_published_locale_idx" ON "_books_page_v" USING btree ("published_locale");
  CREATE INDEX "_books_page_v_latest_idx" ON "_books_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_books_page_v_locales_locale_parent_id_unique" ON "_books_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_books_page_v_locales_parent_id_idx" ON "_books_page_v_locales" USING btree ("_parent_id");
  CREATE INDEX "community_page_partners_lead_order_idx" ON "community_page_partners_lead" USING btree ("_order");
  CREATE INDEX "community_page_partners_lead_parent_id_idx" ON "community_page_partners_lead" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "community_page_partners_lead_locales_locale_parent_id_unique" ON "community_page_partners_lead_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "community_page_partners_lead_locales_parent_id_idx" ON "community_page_partners_lead_locales" USING btree ("_parent_id");
  CREATE INDEX "community_page__status_idx" ON "community_page" USING btree ("_status");
  CREATE UNIQUE INDEX "community_page_locales_locale_parent_id_unique" ON "community_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "community_page_locales_parent_id_idx" ON "community_page_locales" USING btree ("_parent_id");
  CREATE INDEX "_community_page_v_version_partners_lead_order_idx" ON "_community_page_v_version_partners_lead" USING btree ("_order");
  CREATE INDEX "_community_page_v_version_partners_lead_parent_id_idx" ON "_community_page_v_version_partners_lead" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_community_page_v_version_partners_lead_locales_locale_paren" ON "_community_page_v_version_partners_lead_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_community_page_v_version_partners_lead_locales_parent_i_idx" ON "_community_page_v_version_partners_lead_locales" USING btree ("_parent_id");
  CREATE INDEX "_community_page_v_version_version__status_idx" ON "_community_page_v" USING btree ("version__status");
  CREATE INDEX "_community_page_v_created_at_idx" ON "_community_page_v" USING btree ("created_at");
  CREATE INDEX "_community_page_v_updated_at_idx" ON "_community_page_v" USING btree ("updated_at");
  CREATE INDEX "_community_page_v_snapshot_idx" ON "_community_page_v" USING btree ("snapshot");
  CREATE INDEX "_community_page_v_published_locale_idx" ON "_community_page_v" USING btree ("published_locale");
  CREATE INDEX "_community_page_v_latest_idx" ON "_community_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_community_page_v_locales_locale_parent_id_unique" ON "_community_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_community_page_v_locales_parent_id_idx" ON "_community_page_v_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_locales_parent_id_idx" ON "contact_page_locales" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_snapshot_idx" ON "_contact_page_v" USING btree ("snapshot");
  CREATE INDEX "_contact_page_v_published_locale_idx" ON "_contact_page_v" USING btree ("published_locale");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_contact_page_v_locales_locale_parent_id_unique" ON "_contact_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_contact_page_v_locales_parent_id_idx" ON "_contact_page_v_locales" USING btree ("_parent_id");
  CREATE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "counselling_page_patterns_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_questions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_reactions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_reactions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_path" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_path_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_toward" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_patterns_toward_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_right_for_you_maybe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_right_for_you_maybe_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_right_for_you_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_right_for_you_body_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_right_for_you_offer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "counselling_page_right_for_you_offer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_questions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_reactions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_reactions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_path" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_path_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_toward" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_patterns_toward_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_right_for_you_maybe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_right_for_you_maybe_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_right_for_you_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_right_for_you_body_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_right_for_you_offer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_counselling_page_v_version_right_for_you_offer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_story" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_story_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_crafts_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_crafts_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_story" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_story_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_crafts_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_crafts_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "books_page_author_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "books_page_author_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "books_page_author_formats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "books_page_author_formats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "books_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "books_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_books_page_v_version_author_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_books_page_v_version_author_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_books_page_v_version_author_formats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_books_page_v_version_author_formats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_books_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_books_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "community_page_partners_lead" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "community_page_partners_lead_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "community_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "community_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_community_page_v_version_partners_lead" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_community_page_v_version_partners_lead_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_community_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_community_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "counselling_page_patterns_questions" CASCADE;
  DROP TABLE "counselling_page_patterns_questions_locales" CASCADE;
  DROP TABLE "counselling_page_patterns_reactions" CASCADE;
  DROP TABLE "counselling_page_patterns_reactions_locales" CASCADE;
  DROP TABLE "counselling_page_patterns_path" CASCADE;
  DROP TABLE "counselling_page_patterns_path_locales" CASCADE;
  DROP TABLE "counselling_page_patterns_toward" CASCADE;
  DROP TABLE "counselling_page_patterns_toward_locales" CASCADE;
  DROP TABLE "counselling_page_right_for_you_maybe" CASCADE;
  DROP TABLE "counselling_page_right_for_you_maybe_locales" CASCADE;
  DROP TABLE "counselling_page_right_for_you_body" CASCADE;
  DROP TABLE "counselling_page_right_for_you_body_locales" CASCADE;
  DROP TABLE "counselling_page_right_for_you_offer" CASCADE;
  DROP TABLE "counselling_page_right_for_you_offer_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_questions" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_questions_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_reactions" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_reactions_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_path" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_path_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_toward" CASCADE;
  DROP TABLE "_counselling_page_v_version_patterns_toward_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_right_for_you_maybe" CASCADE;
  DROP TABLE "_counselling_page_v_version_right_for_you_maybe_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_right_for_you_body" CASCADE;
  DROP TABLE "_counselling_page_v_version_right_for_you_body_locales" CASCADE;
  DROP TABLE "_counselling_page_v_version_right_for_you_offer" CASCADE;
  DROP TABLE "_counselling_page_v_version_right_for_you_offer_locales" CASCADE;
  DROP TABLE "about_page_story" CASCADE;
  DROP TABLE "about_page_story_locales" CASCADE;
  DROP TABLE "about_page_crafts_items" CASCADE;
  DROP TABLE "about_page_crafts_items_locales" CASCADE;
  DROP TABLE "_about_page_v_version_story" CASCADE;
  DROP TABLE "_about_page_v_version_story_locales" CASCADE;
  DROP TABLE "_about_page_v_version_crafts_items" CASCADE;
  DROP TABLE "_about_page_v_version_crafts_items_locales" CASCADE;
  DROP TABLE "books_page_author_paragraphs" CASCADE;
  DROP TABLE "books_page_author_paragraphs_locales" CASCADE;
  DROP TABLE "books_page_author_formats" CASCADE;
  DROP TABLE "books_page_author_formats_locales" CASCADE;
  DROP TABLE "books_page" CASCADE;
  DROP TABLE "books_page_locales" CASCADE;
  DROP TABLE "_books_page_v_version_author_paragraphs" CASCADE;
  DROP TABLE "_books_page_v_version_author_paragraphs_locales" CASCADE;
  DROP TABLE "_books_page_v_version_author_formats" CASCADE;
  DROP TABLE "_books_page_v_version_author_formats_locales" CASCADE;
  DROP TABLE "_books_page_v" CASCADE;
  DROP TABLE "_books_page_v_locales" CASCADE;
  DROP TABLE "community_page_partners_lead" CASCADE;
  DROP TABLE "community_page_partners_lead_locales" CASCADE;
  DROP TABLE "community_page" CASCADE;
  DROP TABLE "community_page_locales" CASCADE;
  DROP TABLE "_community_page_v_version_partners_lead" CASCADE;
  DROP TABLE "_community_page_v_version_partners_lead_locales" CASCADE;
  DROP TABLE "_community_page_v" CASCADE;
  DROP TABLE "_community_page_v_locales" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TABLE "_contact_page_v_locales" CASCADE;
  DROP INDEX "products_slug_idx";
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  ALTER TABLE "products" DROP COLUMN "gallery";
  ALTER TABLE "_products_v" DROP COLUMN "version_gallery";
  ALTER TABLE "partners" DROP COLUMN "handle";
  ALTER TABLE "_partners_v" DROP COLUMN "version_handle";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "tagline";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "patterns_title";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "patterns_thesis";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "patterns_explain";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "patterns_change";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "patterns_closer";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "right_for_you_title";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "right_for_you_simply";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "right_for_you_here";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "right_for_you_close";
  ALTER TABLE "counselling_page_locales" DROP COLUMN "cta_title";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_tagline";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_patterns_title";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_patterns_thesis";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_patterns_explain";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_patterns_change";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_patterns_closer";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_right_for_you_title";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_right_for_you_simply";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_right_for_you_here";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_right_for_you_close";
  ALTER TABLE "_counselling_page_v_locales" DROP COLUMN "version_cta_title";
  ALTER TABLE "about_page_locales" DROP COLUMN "title_a";
  ALTER TABLE "about_page_locales" DROP COLUMN "title_b";
  ALTER TABLE "about_page_locales" DROP COLUMN "role";
  ALTER TABLE "about_page_locales" DROP COLUMN "crafts_title";
  ALTER TABLE "_about_page_v_locales" DROP COLUMN "version_title_a";
  ALTER TABLE "_about_page_v_locales" DROP COLUMN "version_title_b";
  ALTER TABLE "_about_page_v_locales" DROP COLUMN "version_role";
  ALTER TABLE "_about_page_v_locales" DROP COLUMN "version_crafts_title";
  DROP TYPE "public"."enum_products_gallery";
  DROP TYPE "public"."enum_about_story_kind";
  DROP TYPE "public"."enum_books_page_format_status";
  DROP TYPE "public"."enum_books_page_status";
  DROP TYPE "public"."enum__books_page_v_version_status";
  DROP TYPE "public"."enum__books_page_v_published_locale";
  DROP TYPE "public"."enum_community_page_status";
  DROP TYPE "public"."enum__community_page_v_version_status";
  DROP TYPE "public"."enum__community_page_v_published_locale";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_status";
  DROP TYPE "public"."enum__contact_page_v_published_locale";`)
}
