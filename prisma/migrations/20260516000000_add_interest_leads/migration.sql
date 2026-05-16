CREATE TABLE "InterestLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestLead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InterestLead_email_key" ON "InterestLead"("email");
