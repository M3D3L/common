<template>
  <section id="faq" class="w-full py-24 bg-muted/50 md:py-36">
    <div class="container max-w-3xl">
      <div class="mb-16 text-center">
        <Badge variant="outline" class="mb-4">FAQ</Badge>
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">Common Questions</h2>
      </div>

      <div class="space-y-6">
        <Card v-for="(item, index) in faqs" :key="index" class="p-6">
          <h3 class="mb-2 text-lg font-semibold">
            {{ item.question }}
          </h3>
          <p class="text-muted-foreground">
            {{ item.answer }}
          </p>
        </Card>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";

const faqs = [
  {
    question: "How long do the meals stay fresh in my freezer?",
    answer:
      "Our vacuum-sealed meals stay fresh for up to 3 months in your freezer. Each meal is clearly labeled with preparation date and best-by information.",
  },
  {
    question: "How do I heat the meals?",
    answer:
      "Each meal comes with simple heating instructions on the label. Most can be heated in boiling water (still sealed) or transferred to a dish and microwaved. Ready in 10-15 minutes!",
  },
  {
    question: "Do you deliver to all of San Carlos?",
    answer:
      "Yes! We deliver throughout San Carlos, Sonora. Contact us for specific delivery schedules and to arrange your delivery time.",
  },
  {
    question: "Can I customize my weekly package?",
    answer:
      "Absolutely! Mix and match any 5 meals from our menu for the weekly package price. Choose all the same or try different varieties—it's up to you!",
  },
  {
    question: "What dietary information do you provide?",
    answer:
      "Every meal is labeled with key dietary information including whether it's heart-healthy, diabetic-friendly, gluten-free, or meets other special dietary needs. We're happy to discuss specific requirements.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Contact us via WhatsApp, phone, or through our website. We'll confirm your meal selections, delivery details, and arrange payment. It's that simple!",
  },
];
</script>
