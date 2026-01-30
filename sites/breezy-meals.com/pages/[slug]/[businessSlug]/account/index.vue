<template>
  <div
    class="relative w-full p-6 mx-auto font-body bg-background text-foreground md:p-10 lg:max-w-7xl"
  >
    <!-- Header -->
    <div
      class="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center"
    >
      <div>
        <h1 class="text-3xl font-heading sm:text-4xl">Admin Panel</h1>
        <p class="text-muted-foreground">
          Edit your landing page and menu using your site's design system.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" @click="reloadData" :disabled="loading">
          {{ loading ? "Loading..." : "Reload" }}
        </Button>
        <Button
          class="bg-primary text-primary-foreground"
          @click="saveAll"
          :disabled="loading"
        >
          Save All
        </Button>
      </div>
    </div>

    <!-- Tabs -->
    <Tabs default-value="landing" class="w-full">
      <TabsList class="grid w-full grid-cols-3 sm:max-w-md">
        <TabsTrigger value="landing">Landing Page</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <!-- CONTENT LAYOUT -->
      <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-12">
        <!-- Editor Column -->
        <div class="space-y-6 lg:col-span-7">
          <!-- Landing Editor -->
          <TabsContent value="landing">
            <Card class="p-6 space-y-6">
              <div class="flex items-center justify-between">
                <CardTitle>Landing Content</CardTitle>
                <div class="flex items-center gap-2">
                  <Button variant="secondary" size="sm" @click="resetLanding"
                    >Reset</Button
                  >
                  <Button size="sm" @click="saveLanding" :disabled="loading"
                    >Save</Button
                  >
                </div>
              </div>
              <Separator />

              <!-- Top / Banner -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label for="name">Business Name</Label>
                  <Input
                    id="name"
                    v-model="landing.name"
                    placeholder="e.g. La Terraza"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="slogan">Slogan</Label>
                  <Input
                    id="slogan"
                    v-model="landing.slogan"
                    placeholder="e.g. Fresh · Local · Friendly"
                  />
                </div>

                <div class="space-y-2 sm:col-span-2">
                  <Label>Banner Images (URLs)</Label>
                  <div class="space-y-3">
                    <div
                      v-for="(url, i) in landing.banner"
                      :key="`banner-${i}`"
                      class="flex items-center gap-2"
                    >
                      <Input
                        v-model="landing.banner[i]"
                        placeholder="https://..."
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        @click="removeFromArray(landing.banner, i)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      @click="landing.banner.push('')"
                      >Add Banner</Button
                    >
                  </div>
                </div>
              </div>

              <Separator />

              <!-- About -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label for="about-en">About (EN)</Label>
                  <Textarea
                    id="about-en"
                    v-model="landing.descriptionEn"
                    rows="4"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="about-es">Acerca (ES)</Label>
                  <Textarea
                    id="about-es"
                    v-model="landing.descriptionEs"
                    rows="4"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div class="space-y-2">
                  <Label for="phone">Phone</Label>
                  <Input
                    id="phone"
                    v-model="landing.contact.phone"
                    placeholder="+52 6xx xxx xxxx"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    v-model="landing.contact.email"
                    type="email"
                    placeholder="hello@example.com"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="website">Website</Label>
                  <Input
                    id="website"
                    v-model="landing.contact.website"
                    type="url"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label>Address</Label>
                <Input
                  v-model="landing.address.street"
                  placeholder="Street"
                  class="mb-2"
                />
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input v-model="landing.address.city" placeholder="City" />
                  <Input v-model="landing.address.state" placeholder="State" />
                  <Input
                    v-model="landing.address.postalCode"
                    placeholder="Postal Code"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label>Social Links</Label>
                  <Button
                    variant="secondary"
                    size="sm"
                    @click="landing.socialLinks.push({ label: '', url: '' })"
                    >Add Link</Button
                  >
                </div>
                <div class="space-y-2">
                  <div
                    v-for="(s, i) in landing.socialLinks"
                    :key="`soc-${i}`"
                    class="grid items-center grid-cols-1 gap-2 sm:grid-cols-5"
                  >
                    <Input
                      class="sm:col-span-2"
                      v-model="s.label"
                      placeholder="Label (e.g. Instagram)"
                    />
                    <Input
                      class="sm:col-span-3"
                      v-model="s.url"
                      placeholder="https://instagram.com/..."
                    />
                    <div class="flex justify-end sm:col-span-5">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="removeFromArray(landing.socialLinks, i)"
                        >Remove</Button
                      >
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <!-- Services -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <CardTitle>Services</CardTitle>
                  <Button variant="secondary" size="sm" @click="addService"
                    >Add Service</Button
                  >
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <Card
                    v-for="(svc, i) in landing.services"
                    :key="`svc-${i}`"
                    class="p-4"
                  >
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-5">
                      <div class="space-y-2 sm:col-span-2">
                        <Label>Title</Label>
                        <Input v-model="svc.title" />
                      </div>
                      <div class="space-y-2 sm:col-span-3">
                        <Label>Description</Label>
                        <Textarea v-model="svc.description" rows="3" />
                      </div>
                      <div class="space-y-2 sm:col-span-4">
                        <Label>Image URL</Label>
                        <Input v-model="svc.image" placeholder="https://..." />
                      </div>
                      <div class="flex justify-end sm:col-span-5">
                        <Button
                          variant="destructive"
                          size="sm"
                          @click="removeFromArray(landing.services, i)"
                          >Delete</Button
                        >
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator />

              <!-- Gallery -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <CardTitle>Gallery</CardTitle>
                  <Button
                    variant="secondary"
                    size="sm"
                    @click="landing.gallery.push({ url: '', alt: '' })"
                    >Add Image</Button
                  >
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <Card
                    v-for="(img, i) in landing.gallery"
                    :key="`g-${i}`"
                    class="p-4"
                  >
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-5">
                      <div class="space-y-2 sm:col-span-3">
                        <Label>Image URL</Label>
                        <Input v-model="img.url" placeholder="https://..." />
                      </div>
                      <div class="space-y-2 sm:col-span-2">
                        <Label>Alt</Label>
                        <Input
                          v-model="img.alt"
                          placeholder="Describe the image"
                        />
                      </div>
                      <div class="flex justify-end sm:col-span-5">
                        <Button
                          variant="outline"
                          size="sm"
                          @click="removeFromArray(landing.gallery, i)"
                          >Remove</Button
                        >
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <!-- Menu Editor -->
          <TabsContent value="menu">
            <Card class="p-6 space-y-6">
              <div class="flex items-center justify-between">
                <CardTitle>Menu</CardTitle>
                <div class="flex items-center gap-2">
                  <Button variant="secondary" size="sm" @click="resetMenu"
                    >Reset</Button
                  >
                  <Button size="sm" @click="saveMenu" :disabled="loading"
                    >Save</Button
                  >
                </div>
              </div>
              <Separator />

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label for="menutitle-en">Title (EN)</Label>
                  <Input id="menutitle-en" v-model="menu.titleEn" />
                </div>
                <div class="space-y-2">
                  <Label for="menutitle-es">Título (ES)</Label>
                  <Input id="menutitle-es" v-model="menu.titleEs" />
                </div>
                <div class="space-y-2 sm:col-span-2">
                  <Label for="menudesc-en">Description (EN)</Label>
                  <Textarea
                    id="menudesc-en"
                    v-model="menu.descriptionEn"
                    rows="3"
                  />
                </div>
                <div class="space-y-2 sm:col-span-2">
                  <Label for="menudesc-es">Descripción (ES)</Label>
                  <Textarea
                    id="menudesc-es"
                    v-model="menu.descriptionEs"
                    rows="3"
                  />
                </div>
              </div>

              <Separator />

              <!-- Categories -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <CardTitle>Categories</CardTitle>
                  <Button variant="secondary" size="sm" @click="addCategory"
                    >Add Category</Button
                  >
                </div>

                <div class="space-y-4">
                  <Card
                    v-for="(cat, ci) in menu.items"
                    :key="`cat-${ci}`"
                    class="p-4"
                  >
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
                      <div class="space-y-2">
                        <Label>Name EN</Label>
                        <Input v-model="cat.nameEn" />
                      </div>
                      <div class="space-y-2">
                        <Label>Nombre ES</Label>
                        <Input v-model="cat.nameEs" />
                      </div>
                      <div class="space-y-2 sm:col-span-2">
                        <Label>Category Image (optional)</Label>
                        <Input v-model="cat.image" placeholder="https://..." />
                      </div>
                    </div>

                    <div class="flex justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="removeFromArray(menu.items, ci)"
                        >Remove Category</Button
                      >
                    </div>

                    <Separator class="my-4" />

                    <!-- Items within category -->
                    <div class="flex items-center justify-between">
                      <CardTitle class="text-base">Items</CardTitle>
                      <Button
                        variant="secondary"
                        size="sm"
                        @click="addMenuItem(ci)"
                        >Add Item</Button
                      >
                    </div>

                    <div class="mt-2 space-y-3">
                      <Card
                        v-for="(it, ii) in cat.items"
                        :key="`item-${ci}-${ii}`"
                        class="p-3"
                      >
                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-6">
                          <div class="space-y-2 sm:col-span-2">
                            <Label>Name EN</Label>
                            <Input v-model="it.nameEn" />
                          </div>
                          <div class="space-y-2 sm:col-span-2">
                            <Label>Nombre ES</Label>
                            <Input v-model="it.nameEs" />
                          </div>
                          <div class="space-y-2 sm:col-span-2">
                            <Label>Price</Label>
                            <Input
                              v-model.number="it.price"
                              type="number"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <div class="space-y-2 sm:col-span-3">
                            <Label>Description EN</Label>
                            <Textarea v-model="it.descriptionEn" rows="2" />
                          </div>
                          <div class="space-y-2 sm:col-span-3">
                            <Label>Descripción ES</Label>
                            <Textarea v-model="it.descriptionEs" rows="2" />
                          </div>
                          <div class="space-y-2 sm:col-span-4">
                            <Label>Image URL</Label>
                            <Input
                              v-model="it.image"
                              placeholder="https://..."
                            />
                          </div>
                          <div class="flex items-end justify-end sm:col-span-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              @click="removeMenuItem(ci, ii)"
                              >Delete</Button
                            >
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <!-- Settings -->
          <TabsContent value="settings">
            <Card class="p-6 space-y-6">
              <div class="flex items-center justify-between">
                <CardTitle>Settings</CardTitle>
                <Button size="sm" @click="saveSettings" :disabled="loading"
                  >Save</Button
                >
              </div>
              <Separator />

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <Label>Preview Language</Label>
                    <p class="text-sm text-muted-foreground">
                      Choose language for preview panel
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      :class="{
                        'bg-primary text-primary-foreground':
                          settings.previewLang === 'en',
                      }"
                      @click="settings.previewLang = 'en'"
                    >
                      EN
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      :class="{
                        'bg-primary text-primary-foreground':
                          settings.previewLang === 'es',
                      }"
                      @click="settings.previewLang = 'es'"
                    >
                      ES
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>

        <!-- Preview Column -->
        <div class="lg:col-span-5">
          <Card
            class="sticky top-6 p-4 md:p-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-auto"
          >
            <CardTitle class="text-lg">Live Preview</CardTitle>
            <Separator />

            <!-- Landing preview snippet -->
            <section class="space-y-4">
              <h2 class="text-2xl font-heading text-primary">
                {{ landing.name || "Business Name" }}
              </h2>
              <p class="text-sm text-muted-foreground">{{ landing.slogan }}</p>

              <div class="relative w-full h-48 overflow-hidden rounded-xl">
                <img
                  v-if="landing.banner[0]"
                  :src="landing.banner[0]"
                  :alt="`${landing.name} banner`"
                  class="object-cover w-full h-full"
                />
                <div
                  v-else
                  class="flex items-center justify-center w-full h-full bg-muted"
                >
                  Banner preview
                </div>
              </div>

              <p class="text-sm leading-relaxed">
                {{
                  settings.previewLang === "es"
                    ? landing.descriptionEs
                    : landing.descriptionEn
                }}
              </p>

              <div class="text-sm">
                <p v-if="landing.contact.phone">
                  <b>Phone:</b> {{ landing.contact.phone }}
                </p>
                <p v-if="landing.contact.email">
                  <b>Email:</b> {{ landing.contact.email }}
                </p>
                <p v-if="landing.contact.website">
                  <b>Website:</b> {{ landing.contact.website }}
                </p>
              </div>

              <div
                v-if="settings.isPremiumMember && landing.services.length"
                class="pt-2"
              >
                <p class="font-semibold">Services</p>
                <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <li
                    v-for="(s, i) in landing.services"
                    :key="`pv-svc-${i}`"
                    class="p-3 border rounded-lg border-border"
                  >
                    <div class="flex items-center gap-3">
                      <img
                        v-if="s.image"
                        :src="s.image"
                        class="object-cover w-12 h-12 rounded"
                      />
                      <div>
                        <p class="font-medium">{{ s.title }}</p>
                        <p class="text-xs text-muted-foreground line-clamp-2">
                          {{ s.description }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                v-if="settings.isPremiumMember && landing.gallery.length"
                class="pt-2"
              >
                <p class="font-semibold">Gallery</p>
                <div class="grid grid-cols-3 gap-2">
                  <img
                    v-for="(g, i) in landing.gallery.slice(0, 6)"
                    :key="`pv-g-${i}`"
                    :src="g.url"
                    class="object-cover w-full h-20 rounded"
                  />
                </div>
              </div>
            </section>

            <Separator />

            <!-- Menu preview snippet -->
            <section v-if="menu.items.length" class="space-y-2">
              <h3 class="text-xl font-heading text-primary">
                {{
                  settings.previewLang === "es" ? menu.titleEs : menu.titleEn
                }}
              </h3>
              <p class="text-xs text-muted-foreground">
                {{
                  settings.previewLang === "es"
                    ? menu.descriptionEs
                    : menu.descriptionEn
                }}
              </p>
              <ul class="grid grid-cols-1 gap-3">
                <li
                  v-for="(cat, ci) in menu.items"
                  :key="`pv-cat-${ci}`"
                  class="p-3 border rounded-lg border-border"
                >
                  <p class="font-semibold">
                    {{
                      settings.previewLang === "es" ? cat.nameEs : cat.nameEn
                    }}
                  </p>
                  <ul class="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
                    <li
                      v-for="(it, ii) in cat.items"
                      :key="`pv-item-${ci}-${ii}`"
                      class="flex items-start justify-between gap-2"
                    >
                      <span class="text-sm">{{
                        settings.previewLang === "es" ? it.nameEs : it.nameEn
                      }}</span>
                      <span
                        class="text-sm font-semibold text-primary"
                        v-if="Number.isFinite(+it.price)"
                      >
                        {{
                          Number(it.price).toLocaleString(undefined, {
                            style: "currency",
                            currency: "USD",
                          })
                        }}
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </section>
          </Card>
        </div>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
// shadcn/ui (Vue) imports
import { Button } from "@common/components/ui/button";
import { Card, CardTitle } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Textarea } from "@common/components/ui/textarea";
import { Label } from "@common/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@common/components/ui/tabs";
import { Separator } from "@common/components/ui/separator";
import { Trash2 } from "lucide-vue-next";
import type { RecordModel } from "pocketbase";

