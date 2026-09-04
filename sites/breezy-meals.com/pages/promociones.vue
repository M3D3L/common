<template>
  <section class="container mx-auto w-full px-4 py-8 md:py-10">
    <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Staff
        </p>
        <h1
          class="font-heading text-3xl font-extrabold tracking-tight text-primary md:text-4xl"
        >
          Promos Dashboard
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Create, edit, and delete promos for Breezy from one place.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="loading" @click="loadPromos">
          <RefreshCw
            :size="16"
            class="mr-1.5"
            :class="loading ? 'animate-spin' : ''"
          />
          Refresh
        </Button>
        <Button @click="openCreate">
          <Plus :size="16" class="mr-1.5" />
          New Promo
        </Button>
      </div>
    </header>

    <Card class="mb-5">
      <CardContent class="p-4 sm:p-5">
        <div class="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
          <p>
            <span class="font-semibold text-foreground">Collection:</span>
            {{ COLLECTION }}
          </p>
          <p>
            <span class="font-semibold text-foreground">Total:</span>
            {{ promos.length }}
          </p>
          <p>
            <span class="font-semibold text-foreground">Active:</span>
            {{ activeCount }}
          </p>
        </div>
      </CardContent>
    </Card>

    <Alert class="mb-5 border-amber-500/40 bg-amber-500/10 text-amber-900">
      <AlertTitle>Schema note</AlertTitle>
      <AlertDescription>
        This dashboard expects a PocketBase collection named "promos". If your
        schema uses different field names, update the mapper in this page.
      </AlertDescription>
    </Alert>

    <Alert v-if="errorMessage" class="mb-5" variant="destructive">
      <AlertTitle>Request failed</AlertTitle>
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>

    <Alert
      v-if="successMessage"
      class="mb-5 border-emerald-500/40 bg-emerald-500/10 text-emerald-900"
    >
      <AlertTitle>Saved</AlertTitle>
      <AlertDescription>{{ successMessage }}</AlertDescription>
    </Alert>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle>Promos</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-if="loading">
              <TableCell
                colspan="7"
                class="py-8 text-center text-muted-foreground"
              >
                Loading promos...
              </TableCell>
            </TableRow>

            <TableRow v-else-if="!promos.length">
              <TableCell
                colspan="7"
                class="py-8 text-center text-muted-foreground"
              >
                No promos found.
              </TableCell>
            </TableRow>

            <TableRow v-for="promo in promos" :key="promo.id">
              <TableCell>
                <div class="space-y-1">
                  <p class="font-semibold leading-tight">{{ promo.label }}</p>
                  <p class="line-clamp-1 text-xs text-muted-foreground">
                    {{ promo.summary || "No summary" }}
                  </p>
                </div>
              </TableCell>
              <TableCell class="font-medium">{{
                money(promo.amount)
              }}</TableCell>
              <TableCell>{{ promo.priority }}</TableCell>
              <TableCell>
                <Badge :variant="promo.active ? 'default' : 'secondary'">
                  {{ promo.active ? "Active" : "Inactive" }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {{
                    promo.source === "menu-config"
                      ? "menu config"
                      : "pocketbase"
                  }}
                </Badge>
              </TableCell>
              <TableCell class="text-xs text-muted-foreground">{{
                formatDate(promo.updated)
              }}</TableCell>
              <TableCell>
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="openEdit(promo)">
                    <Pencil :size="14" class="mr-1" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button
                        size="sm"
                        variant="destructive"
                        :disabled="promo.source === 'menu-config'"
                      >
                        <Trash2 :size="14" class="mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete promo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{{ promo.label }}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          @click="removePromo(promo)"
                        >
                          Yes, delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{
            editingId ? "Edit Promo" : "Create Promo"
          }}</DialogTitle>
          <div class="flex items-start justify-between gap-3">
            <DialogDescription>
              Manage core promo fields and requirement rules.
            </DialogDescription>

            <HoverCard>
              <HoverCardTrigger as-child>
                <Button size="icon" variant="ghost" class="h-8 w-8 shrink-0">
                  <CircleHelp :size="16" />
                  <span class="sr-only">Promo help</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                side="bottom"
                align="end"
                :side-offset="8"
                class="w-[min(92vw,360px)] max-h-[60vh] overflow-y-auto space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl"
              >
                <p class="text-sm font-semibold">How to create a promo</p>
                <p class="text-xs text-muted-foreground">
                  Add label, price, and one or more rules. Each rule defines
                  what items must be in the cart for the promo to apply.
                </p>
                <div class="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span class="font-semibold text-foreground">Group:</span>
                    Category-wide match (guisos, sides, bebidas, etc).
                  </p>
                  <p>
                    <span class="font-semibold text-foreground"
                      >Order Unit:</span
                    >
                    Bundle unit match (taquiza:tacos, taquiza:quesadillas).
                  </p>
                  <p>
                    <span class="font-semibold text-foreground">Item:</span>
                    Exact dish name match.
                  </p>
                </div>
                <p class="text-xs text-muted-foreground">
                  Example: Group "guisos" qty 1 + Group "sides" qty 2 + Group
                  "bebidas" qty 1.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </DialogHeader>

        <div class="grid gap-4 py-2">
          <div class="grid gap-1.5">
            <Label for="promo-label">Label</Label>
            <Input
              id="promo-label"
              v-model="form.label"
              placeholder="2 guisados + agua"
            />
          </div>

          <div class="grid gap-1.5">
            <Label for="promo-summary">Summary</Label>
            <Textarea
              id="promo-summary"
              v-model="form.summary"
              rows="2"
              placeholder="Short customer-facing description"
            />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-1.5">
              <Label for="promo-amount">Amount (MXN)</Label>
              <Input
                id="promo-amount"
                v-model="form.amount"
                type="number"
                min="0"
                step="1"
              />
            </div>
            <div class="grid gap-1.5">
              <Label for="promo-priority">Priority</Label>
              <Input
                id="promo-priority"
                v-model="form.priority"
                type="number"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div class="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p class="font-medium">Active</p>
              <p class="text-xs text-muted-foreground">
                Inactive promos are kept for history but not applied.
              </p>
            </div>
            <Switch v-model:checked="form.active" />
          </div>

          <Separator />

          <div class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label>Requirements</Label>
                <p class="text-xs text-muted-foreground">
                  Add the conditions that trigger this promo.
                </p>
              </div>
              <Button size="sm" variant="outline" @click="addRequirementRow">
                <Plus :size="14" class="mr-1.5" />
                Add rule
              </Button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(row, index) in requirementRows"
                :key="`rule-${index}`"
                class="grid gap-2 rounded-lg border p-3 sm:grid-cols-12"
              >
                <div class="sm:col-span-4">
                  <Label class="mb-1 block text-xs text-muted-foreground"
                    >Type</Label
                  >
                  <Select
                    :model-value="row.targetType"
                    @update:model-value="
                      (value) =>
                        changeTargetType(
                          row,
                          value as PromoRequirement['targetType'],
                        )
                    "
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="order-unit">Order Unit</SelectItem>
                      <SelectItem value="item">Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="sm:col-span-5">
                  <Label class="mb-1 block text-xs text-muted-foreground"
                    >Target</Label
                  >
                  <template v-if="availableTargets(row.targetType).length">
                    <Select v-model="row.target">
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent class="max-h-72">
                        <SelectItem
                          v-for="option in availableTargets(row.targetType)"
                          :key="`${row.targetType}-${option}`"
                          :value="option"
                        >
                          {{ option }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </template>
                  <template v-else>
                    <Input v-model="row.target" placeholder="Target key" />
                  </template>
                </div>

                <div class="sm:col-span-2">
                  <Label class="mb-1 block text-xs text-muted-foreground"
                    >Qty</Label
                  >
                  <Input
                    v-model.number="row.qty"
                    type="number"
                    min="1"
                    step="1"
                  />
                </div>

                <div class="sm:col-span-1 flex items-end justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    :disabled="requirementRows.length === 1"
                    @click="removeRequirementRow(index)"
                  >
                    <Trash2 :size="15" />
                    <span class="sr-only">Remove rule</span>
                  </Button>
                </div>
              </div>
            </div>

            <div class="rounded-lg border bg-muted/30 p-3">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-medium">Advanced JSON</p>
                <Button
                  size="sm"
                  variant="outline"
                  @click="advancedJsonOpen = !advancedJsonOpen"
                >
                  {{ advancedJsonOpen ? "Hide" : "Show" }} JSON
                </Button>
              </div>

              <div v-if="advancedJsonOpen" class="mt-3 grid gap-2">
                <Textarea
                  id="promo-req"
                  v-model="form.requirementsJson"
                  rows="8"
                  class="font-mono text-xs"
                  placeholder='[{"targetType":"group","target":"guisado","qty":2}]'
                />
                <div class="flex justify-end">
                  <Button size="sm" variant="outline" @click="syncRowsFromJson">
                    Apply JSON to form
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            :disabled="saving"
            @click="dialogOpen = false"
            >Cancel</Button
          >
          <Button :disabled="saving || !form.label.trim()" @click="savePromo">
            <Save :size="14" class="mr-1.5" />
            {{
              saving ? "Saving..." : editingId ? "Save changes" : "Create promo"
            }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import type { RecordModel } from "pocketbase";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Save,
  CircleHelp,
} from "lucide-vue-next";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@common/components/ui/hover-card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Separator } from "@common/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Switch } from "@common/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@common/components/ui/table";
import { Textarea } from "@common/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@common/components/ui/alert-dialog";
import { menuPricingConfig } from "~/config/menu-pricing";
import type { PricingPromo } from "~/utils/menuPricing";

