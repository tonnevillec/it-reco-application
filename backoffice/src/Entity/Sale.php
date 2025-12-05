<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SaleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SaleRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['sale:read']]
)]
class Sale
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sale:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['sale:read'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sale:read'])]
    private ?string $customerName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['sale:read'])]
    private ?string $customerEmail = null;

    #[ORM\Column]
    #[Groups(['sale:read'])]
    private ?float $totalAmount = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sale:read'])]
    private ?string $paymentMethod = null;

    #[ORM\Column(length: 255)]
    #[Groups(['sale:read'])]
    private ?string $invoiceNumber = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['sale:read'])]
    private ?string $salesChannel = null;

    #[ORM\OneToMany(mappedBy: 'sale', targetEntity: PC::class)]
    #[Groups(['sale:read'])]
    private Collection $pcs;

    #[ORM\OneToMany(mappedBy: 'sale', targetEntity: Part::class)]
    private Collection $parts;

    public function __construct()
    {
        $this->pcs = new ArrayCollection();
        $this->parts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getCustomerName(): ?string
    {
        return $this->customerName;
    }

    public function setCustomerName(string $customerName): static
    {
        $this->customerName = $customerName;

        return $this;
    }

    public function getCustomerEmail(): ?string
    {
        return $this->customerEmail;
    }

    public function setCustomerEmail(?string $customerEmail): static
    {
        $this->customerEmail = $customerEmail;

        return $this;
    }

    public function getTotalAmount(): ?float
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(float $totalAmount): static
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }

    public function getPaymentMethod(): ?string
    {
        return $this->paymentMethod;
    }

    public function setPaymentMethod(string $paymentMethod): static
    {
        $this->paymentMethod = $paymentMethod;

        return $this;
    }

    public function getInvoiceNumber(): ?string
    {
        return $this->invoiceNumber;
    }

    public function setInvoiceNumber(string $invoiceNumber): static
    {
        $this->invoiceNumber = $invoiceNumber;

        return $this;
    }

    public function getSalesChannel(): ?string
    {
        return $this->salesChannel;
    }

    public function setSalesChannel(?string $salesChannel): static
    {
        $this->salesChannel = $salesChannel;

        return $this;
    }

    /**
     * @return Collection<int, PC>
     */
    public function getPcs(): Collection
    {
        return $this->pcs;
    }

    public function addPc(PC $pc): static
    {
        if (!$this->pcs->contains($pc)) {
            $this->pcs->add($pc);
            $pc->setSale($this);
        }

        return $this;
    }

    public function removePc(PC $pc): static
    {
        if ($this->pcs->removeElement($pc)) {
            // set the owning side to null (unless already changed)
            if ($pc->getSale() === $this) {
                $pc->setSale(null);
            }
        }

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
            $part->setSale($this);
        }

        return $this;
    }

    public function removePart(Part $part): static
    {
        if ($this->parts->removeElement($part)) {
            // set the owning side to null (unless already changed)
            if ($part->getSale() === $this) {
                $part->setSale(null);
            }
        }

        return $this;
    }
}
