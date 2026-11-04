import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Hand-edited from the generated statements so nothing is lost: the existing covers, pages and images become the
  // Romanian edition's and are copied to the English one (the seed then swaps in her English files).
  await db.execute(sql`
  ALTER TABLE "books" DROP CONSTRAINT "books_cover_id_media_id_fk";
  ALTER TABLE "_books_v" DROP CONSTRAINT "_books_v_version_cover_id_media_id_fk";
  DROP INDEX "books_cover_idx";
  DROP INDEX "_books_v_version_version_cover_idx";
  DROP INDEX "products_rels_media_id_idx";
  DROP INDEX "_products_v_rels_media_id_idx";
  DROP INDEX "artworks_rels_media_id_idx";
  DROP INDEX "_artworks_v_rels_media_id_idx";

  -- Răsfoiește: each row keeps its RO label and becomes a Romanian row; a copy becomes the English row
  ALTER TABLE "books_leaf_pages" ADD COLUMN "_locale" "_locales";
  ALTER TABLE "books_leaf_pages" ADD COLUMN "label" varchar;
  UPDATE "books_leaf_pages" p SET "_locale" = 'ro', "label" = l."label"
    FROM "books_leaf_pages_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'ro';
  UPDATE "books_leaf_pages" SET "_locale" = 'ro' WHERE "_locale" IS NULL;
  INSERT INTO "books_leaf_pages" ("_order", "_parent_id", "id", "image_id", "_locale", "label")
    SELECT p."_order", p."_parent_id", substr(md5(random()::text || p."id"), 1, 24), p."image_id", 'en', l."label"
    FROM "books_leaf_pages" p LEFT JOIN "books_leaf_pages_locales" l ON l."_parent_id" = p."id" AND l."_locale" = 'en';
  ALTER TABLE "books_leaf_pages" ALTER COLUMN "_locale" SET NOT NULL;
  ALTER TABLE "_books_v_version_leaf_pages" ADD COLUMN "_locale" "_locales";
  ALTER TABLE "_books_v_version_leaf_pages" ADD COLUMN "label" varchar;
  UPDATE "_books_v_version_leaf_pages" p SET "_locale" = 'ro', "label" = l."label"
    FROM "_books_v_version_leaf_pages_locales" l WHERE l."_parent_id" = p."id" AND l."_locale" = 'ro';
  UPDATE "_books_v_version_leaf_pages" SET "_locale" = 'ro' WHERE "_locale" IS NULL;
  ALTER TABLE "_books_v_version_leaf_pages" ALTER COLUMN "_locale" SET NOT NULL;
  DROP TABLE "books_leaf_pages_locales" CASCADE;
  DROP TABLE "_books_v_version_leaf_pages_locales" CASCADE;

  -- the cover moves to the per-language rows, both starting with the current one
  ALTER TABLE "books_locales" ADD COLUMN "cover_id" integer;
  UPDATE "books_locales" l SET "cover_id" = b."cover_id" FROM "books" b WHERE l."_parent_id" = b."id";
  ALTER TABLE "_books_v_locales" ADD COLUMN "version_cover_id" integer;
  UPDATE "_books_v_locales" l SET "version_cover_id" = v."version_cover_id" FROM "_books_v" v WHERE l."_parent_id" = v."id";

  -- product and artwork images: the current ones are Romanian, copied to English
  ALTER TABLE "products_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_products_v_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "artworks_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_artworks_v_rels" ADD COLUMN "locale" "_locales";
  UPDATE "products_rels" SET "locale" = 'ro' WHERE "path" = 'images';
  UPDATE "_products_v_rels" SET "locale" = 'ro' WHERE "path" = 'version.images';
  UPDATE "artworks_rels" SET "locale" = 'ro' WHERE "path" = 'images';
  UPDATE "_artworks_v_rels" SET "locale" = 'ro' WHERE "path" = 'version.images';
  INSERT INTO "products_rels" ("order", "parent_id", "path", "media_id", "locale")
    SELECT "order", "parent_id", "path", "media_id", 'en' FROM "products_rels" WHERE "path" = 'images';
  INSERT INTO "artworks_rels" ("order", "parent_id", "path", "media_id", "locale")
    SELECT "order", "parent_id", "path", "media_id", 'en' FROM "artworks_rels" WHERE "path" = 'images';

  ALTER TABLE "books_locales" ADD CONSTRAINT "books_locales_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v_locales" ADD CONSTRAINT "_books_v_locales_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "books_leaf_pages_locale_idx" ON "books_leaf_pages" USING btree ("_locale");
  CREATE INDEX "books_cover_idx" ON "books_locales" USING btree ("cover_id","_locale");
  CREATE INDEX "_books_v_version_leaf_pages_locale_idx" ON "_books_v_version_leaf_pages" USING btree ("_locale");
  CREATE INDEX "_books_v_version_version_cover_idx" ON "_books_v_locales" USING btree ("version_cover_id","_locale");
  CREATE INDEX "products_rels_locale_idx" ON "products_rels" USING btree ("locale");
  CREATE INDEX "_products_v_rels_locale_idx" ON "_products_v_rels" USING btree ("locale");
  CREATE INDEX "artworks_rels_locale_idx" ON "artworks_rels" USING btree ("locale");
  CREATE INDEX "_artworks_v_rels_locale_idx" ON "_artworks_v_rels" USING btree ("locale");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id","locale");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "artworks_rels_media_id_idx" ON "artworks_rels" USING btree ("media_id","locale");
  CREATE INDEX "_artworks_v_rels_media_id_idx" ON "_artworks_v_rels" USING btree ("media_id","locale");
  ALTER TABLE "books" DROP COLUMN "cover_id";
  ALTER TABLE "_books_v" DROP COLUMN "version_cover_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "books_leaf_pages_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_books_v_version_leaf_pages_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "books_locales" DROP CONSTRAINT "books_locales_cover_id_media_id_fk";
  
  ALTER TABLE "_books_v_locales" DROP CONSTRAINT "_books_v_locales_version_cover_id_media_id_fk";
  
  DROP INDEX "books_leaf_pages_locale_idx";
  DROP INDEX "books_cover_idx";
  DROP INDEX "_books_v_version_leaf_pages_locale_idx";
  DROP INDEX "_books_v_version_version_cover_idx";
  DROP INDEX "products_rels_locale_idx";
  DROP INDEX "_products_v_rels_locale_idx";
  DROP INDEX "artworks_rels_locale_idx";
  DROP INDEX "_artworks_v_rels_locale_idx";
  DROP INDEX "products_rels_media_id_idx";
  DROP INDEX "_products_v_rels_media_id_idx";
  DROP INDEX "artworks_rels_media_id_idx";
  DROP INDEX "_artworks_v_rels_media_id_idx";
  ALTER TABLE "books" ADD COLUMN "cover_id" integer;
  ALTER TABLE "_books_v" ADD COLUMN "version_cover_id" integer;
  ALTER TABLE "books_leaf_pages_locales" ADD CONSTRAINT "books_leaf_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."books_leaf_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_books_v_version_leaf_pages_locales" ADD CONSTRAINT "_books_v_version_leaf_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_books_v_version_leaf_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "books_leaf_pages_locales_locale_parent_id_unique" ON "books_leaf_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "books_leaf_pages_locales_parent_id_idx" ON "books_leaf_pages_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_books_v_version_leaf_pages_locales_locale_parent_id_unique" ON "_books_v_version_leaf_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_books_v_version_leaf_pages_locales_parent_id_idx" ON "_books_v_version_leaf_pages_locales" USING btree ("_parent_id");
  ALTER TABLE "books" ADD CONSTRAINT "books_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "books_cover_idx" ON "books" USING btree ("cover_id");
  CREATE INDEX "_books_v_version_version_cover_idx" ON "_books_v" USING btree ("version_cover_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "artworks_rels_media_id_idx" ON "artworks_rels" USING btree ("media_id");
  CREATE INDEX "_artworks_v_rels_media_id_idx" ON "_artworks_v_rels" USING btree ("media_id");
  ALTER TABLE "books_leaf_pages" DROP COLUMN "_locale";
  ALTER TABLE "books_leaf_pages" DROP COLUMN "label";
  ALTER TABLE "books_locales" DROP COLUMN "cover_id";
  ALTER TABLE "_books_v_version_leaf_pages" DROP COLUMN "_locale";
  ALTER TABLE "_books_v_version_leaf_pages" DROP COLUMN "label";
  ALTER TABLE "_books_v_locales" DROP COLUMN "version_cover_id";
  ALTER TABLE "products_rels" DROP COLUMN "locale";
  ALTER TABLE "_products_v_rels" DROP COLUMN "locale";
  ALTER TABLE "artworks_rels" DROP COLUMN "locale";
  ALTER TABLE "_artworks_v_rels" DROP COLUMN "locale";`)
}
