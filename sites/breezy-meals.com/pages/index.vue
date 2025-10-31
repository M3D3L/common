<template>
  <SeoMeta :seoData="seoData" />

  <div class="w-full">
    <main>
      <!-- Hero -->
      <section class="w-full min-h-screen grid content-center">
        <Card
          class="container flex flex-col items-center justify-center py-24 space-y-8 text-center md:py-24"
        >
          <Badge variant="secondary" class="px-4 py-1.5 text-sm">
            🌊 Fresh Ocean Breeze, Quick & Easy Meals
          </Badge>

          <h1
            class="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Delicious, Healthy Meals
            <span class="block mt-2 text-primary">Ready When You Are</span>
          </h1>

          <p class="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Premium frozen meals delivered to your door in San Carlos, Sonora.
            From classic comfort food to authentic Mexican dishes all
            vacuum-sealed, labeled, and ready to heat and enjoy.
          </p>

          <div class="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" class="px-10 py-3 text-lg shadow-lg">
              Order Now
            </Button>
            <Button size="lg" variant="outline" class="px-10 py-3 text-lg">
              View Menu
            </Button>
          </div>

          <!-- Trust Indicators -->
          <div
            class="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-muted-foreground"
          >
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-primary" />
              <span>Vacuum Sealed Fresh</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-primary" />
              <span>Dietary Options Available</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-primary" />
              <span>Local San Carlos Delivery</span>
            </div>
          </div>
        </Card>
      </section>

      <!-- Why Choose Us -->
      <section class="w-full py-16 bg-muted/30">
        <div class="container">
          <p class="mb-8 text-sm text-center text-muted-foreground">
            Trusted by the San Carlos community
          </p>
          <div
            class="flex flex-wrap items-center justify-center gap-12 opacity-70"
          >
            <div class="flex items-center gap-2 text-xl font-semibold">
              <Heart class="w-6 h-6 text-primary" />
              Heart Healthy Options
            </div>
            <div class="flex items-center gap-2 text-xl font-semibold">
              <Leaf class="w-6 h-6 text-primary" />
              Gluten-Free Available
            </div>
            <div class="flex items-center gap-2 text-xl font-semibold">
              <Users class="w-6 h-6 text-primary" />
              Diabetic Friendly
            </div>
            <div class="flex items-center gap-2 text-xl font-semibold">
              <Clock class="w-6 h-6 text-primary" />
              Ready in Minutes
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" class="w-full py-24 md:py-36">
        <div class="container text-center">
          <Badge variant="outline" class="mb-4">Why Breezy Meals?</Badge>
          <h2 class="mb-4 text-4xl font-bold md:text-5xl">
            Made for Your Lifestyle
          </h2>
          <p class="max-w-3xl mx-auto mb-16 text-lg text-muted-foreground">
            Whether you're enjoying retirement, managing dietary needs, or
            simply want more time to enjoy San Carlos, we've got you covered.
          </p>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              class="p-8 text-left transition hover:border-primary hover:shadow-xl"
              v-for="(feature, index) in aboutUsContent"
              :key="index"
            >
              <div class="flex flex-row gap-2 items-center">
                <div class="mb-4 text-3xl">{{ feature.icon }}</div>
                <CardTitle class="mb-3 text-xl font-semibold">{{
                  feature.title
                }}</CardTitle>
              </div>
              <CardDescription class="text-base">
                {{ feature.description }}
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section id="how" class="w-full py-24 bg-muted/50 md:py-36">
        <Card class="container pt-16 pb-24">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">Simple Process</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">
              How Breezy Meals Works
            </h2>
            <p class="max-w-2xl mx-auto text-lg text-muted-foreground">
              From order to table in just a few easy steps
            </p>
          </div>

          <div class="grid max-w-5xl gap-12 mx-auto md:grid-cols-3">
            <div class="space-y-4 text-center">
              <div
                class="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-bold rounded-full bg-primary/10 text-primary"
              >
                1
              </div>
              <h3 class="text-xl font-semibold">Choose Your Meals</h3>
              <p class="text-muted-foreground">
                Browse our menu of American and Mexican favorites. Select meals
                that fit your dietary needs and preferences.
              </p>
            </div>

            <div class="space-y-4 text-center">
              <div
                class="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-bold rounded-full bg-primary/10 text-primary"
              >
                2
              </div>
              <h3 class="text-xl font-semibold">We Deliver Fresh</h3>
              <p class="text-muted-foreground">
                Your meals arrive vacuum-sealed and frozen, ready to store in
                your freezer until you're ready to enjoy.
              </p>
            </div>

            <div class="space-y-4 text-center">
              <div
                class="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-bold rounded-full bg-primary/10 text-primary"
              >
                3
              </div>
              <h3 class="text-xl font-semibold">Heat & Enjoy</h3>
              <p class="text-muted-foreground">
                Follow the simple heating instructions on each label. Delicious,
                home-style meals ready in minutes!
              </p>
            </div>
          </div>
        </Card>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="w-full py-24 md:py-36">
        <div class="container max-w-5xl">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">Simple Pricing</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">
              Affordable Meal Plans
            </h2>
            <p class="text-lg text-muted-foreground">
              Quality meals that fit your budget. Order by the meal or save with
              weekly packages.
            </p>
          </div>

          <div class="grid gap-8 md:grid-cols-2">
            <!-- Single Meal -->
            <Card class="p-8 border-2">
              <div class="mb-6">
                <h3 class="mb-2 text-2xl font-bold">Single Meal</h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-4xl font-bold">$129</span>
                  <span class="text-muted-foreground">MXN per meal</span>
                </div>
                <p class="text-muted-foreground">Perfect for trying us out</p>
              </div>

              <ul class="mb-8 space-y-4">
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  />
                  <span>Choose any meal from our menu</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  />
                  <span>Vacuum-sealed and labeled</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  />
                  <span>Local delivery available</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  />
                  <span>Dietary information included</span>
                </li>
              </ul>

              <Button variant="outline" class="w-full" size="lg">
                Order Single Meals
              </Button>
            </Card>

            <!-- Weekly Package -->
            <Card class="relative p-8 border-2 shadow-xl border-primary">
              <Badge
                class="absolute transform -translate-x-1/2 -top-3 left-1/2 bg-primary"
              >
                Best Value - Save $50
              </Badge>

              <div class="mb-6">
                <h3 class="mb-2 text-2xl font-bold text-primary">
                  Weekly Package (5 Meals)
                </h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-4xl font-bold">$119</span>
                  <span class="text-muted-foreground">MXN per meal</span>
                </div>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-2xl font-bold">$595</span>
                  <span class="text-muted-foreground">MXN total</span>
                </div>
                <p class="text-muted-foreground">Save $50 on weekly orders</p>
              </div>

              <ul class="mb-8 space-y-4">
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span><strong>All Single Meal benefits</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span><strong>5 meals of your choice</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span><strong>$10 savings per meal</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span><strong>Priority delivery</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span><strong>Mix and match any meals</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle
                    class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  />
                  <span
                    ><strong>No commitment</strong> - order when you need</span
                  >
                </li>
              </ul>

              <Button class="w-full" size="lg"> Order Weekly Package </Button>
              <p class="mt-3 text-sm text-center text-muted-foreground">
                Most popular choice among our customers
              </p>
            </Card>
          </div>

          <div class="mt-12 text-center">
            <p class="text-lg text-muted-foreground">
              <strong>Need more meals?</strong> Contact us for custom packages
              and additional savings!
            </p>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section id="testimonials" class="w-full py-24 md:py-36">
        <div class="container">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">Customer Reviews</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">
              What San Carlos Loves
            </h2>
            <p class="text-lg text-muted-foreground">
              Hear from our happy customers enjoying Breezy Meals
            </p>
          </div>

          <div class="grid gap-8 md:grid-cols-3">
            <Card
              v-for="(review, reviewIndex) in reviewsArray"
              :key="reviewIndex"
            >
              <CardContent>
                <div class="flex items-center gap-3 pt-4 justify-center">
                  <div
                    class="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-primary/50 text-primary"
                  >
                    {{ review.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold">{{ review.name }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ review.role }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-1 mb-4">
                  <Star
                    class="w-5 h-5 text-yellow-400 fill-yellow-400"
                    v-for="n in review.rating"
                    :key="n"
                  />
                </div>
                <p class="text-muted-foreground">"{{ review.review }}"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="w-full py-24 bg-muted/50 md:py-36">
        <div class="container max-w-3xl">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">FAQ</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">
              Common Questions
            </h2>
          </div>

          <div class="space-y-6">
            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">
                How long do the meals stay fresh in my freezer?
              </h3>
              <p class="text-muted-foreground">
                Our vacuum-sealed meals stay fresh for up to 3 months in your
                freezer. Each meal is clearly labeled with preparation date and
                best-by information.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">
                How do I heat the meals?
              </h3>
              <p class="text-muted-foreground">
                Each meal comes with simple heating instructions on the label.
                Most can be heated in boiling water (still sealed) or
                transferred to a dish and microwaved. Ready in 10-15 minutes!
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">
                Do you deliver to all of San Carlos?
              </h3>
              <p class="text-muted-foreground">
                Yes! We deliver throughout San Carlos, Sonora. Contact us for
                specific delivery schedules and to arrange your delivery time.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">
                Can I customize my weekly package?
              </h3>
              <p class="text-muted-foreground">
                Absolutely! Mix and match any 5 meals from our menu for the
                weekly package price. Choose all the same or try different
                varieties—it's up to you!
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">
                What dietary information do you provide?
              </h3>
              <p class="text-muted-foreground">
                Every meal is labeled with key dietary information including
                whether it's heart-healthy, diabetic-friendly, gluten-free, or
                meets other special dietary needs. We're happy to discuss
                specific requirements.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">
                How do I place an order?
              </h3>
              <p class="text-muted-foreground">
                Contact us via WhatsApp, phone, or through our website. We'll
                confirm your meal selections, delivery details, and arrange
                payment. It's that simple!
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 border-t bg-muted/30">
      <div class="container">
        <div class="grid gap-8 md:grid-cols-4">
          <div>
            <a href="/" class="block mb-4 text-xl font-bold">
              Breezy<span class="text-primary">Meals</span>
            </a>
            <p class="text-sm text-muted-foreground">
              Premium frozen meals delivered fresh to San Carlos, Sonora.
            </p>
          </div>
          <div>
            <h4 class="mb-4 font-semibold">Quick Links</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#menu" class="hover:text-primary">Our Menu</a></li>
              <li><a href="#pricing" class="hover:text-primary">Pricing</a></li>
              <li><a href="#faq" class="hover:text-primary">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-semibold">Contact</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" class="hover:text-primary">WhatsApp Orders</a>
              </li>
              <li><a href="#" class="hover:text-primary">Phone</a></li>
              <li><a href="#" class="hover:text-primary">Email</a></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-semibold">Location</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>San Carlos, Sonora</li>
              <li>Mexico</li>
              <li><a href="#" class="hover:text-primary">Get Directions</a></li>
            </ul>
          </div>
        </div>
        <div
          class="pt-8 mt-12 text-sm text-center border-t text-muted-foreground"
        >
          <p>&copy; 2025 Breezy Meals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { CheckCircle, XCircle, Star } from "lucide-vue-next";

const seoData = {
  title:
    "SCDigital | Digital Products, Menus, & WhatsApp Orders for Restaurants",
  description:
    "Create your restaurant's digital menu in minutes. Accept WhatsApp orders directly from customers. Free forever plan available. No payment processors needed.",
};

const aboutUsContent = [
  {
    title: "Vacuum Fresh",
    description:
      "Every meal is carefully prepared, vacuum-sealed to lock in flavor and nutrients, then clearly labeled with heating instructions.",
    icon: "❄️",
  },
  {
    title: "Local Ingredients",
    description:
      "We partner with local farms to source the freshest ingredients, supporting our community and ensuring quality.",
    icon: "🌱",
  },
  {
    title: "Convenient Delivery",
    description:
      "Enjoy hassle-free delivery right to your doorstep, so you can spend more time enjoying your meal and less time in the kitchen.",
    icon: "🚚",
  },
  {
    title: "Diverse Menu Options",
    description:
      "From classic comfort foods to authentic Mexican dishes, our menu offers something for every palate and dietary need.",
    icon: "🍽️",
  },
  {
    title: "Dietary-Friendly",
    description:
      "We cater to various dietary needs with heart-healthy, diabetic-friendly, and gluten-free options clearly marked on our menu.",
    icon: "❤️",
  },
  {
    title: "Ready in Minutes",
    description:
      "Our meals are designed for quick preparation, allowing you to enjoy a delicious home-cooked meal in just minutes.",
    icon: "⏱️",
  },
];

const reviewsArray = [
  {
    name: "Barbara & Tom",
    role: "San Carlos Retirees",
    rating: 5,
    review: `"The pot roast tastes just like my grandmother used to make! Perfect portions and so convenient. We order the weekly package every time."`,
  },
  {
    name: "Roberto M.",
    role: "Long-time Customer",
    rating: 5,
    review: `"As a diabetic, I love that the meals are clearly labeled with nutritional info. The birria is absolutely delicious and fits my diet perfectly!"`,
  },
  {
    name: "Susan & Mike",
    role: "Winter Visitors",
    rating: 5,
    review: `"Finally! Gluten-free options that actually taste amazing. More time on the beach, less time cooking. Breezy Meals is a game-changer."`,
  },
];
</script>