definePageMeta({ layout: "staff", alias: "/promos-dashboard" });

const COLLECTION = "promos";
const { fetchCollection, createItem, updateItem, deleteItem } =
  usePocketBaseCore();

type PromoRequirement = {
  targetType: "group" | "item" | "order-unit";
  target: string;
  qty: number;
};

type PromoViewModel = {
  id: string;
  label: string;
  summary: string;
  amount: number;
  priority: number;
  active: boolean;
  requirements: PromoRequirement[];
  source: "pocketbase" | "menu-config";
  menuPromoId: string;
  updated: string;
  raw: Record<string, any>;
};

type PromoForm = {
  label: string;
  summary: string;
  amount: string;
  priority: string;
  active: boolean;
  requirementsJson: string;
};

type RequirementRow = {
  targetType: PromoRequirement["targetType"];
  target: string;
  qty: number;
};

const promos = ref<PromoViewModel[]>([]);
const loading = ref(false);
const saving = ref(false);
const dialogOpen = ref(false);
const editingId = ref<string | null>(null);
const editingMenuPromoId = ref<string>("");
const advancedJsonOpen = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const form = reactive<PromoForm>({
  label: "",
  summary: "",
  amount: "120",
  priority: "100",
  active: true,
  requirementsJson: '[{"targetType":"group","target":"guisado","qty":2}]',
});

