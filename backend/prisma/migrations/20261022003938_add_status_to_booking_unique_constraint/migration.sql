/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,scheduled_at,status]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bookings_organization_id_scheduled_at_key";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_organization_id_scheduled_at_status_key" ON "bookings"("organization_id", "scheduled_at", "status");