const route = useRoute();
const { fetchCollection, createItem, updateItem } = usePocketBaseCore();

/**
 * --- TYPES ---
 */
interface Contact {
  phone: string;
  email: string;
  website: string;
}
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}
interface SocialLink {
  label: string;
  url: string;
}
interface Service {
  title: string;
  description: string;
  image?: string;
}
interface GalleryImage {
  url: string;
  alt?: string;
}

interface MenuItem {
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  image?: string;
  price?: number | string;
}

interface MenuCategory {
  nameEn: string;
  nameEs: string;
  image?: string;
  items: MenuItem[];
}

// --- INITIAL DATA (For Resets) ---
const initialLandingState = () => ({
  name: "",
  slogan: "",
  banner: [""],
  descriptionEn: "",
  descriptionEs: "",
  contact: { phone: "", email: "", website: "" } as Contact,
  address: { street: "", city: "", state: "", postalCode: "" } as Address,
  socialLinks: [] as SocialLink[],
  services: [] as Service[],
  gallery: [] as GalleryImage[],
});

const initialMenuState = () => ({
  titleEn: "Menu",
  titleEs: "Menú",
  descriptionEn: "",
  descriptionEs: "",
  items: [] as MenuCategory[],
});

/**
 * --- SHARED STATE ---
 */
