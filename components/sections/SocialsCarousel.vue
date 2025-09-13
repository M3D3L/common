<!-- Example usage -->
<template>
  <div class="grid content-center w-full min-h-screen px-4 mx-auto overflow-hidden lg:px-8 lg:container">
    <TextSectionTitle
      class="pt-12 pb-16"
      :title
      :description
      :h1="false"
    />
    <ContainersCarousel :slides="socials">
      <template #slide="{ slide, index }">
        <CardsSocialsCard :key="index" :title="slide.title" :description="slide.description" :likes="slide.likes"
          :imageUrl="slide.imageUrl" />
      </template>
    </ContainersCarousel>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "Follow Me On Social Media",
  },
  description: {
    type: String,
    default:
      "Stay connected and follow me on social media for the latest updates, behind-the-scenes content, and more!",
  },
  socials: {
    type: Array as () => any[],
    default: () => [
      {
        title: "RelocateToSanCarlos.com",
        description: "Invest like a local, live like a local. 🌊☀️",
        likes: 1245,
        imageUrl: "https://picsum.photos/400/400?random=1",
      },
      {
        title: "SanCarlosNomad",
        description: "Coworking in paradise. WiFi + tacos = productivity. 💻🌮",
        likes: 842,
        imageUrl: "https://picsum.photos/400/400?random=2",
      },
      {
        title: "OceanViewHomes",
        description: "Morning coffee never looked this good. ☕🌅",
        likes: 2301,
        imageUrl: "https://picsum.photos/400/400?random=3",
      },
      {
        title: "SonoraAdventures",
        description: "Kayak into sunsets you’ll never forget. 🚣‍♂️🔥",
        likes: 563,
        imageUrl: "https://picsum.photos/400/400?random=4",
      },
      {
        title: "TasteSanCarlos",
        description: "Fresh seafood, cold cerveza, and zero regrets. 🦐🍺",
        likes: 1769,
        imageUrl: "https://picsum.photos/400/400?random=5",
      },
      {
        title: "DesertMeetsSea",
        description: "Where cacti meet turquoise waves. 🌵🌊",
        likes: 987,
        imageUrl: "https://picsum.photos/400/400?random=6",
      },
    ],
  },
});
</script>
