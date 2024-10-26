-- Drop all tables on sqlite database

DROP TABLE IF EXISTS "report_states_audit";
DROP TABLE IF EXISTS "report_data";
DROP TABLE IF EXISTS "reports";
DROP TABLE IF EXISTS "report_types";
DROP TABLE IF EXISTS "report_states";
DROP TABLE IF EXISTS "lands_users";
DROP TABLE IF EXISTS "lands";
DROP TABLE IF EXISTS "land_types";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "companies";
DROP TABLE IF EXISTS "role_permissions";
DROP TABLE IF EXISTS "permissions";
DROP TABLE IF EXISTS "roles";


-- Create table `roles`
CREATE TABLE "roles" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL
);
INSERT INTO "roles" ("name", "description") VALUES
    ('admin', 'Full access to all resources'),
    ('manager', 'Can manage users and reports'),
    ('employee', 'Can create and edit reports'),
    ('client', 'Can view reports');


-- Create table `permissions`
CREATE TABLE "permissions" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL
);
INSERT INTO "permissions" ("name", "description") VALUES
    ('manage_users', 'Can create, edit and delete users'),
    ('manage_reports', 'Can create, edit and delete reports'),
    ('manage_lands', 'Can create, edit and delete lands'),
    ('view_reports', 'Can view reports'),
    ('view_lands', 'Can view lands'),
    ('view_other_reports', 'Can view reports from other users'),
    ('view_other_lands', 'Can view lands from other users');


-- Create table `role_permissions`
CREATE TABLE "role_permissions" (
    "role_name" TEXT NOT NULL,
    "permission_name" TEXT NOT NULL,
    PRIMARY KEY ("role_name", "permission_name"),
    FOREIGN KEY ("role_name") REFERENCES "roles" ("name") ON DELETE CASCADE,
    FOREIGN KEY ("permission_name") REFERENCES "permissions" ("name") ON DELETE CASCADE
);
INSERT INTO "role_permissions" ("role_name", "permission_name") VALUES
    ('admin', 'manage_users'),
    ('admin', 'manage_reports'),
    ('admin', 'manage_lands'),
    ('admin', 'view_reports'),
    ('admin', 'view_lands'),
    ('admin', 'view_other_reports'),
    ('admin', 'view_other_lands'),
    ('manager', 'manage_users'),
    ('manager', 'manage_reports'),
    ('manager', 'manage_lands'),
    ('manager', 'view_reports'),
    ('manager', 'view_lands'),
    ('manager', 'view_other_reports'),
    ('manager', 'view_other_lands'),
    ('employee', 'manage_reports'),
    ('employee', 'view_reports'),
    ('employee', 'view_lands'),
    ('employee', 'view_other_reports'),
    ('employee', 'view_other_lands'),
    ('client', 'view_reports'),
    ('client', 'view_lands');


-- Create table `companies`
CREATE TABLE "companies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cif" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL
);
INSERT INTO "companies" ("id", "cif", "name", "email", "phone", "address") VALUES
    (1, 'B12345678', 'Example Company', 'example@company.org', '+34 123 456 789', 'Example Street, 123');


-- Create table `users`
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER DEFAULT NULL,
    "role" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "nif" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("role") REFERENCES "roles" ("name") ON DELETE CASCADE
);
INSERT INTO "users" ("id", "company_id", "role", "username", "password", "email", "name", "surname", "nif", "phone", "address") VALUES
    (1, null, 'admin', 'admin', '$2a$10$MGa5BRlvDn47mi5y9J54W.XNqPRgthrVKUAPI0qqxCVZ5mI1iU4r2', 'admin@rohuinnovations.com', 'Admin', null, null, null, null),
    (2, null, 'manager', 'manager', '$2a$10$MGa5BRlvDn47mi5y9J54W.XNqPRgthrVKUAPI0qqxCVZ5mI1iU4r2', 'manager@rohuinnovations.com', 'Manager', null, null, null, null),
    (3, null, 'employee', 'employee', '$2a$10$MGa5BRlvDn47mi5y9J54W.XNqPRgthrVKUAPI0qqxCVZ5mI1iU4r2', 'employee@rohuinnovations.com', 'Employee', null, null, null, null),
    (4, 1, 'client', 'client', '$2a$10$MGa5BRlvDn47mi5y9J54W.XNqPRgthrVKUAPI0qqxCVZ5mI1iU4r2', 'client@company.org', 'Alex', 'Smith', 'A12345678', '+34 123 456 789', 'Client Street, 123');


-- Create table `land_types`
CREATE TABLE "land_types" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL
);
INSERT INTO "land_types" ("name", "description") VALUES
    ('vineyard', 'Vineyard');


-- Create table `lands`
CREATE TABLE "lands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER DEFAULT NULL,
    "type" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("type") REFERENCES "land_types" ("name") ON DELETE CASCADE,
    FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE
);
INSERT INTO "lands" ("id", "company_id", "type", "author_id", "name", "description", "address") VALUES
        (1, 1, 'vineyard', 4, 'My Vineyard', 'This is a vineyard demo', 'Vineyard Street, 123');


-- Create table `lands_users`
CREATE TABLE "lands_users" (
    "land_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("land_id", "user_id"),
    FOREIGN KEY ("land_id") REFERENCES "lands" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);


-- Create table `report_states`
CREATE TABLE "report_states" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "phase" INTEGER NOT NULL
);
INSERT INTO "report_states" ("name", "description", "phase") VALUES
    ('draft', 'Draft report', 10),
    ('scheduled', 'Scheduled report', 20),
    ('in_progress', 'In progress report', 30),
    ('pending', 'Pending report', 40),
    ('approved', 'Approved report', 50),
    ('rejected', 'Rejected report', 60),
    ('completed', 'Completed report', 60);


-- Create table `report_types`
CREATE TABLE "report_types" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL
);
INSERT INTO "report_types" ("name", "description") VALUES
    ('default', 'Default report type');


-- Create table `reports`
CREATE TABLE "reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "land_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT 1,
    "scheduled_at" DATETIME DEFAULT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("type") REFERENCES "report_types" ("name") ON DELETE CASCADE,
    FOREIGN KEY ("land_id") REFERENCES "lands" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("reporter_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("state") REFERENCES "report_states" ("name") ON DELETE CASCADE
);


-- Create table `report_data`
CREATE TABLE "report_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME DEFAULT NULL,
    FOREIGN KEY ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE
);


-- Create table `report_states_audit`
CREATE TABLE "report_states_audit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("state") REFERENCES "report_states" ("name") ON DELETE CASCADE
);