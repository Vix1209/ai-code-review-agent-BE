import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductionMigration1741410561481 implements MigrationInterface {
    name = 'ProductionMigration1741410561481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`review\` (\`id\` varchar(36) NOT NULL, \`prompt\` text NOT NULL, \`enrichedPrompt\` text NOT NULL, \`feedback\` text NOT NULL, \`userFeedback\` text NULL, \`processedFeedback\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`accountId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'active', \`resetToken\` varchar(255) NULL, \`resetTokenExpiry\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reference\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`embedding\` text NOT NULL, \`metadata\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`accountIdId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_cfe234d68b9ec0aac262881f2ca\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reference\` ADD CONSTRAINT \`FK_dcf606de76906f34385b11fd746\` FOREIGN KEY (\`accountIdId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reference\` DROP FOREIGN KEY \`FK_dcf606de76906f34385b11fd746\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_cfe234d68b9ec0aac262881f2ca\``);
        await queryRunner.query(`DROP TABLE \`reference\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
        await queryRunner.query(`DROP TABLE \`review\``);
    }

}