const requirementRows = ref<RequirementRow[]>([]);

const KNOWN_GROUP_TARGETS = [
  "bebidas",
  "caldos",
  "desayunos",
  "ensaladas",
  "guisos",
  "sides",
  "sweets",
  "taquizas",
  "tortas_burgers_burritos",
];

const KNOWN_ITEM_TARGETS = [
  "Agua de Melón",
  "Agua de Piña",
  "Limonada de Limón Amarillo",
  "Limonada de Fresa",
  "Té de Limón",
  "Refresco de Sabor",
  "Agua Mineral de Sabor",
  "Lentejas con Tocino",
  "Sopa de letras con pollo desmenuzado",
  "Sopa de tortilla con queso y aguacate",
  "Caldo de Queso",
  "Caldo de Res",
  "Caldo de Albóndigas",
  "Huevos Revuéltos con Jamon, frijol, tortilas y bebida",
  "Huevos Revuéltos con Tocino, frijol, tortilas y bebida",
  "Huevos Revuéltos con Salchicha, frijol, tortilas y bebida",
  "Huevos Revuéltos con Chorizo, frijol, tortilas y bebida",
  "Ensalada de Pollo, Pimienta y Limón",
  "Ensalada de Atún",
  "Ensalada Primavera",
  "Ensalada de Frutas Ralladas",
  "Birria",
  "Cochinita Pibil",
  "Chicharrón en Salsa Verde",
  "Pollo en Crema Chipotle",
  "Pollo en Crema Alfredo con Brocoli",
  "Pollo en Crema de Rajas",
  "Sandwichon de Ensalada de Pollo",
  "Sandwichon de Ensalada de Atún",
  "Pollo en Crema de Champiñón y Tocino",
  "Carne Molida a la Boloñesa",
  "Marlin en Escabeche",
  "Albóndigas de Chipotle Rellenas de Queso",
  "Lasaña de Calabaza",
  "Carne en su Jugo con Tocino",
  "Teriyaki de Res",
  "Pollo Oriental",
  "Discada Norteña (res, cerdo y tocino)",
  "Milanesa de Cerdo",
  "Salpicon de Res",
  "Bistec Ranchero",
  "Espagueti Rojo",
  "Fettuccine Alfredo",
  "Arroz Naranja",
  "Rajas en Salsa Soya",
  "Puré de Papa",
  "Arroz Blanco",
  "Ensalada Fresca",
  "Frijoles Rancheros",
  "Pan de Plátano",
  "Chocolate Muffin",
  "Chocolate Brownie",
  "Chocolate Chip Cookies",
  "Chokis 2x1",
  "Machaca",
  "Frijol",
  "Marlin",
  "Discada",
  "Pescado Estilo Baja",
  "Torta de Cochinita Pibil (con Guarnición de Papas Gajo)",
  "Hamburguesa de Res con Champiñones, Tocino y Cebolla (con Guarnición de Papas Gajo)",
  "Croissants de Jamón y Queso",
  "Burritos de Machaca",
  "Burritos de Huevo con Tocino",
  "Papas Gajo",
  "Papas Gajo con Queso",
];

