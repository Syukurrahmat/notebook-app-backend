-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notebooks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `emoji` VARCHAR(191) NOT NULL,
    `heroImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notebooksId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `priority` ENUM('HIGH', 'NETRAL', 'LOW') NOT NULL,
    `isPinned` BOOLEAN NOT NULL,
    `isArchived` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notesId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Contents_notesId_key`(`notesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NotesToTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_NotesToTags_AB_unique`(`A`, `B`),
    INDEX `_NotesToTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notebooks` ADD CONSTRAINT `Notebooks_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notes` ADD CONSTRAINT `Notes_notebooksId_fkey` FOREIGN KEY (`notebooksId`) REFERENCES `Notebooks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contents` ADD CONSTRAINT `Contents_notesId_fkey` FOREIGN KEY (`notesId`) REFERENCES `Notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tags` ADD CONSTRAINT `Tags_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotesToTags` ADD CONSTRAINT `_NotesToTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Notes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotesToTags` ADD CONSTRAINT `_NotesToTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
