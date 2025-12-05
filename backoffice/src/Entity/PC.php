<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\Repository\PCRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;

#[ORM\Entity(repositoryClass: PCRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['pc:read']],
    operations: [
        new Get(
            security: "is_granted('PUBLIC_ACCESS')",
            normalizationContext: ['groups' => ['pc:read']]
        ),
        new GetCollection(
            security: "is_granted('PUBLIC_ACCESS')",
            normalizationContext: ['groups' => ['pc:read']]
        ),
        new Post(),
        new Put(),
        new Patch(),
        new Delete()
    ]
)]
class PC
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sale:read', 'pc:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['pc:read'])]
    private ?string $itRecoRef = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => true])]
    #[Groups(['sale:read', 'pc:read'])]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $isActif = true;

    public function isActif(): ?bool
    {
        return $this->isActif;
    }

    #[Groups(['pc:read'])]
    public function getIsActif(): ?bool
    {
        return $this->isActif;
    }

    public function setIsActif(bool $isActif): static
    {
        $this->isActif = $isActif;

        return $this;
    }

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['pc:read'])]
    private ?PCType $type = null;

    #[ORM\Column(length: 255)]
    #[Groups(['pc:read'])]
    private ?string $status = null; // AVAILABLE, SOLD, REFURBISHING, ARCHIVED

    #[ORM\Column(length: 255)]
    #[Groups(['sale:read', 'pc:read'])]
    private ?string $model = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sale:read', 'pc:read'])]
    private ?string $brand = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sale:read', 'pc:read'])]
    private ?string $processor = null;

    #[ORM\Column(length: 255)]
    #[Groups(['pc:read'])]
    private ?string $ram = null;

    #[ORM\Column(length: 255)]
    #[Groups(['pc:read'])]
    private ?string $storage = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['pc:read'])]
    private ?string $gpu = null;

    #[ORM\Column(length: 255)]
    #[Groups(['pc:read'])]
    private ?string $pcCondition = null;

    // ...

    public function getPcCondition(): ?string
    {
        return $this->pcCondition;
    }

    public function setPcCondition(string $pcCondition): static
    {
        $this->pcCondition = $pcCondition;

        return $this;
    }

    #[ORM\ManyToOne]
    #[Groups(['pc:read'])]
    private ?Donor $donor = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['pc:read'])]
    private ?\DateTimeInterface $purchaseDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['pc:read'])]
    private ?int $year = null;

    #[ORM\Column]
    #[Groups(['pc:read'])]
    private ?float $price = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['pc:read'])]
    private ?string $comments = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['pc:read'])]
    private ?string $otherDetails = null;

    public function getOtherDetails(): ?string
    {
        return $this->otherDetails;
    }

    public function setOtherDetails(?string $otherDetails): static
    {
        $this->otherDetails = $otherDetails;

        return $this;
    }

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['pc:read'])]
    private ?array $images = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['pc:read'])]
    private ?array $refurbishment = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['pc:read'])]
    private ?array $announcement = null;

    #[ORM\OneToMany(mappedBy: 'pc', targetEntity: Part::class)]
    private Collection $parts;

    #[ORM\ManyToOne(inversedBy: 'pcs')]
    private ?Sale $sale = null;

    public function __construct()
    {
        $this->parts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getItRecoRef(): ?string
    {
        return $this->itRecoRef;
    }

    public function setItRecoRef(string $itRecoRef): static
    {
        $this->itRecoRef = $itRecoRef;

        return $this;
    }

    public function getType(): ?PCType
    {
        return $this->type;
    }

    public function setType(?PCType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(string $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): static
    {
        $this->brand = $brand;

        return $this;
    }

    public function getProcessor(): ?string
    {
        return $this->processor;
    }

    public function setProcessor(string $processor): static
    {
        $this->processor = $processor;

        return $this;
    }

    public function getRam(): ?string
    {
        return $this->ram;
    }

    public function setRam(string $ram): static
    {
        $this->ram = $ram;

        return $this;
    }

    public function getStorage(): ?string
    {
        return $this->storage;
    }

    public function setStorage(string $storage): static
    {
        $this->storage = $storage;

        return $this;
    }

    public function getGpu(): ?string
    {
        return $this->gpu;
    }

    public function setGpu(?string $gpu): static
    {
        $this->gpu = $gpu;

        return $this;
    }

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['pc:read'])]
    private ?array $screen = null;

    // ...

    public function getScreen(): ?array
    {
        return $this->screen;
    }

    public function setScreen(?array $screen): static
    {
        $this->screen = $screen;

        return $this;
    }



    public function getDonor(): ?Donor
    {
        return $this->donor;
    }

    public function setDonor(?Donor $donor): static
    {
        $this->donor = $donor;

        return $this;
    }

    public function getPurchaseDate(): ?\DateTimeInterface
    {
        return $this->purchaseDate;
    }

    public function setPurchaseDate(?\DateTimeInterface $purchaseDate): static
    {
        $this->purchaseDate = $purchaseDate;

        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): static
    {
        $this->year = $year;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getComments(): ?string
    {
        return $this->comments;
    }

    public function setComments(?string $comments): static
    {
        $this->comments = $comments;

        return $this;
    }

    public function getImages(): ?array
    {
        return $this->images;
    }

    public function setImages(?array $images): static
    {
        $this->images = $images;

        return $this;
    }

    public function getRefurbishment(): ?array
    {
        return $this->refurbishment;
    }

    public function setRefurbishment(?array $refurbishment): static
    {
        $this->refurbishment = $refurbishment;

        return $this;
    }

    public function getAnnouncement(): ?array
    {
        return $this->announcement;
    }

    public function setAnnouncement(?array $announcement): static
    {
        $this->announcement = $announcement;

        return $this;
    }

    /**
     * @return Collection<int, Part>
     */
    public function getParts(): Collection
    {
        return $this->parts;
    }

    public function addPart(Part $part): static
    {
        if (!$this->parts->contains($part)) {
            $this->parts->add($part);
            $part->setPc($this);
        }

        return $this;
    }

    public function removePart(Part $part): static
    {
        if ($this->parts->removeElement($part)) {
            // set the owning side to null (unless already changed)
            if ($part->getPc() === $this) {
                $part->setPc(null);
            }
        }

        return $this;
    }

    public function getSale(): ?Sale
    {
        return $this->sale;
    }

    public function setSale(?Sale $sale): static
    {
        $this->sale = $sale;

        return $this;
    }
}
