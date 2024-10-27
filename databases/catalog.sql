-- Drop all tables on sqlite database (reverse order)
DROP TABLE IF EXISTS "required_group_session_space";
DROP TABLE IF EXISTS "subject_group_session";
DROP TABLE IF EXISTS "subject_group";
DROP TABLE IF EXISTS "subject";
DROP TABLE IF EXISTS "teacher";
DROP TABLE IF EXISTS "space";
DROP TABLE IF EXISTS "building";


-- Create table `building`;
CREATE TABLE "building" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "name" TEXT DEFAULT "Unnamed building",
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL
);

-- Create table `space`;
CREATE TABLE "space" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "building_id" INTEGER NOT NULL,
    "name" TEXT DEFAULT "Unnamed classroom",
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("building_id") REFERENCES "building" ("id") ON DELETE CASCADE
);

-- Create table `teacher`
CREATE TABLE "teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT DEFAULT "Unnamed teacher",
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL
);

-- Create table `subject`
CREATE TABLE "subject" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "building_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("building_id") REFERENCES "building" ("id") ON DELETE CASCADE
);

-- Create table `subject_group`
CREATE TABLE "subject_group" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "subject_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "planned_capacity" INTEGER NOT NULL,
    "real_capacity" INTEGER,
    "hours" FLOAT NOT NULL,
    "notes" TEXT,
    "is_morning" BOOLEAN DEFAULT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("subject_id") REFERENCES "subject" ("id") ON DELETE CASCADE
);

-- Create table `subject_group_session`
CREATE TABLE "subject_group_session" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "subject_group_id" INTEGER NOT NULL,
    "building_id" INTEGER DEFAULT NULL,
    "space_id" INTEGER,
    "teacher_id" INTEGER,
    "day" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("subject_group_id") REFERENCES "subject_group" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("building_id") REFERENCES "building" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("space_id") REFERENCES "space" ("id") ON DELETE CASCADE
);

-- Create table `required_group_session_space`
CREATE TABLE "required_group_session_space" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "subject_group_session_id" INTEGER NOT NULL,
    "space_id" INTEGER NOT NULL,
    FOREIGN KEY ("subject_group_session_id") REFERENCES "subject_group_session" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("space_id") REFERENCES "space" ("id") ON DELETE CASCADE
);