const loading = ref(false);
const businessId = ref<string | null>(null);
const menuId = ref<string | null>(null);

const settings = reactive({
  isPremiumMember: true,
  previewLang: "en" as "en" | "es",
});

/**
 * --- LANDING STATE ---
 */
const landing = reactive(initialLandingState());

/**
 * --- MENU STATE ---
 */
const menu = reactive(initialMenuState());

/**
 * --- HELPERS ---
 */
const removeFromArray = <T,>(arr: T[], i: number): void => {
  arr.splice(i, 1);
};

const addService = (): void => {
  landing.services.push({ title: "", description: "", image: "" });
};

const addCategory = (): void => {
  menu.items.push({ nameEn: "", nameEs: "", image: "", items: [] });
};

const addMenuItem = (ci: number): void => {
  const def: MenuItem = {
    nameEn: "",
    nameEs: "",
    descriptionEn: "",
    descriptionEs: "",
    image: "",
    price: "",
  };
  menu.items[ci].items.push(def);
};

const removeMenuItem = (ci: number, ii: number): void => {
  menu.items[ci].items.splice(ii, 1);
};

const slug = computed(() => String(route.params.slug || ""));
const businessSlug = computed(() => String(route.params.businessSlug || ""));

/**
 * --- DATA IO (PocketBase) ---
 */
