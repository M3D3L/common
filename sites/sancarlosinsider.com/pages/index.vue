<template>
  <SeoMeta :seoData="seoData" />

  <div class="min-h-screen bg-background text-foreground font-body">
    <main>
      <!-- Hero -->
      <section class="w-full bg-gradient-to-b from-primary/10 via-background to-background">
        <div class="container flex flex-col items-center justify-center py-24 space-y-8 text-center md:py-36">
          <Badge variant="secondary" class="px-4 py-1.5 text-sm">
            🚀 Free Forever Plan Available
          </Badge>

          <h1 class="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Your Restaurant's
            <span class="block mt-2 text-primary">Digital Menu, Simplified</span>
          </h1>

          <p class="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Create a beautiful digital menu in minutes. Accept WhatsApp orders directly from your customers. No complicated setup, no transaction fees.
          </p>

          <div class="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" class="px-10 py-3 text-lg shadow-lg">
              Create Free Menu
            </Button>
            <Button size="lg" variant="outline" class="px-10 py-3 text-lg">
              View Demo
            </Button>
          </div>

          <!-- Trust Indicators -->
          <div class="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-primary" />
              <span>No Credit Card Required</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-primary" />
              <span>Setup in 5 Minutes</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-primary" />
              <span>Mobile Optimized</span>
            </div>
          </div>

          <!-- Hero Mockup -->
          <Card class="w-full max-w-5xl mt-16 overflow-hidden">
            <div class="relative bg-gradient-to-br from-slate-100 p-8 to-slate-200 dark:from-slate-800 dark:to-slate-900 h-96 md:h-[500px] flex items-center justify-center">
              <img src="/images/menu-mock.png" alt="Menu Mockup" class="object-contain h-full" />
            </div>
          </Card>
        </div>
      </section>

      <!-- Social Proof -->
      <section class="w-full py-16 bg-muted/30">
        <div class="container">
          <p class="mb-8 text-sm text-center text-muted-foreground">Trusted by restaurants across Mexico</p>
          <div class="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div class="text-2xl font-semibold">🌮 Tacos El Güero</div>
            <div class="text-2xl font-semibold">🦐 Mariscos La Playa</div>
            <div class="text-2xl font-semibold">☕ Café Central</div>
            <div class="text-2xl font-semibold">🍕 Pizzería Roma</div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" class="w-full py-24 md:py-36">
        <div class="container text-center">
          <Badge variant="outline" class="mb-4">Everything You Need</Badge>
          <h2 class="mb-4 text-4xl font-bold md:text-5xl">Built for Restaurant Owners</h2>
          <p class="max-w-3xl mx-auto mb-16 text-lg text-muted-foreground">
            Whether you serve tacos, seafood, or specialty coffee, SCDigital gives you the tools to showcase your food and take orders seamlessly.
          </p>
          
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1 -->
            <Card class="p-8 text-left transition hover:border-primary hover:shadow-xl">
              <div class="mb-4 text-4xl">📱</div>
              <CardTitle class="mb-3 text-xl font-semibold">Beautiful Landing Page</CardTitle>
              <CardDescription class="text-base">
                Create a stunning page with your hours, location, contact info, and ambiance photos. Make a great first impression.
              </CardDescription>
            </Card>

            <!-- Feature 2 -->
            <Card class="p-8 text-left transition hover:border-primary hover:shadow-xl">
              <div class="mb-4 text-4xl">📋</div>
              <CardTitle class="mb-3 text-xl font-semibold">Digital Menu</CardTitle>
              <CardDescription class="text-base">
                List all your dishes with descriptions and prices. Update instantly from any device whenever your menu changes.
              </CardDescription>
            </Card>

            <!-- Feature 3 -->
            <Card class="p-8 text-left transition hover:border-primary hover:shadow-xl">
              <div class="mb-4 text-4xl">💬</div>
              <CardTitle class="mb-3 text-xl font-semibold">WhatsApp Orders</CardTitle>
              <CardDescription class="text-base">
                Customers order via WhatsApp with a single tap. No apps to download, no payment processors, no complications.
              </CardDescription>
              <Badge variant="secondary" class="mt-3">Premium Only</Badge>
            </Card>

            <!-- Feature 4 -->
            <Card class="p-8 text-left transition hover:border-primary hover:shadow-xl">
              <div class="mb-4 text-4xl">📸</div>
              <CardTitle class="mb-3 text-xl font-semibold">Photo Gallery</CardTitle>
              <CardDescription class="text-base">
                Show off your best dishes and restaurant atmosphere with a beautiful image gallery that makes mouths water.
              </CardDescription>
              <Badge variant="secondary" class="mt-3">Premium Only</Badge>
            </Card>

            <!-- Feature 5 -->
            <Card class="p-8 text-left transition hover:border-primary hover:shadow-xl">
              <div class="mb-4 text-4xl">🌐</div>
              <CardTitle class="mb-3 text-xl font-semibold">Custom Domain</CardTitle>
              <CardDescription class="text-base">
                Use your own domain name (restaurantename.com) to build your brand and look professional.
              </CardDescription>
              <Badge variant="secondary" class="mt-3">Premium Only</Badge>
            </Card>

            <!-- Feature 6 -->
            <Card class="p-8 text-left transition hover:border-primary hover:shadow-xl">
              <div class="mb-4 text-4xl">⚡</div>
              <CardTitle class="mb-3 text-xl font-semibold">Lightning Fast</CardTitle>
              <CardDescription class="text-base">
                Pages load instantly on any device. Your customers won't wait around for slow websites.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section id="how" class="w-full py-24 bg-muted/50 md:py-36">
        <div class="container">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">Simple Process</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">Launch in 3 Easy Steps</h2>
            <p class="max-w-2xl mx-auto text-lg text-muted-foreground">
              Get your restaurant online in minutes, not days
            </p>
          </div>

          <div class="grid max-w-5xl gap-12 mx-auto md:grid-cols-3">
            <div class="space-y-4 text-center">
              <div class="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-bold rounded-full bg-primary/10 text-primary">
                1
              </div>
              <h3 class="text-xl font-semibold">Sign Up Free</h3>
              <p class="text-muted-foreground">
                Create your account in 30 seconds. No credit card needed to start.
              </p>
            </div>

            <div class="space-y-4 text-center">
              <div class="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-bold rounded-full bg-primary/10 text-primary">
                2
              </div>
              <h3 class="text-xl font-semibold">Add Your Menu</h3>
              <p class="text-muted-foreground">
                Upload your dishes, prices, and photos. Customize your page colors and style.
              </p>
            </div>

            <div class="space-y-4 text-center">
              <div class="flex items-center justify-center w-16 h-16 mx-auto text-2xl font-bold rounded-full bg-primary/10 text-primary">
                3
              </div>
              <h3 class="text-xl font-semibold">Share & Receive Orders</h3>
              <p class="text-muted-foreground">
                Share your link everywhere. Start receiving WhatsApp orders immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="w-full py-24 md:py-36">
        <div class="container max-w-5xl">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">Transparent Pricing</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">Choose Your Plan</h2>
            <p class="text-lg text-muted-foreground">
              Start free forever, or unlock premium features to grow your business
            </p>
          </div>

          <div class="grid gap-8 md:grid-cols-2">
            <!-- Free Plan -->
            <Card class="p-8 border-2">
              <div class="mb-6">
                <h3 class="mb-2 text-2xl font-bold">Free Plan</h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-4xl font-bold">$0</span>
                  <span class="text-muted-foreground">forever</span>
                </div>
                <p class="text-muted-foreground">Perfect for getting started</p>
              </div>

              <ul class="mb-8 space-y-4">
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Basic landing page with contact info</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited menu items with prices</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mobile-optimized design</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Share your menu link anywhere</span>
                </li>
                <li class="flex items-start gap-3">
                  <XCircle class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">WhatsApp order button</span>
                </li>
                <li class="flex items-start gap-3">
                  <XCircle class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Photo gallery</span>
                </li>
                <li class="flex items-start gap-3">
                  <XCircle class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Custom domain</span>
                </li>
                <li class="flex items-start gap-3">
                  <XCircle class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Contains small ads</span>
                </li>
              </ul>

              <Button variant="outline" class="w-full" size="lg">
                Start Free
              </Button>
            </Card>

            <!-- Premium Plan -->
            <Card class="relative p-8 border-2 shadow-xl border-primary">
              <Badge class="absolute transform -translate-x-1/2 -top-3 left-1/2 bg-primary">
                Most Popular
              </Badge>
              
              <div class="mb-6">
                <h3 class="mb-2 text-2xl font-bold text-primary">Premium Plan</h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-4xl font-bold">$299</span>
                  <span class="text-muted-foreground">MXN/month</span>
                </div>
                <p class="text-muted-foreground">Everything you need to grow</p>
              </div>

              <ul class="mb-8 space-y-4">
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Everything in Free</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>WhatsApp Order Button</strong> - Customers order with one tap</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Photo Gallery</strong> - Showcase your dishes beautifully</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Custom Domain</strong> - Use yourrestaurant.com</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Ad-Free Experience</strong> - Professional look</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Priority Support</strong> - Get help when you need it</span>
                </li>
              </ul>

              <Button class="w-full" size="lg">
                Start 14-Day Free Trial
              </Button>
              <p class="mt-3 text-sm text-center text-muted-foreground">
                No credit card required for trial
              </p>
            </Card>
          </div>
        </div>
      </section>

      <!-- Success Stories -->
      <section id="success" class="w-full py-24 bg-muted/50 md:py-36">
        <div class="container">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">Success Stories</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">Loved by Restaurant Owners</h2>
            <p class="text-lg text-muted-foreground">
              See how SCDigital helps restaurants thrive
            </p>
          </div>

          <div class="grid gap-8 md:grid-cols-3">
            <Card class="p-6">
              <div class="flex gap-1 mb-4">
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <p class="mb-4 text-muted-foreground">
                "We went from writing orders on paper to getting WhatsApp orders directly. Our lunch rush is so much smoother now!"
              </p>
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-primary/10 text-primary">
                  M
                </div>
                <div>
                  <p class="font-semibold">María González</p>
                  <p class="text-sm text-muted-foreground">Tacos El Güero</p>
                </div>
              </div>
            </Card>

            <Card class="p-6">
              <div class="flex gap-1 mb-4">
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <p class="mb-4 text-muted-foreground">
                "Setup took 10 minutes. Now tourists find us online and order before they even arrive at the beach. Game changer!"
              </p>
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-primary/10 text-primary">
                  C
                </div>
                <div>
                  <p class="font-semibold">Carlos Ramírez</p>
                  <p class="text-sm text-muted-foreground">Mariscos La Playa</p>
                </div>
              </div>
            </Card>

            <Card class="p-6">
              <div class="flex gap-1 mb-4">
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <p class="mb-4 text-muted-foreground">
                "The photo gallery made such a difference. People see our food and can't resist ordering. Sales are up 40%!"
              </p>
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-primary/10 text-primary">
                  A
                </div>
                <div>
                  <p class="font-semibold">Ana Martínez</p>
                  <p class="text-sm text-muted-foreground">Café Central</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="w-full py-24 md:py-36">
        <div class="container max-w-3xl">
          <div class="mb-16 text-center">
            <Badge variant="outline" class="mb-4">FAQ</Badge>
            <h2 class="mb-4 text-4xl font-bold md:text-5xl">Common Questions</h2>
          </div>

          <div class="space-y-6">
            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">How do WhatsApp orders work?</h3>
              <p class="text-muted-foreground">
                When customers click the order button on your menu, it opens WhatsApp with a pre-filled message containing their order. They send it to your business WhatsApp number, and you confirm the order directly.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">Do I need to handle payments online?</h3>
              <p class="text-muted-foreground">
                No! Customers order via WhatsApp and you arrange payment however you prefer - cash on delivery, bank transfer, or in person. This keeps things simple and avoids payment processor fees.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">Can I update my menu easily?</h3>
              <p class="text-muted-foreground">
                Absolutely! Log in from any device and update prices, add new dishes, or remove items instantly. Changes appear on your menu page immediately.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">What happens after the 14-day Premium trial?</h3>
              <p class="text-muted-foreground">
                Your account automatically switches to the Free plan. You keep your menu, but premium features like WhatsApp orders and photos are disabled. You can upgrade anytime to reactivate them.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">How do I use my own domain?</h3>
              <p class="text-muted-foreground">
                With Premium, you can connect your own domain (like yourrestaurant.com). We provide simple instructions, or our support team can help you set it up.
              </p>
            </Card>

            <Card class="p-6">
              <h3 class="mb-2 text-lg font-semibold">Is there a setup fee or contract?</h3>
              <p class="text-muted-foreground">
                No setup fees, no contracts. The Free plan is free forever. Premium is month-to-month, cancel anytime with no penalties.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="w-full py-24 text-center bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div class="container max-w-4xl">
          <h2 class="mb-4 text-4xl font-bold md:text-5xl">Ready to Modernize Your Restaurant?</h2>
          <p class="max-w-2xl mx-auto mb-8 text-lg text-muted-foreground">
            Join hundreds of restaurants already using SCDitital. Create your digital menu today and start receiving orders in minutes.
          </p>
          <div class="flex flex-col justify-center gap-4 mb-8 sm:flex-row">
            <Button size="lg" class="px-10 py-3 text-lg shadow-lg">
              Start Free Today
            </Button>
            <Button size="lg" variant="outline" class="px-10 py-3 text-lg">
              Try Premium Free
            </Button>
          </div>
          <p class="text-sm text-muted-foreground">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 border-t bg-muted/30">
      <div class="container">
        <div class="grid gap-8 md:grid-cols-4">
          <div>
            <a href="/" class="block mb-4 text-xl font-bold">
              SC<span class="text-primary">Digital</span>
            </a>
            <p class="text-sm text-muted-foreground">
              Digital menus made simple for restaurants everywhere.
            </p>
          </div>
          <div>
            <h4 class="mb-4 font-semibold">Product</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" class="hover:text-primary">Features</a></li>
              <li><a href="#pricing" class="hover:text-primary">Pricing</a></li>
              <li><a href="#faq" class="hover:text-primary">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-semibold">Company</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" class="hover:text-primary">About</a></li>
              <li><a href="#" class="hover:text-primary">Contact</a></li>
              <li><a href="#success" class="hover:text-primary">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-semibold">Legal</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" class="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="pt-8 mt-12 text-sm text-center border-t text-muted-foreground">
          <p>&copy; 2025 SCDigital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Card, CardTitle, CardDescription } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { CheckCircle, XCircle, Star } from "lucide-vue-next";

const seoData = {
  title: "SCDigital | Digital Products, Menus, & WhatsApp Orders for Restaurants",
  description:
    "Create your restaurant's digital menu in minutes. Accept WhatsApp orders directly from customers. Free forever plan available. No payment processors needed.",
};
</script>