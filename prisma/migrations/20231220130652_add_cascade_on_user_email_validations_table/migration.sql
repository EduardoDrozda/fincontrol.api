-- AddForeignKey
ALTER TABLE `user_email_validations` ADD CONSTRAINT `user_email_validations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
