-- CreateTable
CREATE TABLE `master_support_items` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `master_support_items_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_items` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `masterSupportItemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_prices` (
    `id` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `currentPrice` DOUBLE NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_prices_masterPartId_key`(`masterPartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price_histories` (
    `id` VARCHAR(191) NOT NULL,
    `productPriceId` VARCHAR(191) NOT NULL,
    `oldPrice` DOUBLE NOT NULL,
    `newPrice` DOUBLE NOT NULL,
    `effectiveDate` DATETIME(3) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distribution_orders` (
    `id` VARCHAR(191) NOT NULL,
    `sjNumber` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI_DRIVER',
    `totalWeight` DOUBLE NOT NULL,
    `totalItems` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `distribution_orders_sjNumber_key`(`sjNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distribution_items` (
    `id` VARCHAR(191) NOT NULL,
    `distributionId` VARCHAR(191) NOT NULL,
    `packingItemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `returned_items` (
    `id` VARCHAR(191) NOT NULL,
    `distributionItemId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `notes` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_revenues` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `totalRevenue` DOUBLE NOT NULL,
    `cashAmount` DOUBLE NOT NULL,
    `nonCashAmount` DOUBLE NOT NULL,
    `receivableAmount` DOUBLE NOT NULL,
    `expenseAmount` DOUBLE NOT NULL,
    `expenseNotes` TEXT NULL,
    `netBalance` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_revenues_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `details` TEXT NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `distributionOrderId` VARCHAR(191) NOT NULL,
    `isApproved` BOOLEAN NOT NULL,
    `notes` TEXT NULL,
    `verifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_signatures` (
    `id` VARCHAR(191) NOT NULL,
    `distributionOrderId` VARCHAR(191) NOT NULL,
    `signatureData` LONGTEXT NOT NULL,
    `signedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_logs` (
    `id` VARCHAR(191) NOT NULL,
    `distributionOrderId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `driver_liabilities` (
    `id` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `distributionItemId` VARCHAR(191) NOT NULL,
    `sentQuantity` INTEGER NOT NULL,
    `receivedQuantity` INTEGER NOT NULL,
    `missingQuantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `totalLoss` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BELUM_DIBAYAR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_inventories` (
    `id` VARCHAR(191) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `outlet_inventories_outletId_masterPartId_key`(`outletId`, `masterPartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_receipts` (
    `id` VARCHAR(191) NOT NULL,
    `distributionOrderId` VARCHAR(191) NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cashierName` VARCHAR(191) NOT NULL DEFAULT 'Kasir Outlet',

    UNIQUE INDEX `outlet_receipts_distributionOrderId_key`(`distributionOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_receipt_items` (
    `id` VARCHAR(191) NOT NULL,
    `outletReceiptId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `sentQuantity` INTEGER NOT NULL,
    `receivedQuantity` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_outlet_revenues` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `totalRevenue` DOUBLE NOT NULL,
    `cashAmount` DOUBLE NOT NULL,
    `nonCashAmount` DOUBLE NOT NULL,
    `receivableAmount` DOUBLE NOT NULL,
    `expenseAmount` DOUBLE NOT NULL,
    `expenseNotes` TEXT NULL,
    `netBalance` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_outlet_revenues_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cash_deposits` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `notes` TEXT NULL,
    `cashierName` VARCHAR(191) NOT NULL DEFAULT 'Kasir Outlet',
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `cashDepositId` VARCHAR(191) NOT NULL,
    `verifiedBy` VARCHAR(191) NOT NULL DEFAULT 'Admin Omset',
    `actualSalesAmount` DOUBLE NOT NULL,
    `difference` DOUBLE NOT NULL,
    `notes` TEXT NULL,
    `verifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `deposit_verifications_cashDepositId_key`(`cashDepositId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cashier_liabilities` (
    `id` VARCHAR(191) NOT NULL,
    `cashDepositId` VARCHAR(191) NOT NULL,
    `shortageAmount` DOUBLE NOT NULL,
    `liabilityAmount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BELUM_DIBAYAR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `minus_compensations` (
    `id` VARCHAR(191) NOT NULL,
    `depositVerificationId` VARCHAR(191) NOT NULL,
    `driverLiabilityId` VARCHAR(191) NOT NULL,
    `amountApplied` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlets` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `outlets_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_closings` (
    `id` VARCHAR(191) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outlet_closing_items` (
    `id` VARCHAR(191) NOT NULL,
    `outletClosingId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `initialStock` INTEGER NOT NULL,
    `systemOut` INTEGER NOT NULL,
    `finalPhysical` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `closing_employees` (
    `id` VARCHAR(191) NOT NULL,
    `outletClosingId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_transfers` (
    `id` VARCHAR(191) NOT NULL,
    `transferNo` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `fromOutletId` VARCHAR(191) NOT NULL,
    `toOutletId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_transfers_transferNo_key`(`transferNo`),
    INDEX `stock_transfers_date_idx`(`date`),
    INDEX `stock_transfers_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_transfer_items` (
    `id` VARCHAR(191) NOT NULL,
    `stockTransferId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `returned_goods` (
    `id` VARCHAR(191) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_QC',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `returned_items_v2` (
    `id` VARCHAR(191) NOT NULL,
    `returnedGoodsId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `reason` TEXT NULL,
    `qcStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rejected_goods` (
    `id` VARCHAR(191) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_QC',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rejected_items` (
    `id` VARCHAR(191) NOT NULL,
    `rejectedGoodsId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `reason` TEXT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `qcStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_opname_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `outletClosingId` VARCHAR(191) NOT NULL,
    `verifiedBy` VARCHAR(191) NOT NULL DEFAULT 'Admin SO',
    `status` VARCHAR(191) NOT NULL,
    `approvalStatus` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `verifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `stock_opname_verifications_outletClosingId_key`(`outletClosingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_differences` (
    `id` VARCHAR(191) NOT NULL,
    `soVerificationId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `missingQuantity` INTEGER NOT NULL,
    `classification` VARCHAR(191) NOT NULL DEFAULT 'HILANG',
    `unitPrice` DOUBLE NOT NULL,
    `totalLoss` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_liabilities` (
    `id` VARCHAR(191) NOT NULL,
    `stockDifferenceId` VARCHAR(191) NOT NULL,
    `employeeName` VARCHAR(191) NOT NULL,
    `employeeRole` VARCHAR(191) NOT NULL,
    `liabilityAmount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BELUM_DIBAYAR',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_adjustments` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `referenceId` VARCHAR(191) NULL,
    `reason` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'System',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_adjustment_items` (
    `id` VARCHAR(191) NOT NULL,
    `stockAdjustmentId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `qtyAdjusted` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_ledgers` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `transactionType` VARCHAR(191) NOT NULL,
    `referenceNo` VARCHAR(191) NOT NULL,
    `qtyIn` INTEGER NOT NULL DEFAULT 0,
    `qtyOut` INTEGER NOT NULL DEFAULT 0,
    `balance` INTEGER NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quality_control_headers` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `referenceId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_QC',
    `verifiedBy` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quality_control_items` (
    `id` VARCHAR(191) NOT NULL,
    `qcHeaderId` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `qcResult` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quality_control_logs` (
    `id` VARCHAR(191) NOT NULL,
    `qcHeaderId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `details` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rejected_inventories` (
    `id` VARCHAR(191) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rejected_inventories_masterPartId_key`(`masterPartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disposal_candidates` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `masterPartId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `reason` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_PEMUSNAHAN',
    `executedBy` VARCHAR(191) NULL,
    `executedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `purchase_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_items` ADD CONSTRAINT `purchase_items_masterSupportItemId_fkey` FOREIGN KEY (`masterSupportItemId`) REFERENCES `master_support_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_prices` ADD CONSTRAINT `product_prices_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_histories` ADD CONSTRAINT `price_histories_productPriceId_fkey` FOREIGN KEY (`productPriceId`) REFERENCES `product_prices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_orders` ADD CONSTRAINT `distribution_orders_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_orders` ADD CONSTRAINT `distribution_orders_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_items` ADD CONSTRAINT `distribution_items_distributionId_fkey` FOREIGN KEY (`distributionId`) REFERENCES `distribution_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_items` ADD CONSTRAINT `distribution_items_packingItemId_fkey` FOREIGN KEY (`packingItemId`) REFERENCES `packing_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returned_items` ADD CONSTRAINT `returned_items_distributionItemId_fkey` FOREIGN KEY (`distributionItemId`) REFERENCES `distribution_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_verifications` ADD CONSTRAINT `delivery_verifications_distributionOrderId_fkey` FOREIGN KEY (`distributionOrderId`) REFERENCES `distribution_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_signatures` ADD CONSTRAINT `delivery_signatures_distributionOrderId_fkey` FOREIGN KEY (`distributionOrderId`) REFERENCES `distribution_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_logs` ADD CONSTRAINT `delivery_logs_distributionOrderId_fkey` FOREIGN KEY (`distributionOrderId`) REFERENCES `distribution_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `driver_liabilities` ADD CONSTRAINT `driver_liabilities_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `driver_liabilities` ADD CONSTRAINT `driver_liabilities_distributionItemId_fkey` FOREIGN KEY (`distributionItemId`) REFERENCES `distribution_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_inventories` ADD CONSTRAINT `outlet_inventories_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_inventories` ADD CONSTRAINT `outlet_inventories_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_receipts` ADD CONSTRAINT `outlet_receipts_distributionOrderId_fkey` FOREIGN KEY (`distributionOrderId`) REFERENCES `distribution_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_receipt_items` ADD CONSTRAINT `outlet_receipt_items_outletReceiptId_fkey` FOREIGN KEY (`outletReceiptId`) REFERENCES `outlet_receipts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deposit_verifications` ADD CONSTRAINT `deposit_verifications_cashDepositId_fkey` FOREIGN KEY (`cashDepositId`) REFERENCES `cash_deposits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cashier_liabilities` ADD CONSTRAINT `cashier_liabilities_cashDepositId_fkey` FOREIGN KEY (`cashDepositId`) REFERENCES `cash_deposits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `minus_compensations` ADD CONSTRAINT `minus_compensations_depositVerificationId_fkey` FOREIGN KEY (`depositVerificationId`) REFERENCES `deposit_verifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `minus_compensations` ADD CONSTRAINT `minus_compensations_driverLiabilityId_fkey` FOREIGN KEY (`driverLiabilityId`) REFERENCES `driver_liabilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_closings` ADD CONSTRAINT `outlet_closings_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_closing_items` ADD CONSTRAINT `outlet_closing_items_outletClosingId_fkey` FOREIGN KEY (`outletClosingId`) REFERENCES `outlet_closings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outlet_closing_items` ADD CONSTRAINT `outlet_closing_items_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `closing_employees` ADD CONSTRAINT `closing_employees_outletClosingId_fkey` FOREIGN KEY (`outletClosingId`) REFERENCES `outlet_closings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_fromOutletId_fkey` FOREIGN KEY (`fromOutletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_toOutletId_fkey` FOREIGN KEY (`toOutletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_items` ADD CONSTRAINT `stock_transfer_items_stockTransferId_fkey` FOREIGN KEY (`stockTransferId`) REFERENCES `stock_transfers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_items` ADD CONSTRAINT `stock_transfer_items_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returned_goods` ADD CONSTRAINT `returned_goods_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returned_items_v2` ADD CONSTRAINT `returned_items_v2_returnedGoodsId_fkey` FOREIGN KEY (`returnedGoodsId`) REFERENCES `returned_goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returned_items_v2` ADD CONSTRAINT `returned_items_v2_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rejected_goods` ADD CONSTRAINT `rejected_goods_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rejected_items` ADD CONSTRAINT `rejected_items_rejectedGoodsId_fkey` FOREIGN KEY (`rejectedGoodsId`) REFERENCES `rejected_goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rejected_items` ADD CONSTRAINT `rejected_items_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_opname_verifications` ADD CONSTRAINT `stock_opname_verifications_outletClosingId_fkey` FOREIGN KEY (`outletClosingId`) REFERENCES `outlet_closings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_differences` ADD CONSTRAINT `stock_differences_soVerificationId_fkey` FOREIGN KEY (`soVerificationId`) REFERENCES `stock_opname_verifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_differences` ADD CONSTRAINT `stock_differences_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_liabilities` ADD CONSTRAINT `employee_liabilities_stockDifferenceId_fkey` FOREIGN KEY (`stockDifferenceId`) REFERENCES `stock_differences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_adjustments` ADD CONSTRAINT `stock_adjustments_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_adjustment_items` ADD CONSTRAINT `stock_adjustment_items_stockAdjustmentId_fkey` FOREIGN KEY (`stockAdjustmentId`) REFERENCES `stock_adjustments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_adjustment_items` ADD CONSTRAINT `stock_adjustment_items_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_ledgers` ADD CONSTRAINT `inventory_ledgers_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_ledgers` ADD CONSTRAINT `inventory_ledgers_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quality_control_headers` ADD CONSTRAINT `quality_control_headers_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quality_control_items` ADD CONSTRAINT `quality_control_items_qcHeaderId_fkey` FOREIGN KEY (`qcHeaderId`) REFERENCES `quality_control_headers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quality_control_items` ADD CONSTRAINT `quality_control_items_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quality_control_logs` ADD CONSTRAINT `quality_control_logs_qcHeaderId_fkey` FOREIGN KEY (`qcHeaderId`) REFERENCES `quality_control_headers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rejected_inventories` ADD CONSTRAINT `rejected_inventories_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposal_candidates` ADD CONSTRAINT `disposal_candidates_masterPartId_fkey` FOREIGN KEY (`masterPartId`) REFERENCES `master_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