const reloadData = async () => {
  loading.value = true;
  try {
    const filter = slug.value ? `slug= "${businessSlug.value}"` : "";

    // 1. BUSINESS (Landing Page)
    const bizResult = await fetchCollection(
      slug.value,
      1,
      1,
      filter,
      "-created",
      null,
      null,
      true,
    );
    const businessRecord = bizResult?.items?.[0] as RecordModel | undefined;

    if (businessRecord) {
      businessId.value = businessRecord.id;

      Object.assign(landing, {
        name: businessRecord.name ?? "",
        slogan: businessRecord.slogan ?? "",
        banner:
          Array.isArray(businessRecord.banner) && businessRecord.banner.length
            ? businessRecord.banner
            : [""],
        descriptionEn: businessRecord.descriptionEn ?? "",
        descriptionEs: businessRecord.descriptionEs ?? "",
        contact: Object.assign(
          initialLandingState().contact,
          businessRecord.contact ?? {},
        ),
        address: Object.assign(
          initialLandingState().address,
          businessRecord.address ?? {},
        ),
        socialLinks: businessRecord.socialLinks ?? [],
        services: businessRecord.services ?? [],
        gallery: businessRecord.gallery ?? [],
      });
      settings.isPremiumMember = Boolean(businessRecord.isPremiumMember);
    } else {
      businessId.value = null;
      Object.assign(landing, initialLandingState());
      settings.isPremiumMember = true;
    }

    // 2. MENU
    const menuResult = await fetchCollection(
      "menus",
      1,
      1,
      filter,
      "-created",
      "business",
      null, // fields
      true, // ignoreCache
    );
    const menuRecord = menuResult?.items?.[0] as RecordModel | undefined;

    if (menuRecord) {
      menuId.value = menuRecord.id;
      Object.assign(menu, {
        titleEn: menuRecord.titleEn ?? "Menu",
        titleEs: menuRecord.titleEs ?? "Menú",
        descriptionEn: menuRecord.descriptionEn ?? "",
        descriptionEs: menuRecord.descriptionEs ?? "",
        items: menuRecord.items ?? [],
      });
    } else {
      menuId.value = null;
      Object.assign(menu, initialMenuState());
    }
  } catch (e) {
    console.error("Error reloading data:", e);
  } finally {
    loading.value = false;
  }
};

