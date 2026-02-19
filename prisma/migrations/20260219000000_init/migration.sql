-- CreateEnum
CREATE TYPE "DefaultAccount" AS ENUM ('planner', 'storyteller', 'vendor');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('Premium', 'Basic', 'BasicPlus', 'Unclaimed');

-- CreateEnum
CREATE TYPE "PremiumRequestType" AS ENUM ('free', 'three', 'six', 'twelve');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('New', 'Inprogress', 'Done');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('Yes', 'No', 'Pending');

-- CreateEnum
CREATE TYPE "AttendStatus" AS ENUM ('Rejected', 'Added', 'Replaced');

-- CreateEnum
CREATE TYPE "WeddingInfoType" AS ENUM ('Bride', 'Groom', 'MaidOfHonor', 'BestMan');

-- CreateEnum
CREATE TYPE "MessageSenderType" AS ENUM ('planner', 'storyteller', 'vendor');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('Yes', 'No', 'Later');

-- CreateEnum
CREATE TYPE "TaskViewMode" AS ENUM ('LIST_SHOW', 'LIST_HIDE', 'GRID_SHOW', 'GRID_HIDE');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('radio', 'dropdown', 'subheader', 'checkbox');

-- CreateEnum
CREATE TYPE "GuestType" AS ENUM ('adult', 'child');

