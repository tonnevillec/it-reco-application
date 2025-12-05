<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251202214830 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE donor (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(255) DEFAULT NULL, company VARCHAR(255) DEFAULT NULL, address LONGTEXT DEFAULT NULL, siret VARCHAR(255) DEFAULT NULL, documents JSON DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE general_info (id INT AUTO_INCREMENT NOT NULL, company_name VARCHAR(255) DEFAULT NULL, siret VARCHAR(255) DEFAULT NULL, address LONGTEXT DEFAULT NULL, contact_email VARCHAR(255) DEFAULT NULL, logo_url VARCHAR(255) DEFAULT NULL, hero_text LONGTEXT DEFAULT NULL, legal_mentions LONGTEXT DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE part (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, brand VARCHAR(255) DEFAULT NULL, specifications LONGTEXT DEFAULT NULL, purchase_price DOUBLE PRECISION DEFAULT NULL, selling_price DOUBLE PRECISION DEFAULT NULL, purchase_date DATE DEFAULT NULL, status VARCHAR(255) NOT NULL, invoice VARCHAR(255) DEFAULT NULL, pc_id INT DEFAULT NULL, sale_id INT DEFAULT NULL, INDEX IDX_490F70C68F63531D (pc_id), INDEX IDX_490F70C64A7E4868 (sale_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE pc (id INT AUTO_INCREMENT NOT NULL, it_reco_ref VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, model VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, processor VARCHAR(255) NOT NULL, ram VARCHAR(255) NOT NULL, storage VARCHAR(255) NOT NULL, gpu VARCHAR(255) DEFAULT NULL, screen VARCHAR(255) DEFAULT NULL, `condition` VARCHAR(255) NOT NULL, purchase_date DATE DEFAULT NULL, price DOUBLE PRECISION NOT NULL, comments LONGTEXT DEFAULT NULL, images JSON DEFAULT NULL, type_id INT NOT NULL, donor_id INT DEFAULT NULL, sale_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_BA5D5BEBC8EE2296 (it_reco_ref), INDEX IDX_BA5D5BEBC54C8C93 (type_id), INDEX IDX_BA5D5BEB3DD7B7A7 (donor_id), INDEX IDX_BA5D5BEB4A7E4868 (sale_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE pctype (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE sale (id INT AUTO_INCREMENT NOT NULL, date DATETIME NOT NULL, customer_name VARCHAR(255) NOT NULL, customer_email VARCHAR(255) DEFAULT NULL, total_amount DOUBLE PRECISION NOT NULL, payment_method VARCHAR(255) NOT NULL, invoice_number VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME (username), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE part ADD CONSTRAINT FK_490F70C68F63531D FOREIGN KEY (pc_id) REFERENCES pc (id)');
        $this->addSql('ALTER TABLE part ADD CONSTRAINT FK_490F70C64A7E4868 FOREIGN KEY (sale_id) REFERENCES sale (id)');
        $this->addSql('ALTER TABLE pc ADD CONSTRAINT FK_BA5D5BEBC54C8C93 FOREIGN KEY (type_id) REFERENCES pctype (id)');
        $this->addSql('ALTER TABLE pc ADD CONSTRAINT FK_BA5D5BEB3DD7B7A7 FOREIGN KEY (donor_id) REFERENCES donor (id)');
        $this->addSql('ALTER TABLE pc ADD CONSTRAINT FK_BA5D5BEB4A7E4868 FOREIGN KEY (sale_id) REFERENCES sale (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE part DROP FOREIGN KEY FK_490F70C68F63531D');
        $this->addSql('ALTER TABLE part DROP FOREIGN KEY FK_490F70C64A7E4868');
        $this->addSql('ALTER TABLE pc DROP FOREIGN KEY FK_BA5D5BEBC54C8C93');
        $this->addSql('ALTER TABLE pc DROP FOREIGN KEY FK_BA5D5BEB3DD7B7A7');
        $this->addSql('ALTER TABLE pc DROP FOREIGN KEY FK_BA5D5BEB4A7E4868');
        $this->addSql('DROP TABLE donor');
        $this->addSql('DROP TABLE general_info');
        $this->addSql('DROP TABLE part');
        $this->addSql('DROP TABLE pc');
        $this->addSql('DROP TABLE pctype');
        $this->addSql('DROP TABLE sale');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
