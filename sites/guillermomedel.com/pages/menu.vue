<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <SeoMeta :follow="false" />

    <!-- Cargando -->
    <div v-if="pending" class="mx-auto max-w-lg px-5 pt-9 pb-40">
      <div class="mt-12 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 4" :key="i" class="h-20 w-full rounded-xl" />
      </div>
      <div class="mt-8 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" />
      </div>
    </div>

    <!-- Error / sin menú publicado -->
    <div
      v-else-if="!record"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🍽️</p>
        <h1 class="text-xl font-bold font-heading">
          {{
            loadError
              ? "No pudimos cargar el menú"
              : "El menú aún no está listo"
          }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{
            loadError
              ? "Revisa tu conexión y vuelve a intentarlo."
              : "El restaurante publica el menú al abrir. Vuelve en un momento."
          }}
        </p>
        <Button variant="outline" size="sm" class="mt-4" @click="load">
          <ClientOnly><RotateCw :size="15" class="mr-2" /></ClientOnly>
          Reintentar
        </Button>
      </div>
    </div>

    <!-- Sin servicio hoy (fin de semana / semana cerrada / sin menú del día) -->
    <div
      v-else-if="!hasMenu"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🗓️</p>
        <h1 class="text-xl font-bold font-heading">Hoy no hay servicio</h1>

        <Card
          class="flex items-center mt-2 justify-between w-full px-3 py-2"
          aria-label="Seleccionar día del menú"
        >
          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9"
            title="Día anterior"
            aria-label="Día anterior"
            @click="changeMenuDate(-1)"
          >
            <ClientOnly><ChevronLeft :size="18" /></ClientOnly>
          </Button>
          <div class="text-center">
            <p
              class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              Menú del día
            </p>
            <p class="text-sm font-bold capitalize">{{ selectedDateLabel }}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9"
            title="Día siguiente"
            aria-label="Día siguiente"
            @click="changeMenuDate(1)"
          >
            <ClientOnly><ChevronRight :size="18" /></ClientOnly>
          </Button>
        </Card>
        <p class="mt-3 text-sm text-muted-foreground">
          No hay menú disponible para hoy. ¿Quieres preordenar para los próximos
          días?
        </p>
        <!-- <Button as-child variant="outline" size="sm" class="mt-4">
          <NuxtLink to="/semana">Ver preórdenes</NuxtLink>
        </Button> -->
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <main ref="menuMainEl" class="mx-auto max-w-lg space-y-8 px-5 pb-44 pt-6">
        <!-- Instrucciones -->
        <section
          v-if="!props.staffMode"
          class="js-reveal-item rounded-lg bg-primary/5 border border-primary/10 p-4"
        >
          <h3 class="font-bold text-sm mb-2 flex items-center gap-2">
            <span>💡</span> How to order / Cómo pedir
          </h3>
          <ol
            class="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside"
          >
            <li>Select your dishes / Selecciona tus platillos.</li>
            <li>Choose delivery/pickup / Elige entrega o recoger.</li>
            <li>
              Fill in your name (required for delivery) / Ingresa tu nombre
              (requerido para domicilio).
            </li>
            <li>Tap "Send" / Presiona "Enviar".</li>
          </ol>
        </section>

        <section
          v-if="props.useDailyMenu"
          class="js-reveal-item flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 px-3 py-2"
          aria-label="Seleccionar día del menú"
        >
          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9"
            title="Día anterior"
            aria-label="Día anterior"
            @click="changeMenuDate(-1)"
          >
            <ClientOnly><ChevronLeft :size="18" /></ClientOnly>
          </Button>
          <div class="text-center">
            <p
              class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              Menú del día
            </p>
            <p class="text-sm font-bold capitalize">{{ selectedDateLabel }}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9"
            title="Día siguiente"
            aria-label="Día siguiente"
            @click="changeMenuDate(1)"
          >
            <ClientOnly><ChevronRight :size="18" /></ClientOnly>
          </Button>
        </section>

        <section
          v-if="
            !props.staffMode &&
            props.useDailyMenu &&
            promoCardsWithAppliedState.length
          "
        >
          <div class="mb-2 flex items-center gap-2">
            <nuxt-link
              to="/promos"
              class="flex items-center gap-1 hover:underline"
            >
              <Badge
                variant="outline"
                class="border-primary/30 bg-primary/10 text-[10px] uppercase text-primary"
              >
                Promos
              </Badge>
            </nuxt-link>
            <p class="text-xs font-bold uppercase tracking-wide">
              Promociones disponibles / Available promos
            </p>
          </div>

          <div class="space-y-2">
            <div
              v-for="promo in promoCardsWithAppliedState"
              :key="promo.id"
              class="js-reveal-item rounded-md border border-primary/10 bg-background/80 p-2"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="font-semibold leading-tight">
                    {{ promo.label }}
                  </p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ promo.summary }}
                  </p>
                </div>
                <p
                  class="shrink-0 text-right text-sm font-bold tabular-nums text-primary"
                >
                  {{ money(promo.price) }}
                </p>
              </div>

              <div class="mt-2 space-y-1">
                <div
                  v-for="requirement in promo.requirements"
                  :key="requirement.id"
                  class="flex items-center justify-between gap-2 text-[11px]"
                >
                  <p class="text-muted-foreground">
                    {{ requirement.current }}/{{ requirement.required }}
                    {{ requirement.label }}
                  </p>
                  <p
                    :class="
                      requirement.met
                        ? 'font-semibold text-emerald-700'
                        : 'font-semibold text-amber-700'
                    "
                  >
                    {{
                      requirement.met
                        ? "Listo / Ready"
                        : `Falta ${requirement.missing} / Missing ${requirement.missing}`
                    }}
                  </p>
                </div>
              </div>

              <p
                class="mt-2 text-[11px] font-semibold"
                :class="
                  promo.appliedQty > 0
                    ? 'text-emerald-700'
                    : promo.eligible
                      ? 'text-sky-700'
                      : 'text-amber-700'
                "
              >
                {{
                  promo.appliedQty > 0
                    ? `Combo activado / Combo active: ${promo.label}${
                        promo.appliedQty > 1 ? ` x${promo.appliedQty}` : ""
                      }`
                    : promo.eligible
                      ? "Cumple requisitos, pero comparte guarniciones/bebida con otras promos activas. / Meets requirements, but shares sides/drink with other active promos."
                      : `Te falta / Missing: ${promo.missingTextEs} / ${promo.missingTextEn}`
                }}
              </p>
            </div>
          </div>
        </section>

        <!-- ===== Chips de categoría: filtran a golpe de vista =====
             Cada chip abre su cajón y hace scroll hacia él. "Todo" expande o
             colapsa todo. El badge conserva el conteo del carrito aunque el
             cajón esté cerrado, para que el usuario nunca pierda su pedido. -->
        <div class="-mx-5 border-b border-border bg-background/95 px-5 py-2">
          <div class="flex gap-2 overflow-x-auto pb-0.5">
            <Button
              type="button"
              size="sm"
              class="h-8 shrink-0 rounded-full px-3 text-xs font-bold"
              :variant="allGroupsOpen ? 'default' : 'outline'"
              @click="toggleAllGroups"
            >
              Todo / All
            </Button>

            <Button
              v-for="group in visibleMenuGroups"
              :key="`chip-${group.key}`"
              type="button"
              size="sm"
              class="h-8 shrink-0 rounded-full px-3 text-xs font-bold"
              :variant="isGroupOpen(group.key) ? 'default' : 'outline'"
              @click="focusGroup(group.key)"
            >
              {{ group.label }}
              <span v-if="groupCartCount(group.key)" class="ml-1 tabular-nums"
                >· {{ groupCartCount(group.key) }}</span
              >
            </Button>
          </div>
        </div>

        <section
          v-for="group in menuGroups"
          v-show="showGroupSection(group.key)"
          :key="group.key"
          :ref="(el) => setSectionRef(group.key, el)"
          class="js-reveal-section scroll-mt-16"
        >
          <!-- Encabezado = botón que abre/cierra el cajón -->
          <button
            type="button"
            class="mb-3 flex w-full items-center gap-3 text-left"
            :aria-expanded="isGroupOpen(group.key)"
            @click="toggleGroup(group.key)"
          >
            <h2
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              {{ group.label }}
              <span
                class="ml-1 font-semibold tabular-nums text-foreground/50"
                >{{ groupItems(group.key).length }}</span
              >
            </h2>
            <span
              v-if="groupCartCount(group.key)"
              class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-primary"
            >
              {{ groupCartCount(group.key) }} en carrito
            </span>
            <Separator class="shrink flex-1" />
            <ClientOnly>
              <ChevronDown
                :size="16"
                class="shrink-0 text-muted-foreground transition-transform duration-200"
                :class="isGroupOpen(group.key) && 'rotate-180'"
              />
            </ClientOnly>
          </button>

          <!-- Cuerpo del cajón -->
          <div v-show="isGroupOpen(group.key)">
            <!-- ===== Taquizas: por orden ===== -->
            <div
              v-if="taquizaGroup && group.key === taquizaGroup.key"
              class="mb-3 space-y-3"
            >
              <!-- Crear una orden nueva (tacos o quesadillas). Se pueden agregar
                   tantas como quiera el cliente; cada una tiene su propio límite. -->
              <div class="grid grid-cols-2 gap-2">
                <Button
                  v-for="kind in taquizaKinds"
                  :key="`add-${kind}`"
                  variant="outline"
                  class="h-auto flex-col items-start gap-0.5 py-2"
                  @click="addTaquizaOrder(kind)"
                >
                  <span
                    class="flex items-center gap-1.5 text-xs font-bold uppercase"
                  >
                    <ClientOnly><Plus :size="14" /></ClientOnly>
                    {{
                      kind === "tacos"
                        ? "Orden de tacos"
                        : "Orden de quesadillas"
                    }}
                  </span>
                  <span class="text-[11px] font-normal text-background">
                    {{ TAQUIZA_CAP[kind] }} piezas por orden
                  </span>
                </Button>
              </div>

              <p
                v-if="!taquizaOrders.length"
                class="text-[11px] text-muted-foreground"
              >
                Agrega una orden de tacos o quesadillas para elegir tus guisos.
              </p>

              <!-- Órdenes creadas. Cada tarjeta es una orden independiente con su
                   propio tope de piezas y su propia selección de guisos. -->
              <div
                v-for="(order, idx) in taquizaOrders"
                :key="order.id"
                class="js-reveal-item rounded-md border p-2"
              >
                <div class="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <p class="text-xs font-bold uppercase">
                      Orden {{ idx + 1 }} ·
                      {{ order.kind === "tacos" ? "Tacos" : "Quesadillas" }}
                    </p>
                    <p class="text-[11px] text-muted-foreground">
                      {{ orderFillTotal(order) }}/{{ TAQUIZA_CAP[order.kind] }}
                      pieza(s)
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 text-background hover:text-destructive"
                    :aria-label="`Quitar orden ${idx + 1}`"
                    @click="removeTaquizaOrder(order.id)"
                  >
                    <ClientOnly><Trash2 :size="15" /></ClientOnly>
                  </Button>
                </div>

                <div v-if="groupItems(group.key).length" class="space-y-2">
                  <Card
                    v-for="item in groupItems(group.key)"
                    :key="`${order.id}-${item.name}`"
                    class="flex items-center gap-3 p-3"
                    :class="[
                      isOut(item.name) && 'opacity-60',
                      (order.fills[item.name] ?? 0) > 0 &&
                        'bg-primary/5 ring-1 ring-primary/40',
                    ]"
                  >
                    <div class="flex-1">
                      <p
                        class="font-semibold leading-tight"
                        :class="
                          isOut(item.name) &&
                          'text-muted-foreground line-through'
                        "
                      >
                        {{ item.name }}
                      </p>
                    </div>

                    <div
                      v-if="!isOut(item.name)"
                      class="flex shrink-0 items-center gap-1"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-8 w-8"
                        :disabled="(order.fills[item.name] ?? 0) <= 0"
                        @click="setOrderFill(order, item.name, -1)"
                      >
                        <ClientOnly><Minus :size="15" /></ClientOnly>
                      </Button>
                      <span class="w-6 text-center font-bold tabular-nums">
                        {{ order.fills[item.name] ?? 0 }}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-8 w-8"
                        :disabled="!canAddToOrder(order)"
                        @click="setOrderFill(order, item.name, 1)"
                      >
                        <ClientOnly><Plus :size="15" /></ClientOnly>
                      </Button>
                    </div>
                  </Card>
                </div>
                <p v-else class="text-[11px] text-muted-foreground">
                  No hay guisos disponibles para taquizas hoy.
                </p>

                <p class="mt-2 text-[11px] text-muted-foreground">
                  Máximo {{ TAQUIZA_CAP[order.kind] }} pieza(s) en esta orden.
                </p>
              </div>
            </div>

            <!-- ===== Grupos normales ===== -->
            <div
              v-if="
                groupItems(group.key).length &&
                !(taquizaGroup && group.key === taquizaGroup.key)
              "
              class="space-y-2"
            >
              <Card
                v-for="item in groupItems(group.key)"
                :key="item.name"
                class="js-reveal-item flex items-center gap-3 p-3 transition-colors"
                :class="[
                  isOut(item.name) && 'opacity-60',
                  cart[item.name] > 0 && 'bg-primary/5 ring-1 ring-primary/40',
                ]"
              >
                <div class="flex flex-row w-full items-center gap-3">
                  <div
                    v-if="typeof item.image == 'string'"
                    class="h-20 w-20 shrink-0 overflow-hidden rounded-full"
                  >
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="object-cover w-full h-full"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p
                      class="font-semibold leading-tight"
                      :class="
                        isOut(item.name) && 'text-muted-foreground line-through'
                      "
                    >
                      {{ item.name }}
                    </p>
                    <p
                      v-if="item?.price !== 0"
                      class="mt-0.5 text-[11px] font-semibold text-muted-foreground"
                    >
                      {{ money(item.price) }}
                    </p>

                    <Badge
                      v-if="isOut(item.name)"
                      variant="outline"
                      class="mt-1 border-destructive/30 bg-destructive/10 text-[10px] uppercase text-destructive"
                    >
                      Agotado
                    </Badge>
                  </div>

                  <div
                    v-if="!isOut(item.name)"
                    class="flex shrink-0 items-center gap-1"
                  >
                    <template v-if="cart[item.name]">
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-8 w-8"
                        :aria-label="`Quitar uno de ${item.name}`"
                        :disabled="isGroupLocked(group.key)"
                        @click="setQty(group.key, item.name, -1)"
                      >
                        <ClientOnly><Minus :size="15" /></ClientOnly>
                      </Button>
                      <span
                        class="w-6 text-center font-bold tabular-nums"
                        aria-live="polite"
                        >{{ cart[item.name] }}</span
                      >
                    </template>
                    <Button
                      variant="outline"
                      size="icon"
                      class="h-8 w-8"
                      :aria-label="`Agregar ${item.name}`"
                      :disabled="!canAddItem(group.key)"
                      @click="setQty(group.key, item.name, 1)"
                    >
                      <ClientOnly><Plus :size="15" /></ClientOnly>
                    </Button>
                  </div>
                  <Button
                    v-if="props.staffMode && isLoggedIn"
                    variant="ghost"
                    size="sm"
                    class="shrink-0 px-2 text-[10px]"
                    :class="
                      isOut(item.name)
                        ? 'text-destructive hover:text-destructive'
                        : 'text-green-700 hover:text-green-800'
                    "
                    :title="
                      isOut(item.name) ? 'Marcar disponible' : 'Marcar agotado'
                    "
                    @click.stop="toggleOut(item.name)"
                  >
                    {{ isOut(item.name) ? "Disponible" : "Agotado" }}
                  </Button>
                </div>
              </Card>
            </div>

            <p
              v-if="isGroupLocked(group.key)"
              class="mt-2 text-[11px] text-muted-foreground"
            >
              {{ lockReason(group.key) }}
            </p>
          </div>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            ¿Cómo lo quieres? / How do you want it?
          </h2>
          <Tabs v-model="mode">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger
                v-for="m in MODES"
                :key="m"
                :value="m"
                class="gap-1.5"
              >
                <ClientOnly>
                  <component
                    class="mx-auto"
                    :is="MODE_ICON[m] ?? Utensils"
                    :size="14"
                  />
                </ClientOnly>
                {{ MODE_SHORT[m] }}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section v-if="orderSummaryLines.length" class="js-reveal-item">
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Totales / Pricing totals
          </h2>
          <Card class="p-4">
            <div class="space-y-3">
              <div
                v-for="line in orderSummaryLines"
                :key="`${line.kind}-${line.code}`"
                class="flex items-start justify-between gap-3"
              >
                <div class="min-w-0 flex-1">
                  <p class="font-semibold leading-tight">{{ line.label }}</p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ line.qty }} x
                    {{
                      line.unitPrice > 0 ? money(line.unitPrice) : "Incluido"
                    }}
                  </p>
                  <p
                    v-if="line.detail"
                    class="text-[11px] text-muted-foreground"
                  >
                    Incluye: {{ line.detail }}
                  </p>
                </div>
                <p class="shrink-0 text-right font-semibold tabular-nums">
                  {{ line.total > 0 ? money(line.total) : "Incluido" }}
                </p>
              </div>

              <Separator />

              <div
                class="flex items-center justify-between text-sm text-muted-foreground"
              >
                <span>Total de piezas / Items</span>
                <span class="font-semibold tabular-nums">{{ totalQty }}</span>
              </div>

              <div class="flex items-center justify-between gap-3">
                <p class="font-bold uppercase tracking-wide">Total</p>
                <p class="text-lg font-bold tabular-nums">
                  {{ money(pricingSummary.total) }}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section class="js-reveal-item">
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Tus datos / Your Info
          </h2>
          <Card class="space-y-4 p-4">
            <div class="space-y-1.5">
              <Label for="c-name" class="flex items-center gap-1">
                Tu nombre / Your name
                <span v-if="nameRequired" class="text-destructive">*</span>
                <span v-else class="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="c-name"
                v-model="customer.name"
                placeholder="Ej. Juan Pérez / e.g. John Doe"
                :class="{
                  'border-destructive focus-visible:ring-destructive':
                    itemCount > 0 && nameRequired && !customer.name.trim(),
                }"
              />
              <p
                v-if="itemCount > 0 && nameRequired && !customer.name.trim()"
                class="text-[11px] text-destructive"
              >
                Required to complete your order / Requerido para completar tu
                pedido.
              </p>
            </div>

            <!-- Código de socio (opcional). Texto plano: se estampa en el
                mensaje de WhatsApp; el staff valida y redime al servir. -->
            <div v-if="props.showMemberCode" class="space-y-1.5">
              <Label for="c-code"
                >Código de socio / Member code (opcional)</Label
              >
              <Input
                id="c-code"
                v-model="memberCode"
                autocomplete="off"
                placeholder="Ej. GM1234"
                class="uppercase tracking-widest"
                @blur="
                  memberCode = memberCode.replace(/\s+/g, '').toUpperCase()
                "
              />
              <p class="text-[11px] text-muted-foreground">
                Si eres socio, ingresa tu código para usar una de tus comidas.
              </p>
            </div>

            <template v-if="props.staffMode || mode === 'domicilio'">
              <div class="space-y-1.5">
                <Label for="c-phone">WhatsApp / Phone</Label>
                <Input
                  id="c-phone"
                  v-model="customer.phone"
                  type="tel"
                  placeholder="10 dígitos"
                />
              </div>

              <div class="space-y-1.5">
                <Label for="c-address" class="flex items-center gap-1">
                  Dirección / Address
                  <span v-if="mode === 'domicilio'" class="text-destructive"
                    >*</span
                  >
                </Label>
                <Input
                  id="c-address"
                  v-model="customer.address"
                  placeholder="Calle, número, referencias"
                  :class="{
                    'border-destructive focus-visible:ring-destructive':
                      itemCount > 0 && needsAddress,
                  }"
                />
                <p
                  v-if="itemCount > 0 && needsAddress"
                  class="text-[11px] text-destructive"
                >
                  Required for delivery / Requerida para envíos a domicilio.
                </p>
              </div>
            </template>

            <!-- Hora: para "aquí" y "para llevar" (no domicilio). Opcional, sin default -->
            <div v-if="mode !== 'domicilio'" class="space-y-1.5">
              <Label>{{ timeLabel }} (opcional/optional)</Label>
              <div class="flex items-center gap-1.5">
                <Select v-model="selHour">
                  <SelectTrigger class="flex-1">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="h in hours12" :key="h" :value="h">
                      {{ h }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <span class="font-bold text-muted-foreground">:</span>

                <Select v-model="selMin">
                  <SelectTrigger class="flex-1">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="m in minutes" :key="m" :value="m">
                      {{ m }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div class="flex overflow-hidden border rounded-md">
                  <button
                    type="button"
                    class="px-2.5 py-2 text-xs font-bold uppercase transition-colors"
                    :class="
                      selPeriod === 'am'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    "
                    @click="selPeriod = 'am'"
                  >
                    am
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-2 text-xs font-bold uppercase transition-colors border-l"
                    :class="
                      selPeriod === 'pm'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    "
                    @click="selPeriod = 'pm'"
                  >
                    pm
                  </button>
                </div>
              </div>
              <button
                v-if="selHour || selMin || selPeriod"
                type="button"
                class="text-[11px] font-bold underline text-muted-foreground hover:text-primary"
                @click="clearTime"
              >
                Lo antes posible / ASAP
              </button>
            </div>

            <div class="space-y-1.5">
              <Label for="c-note">Nota / Note (opcional/optional)</Label>
              <Textarea
                id="c-note"
                v-model="note"
                rows="2"
                placeholder="Sin cebolla, casa roja / No onions, red house…"
              />
            </div>
          </Card>
        </section>
      </main>

      <!-- Barra fija -->
      <div
        class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur"
      >
        <div class="mx-auto max-w-lg space-y-2">
          <div
            v-if="promoStatusBanner"
            class="rounded-md border px-3 py-2"
            :class="
              promoStatusBanner.met
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-amber-300 bg-amber-50'
            "
          >
            <p
              class="text-xs font-semibold"
              :class="
                promoStatusBanner.met ? 'text-emerald-800' : 'text-amber-800'
              "
            >
              {{ promoStatusBanner.title }}
            </p>
            <p
              class="text-[11px]"
              :class="
                promoStatusBanner.met ? 'text-emerald-700' : 'text-amber-700'
              "
            >
              {{ promoStatusBanner.message }}
            </p>
          </div>

          <div
            class="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span class="tabular-nums">
              <template v-if="totalQty">
                {{ totalQty }} platillo{{ totalQty === 1 ? "" : "s" }} ·
                {{ MODE_LABEL[mode] }}
              </template>
              <template v-else>
                Tu pedido / Your order · {{ MODE_LABEL[mode] }}
              </template>
            </span>
            <span
              v-if="orderSummaryLines.length"
              class="font-semibold tabular-nums"
            >
              {{ money(pricingSummary.total) }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <Button
              v-if="totalQty"
              variant="outline"
              size="lg"
              class="shrink-0"
              @click="clearCart"
            >
              <ClientOnly><Trash2 :size="16" class="mr-2" /></ClientOnly>
              Vaciar
            </Button>
            <Button
              size="lg"
              class="flex-1"
              :disabled="!canTrySend || sendingOrder"
              @click="sendOrder"
            >
              <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
              {{ sendingOrder ? "Enviando..." : "Enviar / Send" }}
            </Button>
          </div>

          <p
            v-if="itemCount && !canTrySend"
            class="text-[11px] text-muted-foreground text-center"
          >
            {{ hint }}
          </p>
        </div>
      </div>
    </template>

    <!-- Confirmación de pedido -->
    <Dialog v-model:open="showThankYou">
      <DialogContent class="max-w-sm text-center">
        <div class="flex flex-col items-center gap-2 pt-2">
          <img
            :src="LOGO_SRC"
            alt="Breezy Meals"
            class="h-16 w-16 rounded-full border-2 border-primary/20 object-cover shadow-xs"
          />
        </div>
        <DialogHeader class="text-center sm:text-center">
          <DialogTitle class="text-center font-heading text-xl">
            ¡Gracias {{ thankYouName }} por tu pedido! / Thank you
            {{ thankYouName }} for your order!
          </DialogTitle>
          <DialogDescription class="text-center">
            Ya lo recibimos en cocina y lo estamos preparando.
            <br />
            We've received it in the kitchen and it's being prepared.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="sm:justify-center">
          <Button class="w-full" @click="showThankYou = false">
            Entendido / Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import { Textarea } from "@common/components/ui/textarea";
import { Skeleton } from "@common/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@common/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@common/components/ui/dialog";
import {
  Plus,
  Minus,
  Send,
  Trash2,
  ShoppingBag,
  Bike,
  Utensils,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-vue-next";
import {
  DRINK_GROUP_KEYS,
  MAIN_GROUP_KEYS,
  SIDE_GROUP_KEYS,
  comboForItem,
  emptyDayDishes,
  findMenuItemByName,
  groupByKey,
  groups as baseGroups,
  groupsFromData,
  MODES,
  MODE_SHORT,
  normalizeDishNames,
  normalizeMenuCatalog,
  todayISO,
  type DayDishes,
  type GroupKey,
  type MenuCatalog,
  type MenuItem,
  type MenuRecord,
} from "~/utils/comandas";
import {
  resolveDay,
  type RotationConfig,
  type WeekBlock,
  type WeekOverride,
} from "~/utils/rotation";
import { MODE_LABEL, type OrderMode } from "~/composables/useWhatsappOrder";
import usePocketBase from "@common/composables/usePocketbase";
import { menuPricingConfig } from "~/config/menu-pricing";
import {
  priceMenuOrder,
  type PricingPromoRequirement,
} from "~/utils/menuPricing";
import type { PlacedOrder } from "~/utils/comandas";

definePageMeta({ layout: "breezy" });

const props = withDefaults(
  defineProps<{
    fetchedCollection?: string;
    dishesField?: "dishes" | "store";
    useDailyMenu?: boolean;
    staffMode?: boolean;
    showMemberCode?: boolean;
  }>(),
  {
    fetchedCollection: "menu",
    dishesField: "dishes",
    useDailyMenu: true,
    staffMode: false,
    showMemberCode: true,
  },
);

const { formatCustomerOrder } = useMenuLink();
const { waLink, isAppleDevice, formatSoldOut } = useWhatsappOrder();
const { createItem, fetchCollection, updateItem } = usePocketBaseCore();
const { getMemberByCode } = useMembers();
const pb = usePocketBase();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const businessConfig = (runtimeConfig.public?.business ?? {}) as {
  whatsappNumber?: string;
  logoUrl?: string;
};

const EMPTY_DISHES: DayDishes = emptyDayDishes();
const RESTAURANT_WHATSAPP = String(
  businessConfig.whatsappNumber || runtimeConfig.public.whatsappNumber || "",
);
// Mismo logo que el header (layouts/breezy.vue), para la marca en el modal.
const LOGO_SRC = businessConfig.logoUrl || "";
// Misma colección/campo que usa el tablero de cocina (useComandas.ts): un
// registro por orden en `data`, existe mientras esté activa.
const COMANDAS_COLLECTION = "comandas";
const COMANDAS_FIELD = "data";
const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const MODE_ICON: Record<string, any> = {
  llevar: ShoppingBag,
  domicilio: Bike,
  comer: Utensils,
  aqui: Utensils,
  local: Utensils,
};

// Registro `menu` con los campos de rotación.
type MenuRecordFull = MenuRecord & {
  store?: MenuCatalog | DayDishes;
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, WeekOverride>;
  active_date?: string;
  [key: string]: unknown;
};

const { record, pending, loadError, load } =
  useLatestMenuRecord<MenuRecordFull>(props.fetchedCollection);

onMounted(load);

const selectedDate = ref(todayISO());

const selectedDateLabel = computed(() =>
  new Date(`${selectedDate.value}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);

function changeMenuDate(days: number) {
  const date = new Date(`${selectedDate.value}T12:00:00`);
  date.setDate(date.getDate() + days);
  selectedDate.value = date.toISOString().slice(0, 10);
  clearCart();
}

/**
 * Menú del día: mismo criterio que la app de comandas.
 *  1) Si hay un `active` fijado HOY (turno iniciado o ajuste manual), ese manda.
 *  2) Si no, se resuelve la fecha de hoy contra la rotación semanal (bloques).
 */
const active = computed<DayDishes>(() => {
  const rec = record.value;
  if (!rec) return EMPTY_DISHES;

  const selectedDishes = rec[props.dishesField];
  if (props.staffMode) {
    return normalizeDishNames(rec.active as Partial<Record<GroupKey, unknown>>);
  }
  if (!props.useDailyMenu || props.dishesField !== "dishes") {
    return normalizeDishNames(
      selectedDishes as Partial<Record<GroupKey, unknown>>,
    );
  }

  const a = normalizeDishNames(
    rec.active as Partial<Record<GroupKey, unknown>>,
  );
  const activeFresh =
    rec.active_date === selectedDate.value &&
    groupsFromData(a as Record<string, unknown>).some(
      (g) => (a[g.key] ?? []).length > 0,
    );
  if (activeFresh) return a;

  const cfg: RotationConfig = {
    blocks: rec.week_blocks ?? [],
    rotation: rec.rotation ?? [],
    anchor: rec.rotation_anchor ?? "",
    overrides: rec.overrides ?? {},
  };
  const resolved = resolveDay(selectedDate.value, cfg);
  return resolved
    ? normalizeDishNames(resolved.menu as Partial<Record<GroupKey, unknown>>)
    : EMPTY_DISHES;
});

const menuSourceCatalog = computed<Partial<Record<GroupKey, unknown>>>(
  () =>
    (record.value?.[props.dishesField] ?? {}) as Partial<
      Record<GroupKey, unknown>
    >,
);

const menuGroups = computed(() => {
  const fromMenu = groupsFromData({
    ...(menuSourceCatalog.value as Record<string, unknown>),
    ...(active.value as Record<string, unknown>),
  });
  const knownKeys = new Set<string>(baseGroups.map((group) => group.key));
  const extraGroups = fromMenu.filter((group) => !knownKeys.has(group.key));

  return [...baseGroups, ...extraGroups];
});

const hasMenu = computed(() =>
  menuGroups.value.some((g) => active.value[g.key]?.length),
);

const catalog = computed<MenuCatalog>(() =>
  normalizeMenuCatalog(menuSourceCatalog.value),
);

type ActiveMenuItem = MenuItem & { group: GroupKey };

const activeItems = computed<Record<GroupKey, ActiveMenuItem[]>>(() => {
  const out = {} as Record<GroupKey, ActiveMenuItem[]>;

  menuGroups.value.forEach((g) => {
    const names = active.value[g.key] ?? [];

    out[g.key] = names.map((name) => {
      const found = findMenuItemByName(catalog.value, name, g.key);
      if (found?.item) {
        return { ...found.item, group: g.key };
      }
      return {
        name,
        price: 0,
        combo: comboForItem(null, g.key),
        group: g.key,
      };
    });
  });
  return out;
});

const groupItems = (k: GroupKey) => activeItems.value[k] ?? [];
const taquizaGroup = baseGroups.find((g) => "pieceOptions" in g) as
  | ((typeof baseGroups)[number] & {
      pieceOptions: { tacos: number; quesadillas: number };
    })
  | undefined;

function showGroupSection(key: GroupKey) {
  return groupItems(key).length > 0;
}

/* ===== Chips + cajones (acordeón) =====
 * `openGroups` = conjunto de grupos abiertos. Los chips y el encabezado de cada
 * sección comparten este estado, así que un chip "activo" siempre corresponde a
 * un cajón abierto. Al arrancar abrimos solo el primer grupo con platillos para
 * no abrumar con toda la lista desplegada. */
const openGroups = ref<Set<string>>(new Set());

// Grupos que realmente tienen platillos hoy (los que muestran chip).
const visibleMenuGroups = computed(() =>
  menuGroups.value.filter((g) => groupItems(g.key).length > 0),
);

const isGroupOpen = (key: GroupKey) => openGroups.value.has(key);

function toggleGroup(key: GroupKey) {
  const next = new Set(openGroups.value);
  next.has(key) ? next.delete(key) : next.add(key);
  openGroups.value = next;
}

const allGroupsOpen = computed(
  () =>
    visibleMenuGroups.value.length > 0 &&
    visibleMenuGroups.value.every((g) => openGroups.value.has(g.key)),
);

function toggleAllGroups() {
  openGroups.value = allGroupsOpen.value
    ? new Set()
    : new Set(visibleMenuGroups.value.map((g) => g.key));
}

// Conteo del carrito por grupo (badge del chip y del encabezado). Conserva la
// referencia del pedido aunque el cajón esté cerrado.
function groupCartCount(key: GroupKey) {
  return groupItems(key).reduce((sum, item) => sum + (cart[item.name] ?? 0), 0);
}

// Refs de cada <section> para poder hacer scroll hacia ellas desde el chip.
const sectionEls: Record<string, HTMLElement> = {};
function setSectionRef(key: string, el: unknown) {
  if (el instanceof HTMLElement) sectionEls[key] = el;
}

function getHeaderStackOffsetPx(): number {
  if (typeof window === "undefined") return 0;

  let offset = 0;
  const stackEls = document.querySelectorAll<HTMLElement>("[data-top-stack]");

  stackEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    // Count only visible top-stack elements currently attached near the top.
    if (rect.height <= 0) return;
    if (rect.bottom <= 0) return;
    if (rect.top >= 220) return;
    offset = Math.max(offset, rect.bottom);
  });

  return Math.ceil(offset);
}

function scrollGroupIntoView(key: GroupKey, behavior: ScrollBehavior) {
  if (typeof window === "undefined") return;
  const section = sectionEls[key];
  if (!section) return;

  const offset = getHeaderStackOffsetPx() + 20;
  const targetY = Math.max(
    0,
    window.scrollY + section.getBoundingClientRect().top - offset,
  );

  window.scrollTo({ top: targetY, behavior });
}

// Chip: abre el cajón (si estaba cerrado) y hace scroll suave hacia él.
async function focusGroup(key: GroupKey) {
  if (!openGroups.value.has(key)) {
    const next = new Set(openGroups.value);
    next.add(key);
    openGroups.value = next;
  }

  await nextTick();
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

  scrollGroupIntoView(key, "smooth");

  // Correct once more after layout settles to avoid the "second click" effect.
  window.setTimeout(() => {
    scrollGroupIntoView(key, "smooth");
  }, 140);
}

// Abre el primer grupo con platillos la primera vez que carga el menú.
const didInitOpen = ref(false);
watch(
  visibleMenuGroups,
  (groups) => {
    if (!didInitOpen.value && groups.length) {
      openGroups.value = new Set(
        props.dishesField === "dishes"
          ? groups.map((group) => group.key)
          : [groups[0].key],
      );
      didInitOpen.value = true;
    }
  },
  { immediate: true },
);

const soldOut = computed<string[]>(() => record.value?.sold_out ?? []);
const isOut = (n: string) => soldOut.value.includes(n);
const isLoggedIn = ref(false);
const menuMainEl = ref<HTMLElement | null>(null);

type GsapRuntime = {
  gsap: any;
  ScrollTrigger: any;
};

let gsapRuntime: GsapRuntime | null = null;
const revealTriggers: any[] = [];
let revealRaf: number | null = null;

async function getGsapRuntime(): Promise<GsapRuntime> {
  if (gsapRuntime) return gsapRuntime;

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  gsap.registerPlugin(ScrollTrigger);
  gsapRuntime = { gsap, ScrollTrigger };
  return gsapRuntime;
}

function motionReduced(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function initScrollReveal() {
  if (!import.meta.client || !menuMainEl.value || motionReduced()) return;

  const { gsap, ScrollTrigger } = await getGsapRuntime();
  const nodes = menuMainEl.value.querySelectorAll<HTMLElement>(
    ".js-reveal-item, .js-reveal-section",
  );

  nodes.forEach((el) => {
    if (el.dataset.revealInit === "1") return;
    if (el.offsetParent === null) return;

    el.dataset.revealInit = "1";
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.32,
        ease: "power1.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: el,
          start: "top 96%",
          once: true,
        },
      },
    );

    if (tween.scrollTrigger) revealTriggers.push(tween.scrollTrigger);
  });

  ScrollTrigger.refresh();
}

function scheduleRevealRefresh() {
  if (!import.meta.client) return;
  if (revealRaf) cancelAnimationFrame(revealRaf);
  revealRaf = requestAnimationFrame(() => {
    void initScrollReveal();
    revealRaf = null;
  });
}

async function toggleOut(name: string) {
  if (!props.staffMode || !record.value) return;

  const wa =
    typeof window !== "undefined" && !isAppleDevice()
      ? window.open("", "_blank")
      : null;

  const next = new Set(soldOut.value);
  const nowAvailable = next.has(name);
  if (nowAvailable) next.delete(name);
  else {
    next.add(name);
    cart[name] = 0;
  }

  try {
    await updateItem(props.fetchedCollection, record.value.id, {
      sold_out: [...next],
    });
    record.value.sold_out = [...next];
  } catch {
    wa?.close();
    return;
  }

  const text = formatSoldOut(name, nowAvailable);
  const url = waLink(text);

  if (typeof window !== "undefined") {
    if (isAppleDevice()) {
      window.location.href = url;
    } else if (wa) {
      wa.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }
}

const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

// Código de socio (opcional, texto plano). No se valida aquí: se estampa en el
// mensaje de WhatsApp para que el staff lo vea y redima al servir.
const memberCode = ref("");
const memberLoading = ref(false);

async function loadMemberFromCode(code: string) {
  const normalized = code.replace(/\s+/g, "").toUpperCase();
  if (!normalized) return;
  memberLoading.value = true;
  try {
    const member = await getMemberByCode(normalized);
    if (member) {
      customer.name = member.name ?? "";
      customer.phone = member.phone ?? "";
      customer.address = member.address ?? "";
    }
  } finally {
    memberLoading.value = false;
  }
}

const sendingOrder = ref(false);
const showThankYou = ref(false);
// Nombre a mostrar en el modal de agradecimiento; se captura antes de
// limpiar el formulario (resetOrderForm vacía customer.name).
const thankYouName = ref("");

watch(memberCode, (code) => {
  if (props.staffMode) loadMemberFromCode(code);
});

onMounted(() => {
  isLoggedIn.value = pb.authStore.isValid;
  if (props.staffMode) {
    const code = route.query.code;
    if (typeof code === "string" && code.trim()) {
      memberCode.value = code.replace(/\s+/g, "").toUpperCase();
    }
  }

  scheduleRevealRefresh();
});

watch(
  () => [
    selectedDate.value,
    visibleMenuGroups.value.length,
    openGroups.value.size,
  ],
  async () => {
    await nextTick();
    scheduleRevealRefresh();
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  if (revealRaf) cancelAnimationFrame(revealRaf);
  revealTriggers.forEach((trigger) => trigger?.kill?.());
  revealTriggers.length = 0;
});

/* ===== Taquizas: modelo por orden =====
 * Cada orden es una unidad independiente (tacos = 3 piezas, quesadillas = 2).
 * El cliente crea tantas órdenes como quiera; dentro de cada una elige sus
 * guisos hasta el tope de esa orden. El `cart` sigue el invariante que espera
 * la cocina: cart[nombre] = porción normal + suma de esa pieza en todas las
 * órdenes de taquiza (por eso siempre usamos deltas, nunca reasignación).
 */
type TaquizaKind = "tacos" | "quesadillas";
const taquizaKinds: TaquizaKind[] = ["tacos", "quesadillas"];

const taquizaRules = {
  tacos: taquizaGroup?.pieceOptions?.tacos ?? 3,
  quesadillas: taquizaGroup?.pieceOptions?.quesadillas ?? 2,
};

const TAQUIZA_CAP: Record<TaquizaKind, number> = {
  tacos: taquizaRules.tacos,
  quesadillas: taquizaRules.quesadillas,
};

interface TaquizaOrder {
  id: string;
  kind: TaquizaKind;
  fills: Record<string, number>; // guiso -> cantidad en esta orden
}

const taquizaOrders = ref<TaquizaOrder[]>([]);

watch(
  () => taquizaOrders.value.length,
  async () => {
    await nextTick();
    scheduleRevealRefresh();
  },
  { flush: "post" },
);

let taquizaSeq = 0;
function nextTaquizaId() {
  taquizaSeq += 1;
  return `tq_${Date.now().toString(36)}_${taquizaSeq}`;
}

function orderFillTotal(order: TaquizaOrder) {
  return Object.values(order.fills).reduce((sum, q) => sum + q, 0);
}

function canAddToOrder(order: TaquizaOrder) {
  return orderFillTotal(order) < TAQUIZA_CAP[order.kind];
}

/**
 * Ajuste RELATIVO del cart para piezas de taquiza. Nunca reasigna el total: un
 * guiso puede vivir a la vez en `guisos` y en `taquizas` (p. ej. "Birria"), y
 * ambas porciones comparten la misma llave del cart.
 */
function applyTaquizaDelta(name: string, delta: number) {
  const next = (cart[name] ?? 0) + delta;
  cart[name] = next <= 0 ? 0 : next;
}

function addTaquizaOrder(kind: TaquizaKind) {
  taquizaOrders.value.push({ id: nextTaquizaId(), kind, fills: {} });
}

function removeTaquizaOrder(id: string) {
  const idx = taquizaOrders.value.findIndex((o) => o.id === id);
  if (idx === -1) return;
  const [removed] = taquizaOrders.value.splice(idx, 1);
  Object.entries(removed.fills).forEach(([name, qty]) => {
    if (qty > 0) applyTaquizaDelta(name, -qty);
  });
}

function setOrderFill(order: TaquizaOrder, name: string, delta: number) {
  if (delta > 0) {
    if (!canAddToOrder(order)) return;
    order.fills[name] = (order.fills[name] ?? 0) + 1;
    applyTaquizaDelta(name, 1);
  } else {
    const cur = order.fills[name] ?? 0;
    if (cur <= 0) return;
    const next = cur - 1;
    if (next <= 0) delete order.fills[name];
    else order.fills[name] = next;
    applyTaquizaDelta(name, -1);
  }
}

// Vista "por tipo" que espera la cocina (formatCustomerOrder / comandas.ts):
// aplanamos todas las órdenes a un mapa nombre -> cantidad por tipo.
const taquizaByKind = computed<Record<TaquizaKind, Record<string, number>>>(
  () => {
    const out: Record<TaquizaKind, Record<string, number>> = {
      tacos: {},
      quesadillas: {},
    };
    taquizaOrders.value.forEach((order) => {
      Object.entries(order.fills).forEach(([name, qty]) => {
        if (qty > 0) {
          out[order.kind][name] = (out[order.kind][name] ?? 0) + qty;
        }
      });
    });
    return out;
  },
);

const taquizaOrderCount = computed<Record<TaquizaKind, number>>(() => ({
  tacos: taquizaOrders.value.filter((o) => o.kind === "tacos").length,
  quesadillas: taquizaOrders.value.filter((o) => o.kind === "quesadillas")
    .length,
}));

const taquizaSelectedByKind = computed<Record<TaquizaKind, number>>(() => {
  const sum = (k: TaquizaKind) =>
    Object.values(taquizaByKind.value[k]).reduce((s, q) => s + q, 0);
  return { tacos: sum("tacos"), quesadillas: sum("quesadillas") };
});

const hasTaquizaOrder = computed(() => taquizaOrders.value.length > 0);

/** Piezas de taquiza (todas las órdenes) de un mismo guiso, para no doblar
 *  su conteo en los totales del guiso normal cuando el nombre se comparte. */
function taquizaTotalForName(name: string) {
  return (
    (taquizaByKind.value.tacos[name] ?? 0) +
    (taquizaByKind.value.quesadillas[name] ?? 0)
  );
}

/* ===== Hora (para "aquí" y "para llevar"; opcional, sin default) ===== */
const hours12 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const minutes = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const selHour = ref<string>();
const selMin = ref<string>();
const selPeriod = ref<"am" | "pm">();

const pickupTime = computed(() => {
  if (!selHour.value || !selPeriod.value) return "";
  const mm = selMin.value || "00";
  let h = Number(selHour.value) % 12;
  if (selPeriod.value === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${mm}`;
});

const timeLabel = computed(() =>
  mode.value === "aqui"
    ? "Hora de llegada / Arrival time"
    : "Hora de recolección / Pickup time",
);

function clearTime() {
  selHour.value = undefined;
  selMin.value = undefined;
  selPeriod.value = undefined;
}

const cartItems = computed(() =>
  Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([name, qty]) => ({ name, qty })),
);

interface PromoProgressRequirement {
  id: string;
  label: string;
  labelEs: string;
  labelEn: string;
  required: number;
  current: number;
  missing: number;
  met: boolean;
}

interface PromoProgressCard {
  id: string;
  label: string;
  summary: string;
  price: number;
  requirements: PromoProgressRequirement[];
  eligible: boolean;
  appliedQty: number;
  missingTextEs: string;
  missingTextEn: string;
}

function promoRequirementLabel(requirement: PricingPromoRequirement) {
  const groupLabels: Record<string, { es: string; en: string }> = {
    guisos: { es: "Guisos", en: "Stews" },
    caldos: { es: "Caldos", en: "Soups" },
    sides: { es: "Guarniciones", en: "Sides" },
    bebidas: { es: "Bebidas", en: "Drinks" },
  };

  if (requirement.targetType === "group") {
    const mapped = groupLabels[requirement.target];
    if (mapped) return `${mapped.es} / ${mapped.en}`;
    return groupByKey[requirement.target]?.label ?? requirement.target;
  }

  if (requirement.targetType === "order-unit") {
    return (
      menuPricingConfig.orderUnits?.[requirement.target]?.label ??
      requirement.target
    );
  }

  return requirement.target;
}

function promoRequirementNoun(
  requirement: PricingPromoRequirement,
  qty: number,
  lang: "es" | "en",
) {
  if (requirement.targetType === "group") {
    const nouns: Record<
      string,
      { esSing: string; esPlur: string; enSing: string; enPlur: string }
    > = {
      guisos: {
        esSing: "guiso",
        esPlur: "guisos",
        enSing: "stew",
        enPlur: "stews",
      },
      caldos: {
        esSing: "caldo",
        esPlur: "caldos",
        enSing: "soup",
        enPlur: "soups",
      },
      sides: {
        esSing: "guarnicion",
        esPlur: "guarniciones",
        enSing: "side",
        enPlur: "sides",
      },
      bebidas: {
        esSing: "bebida",
        esPlur: "bebidas",
        enSing: "drink",
        enPlur: "drinks",
      },
    };

    const noun = nouns[requirement.target];
    if (noun) {
      if (lang === "es") return qty === 1 ? noun.esSing : noun.esPlur;
      return qty === 1 ? noun.enSing : noun.enPlur;
    }
  }

  return (
    promoRequirementLabel(requirement)
      .split("/")
      .map((part) => part.trim())[lang === "es" ? 0 : 1] ||
    promoRequirementLabel(requirement)
  );
}

function promoSummaryLang(
  promo: (typeof menuPricingConfig.promos)[number],
  lang: "es" | "en",
) {
  return promo.match.requirements
    .map((requirement) => {
      const qty = requirement.qty;
      const noun = promoRequirementNoun(requirement, qty, lang);
      return `${qty} ${noun}`;
    })
    .join(" + ");
}

function promoRequirementCurrentQty(requirement: PricingPromoRequirement) {
  if (requirement.targetType === "group") {
    const group = menuGroups.value.find(
      (entry) => entry.key === requirement.target,
    );
    if (!group) return 0;

    return groupItems(group.key).reduce(
      (sum, item) =>
        sum +
        Math.max(0, (cart[item.name] ?? 0) - taquizaTotalForName(item.name)),
      0,
    );
  }

  if (requirement.targetType === "order-unit") {
    if (requirement.target === "taquiza:tacos")
      return taquizaOrderCount.value.tacos;
    if (requirement.target === "taquiza:quesadillas") {
      return taquizaOrderCount.value.quesadillas;
    }
    return 0;
  }

  return Math.max(
    0,
    (cart[requirement.target] ?? 0) - taquizaTotalForName(requirement.target),
  );
}

function joinWithConjunction(parts: string[]) {
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

function joinWithConjunctionEn(parts: string[]) {
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

const promoProgressCards = computed<PromoProgressCard[]>(() =>
  menuPricingConfig.promos
    .filter((promo) => promo.active !== false)
    .filter((promo) => promoIsAvailableToday(promo))
    .map((promo) => {
      const requirements: PromoProgressRequirement[] =
        promo.match.requirements.map((requirement) => {
          const current = promoRequirementCurrentQty(requirement);
          const required = requirement.qty;
          const missing = Math.max(0, required - current);
          return {
            id: `${promo.id}-${requirement.targetType}-${requirement.target}`,
            label: promoRequirementLabel(requirement),
            labelEs: promoRequirementNoun(requirement, required, "es"),
            labelEn: promoRequirementNoun(requirement, required, "en"),
            required,
            current: Math.min(current, required),
            missing,
            met: missing === 0,
          };
        });

      const missingPartsEs = requirements
        .filter((requirement) => requirement.missing > 0)
        .map((requirement) => `${requirement.missing} ${requirement.labelEs}`);

      const missingPartsEn = requirements
        .filter((requirement) => requirement.missing > 0)
        .map((requirement) => `${requirement.missing} ${requirement.labelEn}`);

      const summaryEs = promo.display?.summary ?? promoSummaryLang(promo, "es");
      const summaryEn = promoSummaryLang(promo, "en");

      return {
        id: promo.id,
        label: promo.label,
        summary: `${summaryEs} / ${summaryEn}`,
        price: promo.pricing.amount,
        requirements,
        eligible: missingPartsEs.length === 0,
        appliedQty: 0,
        missingTextEs: joinWithConjunction(missingPartsEs),
        missingTextEn: joinWithConjunctionEn(missingPartsEn),
      };
    }),
);

const appliedPromoQtyById = computed(() => {
  const out = new Map<string, number>();
  pricingSummary.value.lines
    .filter((line) => line.kind === "promo")
    .forEach((line) => {
      out.set(line.code, (out.get(line.code) ?? 0) + line.qty);
    });
  return out;
});

const promoCardsWithAppliedState = computed(() =>
  promoProgressCards.value.map((promo) => ({
    ...promo,
    appliedQty: appliedPromoQtyById.value.get(promo.id) ?? 0,
  })),
);

const promoStatusBanner = computed(() => {
  if (props.staffMode || !props.useDailyMenu || itemCount.value <= 0)
    return null;

  const appliedPromos = promoCardsWithAppliedState.value.filter(
    (promo) => promo.appliedQty > 0,
  );
  if (appliedPromos.length) {
    const labels = appliedPromos.map((promo) =>
      promo.appliedQty > 1
        ? `${promo.label} x${promo.appliedQty}`
        : promo.label,
    );
    return {
      met: true,
      title: "Promos aplicadas / Applied promos",
      message: labels.join(" · "),
    };
  }

  const nextPromo = promoCardsWithAppliedState.value[0];
  if (!nextPromo) return null;

  return {
    met: false,
    title: `Vas en camino a ${nextPromo.label} / You're on track for ${nextPromo.label}`,
    message: `Te falta ${nextPromo.missingTextEs} para activar ${money(nextPromo.price)}. / Missing ${nextPromo.missingTextEn} to activate ${money(nextPromo.price)}.`,
  };
});

function promoSummary(promo: (typeof menuPricingConfig.promos)[number]) {
  return promoSummaryLang(promo, "es");
}

function promoIsAvailableToday(
  promo: (typeof menuPricingConfig.promos)[number],
) {
  return promo.match.requirements.every((requirement) => {
    if (requirement.targetType === "group") {
      const group = menuGroups.value.find(
        (entry) => entry.key === requirement.target,
      );
      if (!group) return false;
      const availableCount = groupItems(group.key).filter(
        (item) => !isOut(item.name),
      ).length;
      return availableCount >= requirement.qty;
    }

    if (requirement.targetType === "item") {
      const found = menuGroups.value
        .flatMap((group) => groupItems(group.key))
        .find((item) => item.name === requirement.target && !isOut(item.name));
      return !!found;
    }

    if (!taquizaGroup) return false;
    const taquizaAvailable = groupItems(taquizaGroup.key).filter(
      (item) => !isOut(item.name),
    ).length;
    return taquizaAvailable > 0;
  });
}

const pricingSummary = computed(() => {
  const standardItems = menuGroups.value.flatMap((group) => {
    if (taquizaGroup && group.key === taquizaGroup.key) return [];

    return groupItems(group.key)
      .map((item) => ({
        name: item.name,
        group: group.key,
        // Resta la porción de taquiza cuando el nombre se comparte, para no
        // cobrar dos veces un guiso que también es relleno de taquiza.
        qty: Math.max(
          0,
          (cart[item.name] ?? 0) - taquizaTotalForName(item.name),
        ),
        unitPrice: item.price ?? 0,
      }))
      .filter((entry) => entry.qty > 0);
  });

  const taquizaUnits = [
    { code: "taquiza:tacos", qty: taquizaOrderCount.value.tacos },
    { code: "taquiza:quesadillas", qty: taquizaOrderCount.value.quesadillas },
  ]
    .filter((unit) => unit.qty > 0)
    .map((unit) => ({
      code: unit.code,
      qty: unit.qty,
      label: menuPricingConfig.orderUnits?.[unit.code]?.label ?? unit.code,
      unitPrice: menuPricingConfig.orderUnits?.[unit.code]?.unitPrice ?? 0,
    }));

  return priceMenuOrder({
    items: standardItems,
    orderUnits: taquizaUnits,
    config: menuPricingConfig,
  });
});

const orderSummaryLines = computed(() => pricingSummary.value.lines);

const itemCount = computed(() => cartItems.value.length);
const totalQty = computed(() =>
  cartItems.value.reduce((sum, it) => sum + it.qty, 0),
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

// El nombre es opcional para llevar/aquí; a domicilio siempre se requiere
// para identificar al cliente que recibe.
const nameRequired = computed(() => mode.value === "domicilio");

const needsName = computed(() => nameRequired.value && !customer.name.trim());

const canSend = computed(
  () => itemCount.value > 0 && !needsName.value && !needsAddress.value,
);

const canTrySend = canSend;

const hint = computed(() =>
  needsName.value
    ? "Please enter your name to proceed / Ingresa tu nombre para continuar."
    : needsAddress.value
      ? "Address is required for delivery / Se requiere dirección para el envío."
      : "",
);

function money(value: number) {
  return PRICE_FORMAT.format(value || 0);
}

function isGroupLocked(k: GroupKey) {
  return false;
}

function lockReason(k: GroupKey) {
  return "";
}

function canAddItem(k: GroupKey) {
  if (isGroupLocked(k)) return false;
  // Las taquizas no se agregan desde el bloque normal, sino por orden.
  if (taquizaGroup && k === taquizaGroup.key) return false;
  return true;
}

function setQty(k: GroupKey, n: string, d: number) {
  // El grupo de taquizas se maneja por orden (setOrderFill), nunca aquí.
  if (taquizaGroup && k === taquizaGroup.key) return;
  if (d > 0 && !canAddItem(k)) return;
  applyTaquizaDelta(n, d); // suma/resta relativa: preserva la porción de taquiza
}

function clearCart() {
  for (const k of Object.keys(cart)) cart[k] = 0;
  taquizaOrders.value = [];
}

// Deja el formulario listo para un pedido nuevo tras confirmar el envío.
function resetOrderForm() {
  clearCart();
  mode.value = "llevar";
  note.value = "";
  customer.name = "";
  customer.phone = "";
  customer.address = "";
  memberCode.value = "";
  clearTime();
}

function buildNote() {
  const pieces: string[] = [];
  // La hora aplica a "aquí" y "para llevar" (no domicilio).
  if (pickupTime.value && mode.value !== "domicilio") {
    const verb = mode.value === "aqui" ? "Llegada" : "Recoger";
    pieces.push(`${verb} a las ${pickupTime.value}`);
  }
  if (hasTaquizaOrder.value) {
    const summary = [
      taquizaOrderCount.value.tacos > 0
        ? `${taquizaOrderCount.value.tacos} orden(es) de tacos (${taquizaRules.tacos} c/u, ${taquizaSelectedByKind.value.tacos} seleccionadas)`
        : "",
      taquizaOrderCount.value.quesadillas > 0
        ? `${taquizaOrderCount.value.quesadillas} orden(es) de quesadillas (${taquizaRules.quesadillas} c/u, ${taquizaSelectedByKind.value.quesadillas} seleccionadas)`
        : "",
    ]
      .filter(Boolean)
      .join(", ");
    pieces.push(`Taquiza: ${summary}`);
  }
  if (note.value.trim()) pieces.push(note.value.trim());
  return pieces.join(" · ");
}

// Número consecutivo para el tablero de cocina: máximo existente + 1. Al no
// haber columna de status, cualquier registro que quede en la colección es
// una orden activa.
async function nextComandaNumber(): Promise<number> {
  try {
    const res = await fetchCollection(
      COMANDAS_COLLECTION,
      1,
      300,
      "",
      "-created",
      null,
      null,
      true,
    );
    const max = res.items.reduce((acc, rec) => {
      const n = Number((rec as any)[COMANDAS_FIELD]?.number) || 0;
      return Math.max(acc, n);
    }, 0);
    return max + 1;
  } catch {
    return Math.floor(Date.now() / 1000) % 100000;
  }
}

// Crea la comanda en la BD para que aparezca en el tablero de cocina. Nunca
// bloquea el envío por WhatsApp: si falla, el pedido igual se manda.
async function createComanda(
  number: number,
  finalNote: string,
  snapshotTaquizaByKind: Record<TaquizaKind, Record<string, number>>,
  memberCodeValue: string,
) {
  const order: PlacedOrder = {
    id: `${number}-${Date.now()}`,
    number,
    cart: { ...cart },
    mode: mode.value,
    note: finalNote,
    fulfillDate: selectedDate.value,
    fulfillTime: mode.value !== "domicilio" ? pickupTime.value : "",
    customer: { ...customer },
    taquizaOrders: { ...taquizaOrderCount.value },
    taquizaByKind: snapshotTaquizaByKind,
    createdAt: Date.now(),
    memberCode: memberCodeValue || undefined,
  };

  try {
    await createItem(COMANDAS_COLLECTION, { [COMANDAS_FIELD]: order });
  } catch (e) {
    console.error("No se pudo crear la comanda en cocina", e);
  }
}

async function sendOrder() {
  if (!record.value || !canTrySend.value || sendingOrder.value) return;

  if (!canSend.value) return;
  sendingOrder.value = true;

  // Abrir la pestaña DENTRO del gesto del click (síncrono): si se abre
  // después de un `await`, el bloqueador de pop-ups la mata y el fallback
  // termina navegando la propia página (se "cierra" el menú de golpe) y,
  // según el navegador, deja dos intentos de apertura visibles.
  const wa =
    typeof window !== "undefined" && !isAppleDevice()
      ? window.open("", "_blank")
      : null;

  const a = active.value; // menú resuelto (rotación o `active` de hoy)

  // Si hay código de socio, se estampa en la nota Y se guarda como campo
  // estructurado; el staff descuenta la comida al marcar la orden lista.
  const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
  const memberTag = code ? `SOCIO ${code}` : "";

  const snapshotTaquizaByKind = {
    tacos: { ...taquizaByKind.value.tacos },
    quesadillas: { ...taquizaByKind.value.quesadillas },
  };
  const finalNote = [buildNote(), memberTag].filter(Boolean).join(" · ");

  const number = await nextComandaNumber();

  const text = formatCustomerOrder({
    orderNumber: number,
    name: customer.name,
    cart: { ...cart },
    mode: mode.value,
    dishes: a,
    taquizaByKind: snapshotTaquizaByKind,
    note: finalNote,
    phone: customer.phone,
    address: customer.address,
    fulfillDate: selectedDate.value,
  });
  await createComanda(number, finalNote, snapshotTaquizaByKind, code);

  const url = waLink(text, RESTAURANT_WHATSAPP);
  if (typeof window !== "undefined") {
    if (isAppleDevice()) {
      window.location.href = url;
    } else if (wa) {
      wa.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }

  thankYouName.value = customer.name.trim();
  resetOrderForm();
  showThankYou.value = true;

  // Evita doble-tap y mensajes duplicados en móviles.
  window.setTimeout(() => {
    sendingOrder.value = false;
  }, 1200);
}
</script>