-- CreateEnum
CREATE TYPE "CouponUnit" AS ENUM ('Percent', 'Amount');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "email_verified" TIMESTAMP(3),
    "password" VARCHAR(255),
    "first_name" VARCHAR(30),
    "last_name" VARCHAR(30),
    "image" TEXT,
    "is_first_login" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT false,
    "accepted_agb" BOOLEAN NOT NULL DEFAULT false,
    "default_account" "DefaultAccount",
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255),
    "auth_key" VARCHAR(32) NOT NULL,
    "password_reset_token" VARCHAR(255),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planner" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" VARCHAR(30),
    "last_name" VARCHAR(30),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_surveyed" "SurveyStatus" NOT NULL DEFAULT 'Later',
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "planner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storyteller" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" VARCHAR(30),
    "last_name" VARCHAR(30),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "storyteller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(24),
    "logo" VARCHAR(100),
    "coverphoto" VARCHAR(100),
    "coverphoto_position" VARCHAR(25),
    "alias" VARCHAR(30),
    "website" VARCHAR(255),
    "type" "VendorType" NOT NULL DEFAULT 'Basic',
    "description" VARCHAR(140),
    "additional_info" VARCHAR(1400),
    "premiumrequest_type" "PremiumRequestType" NOT NULL DEFAULT 'free',
    "premium_requested" BOOLEAN NOT NULL DEFAULT false,
    "premium_approved_dt" TIMESTAMP(3),
    "is_downgraded" BOOLEAN NOT NULL DEFAULT false,
    "is_referred" BOOLEAN NOT NULL DEFAULT false,
    "referred_by" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_start_page" BOOLEAN NOT NULL DEFAULT false,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "is_first_login" BOOLEAN NOT NULL DEFAULT true,
    "is_surveyed" "SurveyStatus" NOT NULL DEFAULT 'Later',
    "approved_by" INTEGER,
    "approved_dt" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_address" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "street" VARCHAR(100),
    "street_no" VARCHAR(30),
    "zipcode" VARCHAR(10),
    "location" VARCHAR(255) NOT NULL,
    "lat" DECIMAL(10,8),
    "lng" DECIMAL(10,8),
    "additional_location" VARCHAR(255),
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_category" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "vendor_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_photo" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "photo_name" VARCHAR(100) NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "order" SMALLINT,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "approved_by" INTEGER,
    "approved_dt" TIMESTAMP(3),
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_photo_likes" (
    "id" SERIAL NOT NULL,
    "photo_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_photo_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_photo_tag" (
    "id" SERIAL NOT NULL,
    "photo_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_photo_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_like" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_claim" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" INTEGER,
    "reject_reason" VARCHAR(500),
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_deal" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "discount" VARCHAR(10) NOT NULL,
    "discount_tag" VARCHAR(10) NOT NULL DEFAULT 'Deal',
    "discount_title" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "discount_code" VARCHAR(15) NOT NULL,
    "description" VARCHAR(500),
    "conditions" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "vendor_deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_merge" (
    "id" SERIAL NOT NULL,
    "master_id" INTEGER NOT NULL,
    "merge_id" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_merge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_type_history" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "type" "VendorType",
    "premiumrequest_type" "PremiumRequestType" NOT NULL DEFAULT 'free',
    "premiumrequest_dt" TIMESTAMP(3),
    "coupon_id" INTEGER,

    CONSTRAINT "vendor_type_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "alias" VARCHAR(45) NOT NULL,
    "order" INTEGER,
    "created_by" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_question" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_question_choice" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "choice" VARCHAR(100) NOT NULL,
    "order" INTEGER,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_question_choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_question_answer" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "choice_id" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_question_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "order" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_by_admin" INTEGER,
    "created_by_user" INTEGER,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "budget" DOUBLE PRECISION,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER,
    "is_budget_defined" BOOLEAN NOT NULL DEFAULT false,
    "url" VARCHAR(100),
    "created_by_admin" INTEGER,
    "created_by_user" INTEGER,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_blog" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "logo" VARCHAR(100),
    "url" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "owner_name" VARCHAR(255),
    "description" VARCHAR(500),
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding" (
    "id" SERIAL NOT NULL,
    "story_id" INTEGER,
    "photo" VARCHAR(100),
    "photo_position" INTEGER,
    "wedding_date" DATE,
    "estimate_budget" DOUBLE PRECISION,
    "zipcode" VARCHAR(10),
    "location" VARCHAR(500),
    "alias" VARCHAR(30),
    "code" VARCHAR(10),
    "created_by" TEXT NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_planner" (
    "id" SERIAL NOT NULL,
    "wedding_id" INTEGER NOT NULL,
    "planner_id" INTEGER NOT NULL,
    "is_first_login" BOOLEAN NOT NULL DEFAULT true,
    "task_view" "TaskViewMode" NOT NULL DEFAULT 'LIST_SHOW',

    CONSTRAINT "wedding_planner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_info" (
    "id" SERIAL NOT NULL,
    "wedding_id" INTEGER NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "type" "WeddingInfoType" NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(15),
    "is_invited" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_task" (
    "id" SERIAL NOT NULL,
    "wedding_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "vendor_id" INTEGER,
    "status" "TaskStatus" NOT NULL DEFAULT 'New',
    "deadline" DATE,
    "order" INTEGER NOT NULL,
    "updated_by" INTEGER,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_task_budget" (
    "id" SERIAL NOT NULL,
    "wedding_id" INTEGER NOT NULL,
    "task_id" INTEGER,
    "task_name" VARCHAR(500),
    "budget" DOUBLE PRECISION,
    "actual_budget" DOUBLE PRECISION,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "updated_by" INTEGER,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_task_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_task_note" (
    "id" SERIAL NOT NULL,
    "wedding_task_id" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_task_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_guest" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "wedding_id" INTEGER NOT NULL,
    "attend_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "type" "GuestType" NOT NULL DEFAULT 'adult',
    "guest_email" VARCHAR(100),
    "phone" VARCHAR(15),
    "street" VARCHAR(100),
    "street_no" VARCHAR(20),
    "zipcode" VARCHAR(6),
    "location" VARCHAR(100),
    "comment" VARCHAR(500),
    "rsvp" "RsvpStatus" NOT NULL DEFAULT 'Pending',
    "table_id" INTEGER,
    "created_by" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_attend" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "wedding_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "GuestType" NOT NULL DEFAULT 'adult',
    "guest_email" VARCHAR(100),
    "phone" VARCHAR(15),
    "street" VARCHAR(100),
    "street_no" VARCHAR(20),
    "zipcode" VARCHAR(6),
    "location" VARCHAR(100),
    "rsvp" "RsvpStatus" NOT NULL DEFAULT 'Pending',
    "status" "AttendStatus",
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_attend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_table" (
    "id" SERIAL NOT NULL,
    "wedding_id" INTEGER NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "seats" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_tags" (
    "id" SERIAL NOT NULL,
    "wedding_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_dt" TIMESTAMP(3),

    CONSTRAINT "wedding_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_guest_tag" (
    "id" SERIAL NOT NULL,
    "guest_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "wedding_guest_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_story" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "bride_name" VARCHAR(20) NOT NULL,
    "groom_name" VARCHAR(20) NOT NULL,
    "contact_email" VARCHAR(100) NOT NULL,
    "zipcode" VARCHAR(10),
    "location" VARCHAR(500),
    "wedding_date" DATE NOT NULL,
    "coverphoto" VARCHAR(100),
    "coverphoto_position" VARCHAR(25),
    "alias" VARCHAR(30),
    "reject_reason" VARCHAR(500),
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_start_page" BOOLEAN NOT NULL DEFAULT false,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" INTEGER,
    "approved_dt" TIMESTAMP(3),
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_story_photo" (
    "id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "photo_name" VARCHAR(100) NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "order" SMALLINT,
    "is_approved" BOOLEAN NOT NULL,
    "approved_by" INTEGER,
    "approved_dt" TIMESTAMP(3),
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_story_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_story_photo_tag" (
    "id" SERIAL NOT NULL,
    "photo_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_story_photo_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_story_photo_likes" (
    "id" SERIAL NOT NULL,
    "photo_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_story_photo_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_story_vendor" (
    "id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "comment" VARCHAR(500),
    "comment_dt" TIMESTAMP(3),
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" INTEGER,
    "approved_dt" TIMESTAMP(3),
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_story_vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_story_like" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "story_id" INTEGER NOT NULL,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_story_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "message" VARCHAR(1000),
    "sender_type" "MessageSenderType",
    "receiver_type" "MessageSenderType",
    "read" BOOLEAN NOT NULL DEFAULT false,
    "is_notified" BOOLEAN NOT NULL DEFAULT false,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "vendor_id" INTEGER NOT NULL,
    "ip_address" VARCHAR(50) NOT NULL,
    "visited_dt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_analytics" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "story_id" INTEGER NOT NULL,
    "ip_address" VARCHAR(50) NOT NULL,
    "visited_dt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_task_analytics" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "ip_address" VARCHAR(50) NOT NULL,
    "visited_dt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_task_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_task_budget_analytics" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "ip_address" VARCHAR(50) NOT NULL,
    "visited_dt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_task_budget_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" "CouponUnit" NOT NULL DEFAULT 'Percent',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_analytics" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "code_id" INTEGER NOT NULL,
    "ip_address" VARCHAR(50) NOT NULL,
    "visited_dt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashback" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cashback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_vendor_placement" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "task_id" INTEGER,
    "from" TIMESTAMP(3),
    "to" TIMESTAMP(3),
    "created_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_vendor_placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_vendor_placement_analytics" (
    "id" SERIAL NOT NULL,
    "placement_id" INTEGER NOT NULL,
    "user_id" TEXT,
    "ip_address" VARCHAR(50) NOT NULL,
    "visited_dt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_vendor_placement_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "subscribed_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "feedback" TEXT NOT NULL,
    "created_dt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "planner_user_id_key" ON "planner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "storyteller_user_id_key" ON "storyteller"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_user_id_key" ON "vendor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_alias_key" ON "vendor"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_like_user_id_vendor_id_key" ON "vendor_like"("user_id", "vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_alias_key" ON "category"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_alias_key" ON "wedding"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_task_budget_task_id_key" ON "wedding_task_budget"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_story_alias_key" ON "wedding_story"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_story_like_user_id_story_id_key" ON "wedding_story_like"("user_id", "story_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_code_key" ON "coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "budget_vendor_placement_task_id_key" ON "budget_vendor_placement"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner" ADD CONSTRAINT "planner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storyteller" ADD CONSTRAINT "storyteller_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_address" ADD CONSTRAINT "vendor_address_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_category" ADD CONSTRAINT "vendor_category_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_category" ADD CONSTRAINT "vendor_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_photo" ADD CONSTRAINT "vendor_photo_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_photo_likes" ADD CONSTRAINT "vendor_photo_likes_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "vendor_photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_photo_tag" ADD CONSTRAINT "vendor_photo_tag_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "vendor_photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_photo_tag" ADD CONSTRAINT "vendor_photo_tag_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_photo_tag" ADD CONSTRAINT "vendor_photo_tag_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_like" ADD CONSTRAINT "vendor_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_like" ADD CONSTRAINT "vendor_like_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_claim" ADD CONSTRAINT "vendor_claim_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_claim" ADD CONSTRAINT "vendor_claim_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_deal" ADD CONSTRAINT "vendor_deal_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_merge" ADD CONSTRAINT "vendor_merge_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_merge" ADD CONSTRAINT "vendor_merge_merge_id_fkey" FOREIGN KEY ("merge_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_type_history" ADD CONSTRAINT "vendor_type_history_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_type_history" ADD CONSTRAINT "vendor_type_history_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_question" ADD CONSTRAINT "category_question_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_question_choice" ADD CONSTRAINT "category_question_choice_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "category_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_question_answer" ADD CONSTRAINT "category_question_answer_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_question_answer" ADD CONSTRAINT "category_question_answer_choice_id_fkey" FOREIGN KEY ("choice_id") REFERENCES "category_question_choice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_blog" ADD CONSTRAINT "task_blog_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding" ADD CONSTRAINT "wedding_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_planner" ADD CONSTRAINT "wedding_planner_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_planner" ADD CONSTRAINT "wedding_planner_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_info" ADD CONSTRAINT "wedding_info_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task" ADD CONSTRAINT "wedding_task_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task" ADD CONSTRAINT "wedding_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task" ADD CONSTRAINT "wedding_task_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task" ADD CONSTRAINT "wedding_task_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task_budget" ADD CONSTRAINT "wedding_task_budget_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "wedding_task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task_note" ADD CONSTRAINT "wedding_task_note_wedding_task_id_fkey" FOREIGN KEY ("wedding_task_id") REFERENCES "wedding_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_guest" ADD CONSTRAINT "wedding_guest_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_guest" ADD CONSTRAINT "wedding_guest_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "wedding_guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_guest" ADD CONSTRAINT "wedding_guest_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "wedding_table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_attend" ADD CONSTRAINT "wedding_attend_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_attend" ADD CONSTRAINT "wedding_attend_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "wedding_attend"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_table" ADD CONSTRAINT "wedding_table_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_tags" ADD CONSTRAINT "wedding_tags_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_guest_tag" ADD CONSTRAINT "wedding_guest_tag_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "wedding_guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_guest_tag" ADD CONSTRAINT "wedding_guest_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "wedding_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story" ADD CONSTRAINT "wedding_story_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_photo" ADD CONSTRAINT "wedding_story_photo_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "wedding_story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_photo_tag" ADD CONSTRAINT "wedding_story_photo_tag_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "wedding_story_photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_photo_tag" ADD CONSTRAINT "wedding_story_photo_tag_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_photo_tag" ADD CONSTRAINT "wedding_story_photo_tag_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_photo_likes" ADD CONSTRAINT "wedding_story_photo_likes_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "wedding_story_photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_vendor" ADD CONSTRAINT "wedding_story_vendor_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "wedding_story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_vendor" ADD CONSTRAINT "wedding_story_vendor_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_vendor" ADD CONSTRAINT "wedding_story_vendor_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_like" ADD CONSTRAINT "wedding_story_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_story_like" ADD CONSTRAINT "wedding_story_like_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "wedding_story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_analytics" ADD CONSTRAINT "story_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_analytics" ADD CONSTRAINT "story_analytics_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "wedding_story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_task_analytics" ADD CONSTRAINT "wedding_task_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_analytics" ADD CONSTRAINT "affiliate_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashback" ADD CONSTRAINT "cashback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_vendor_placement" ADD CONSTRAINT "budget_vendor_placement_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_vendor_placement_analytics" ADD CONSTRAINT "budget_vendor_placement_analytics_placement_id_fkey" FOREIGN KEY ("placement_id") REFERENCES "budget_vendor_placement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