/**
 * --- INTERNAL SAVE FUNCTIONS (no loading checks) ---
 */
const saveLandingInternal = async () => {
  if (!businessId.value) {
    await saveNewBusiness();
    return;
  }

  const payload = {
    name: landing.name,
    slogan: landing.slogan,
    banner: landing.banner.filter((url) => url.trim()),
    descriptionEn: landing.descriptionEn,
    descriptionEs: landing.descriptionEs,
    contact: landing.contact,
    address: landing.address,
    socialLinks: landing.socialLinks,
    services: landing.services,
    gallery: landing.gallery,
    isPremiumMember: settings.isPremiumMember,
  };
  await updateItem("businesses", businessId.value, payload);
};

const saveMenuInternal = async () => {
  if (!menuId.value) {
    await saveNewMenu();
    return;
  }

  const payload = {
    business: businessId.value,
    titleEn: menu.titleEn,
    titleEs: menu.titleEs,
    descriptionEn: menu.descriptionEn,
    descriptionEs: menu.descriptionEs,
    items: menu.items,
  };
  await updateItem("menus", menuId.value, payload);
};

/**
 * --- PUBLIC SAVE FUNCTIONS (with loading) ---
 */
const saveLanding = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    await saveLandingInternal();
  } catch (e) {
    console.error("Error saving landing data:", e);
  } finally {
    loading.value = false;
  }
};