const groupTargets = computed(() => {
  const values = new Set<string>(KNOWN_GROUP_TARGETS);
  menuPricingConfig.promos.forEach((promo) => {
    (promo.match?.requirements || []).forEach((req) => {
      if (req.targetType === "group" && req.target) values.add(req.target);
    });
  });
  return [...values].sort((a, b) => a.localeCompare(b, "es"));
});

const orderUnitTargets = computed(() => {
  return Object.keys(menuPricingConfig.orderUnits || {}).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
});

const itemTargets = computed(() => {
  const values = new Set<string>(KNOWN_ITEM_TARGETS);
  menuPricingConfig.promos.forEach((promo) => {
    (promo.match?.requirements || []).forEach((req) => {
      if (req.targetType === "item" && req.target) values.add(req.target);
    });
  });
  return [...values].sort((a, b) => a.localeCompare(b, "es"));
});

const activeCount = computed(() => promos.value.filter((p) => p.active).length);

const money = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const parseRequirements = (rawText: string): PromoRequirement[] => {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  const parsed = JSON.parse(trimmed);
  if (!Array.isArray(parsed)) {
    throw new Error("Requirements must be a JSON array.");
  }

  return parsed.map((entry, index) => {
    const targetType = String(entry?.targetType || "");
    const target = String(entry?.target || "");
    const qty = Number(entry?.qty || 0);
    const validType =
      targetType === "group" ||
      targetType === "item" ||
      targetType === "order-unit";

    if (!validType || !target || !Number.isFinite(qty) || qty <= 0) {
      throw new Error(`Invalid requirement at index ${index}.`);
    }

    return {
      targetType,
      target,
      qty,
    } as PromoRequirement;
  });
};

const createBlankRequirement = (): RequirementRow => ({
  targetType: "group",
  target: "",
  qty: 1,
});

const availableTargets = (targetType: PromoRequirement["targetType"]) => {
  if (targetType === "group") return groupTargets.value;
  if (targetType === "order-unit") return orderUnitTargets.value;
  return itemTargets.value;
};

const changeTargetType = (
  row: RequirementRow,
  value: PromoRequirement["targetType"],
) => {
  row.targetType = value;
  const options = availableTargets(value);
  row.target = options[0] || "";
};

