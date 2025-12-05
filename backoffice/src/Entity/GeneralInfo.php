<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\GeneralInfoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;

#[ORM\Entity(repositoryClass: GeneralInfoRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('PUBLIC_ACCESS')"),
        new GetCollection(security: "is_granted('PUBLIC_ACCESS')"),
        new Post(),
        new Put(),
        new Patch()
    ]
)]
class GeneralInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $companyName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siret = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $address = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactEmail = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $logoUrl = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $heroText = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $legalMentions = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $documents = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $news = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCompanyName(): ?string
    {
        return $this->companyName;
    }

    public function setCompanyName(?string $companyName): static
    {
        $this->companyName = $companyName;

        return $this;
    }

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): static
    {
        $this->siret = $siret;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getContactEmail(): ?string
    {
        return $this->contactEmail;
    }

    public function setContactEmail(?string $contactEmail): static
    {
        $this->contactEmail = $contactEmail;

        return $this;
    }

    public function getLogoUrl(): ?string
    {
        return $this->logoUrl;
    }

    public function setLogoUrl(?string $logoUrl): static
    {
        $this->logoUrl = $logoUrl;

        return $this;
    }

    public function getHeroText(): ?string
    {
        return $this->heroText;
    }

    public function setHeroText(?string $heroText): static
    {
        $this->heroText = $heroText;

        return $this;
    }

    public function getLegalMentions(): ?string
    {
        return $this->legalMentions;
    }

    public function setLegalMentions(?string $legalMentions): static
    {
        $this->legalMentions = $legalMentions;

        return $this;
    }

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $alertMessage = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $telephone = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $leboncoinUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $linkedinUrl = null;

    public function getAlertMessage(): ?string
    {
        return $this->alertMessage;
    }

    public function setAlertMessage(?string $alertMessage): static
    {
        $this->alertMessage = $alertMessage;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getLeboncoinUrl(): ?string
    {
        return $this->leboncoinUrl;
    }

    public function setLeboncoinUrl(?string $leboncoinUrl): static
    {
        $this->leboncoinUrl = $leboncoinUrl;

        return $this;
    }

    public function getLinkedinUrl(): ?string
    {
        return $this->linkedinUrl;
    }

    public function setLinkedinUrl(?string $linkedinUrl): static
    {
        $this->linkedinUrl = $linkedinUrl;

        return $this;
    }

    public function getDocuments(): ?array
    {
        return $this->documents;
    }

    public function setDocuments(?array $documents): static
    {
        $this->documents = $documents;

        return $this;
    }

    public function getNews(): ?array
    {
        return $this->news;
    }

    public function setNews(?array $news): static
    {
        $this->news = $news;

        return $this;
    }

    #[Groups(['general_info:read'])]
    public function getActiveNews(): array
    {
        if (null === $this->news) {
            return [];
        }

        return array_values(array_filter($this->news, function ($item) {
            return isset($item['active']) && true === $item['active'];
        }));
    }
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $legalUpdateDate = null;

    public function getLegalUpdateDate(): ?\DateTimeInterface
    {
        return $this->legalUpdateDate;
    }

    public function setLegalUpdateDate(?\DateTimeInterface $legalUpdateDate): static
    {
        $this->legalUpdateDate = $legalUpdateDate;

        return $this;
    }
}