const saveMenu = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    await saveMenuInternal();
  } catch (e) {
    console.error("Error saving menu data:", e);
  } finally {
    loading.value = false;
  }
};

const saveNewBusiness = async () => {
  const payload = {
    slug: route.params.slug || undefined,
    name: landing.name,
    slogan: landing.slogan,
    banner: landing.banner.filter((url) => url.trim()),
    descriptionEn: landing.descriptionEn,
    descriptionEs: landing.descriptionEs,
    contact: landing.contact,
    address: landing.address,
    socialLinks: landing.socialLinks,
    services: landing.services,
    gallery: landing.gallery,
    isPremiumMember: settings.isPremiumMember,
  };
  const rec = (await createItem("businesses", payload)) as RecordModel;
  businessId.value = rec.id;
};

const saveNewMenu = async () => {
  const payload = {
    slug: route.params.slug || undefined,
    business: businessId.value,
    titleEn: menu.titleEn,
    titleEs: menu.titleEs,
    descriptionEn: menu.descriptionEn,
    descriptionEs: menu.descriptionEs,
    items: menu.items,
  };
  const rec = (await createItem("menus", payload)) as RecordModel;
  menuId.value = rec.id;
};

const saveSettings = async () => {
  await saveAll();
};

const saveAll = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    await Promise.all([saveLandingInternal(), saveMenuInternal()]);
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const resetLanding = () => {
  Object.assign(landing, initialLandingState());
};

const resetMenu = () => {
  Object.assign(menu, initialMenuState());
};

// Initialization logic
onMounted(() => {
  reloadData();
});
</script>