const addRequirementRow = () => {
  requirementRows.value.push(createBlankRequirement());
};

const removeRequirementRow = (index: number) => {
  requirementRows.value.splice(index, 1);
  if (!requirementRows.value.length) {
    requirementRows.value.push(createBlankRequirement());
  }
};

const syncRowsFromJson = () => {
  try {
    const parsed = parseRequirements(form.requirementsJson);
    requirementRows.value = parsed.length
      ? parsed.map((req) => ({
          targetType: req.targetType,
          target: req.target,
          qty: req.qty,
        }))
      : [createBlankRequirement()];
  } catch {
    requirementRows.value = [createBlankRequirement()];
  }
};

const syncJsonFromRows = () => {
  const cleaned = requirementRows.value
    .map((row) => ({
      targetType: row.targetType,
      target: String(row.target || "").trim(),
      qty: Math.max(1, Number(row.qty || 1)),
    }))
    .filter((row) => row.target);

  form.requirementsJson = JSON.stringify(cleaned, null, 2);
};

const normalizePromo = (record: RecordModel): PromoViewModel => {
  const raw = record as Record<string, any>;
  const data = raw.data && typeof raw.data === "object" ? raw.data : {};
  const menuPromoId = String(raw.promoId || raw.code || data.id || "").trim();

  const label =
    String(raw.label || raw.name || data.label || "").trim() ||
    `Promo ${String(raw.id || "")}`;
  const summary = String(
    raw.display?.summary ||
      raw.summary ||
      raw.description ||
      data.display?.summary ||
      "",
  ).trim();
  const amount = Number(raw.pricing?.amount ?? data.pricing?.amount ?? 0) || 0;
  const priority = Number(raw.priority ?? data.priority ?? 0) || 0;
  const active = Boolean(raw.active ?? data.active ?? true);

  const requirements = (
    Array.isArray(raw.requirements)
      ? raw.requirements
      : Array.isArray(raw.match?.requirements)
        ? raw.match.requirements
        : Array.isArray(data.match?.requirements)
          ? data.match.requirements
          : []
  ) as PromoRequirement[];

  return {
    id: String(raw.id),
    label,
    summary,
    amount,
    priority,
    active,
    requirements,
    source: "pocketbase",
    menuPromoId,
    updated: String(raw.updated || raw.created || ""),
    raw,
  };
};

const promoFromConfig = (promo: PricingPromo): PromoViewModel => {
  return {
    id: `config:${promo.id}`,
    label: promo.label,
    summary: String(promo.display?.summary || "").trim(),
    amount: Number(promo.pricing?.amount || 0),
    priority: Number(promo.priority || 0),
    active: promo.active !== false,
    requirements: (promo.match?.requirements || []) as PromoRequirement[],
    source: "menu-config",
    menuPromoId: String(promo.id || "").trim(),
    updated: "",
    raw: {
      id: promo.id,
      label: promo.label,
      active: promo.active !== false,
      priority: promo.priority,
      pricing: promo.pricing,
      display: promo.display,
      match: promo.match,
    },
  };
};

const buildCanonicalPayload = () => {
  const amount = Math.max(0, Number(form.amount || 0));
  const priority = Math.max(0, Number(form.priority || 0));
  const requirements = parseRequirements(form.requirementsJson);
  const summary = form.summary.trim();

  if (!requirements.length) {
    throw new Error("Add at least one requirement rule.");
  }

  const promoId =
    editingMenuPromoId.value.trim() ||
    form.label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return {
    promoId,
    label: form.label.trim(),
    priority,
    active: form.active,
    match: { requirements },
    pricing: { amount },
    display: { summary },
  };
};

