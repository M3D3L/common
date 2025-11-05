<template>
  <SeoMeta :seoData="seoData" />

  <div class="w-full">
    <main>
      <!-- Hero -->
      <OrganismsHero />

      <!-- Why Choose Us -->
      <AtomsWhyUs />

      <!-- Features -->
      <AtomsFeatures />
      <!-- How It Works -->
      <AtomsHowItWorks />

      <!-- Pricing -->
      <AtomsPricingSection />

      <!-- Testimonials -->
      <AtomsRatingsSection />

      <!-- FAQ -->
      <AtomsFaqSection />
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
const seoData = {
  title:
    "SCDigital | Digital Products, Menus, & WhatsApp Orders for Restaurants",
  description:
    "Create your restaurant's digital menu in minutes. Accept WhatsApp orders directly from customers. Free forever plan available. No payment processors needed.",
};
</script>
