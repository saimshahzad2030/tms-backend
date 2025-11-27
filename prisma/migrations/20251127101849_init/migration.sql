-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "token" TEXT DEFAULT '',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdById" INTEGER NOT NULL,
    "categories" JSONB[],

    CONSTRAINT "AdminTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "columnDetailsChecked" BOOLEAN DEFAULT false,
    "description" TEXT,
    "unCheckOptionId" INTEGER,
    "isTimeSensitive" BOOLEAN,
    "timeSensitiveColorsId" INTEGER,
    "type" TEXT,
    "trigger" TEXT NOT NULL,
    "popupDescription" TEXT,
    "completed" BOOLEAN DEFAULT false,
    "linkedStepId" INTEGER,
    "unCheckEnabled" BOOLEAN,
    "templateId" INTEGER NOT NULL,
    "futureColumnThings" JSONB[],
    "columnDetails" JSONB[],
    "unCheckOption" JSONB,
    "timeSensitiveColors" JSONB,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnabledUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_EnabledUsers_AB_unique" ON "_EnabledUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_EnabledUsers_B_index" ON "_EnabledUsers"("B");

-- AddForeignKey
ALTER TABLE "AdminTemplate" ADD CONSTRAINT "AdminTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AdminTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnabledUsers" ADD CONSTRAINT "_EnabledUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "AdminTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnabledUsers" ADD CONSTRAINT "_EnabledUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