const buildPayloadCandidates = (sourceKeys?: string[]) => {
  const canonical = buildCanonicalPayload();
  const keys = new Set(sourceKeys || []);

  // First candidate strictly matches the new promos schema.
  const strict = {
    promoId: canonical.promoId,
    label: canonical.label,
    priority: canonical.priority,
    active: canonical.active,
    match: canonical.match,
    pricing: canonical.pricing,
    display: canonical.display,
  };

  // Fallback candidate respects only fields currently present on the edited
  // record plus required shape fields, useful for old data variations.
  const compat: Record<string, any> = {};
  [
    "promoId",
    "label",
    "priority",
    "active",
    "match",
    "pricing",
    "display",
  ].forEach((key) => {
    if (keys.has(key)) compat[key] = (strict as any)[key];
  });

  return Object.keys(compat).length ? [strict, compat] : [strict];
};

const resetForm = () => {
  form.label = "";
  form.summary = "";
  form.amount = "120";
  form.priority = "100";
  form.active = true;
  form.requirementsJson = '[{"targetType":"group","target":"guisado","qty":2}]';
  advancedJsonOpen.value = false;
  syncRowsFromJson();
};

const openCreate = () => {
  editingId.value = null;
  editingMenuPromoId.value = "";
  errorMessage.value = "";
  successMessage.value = "";
  resetForm();
  dialogOpen.value = true;
};

const openEdit = (promo: PromoViewModel) => {
  editingId.value = promo.source === "pocketbase" ? promo.id : null;
  editingMenuPromoId.value = promo.menuPromoId || "";
  errorMessage.value = "";
  successMessage.value = "";

  form.label = promo.label;
  form.summary = promo.summary;
  form.amount = String(promo.amount || 0);
  form.priority = String(promo.priority || 0);
  form.active = promo.active;
  form.requirementsJson = JSON.stringify(promo.requirements || [], null, 2);
  advancedJsonOpen.value = false;
  syncRowsFromJson();

  dialogOpen.value = true;
};

const loadPromos = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await fetchCollection(
      COLLECTION,
      1,
      200,
      "",
      "-updated",
      null,
      null,
      true,
      { requestKey: "promos_dashboard" },
    );
    const fromPocketbase = result.items.map(normalizePromo);

    const mergedByKey = new Map<string, PromoViewModel>();

    menuPricingConfig.promos.forEach((promo) => {
      const item = promoFromConfig(promo);
      mergedByKey.set(item.menuPromoId || item.id, item);
    });

    fromPocketbase.forEach((promo) => {
      const key = promo.menuPromoId || promo.id;
      mergedByKey.set(key, promo);
    });

    promos.value = [...mergedByKey.values()].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.label.localeCompare(b.label, "es");
    });
  } catch (error: any) {
    errorMessage.value = error?.message || "Could not load promos.";
    promos.value = menuPricingConfig.promos
      .map(promoFromConfig)
      .sort((a, b) => a.priority - b.priority);
  } finally {
    loading.value = false;
  }
};

const savePromo = async () => {
  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    syncJsonFromRows();
    const editingPromo = promos.value.find(
      (item) => item.id === editingId.value,
    );
    const candidates = buildPayloadCandidates(
      editingPromo ? Object.keys(editingPromo.raw) : undefined,
    );

    let lastError: any = null;
    for (const payload of candidates) {
      try {
        if (editingId.value) {
          await updateItem(COLLECTION, editingId.value, payload);
        } else {
          await createItem(COLLECTION, payload);
        }
        lastError = null;
        break;
      } catch (error: any) {
        lastError = error;
      }
    }

    if (lastError) throw lastError;

    successMessage.value = editingId.value
      ? "Promo updated successfully."
      : "Promo created successfully.";
    dialogOpen.value = false;
    await loadPromos();
  } catch (error: any) {
    errorMessage.value = error?.message || "Could not save promo.";
  } finally {
    saving.value = false;
  }
};

const removePromo = async (promo: PromoViewModel) => {
  errorMessage.value = "";
  successMessage.value = "";

  if (promo.source === "menu-config") {
    errorMessage.value =
      "This promo comes from menu-pricing config. Remove it from config/menu-pricing.ts or import/override it in PocketBase first.";
    return;
  }

  try {
    await deleteItem(COLLECTION, promo.id);
    successMessage.value = `Promo \"${promo.label}\" deleted.`;
    await loadPromos();
  } catch (error: any) {
    errorMessage.value = error?.message || "Could not delete promo.";
  }
};

onMounted(loadPromos);
</script>
