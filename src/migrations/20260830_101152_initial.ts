import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_case_study_sections_tone" AS ENUM('paper', 'surface', 'soft', 'alt', 'sage', 'deep');
  CREATE TYPE "public"."enum_projects_case_study_sections_figure" AS ENUM('relation', 'architecture', 'stack', 'infrastructure', 'domain', 'techniques', 'responsibility', 'disclosure', 'status', 'phases', 'research-architecture', 'metrics', 'capabilities', 'planned', 'process-topology', 'aggregation', 'limits', 'growth', 'proof', 'tradeoff', 'gap');
  CREATE TYPE "public"."enum_projects_visual" AS ENUM('system', 'modules', 'relations', 'pipeline', 'grid', 'orbit', 'scan', 'strata', 'flow', 'edge', 'topology');
  CREATE TYPE "public"."enum_projects_case_study_wordmark_accent" AS ENUM('lead', 'tail');
  CREATE TYPE "public"."enum_socials_icon" AS ENUM('github', 'linkedin', 'mail');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_disciplines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_covers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"tone" "enum_projects_case_study_sections_tone" DEFAULT 'paper',
  	"figure" "enum_projects_case_study_sections_figure"
  );
  
  CREATE TABLE "projects_case_study_techniques" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_contributors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar
  );
  
  CREATE TABLE "projects_case_study_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"available" boolean DEFAULT false
  );
  
  CREATE TABLE "projects_case_study_planned" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"available" boolean DEFAULT false
  );
  
  CREATE TABLE "projects_case_study_responsibility_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_disclosure_can_show" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_disclosure_withheld" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_technical_notes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_technical_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_architecture_heads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layer_id" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "projects_case_study_architecture_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layer_id" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "projects_case_study_architecture_aside" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layer_id" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "projects_case_study_infrastructure_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layer_id" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "projects_case_study_domain_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"node_id" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"stage" numeric NOT NULL,
  	"x" numeric NOT NULL,
  	"y" numeric NOT NULL
  );
  
  CREATE TABLE "projects_case_study_domain_edges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_growth" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_tradeoff_left_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_tradeoff_right_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_tradeoff_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_phases_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"complete" boolean DEFAULT false
  );
  
  CREATE TABLE "projects_case_study_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "projects_case_study_data_flows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"carries" varchar NOT NULL,
  	"topic" varchar NOT NULL,
  	"to" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_metrics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_tooling_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_tooling" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_capabilities_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_capabilities_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_topology_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_id" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"kind" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_topology_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "projects_case_study_primitives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_aggregation_measures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_limits_verified" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_limits_not_verified" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_next_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_proof_chain" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_access_model_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects_case_study_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"slug" varchar NOT NULL,
  	"index" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar NOT NULL,
  	"company" varchar,
  	"year" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"visual" "enum_projects_visual" NOT NULL,
  	"accent" varchar NOT NULL,
  	"palette_enabled" boolean DEFAULT false,
  	"palette_accent" varchar,
  	"palette_accent_deep" varchar,
  	"palette_muted" varchar,
  	"palette_surface" varchar,
  	"palette_surface_alt" varchar,
  	"palette_surface_soft" varchar,
  	"palette_warm" varchar,
  	"palette_cream" varchar,
  	"case_study_has_case_study" boolean DEFAULT false,
  	"case_study_statement" varchar,
  	"case_study_seo_description" varchar,
  	"case_study_hero_note" varchar,
  	"case_study_wordmark_lead" varchar,
  	"case_study_wordmark_tail" varchar,
  	"case_study_wordmark_accent" "enum_projects_case_study_wordmark_accent",
  	"case_study_technical_summary" varchar,
  	"case_study_repository" varchar,
  	"case_study_repository_url" varchar,
  	"case_study_public_artifacts" varchar,
  	"case_study_evidence_supported" varchar,
  	"case_study_evidence_not_overstated" varchar,
  	"case_study_responsibility_caveat" varchar,
  	"case_study_tradeoff_left_title" varchar,
  	"case_study_tradeoff_right_title" varchar,
  	"case_study_capabilities_note" varchar,
  	"case_study_aggregation_source" varchar,
  	"case_study_aggregation_group_by" varchar,
  	"case_study_aggregation_output" varchar,
  	"case_study_aggregation_note_title" varchar,
  	"case_study_aggregation_note_body" varchar,
  	"case_study_aggregation_note_formula" varchar,
  	"case_study_gap_label" varchar,
  	"case_study_gap_subject" varchar,
  	"case_study_gap_status" varchar,
  	"case_study_gap_next" varchar,
  	"case_study_proof_note" varchar,
  	"case_study_access_model_title" varchar,
  	"case_study_access_model_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experience_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "experience" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"type" varchar,
  	"location" varchar,
  	"summary" varchar,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_grades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "education" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"number" varchar NOT NULL,
  	"tag" varchar NOT NULL,
  	"qualification" varchar NOT NULL,
  	"institution" varchar,
  	"institution_short" varchar,
  	"description" varchar NOT NULL,
  	"status" varchar,
  	"progress" varchar,
  	"semesters_completed" numeric,
  	"display_lead" varchar,
  	"display_outline" varchar,
  	"display_solid" varchar,
  	"grade_tally_a_stars" numeric,
  	"grade_tally_a_grades" numeric,
  	"achievement" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"caption" varchar NOT NULL,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "technologies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "socials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"icon" "enum_socials_icon" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"kind_id" integer,
  	"credit" varchar,
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
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "media_kinds" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
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
  	"projects_id" integer,
  	"experience_id" integer,
  	"education_id" integer,
  	"stats_id" integer,
  	"technologies_id" integer,
  	"socials_id" integer,
  	"media_id" integer,
  	"media_kinds_id" integer,
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
  
  CREATE TABLE "settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"person_first_name" varchar NOT NULL,
  	"person_last_name" varchar NOT NULL,
  	"person_title" varchar NOT NULL,
  	"person_title_short" varchar NOT NULL,
  	"person_intro" varchar NOT NULL,
  	"person_availability" varchar NOT NULL,
  	"person_location" varchar,
  	"portrait_cutout_id" integer,
  	"portrait_original_id" integer,
  	"site_description" varchar NOT NULL,
  	"site_built_by" varchar,
  	"site_url" varchar,
  	"section_labels_about" varchar NOT NULL,
  	"section_labels_stats" varchar NOT NULL,
  	"section_labels_work" varchar NOT NULL,
  	"section_labels_experience" varchar NOT NULL,
  	"section_labels_education" varchar NOT NULL,
  	"section_labels_technologies" varchar NOT NULL,
  	"section_labels_contact" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"subline" varchar NOT NULL,
  	"subline_accent" varchar NOT NULL,
  	"cta" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "education_intro_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "education_intro" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lede" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "projects_tags" ADD CONSTRAINT "projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_meta" ADD CONSTRAINT "projects_case_study_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_highlights" ADD CONSTRAINT "projects_case_study_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_disciplines" ADD CONSTRAINT "projects_case_study_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_covers" ADD CONSTRAINT "projects_case_study_covers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_technologies" ADD CONSTRAINT "projects_case_study_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_sections_body" ADD CONSTRAINT "projects_case_study_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_case_study_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_sections" ADD CONSTRAINT "projects_case_study_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_techniques" ADD CONSTRAINT "projects_case_study_techniques_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_contributors" ADD CONSTRAINT "projects_case_study_contributors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_credits" ADD CONSTRAINT "projects_case_study_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_status" ADD CONSTRAINT "projects_case_study_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_planned" ADD CONSTRAINT "projects_case_study_planned_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_responsibility_stages" ADD CONSTRAINT "projects_case_study_responsibility_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_disclosure_can_show" ADD CONSTRAINT "projects_case_study_disclosure_can_show_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_disclosure_withheld" ADD CONSTRAINT "projects_case_study_disclosure_withheld_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_technical_notes_items" ADD CONSTRAINT "projects_case_study_technical_notes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_case_study_technical_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_technical_notes" ADD CONSTRAINT "projects_case_study_technical_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_architecture_heads" ADD CONSTRAINT "projects_case_study_architecture_heads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_architecture_stack" ADD CONSTRAINT "projects_case_study_architecture_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_architecture_aside" ADD CONSTRAINT "projects_case_study_architecture_aside_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_infrastructure_stack" ADD CONSTRAINT "projects_case_study_infrastructure_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_domain_nodes" ADD CONSTRAINT "projects_case_study_domain_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_domain_edges" ADD CONSTRAINT "projects_case_study_domain_edges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_growth" ADD CONSTRAINT "projects_case_study_growth_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_tradeoff_left_items" ADD CONSTRAINT "projects_case_study_tradeoff_left_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_tradeoff_right_items" ADD CONSTRAINT "projects_case_study_tradeoff_right_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_tradeoff_words" ADD CONSTRAINT "projects_case_study_tradeoff_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_phases_items" ADD CONSTRAINT "projects_case_study_phases_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_case_study_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_phases" ADD CONSTRAINT "projects_case_study_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_packages" ADD CONSTRAINT "projects_case_study_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_data_flows" ADD CONSTRAINT "projects_case_study_data_flows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_metrics_items" ADD CONSTRAINT "projects_case_study_metrics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_case_study_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_metrics" ADD CONSTRAINT "projects_case_study_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_tooling_items" ADD CONSTRAINT "projects_case_study_tooling_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_case_study_tooling"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_tooling" ADD CONSTRAINT "projects_case_study_tooling_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_capabilities_groups_items" ADD CONSTRAINT "projects_case_study_capabilities_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_case_study_capabilities_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_capabilities_groups" ADD CONSTRAINT "projects_case_study_capabilities_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_topology_steps" ADD CONSTRAINT "projects_case_study_topology_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_topology_support" ADD CONSTRAINT "projects_case_study_topology_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_primitives" ADD CONSTRAINT "projects_case_study_primitives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_aggregation_measures" ADD CONSTRAINT "projects_case_study_aggregation_measures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_limits_verified" ADD CONSTRAINT "projects_case_study_limits_verified_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_limits_not_verified" ADD CONSTRAINT "projects_case_study_limits_not_verified_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_next_proof" ADD CONSTRAINT "projects_case_study_next_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_proof_points" ADD CONSTRAINT "projects_case_study_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_proof_chain" ADD CONSTRAINT "projects_case_study_proof_chain_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_access_model_items" ADD CONSTRAINT "projects_case_study_access_model_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_case_study_media" ADD CONSTRAINT "projects_case_study_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_case_study_media" ADD CONSTRAINT "projects_case_study_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience_skills" ADD CONSTRAINT "experience_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience" ADD CONSTRAINT "experience_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education_grades" ADD CONSTRAINT "education_grades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_kind_id_media_kinds_id_fk" FOREIGN KEY ("kind_id") REFERENCES "public"."media_kinds"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experience_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_fk" FOREIGN KEY ("education_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stats_fk" FOREIGN KEY ("stats_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_technologies_fk" FOREIGN KEY ("technologies_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_socials_fk" FOREIGN KEY ("socials_id") REFERENCES "public"."socials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_kinds_fk" FOREIGN KEY ("media_kinds_id") REFERENCES "public"."media_kinds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_navigation" ADD CONSTRAINT "settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_portrait_cutout_id_media_id_fk" FOREIGN KEY ("portrait_cutout_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_portrait_original_id_media_id_fk" FOREIGN KEY ("portrait_original_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_statement" ADD CONSTRAINT "about_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_headline" ADD CONSTRAINT "contact_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_intro_statement" ADD CONSTRAINT "education_intro_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education_intro"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_tags_order_idx" ON "projects_tags" USING btree ("_order");
  CREATE INDEX "projects_tags_parent_id_idx" ON "projects_tags" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_meta_order_idx" ON "projects_case_study_meta" USING btree ("_order");
  CREATE INDEX "projects_case_study_meta_parent_id_idx" ON "projects_case_study_meta" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_highlights_order_idx" ON "projects_case_study_highlights" USING btree ("_order");
  CREATE INDEX "projects_case_study_highlights_parent_id_idx" ON "projects_case_study_highlights" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_disciplines_order_idx" ON "projects_case_study_disciplines" USING btree ("_order");
  CREATE INDEX "projects_case_study_disciplines_parent_id_idx" ON "projects_case_study_disciplines" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_covers_order_idx" ON "projects_case_study_covers" USING btree ("_order");
  CREATE INDEX "projects_case_study_covers_parent_id_idx" ON "projects_case_study_covers" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_technologies_order_idx" ON "projects_case_study_technologies" USING btree ("_order");
  CREATE INDEX "projects_case_study_technologies_parent_id_idx" ON "projects_case_study_technologies" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_sections_body_order_idx" ON "projects_case_study_sections_body" USING btree ("_order");
  CREATE INDEX "projects_case_study_sections_body_parent_id_idx" ON "projects_case_study_sections_body" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_sections_order_idx" ON "projects_case_study_sections" USING btree ("_order");
  CREATE INDEX "projects_case_study_sections_parent_id_idx" ON "projects_case_study_sections" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_techniques_order_idx" ON "projects_case_study_techniques" USING btree ("_order");
  CREATE INDEX "projects_case_study_techniques_parent_id_idx" ON "projects_case_study_techniques" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_contributors_order_idx" ON "projects_case_study_contributors" USING btree ("_order");
  CREATE INDEX "projects_case_study_contributors_parent_id_idx" ON "projects_case_study_contributors" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_credits_order_idx" ON "projects_case_study_credits" USING btree ("_order");
  CREATE INDEX "projects_case_study_credits_parent_id_idx" ON "projects_case_study_credits" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_status_order_idx" ON "projects_case_study_status" USING btree ("_order");
  CREATE INDEX "projects_case_study_status_parent_id_idx" ON "projects_case_study_status" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_planned_order_idx" ON "projects_case_study_planned" USING btree ("_order");
  CREATE INDEX "projects_case_study_planned_parent_id_idx" ON "projects_case_study_planned" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_responsibility_stages_order_idx" ON "projects_case_study_responsibility_stages" USING btree ("_order");
  CREATE INDEX "projects_case_study_responsibility_stages_parent_id_idx" ON "projects_case_study_responsibility_stages" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_disclosure_can_show_order_idx" ON "projects_case_study_disclosure_can_show" USING btree ("_order");
  CREATE INDEX "projects_case_study_disclosure_can_show_parent_id_idx" ON "projects_case_study_disclosure_can_show" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_disclosure_withheld_order_idx" ON "projects_case_study_disclosure_withheld" USING btree ("_order");
  CREATE INDEX "projects_case_study_disclosure_withheld_parent_id_idx" ON "projects_case_study_disclosure_withheld" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_technical_notes_items_order_idx" ON "projects_case_study_technical_notes_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_technical_notes_items_parent_id_idx" ON "projects_case_study_technical_notes_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_technical_notes_order_idx" ON "projects_case_study_technical_notes" USING btree ("_order");
  CREATE INDEX "projects_case_study_technical_notes_parent_id_idx" ON "projects_case_study_technical_notes" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_architecture_heads_order_idx" ON "projects_case_study_architecture_heads" USING btree ("_order");
  CREATE INDEX "projects_case_study_architecture_heads_parent_id_idx" ON "projects_case_study_architecture_heads" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_architecture_stack_order_idx" ON "projects_case_study_architecture_stack" USING btree ("_order");
  CREATE INDEX "projects_case_study_architecture_stack_parent_id_idx" ON "projects_case_study_architecture_stack" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_architecture_aside_order_idx" ON "projects_case_study_architecture_aside" USING btree ("_order");
  CREATE INDEX "projects_case_study_architecture_aside_parent_id_idx" ON "projects_case_study_architecture_aside" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_infrastructure_stack_order_idx" ON "projects_case_study_infrastructure_stack" USING btree ("_order");
  CREATE INDEX "projects_case_study_infrastructure_stack_parent_id_idx" ON "projects_case_study_infrastructure_stack" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_domain_nodes_order_idx" ON "projects_case_study_domain_nodes" USING btree ("_order");
  CREATE INDEX "projects_case_study_domain_nodes_parent_id_idx" ON "projects_case_study_domain_nodes" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_domain_edges_order_idx" ON "projects_case_study_domain_edges" USING btree ("_order");
  CREATE INDEX "projects_case_study_domain_edges_parent_id_idx" ON "projects_case_study_domain_edges" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_growth_order_idx" ON "projects_case_study_growth" USING btree ("_order");
  CREATE INDEX "projects_case_study_growth_parent_id_idx" ON "projects_case_study_growth" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_tradeoff_left_items_order_idx" ON "projects_case_study_tradeoff_left_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_tradeoff_left_items_parent_id_idx" ON "projects_case_study_tradeoff_left_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_tradeoff_right_items_order_idx" ON "projects_case_study_tradeoff_right_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_tradeoff_right_items_parent_id_idx" ON "projects_case_study_tradeoff_right_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_tradeoff_words_order_idx" ON "projects_case_study_tradeoff_words" USING btree ("_order");
  CREATE INDEX "projects_case_study_tradeoff_words_parent_id_idx" ON "projects_case_study_tradeoff_words" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_phases_items_order_idx" ON "projects_case_study_phases_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_phases_items_parent_id_idx" ON "projects_case_study_phases_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_phases_order_idx" ON "projects_case_study_phases" USING btree ("_order");
  CREATE INDEX "projects_case_study_phases_parent_id_idx" ON "projects_case_study_phases" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_packages_order_idx" ON "projects_case_study_packages" USING btree ("_order");
  CREATE INDEX "projects_case_study_packages_parent_id_idx" ON "projects_case_study_packages" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_data_flows_order_idx" ON "projects_case_study_data_flows" USING btree ("_order");
  CREATE INDEX "projects_case_study_data_flows_parent_id_idx" ON "projects_case_study_data_flows" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_metrics_items_order_idx" ON "projects_case_study_metrics_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_metrics_items_parent_id_idx" ON "projects_case_study_metrics_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_metrics_order_idx" ON "projects_case_study_metrics" USING btree ("_order");
  CREATE INDEX "projects_case_study_metrics_parent_id_idx" ON "projects_case_study_metrics" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_tooling_items_order_idx" ON "projects_case_study_tooling_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_tooling_items_parent_id_idx" ON "projects_case_study_tooling_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_tooling_order_idx" ON "projects_case_study_tooling" USING btree ("_order");
  CREATE INDEX "projects_case_study_tooling_parent_id_idx" ON "projects_case_study_tooling" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_capabilities_groups_items_order_idx" ON "projects_case_study_capabilities_groups_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_capabilities_groups_items_parent_id_idx" ON "projects_case_study_capabilities_groups_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_capabilities_groups_order_idx" ON "projects_case_study_capabilities_groups" USING btree ("_order");
  CREATE INDEX "projects_case_study_capabilities_groups_parent_id_idx" ON "projects_case_study_capabilities_groups" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_topology_steps_order_idx" ON "projects_case_study_topology_steps" USING btree ("_order");
  CREATE INDEX "projects_case_study_topology_steps_parent_id_idx" ON "projects_case_study_topology_steps" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_topology_support_order_idx" ON "projects_case_study_topology_support" USING btree ("_order");
  CREATE INDEX "projects_case_study_topology_support_parent_id_idx" ON "projects_case_study_topology_support" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_primitives_order_idx" ON "projects_case_study_primitives" USING btree ("_order");
  CREATE INDEX "projects_case_study_primitives_parent_id_idx" ON "projects_case_study_primitives" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_aggregation_measures_order_idx" ON "projects_case_study_aggregation_measures" USING btree ("_order");
  CREATE INDEX "projects_case_study_aggregation_measures_parent_id_idx" ON "projects_case_study_aggregation_measures" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_limits_verified_order_idx" ON "projects_case_study_limits_verified" USING btree ("_order");
  CREATE INDEX "projects_case_study_limits_verified_parent_id_idx" ON "projects_case_study_limits_verified" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_limits_not_verified_order_idx" ON "projects_case_study_limits_not_verified" USING btree ("_order");
  CREATE INDEX "projects_case_study_limits_not_verified_parent_id_idx" ON "projects_case_study_limits_not_verified" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_next_proof_order_idx" ON "projects_case_study_next_proof" USING btree ("_order");
  CREATE INDEX "projects_case_study_next_proof_parent_id_idx" ON "projects_case_study_next_proof" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_proof_points_order_idx" ON "projects_case_study_proof_points" USING btree ("_order");
  CREATE INDEX "projects_case_study_proof_points_parent_id_idx" ON "projects_case_study_proof_points" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_proof_chain_order_idx" ON "projects_case_study_proof_chain" USING btree ("_order");
  CREATE INDEX "projects_case_study_proof_chain_parent_id_idx" ON "projects_case_study_proof_chain" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_access_model_items_order_idx" ON "projects_case_study_access_model_items" USING btree ("_order");
  CREATE INDEX "projects_case_study_access_model_items_parent_id_idx" ON "projects_case_study_access_model_items" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_media_order_idx" ON "projects_case_study_media" USING btree ("_order");
  CREATE INDEX "projects_case_study_media_parent_id_idx" ON "projects_case_study_media" USING btree ("_parent_id");
  CREATE INDEX "projects_case_study_media_image_idx" ON "projects_case_study_media" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "experience_skills_order_idx" ON "experience_skills" USING btree ("_order");
  CREATE INDEX "experience_skills_parent_id_idx" ON "experience_skills" USING btree ("_parent_id");
  CREATE INDEX "experience_logo_idx" ON "experience" USING btree ("logo_id");
  CREATE INDEX "experience_updated_at_idx" ON "experience" USING btree ("updated_at");
  CREATE INDEX "experience_created_at_idx" ON "experience" USING btree ("created_at");
  CREATE INDEX "education_grades_order_idx" ON "education_grades" USING btree ("_order");
  CREATE INDEX "education_grades_parent_id_idx" ON "education_grades" USING btree ("_parent_id");
  CREATE INDEX "education_updated_at_idx" ON "education" USING btree ("updated_at");
  CREATE INDEX "education_created_at_idx" ON "education" USING btree ("created_at");
  CREATE INDEX "stats_updated_at_idx" ON "stats" USING btree ("updated_at");
  CREATE INDEX "stats_created_at_idx" ON "stats" USING btree ("created_at");
  CREATE INDEX "technologies_updated_at_idx" ON "technologies" USING btree ("updated_at");
  CREATE INDEX "technologies_created_at_idx" ON "technologies" USING btree ("created_at");
  CREATE INDEX "socials_updated_at_idx" ON "socials" USING btree ("updated_at");
  CREATE INDEX "socials_created_at_idx" ON "socials" USING btree ("created_at");
  CREATE INDEX "media_kind_idx" ON "media" USING btree ("kind_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE UNIQUE INDEX "media_kinds_slug_idx" ON "media_kinds" USING btree ("slug");
  CREATE INDEX "media_kinds_updated_at_idx" ON "media_kinds" USING btree ("updated_at");
  CREATE INDEX "media_kinds_created_at_idx" ON "media_kinds" USING btree ("created_at");
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
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_experience_id_idx" ON "payload_locked_documents_rels" USING btree ("experience_id");
  CREATE INDEX "payload_locked_documents_rels_education_id_idx" ON "payload_locked_documents_rels" USING btree ("education_id");
  CREATE INDEX "payload_locked_documents_rels_stats_id_idx" ON "payload_locked_documents_rels" USING btree ("stats_id");
  CREATE INDEX "payload_locked_documents_rels_technologies_id_idx" ON "payload_locked_documents_rels" USING btree ("technologies_id");
  CREATE INDEX "payload_locked_documents_rels_socials_id_idx" ON "payload_locked_documents_rels" USING btree ("socials_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_media_kinds_id_idx" ON "payload_locked_documents_rels" USING btree ("media_kinds_id");
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
  CREATE INDEX "settings_navigation_order_idx" ON "settings_navigation" USING btree ("_order");
  CREATE INDEX "settings_navigation_parent_id_idx" ON "settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "settings_portrait_portrait_cutout_idx" ON "settings" USING btree ("portrait_cutout_id");
  CREATE INDEX "settings_portrait_portrait_original_idx" ON "settings" USING btree ("portrait_original_id");
  CREATE INDEX "about_statement_order_idx" ON "about_statement" USING btree ("_order");
  CREATE INDEX "about_statement_parent_id_idx" ON "about_statement" USING btree ("_parent_id");
  CREATE INDEX "contact_headline_order_idx" ON "contact_headline" USING btree ("_order");
  CREATE INDEX "contact_headline_parent_id_idx" ON "contact_headline" USING btree ("_parent_id");
  CREATE INDEX "education_intro_statement_order_idx" ON "education_intro_statement" USING btree ("_order");
  CREATE INDEX "education_intro_statement_parent_id_idx" ON "education_intro_statement" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_tags" CASCADE;
  DROP TABLE "projects_case_study_meta" CASCADE;
  DROP TABLE "projects_case_study_highlights" CASCADE;
  DROP TABLE "projects_case_study_disciplines" CASCADE;
  DROP TABLE "projects_case_study_covers" CASCADE;
  DROP TABLE "projects_case_study_technologies" CASCADE;
  DROP TABLE "projects_case_study_sections_body" CASCADE;
  DROP TABLE "projects_case_study_sections" CASCADE;
  DROP TABLE "projects_case_study_techniques" CASCADE;
  DROP TABLE "projects_case_study_contributors" CASCADE;
  DROP TABLE "projects_case_study_credits" CASCADE;
  DROP TABLE "projects_case_study_status" CASCADE;
  DROP TABLE "projects_case_study_planned" CASCADE;
  DROP TABLE "projects_case_study_responsibility_stages" CASCADE;
  DROP TABLE "projects_case_study_disclosure_can_show" CASCADE;
  DROP TABLE "projects_case_study_disclosure_withheld" CASCADE;
  DROP TABLE "projects_case_study_technical_notes_items" CASCADE;
  DROP TABLE "projects_case_study_technical_notes" CASCADE;
  DROP TABLE "projects_case_study_architecture_heads" CASCADE;
  DROP TABLE "projects_case_study_architecture_stack" CASCADE;
  DROP TABLE "projects_case_study_architecture_aside" CASCADE;
  DROP TABLE "projects_case_study_infrastructure_stack" CASCADE;
  DROP TABLE "projects_case_study_domain_nodes" CASCADE;
  DROP TABLE "projects_case_study_domain_edges" CASCADE;
  DROP TABLE "projects_case_study_growth" CASCADE;
  DROP TABLE "projects_case_study_tradeoff_left_items" CASCADE;
  DROP TABLE "projects_case_study_tradeoff_right_items" CASCADE;
  DROP TABLE "projects_case_study_tradeoff_words" CASCADE;
  DROP TABLE "projects_case_study_phases_items" CASCADE;
  DROP TABLE "projects_case_study_phases" CASCADE;
  DROP TABLE "projects_case_study_packages" CASCADE;
  DROP TABLE "projects_case_study_data_flows" CASCADE;
  DROP TABLE "projects_case_study_metrics_items" CASCADE;
  DROP TABLE "projects_case_study_metrics" CASCADE;
  DROP TABLE "projects_case_study_tooling_items" CASCADE;
  DROP TABLE "projects_case_study_tooling" CASCADE;
  DROP TABLE "projects_case_study_capabilities_groups_items" CASCADE;
  DROP TABLE "projects_case_study_capabilities_groups" CASCADE;
  DROP TABLE "projects_case_study_topology_steps" CASCADE;
  DROP TABLE "projects_case_study_topology_support" CASCADE;
  DROP TABLE "projects_case_study_primitives" CASCADE;
  DROP TABLE "projects_case_study_aggregation_measures" CASCADE;
  DROP TABLE "projects_case_study_limits_verified" CASCADE;
  DROP TABLE "projects_case_study_limits_not_verified" CASCADE;
  DROP TABLE "projects_case_study_next_proof" CASCADE;
  DROP TABLE "projects_case_study_proof_points" CASCADE;
  DROP TABLE "projects_case_study_proof_chain" CASCADE;
  DROP TABLE "projects_case_study_access_model_items" CASCADE;
  DROP TABLE "projects_case_study_media" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "experience_skills" CASCADE;
  DROP TABLE "experience" CASCADE;
  DROP TABLE "education_grades" CASCADE;
  DROP TABLE "education" CASCADE;
  DROP TABLE "stats" CASCADE;
  DROP TABLE "technologies" CASCADE;
  DROP TABLE "socials" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_kinds" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "settings_navigation" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "about_statement" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "contact_headline" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "education_intro_statement" CASCADE;
  DROP TABLE "education_intro" CASCADE;
  DROP TYPE "public"."enum_projects_case_study_sections_tone";
  DROP TYPE "public"."enum_projects_case_study_sections_figure";
  DROP TYPE "public"."enum_projects_visual";
  DROP TYPE "public"."enum_projects_case_study_wordmark_accent";
  DROP TYPE "public"."enum_socials_icon";
  DROP TYPE "public"."enum_users_role";`)
}
