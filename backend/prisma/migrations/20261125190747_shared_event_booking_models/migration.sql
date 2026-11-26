
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'BIRTHDAY', 'ENGAGEMENT', 'BUSINESS', 'CONFERENCE', 'GRADUATION', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PLANNING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'ACTIVE', 'DECLINED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ChangeRequestType" AS ENUM ('EVENT_UPDATE', 'BOOKING_CANCELLATION');

-- CreateEnum
CREATE TYPE "ChangeRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLATION_REQUESTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CancellationStatus" AS ENUM ('REQUESTED', 'PROVIDER_REJECTED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "ServicePackage" DROP CONSTRAINT "ServicePackage_serviceId_fkey";

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "timeZone" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMember" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "invitedById" UUID NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "EventMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventInvitationHistory" (
    "id" UUID NOT NULL,
    "eventMemberId" UUID NOT NULL,
    "invitedById" UUID NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "EventInvitationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventChangeRequest" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "bookingId" UUID,
    "requesterId" UUID NOT NULL,
    "reviewerId" UUID,
    "requestType" "ChangeRequestType" NOT NULL,
    "beforeData" JSONB NOT NULL,
    "proposedData" JSONB NOT NULL,
    "status" "ChangeRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "EventChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "venueId" UUID,
    "servicePackageId" UUID,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingCancellation" (
    "id" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "requestedById" UUID NOT NULL,
    "eventChangeRequestId" UUID,
    "previousBookingStatus" "BookingStatus" NOT NULL,
    "status" "CancellationStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT,
    "providerResponse" TEXT,
    "providerRespondedAt" TIMESTAMP(3),
    "estimatedCancellationFee" DECIMAL(12,2),
    "finalCancellationFee" DECIMAL(12,2),
    "cancellationPolicySnapshot" JSONB,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BookingCancellation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_ownerId_idx" ON "Event"("ownerId");

-- CreateIndex
CREATE INDEX "Event_status_startDate_idx" ON "Event"("status", "startDate");

-- CreateIndex
CREATE INDEX "Event_city_idx" ON "Event"("city");

-- CreateIndex
CREATE INDEX "EventMember_eventId_status_idx" ON "EventMember"("eventId", "status");

-- CreateIndex
CREATE INDEX "EventMember_userId_status_idx" ON "EventMember"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EventMember_eventId_userId_key" ON "EventMember"("eventId", "userId");

-- CreateIndex
CREATE INDEX "EventInvitationHistory_eventMemberId_createdAt_idx" ON "EventInvitationHistory"("eventMemberId", "createdAt");

-- CreateIndex
CREATE INDEX "EventInvitationHistory_status_expiresAt_idx" ON "EventInvitationHistory"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "EventChangeRequest_eventId_status_idx" ON "EventChangeRequest"("eventId", "status");

-- CreateIndex
CREATE INDEX "EventChangeRequest_requesterId_status_idx" ON "EventChangeRequest"("requesterId", "status");

-- CreateIndex
CREATE INDEX "EventChangeRequest_bookingId_idx" ON "EventChangeRequest"("bookingId");

-- CreateIndex
CREATE INDEX "Booking_eventId_status_idx" ON "Booking"("eventId", "status");

-- CreateIndex
CREATE INDEX "Booking_venueId_idx" ON "Booking"("venueId");

-- CreateIndex
CREATE INDEX "Booking_servicePackageId_idx" ON "Booking"("servicePackageId");

-- CreateIndex
CREATE INDEX "Booking_status_scheduledAt_idx" ON "Booking"("status", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCancellation_eventChangeRequestId_key" ON "BookingCancellation"("eventChangeRequestId");

-- CreateIndex
CREATE INDEX "BookingCancellation_bookingId_requestedAt_idx" ON "BookingCancellation"("bookingId", "requestedAt");

-- CreateIndex
CREATE INDEX "BookingCancellation_requestedById_idx" ON "BookingCancellation"("requestedById");

-- CreateIndex
CREATE INDEX "BookingCancellation_status_idx" ON "BookingCancellation"("status");

-- AddForeignKey
ALTER TABLE "ServicePackage" ADD CONSTRAINT "ServicePackage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvitationHistory" ADD CONSTRAINT "EventInvitationHistory_eventMemberId_fkey" FOREIGN KEY ("eventMemberId") REFERENCES "EventMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvitationHistory" ADD CONSTRAINT "EventInvitationHistory_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChangeRequest" ADD CONSTRAINT "EventChangeRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChangeRequest" ADD CONSTRAINT "EventChangeRequest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChangeRequest" ADD CONSTRAINT "EventChangeRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChangeRequest" ADD CONSTRAINT "EventChangeRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_servicePackageId_fkey" FOREIGN KEY ("servicePackageId") REFERENCES "ServicePackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCancellation" ADD CONSTRAINT "BookingCancellation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCancellation" ADD CONSTRAINT "BookingCancellation_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCancellation" ADD CONSTRAINT "BookingCancellation_eventChangeRequestId_fkey" FOREIGN KEY ("eventChangeRequestId") REFERENCES "EventChangeRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Booking"
ADD CONSTRAINT "booking_exactly_one_resource"
CHECK (
  ("venueId" IS NOT NULL AND "servicePackageId" IS NULL)
  OR
  ("venueId" IS NULL AND "servicePackageId" IS NOT NULL)
);

CREATE UNIQUE INDEX "one_active_venue_booking_per_event"
ON "Booking" ("eventId")
WHERE "venueId" IS NOT NULL
AND "status" IN (
  'PENDING',
  'CONFIRMED',
  'CANCELLATION_REQUESTED'
);

CREATE UNIQUE INDEX "one_pending_invitation_per_member"
ON "EventInvitationHistory" ("eventMemberId")
WHERE "status" = 'PENDING';

CREATE UNIQUE INDEX "one_outstanding_cancellation_per_booking"
ON "BookingCancellation" ("bookingId")
WHERE "status" = 'REQUESTED';

ALTER TABLE "Event"
ADD CONSTRAINT "event_valid_date_range"
CHECK (
  "endDate" IS NULL OR "endDate" > "startDate"
);

ALTER TABLE "EventInvitationHistory"
ADD CONSTRAINT "invitation_expiration_after_creation"
CHECK ("expiresAt" > "createdAt");

ALTER TABLE "Booking"
ADD CONSTRAINT "booking_nonnegative_price"
CHECK ("totalPrice" >= 0);

ALTER TABLE "BookingCancellation"
ADD CONSTRAINT "valid_previous_booking_status"
CHECK (
  "previousBookingStatus" IN ('PENDING', 'CONFIRMED')
);

ALTER TABLE "BookingCancellation"
ADD CONSTRAINT "nonnegative_cancellation_fees"
CHECK (
  ("estimatedCancellationFee" IS NULL OR "estimatedCancellationFee" >= 0)
  AND
  ("finalCancellationFee" IS NULL OR "finalCancellationFee" >= 0)
);

ALTER TABLE "EventChangeRequest"
ADD CONSTRAINT "change_request_valid_target"
CHECK (
  ("requestType" = 'EVENT_UPDATE' AND "bookingId" IS NULL)
  OR
  ("requestType" = 'BOOKING_CANCELLATION' AND "bookingId" IS NOT NULL)
);

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_id_eventId_key"
UNIQUE ("id", "eventId");

ALTER TABLE "EventChangeRequest"
ADD CONSTRAINT "change_request_booking_same_event"
FOREIGN KEY ("bookingId", "eventId")
REFERENCES "Booking" ("id", "eventId")
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION prevent_booking_price_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."totalPrice" IS DISTINCT FROM OLD."totalPrice"
     OR NEW."currency" IS DISTINCT FROM OLD."currency" THEN
    RAISE EXCEPTION 'Booking price snapshots are immutable';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "booking_price_immutable"
BEFORE UPDATE ON "Booking"
FOR EACH ROW
EXECUTE FUNCTION prevent_booking_price_changes();


ALTER TABLE "EventChangeRequest"
ADD CONSTRAINT "EventChangeRequest_id_bookingId_key"
UNIQUE ("id", "bookingId");

ALTER TABLE "BookingCancellation"
ADD CONSTRAINT "cancellation_proposal_same_booking"
FOREIGN KEY ("eventChangeRequestId", "bookingId")
REFERENCES "EventChangeRequest" ("id", "bookingId")
ON DELETE RESTRICT
ON UPDATE CASCADE;