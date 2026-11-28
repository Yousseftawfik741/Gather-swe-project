ALTER TABLE "Venue"
ADD COLUMN "supportedEventTypes" "EventType"[] DEFAULT ARRAY[]::"EventType"[];