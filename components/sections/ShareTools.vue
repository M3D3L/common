<template>
  <div class="flex gap-2 print:hidden">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Print article"
          @click="printPage"
        >
          <Printer class="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Print</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip v-for="platform in sharePlatforms" :key="platform.id">
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          :aria-label="`Share on ${platform.name}`"
          @click="share(platform.id)"
        >
          <component :is="platform.icon" class="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share on {{ platform.name }}</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Share via Email"
          @click="share('email')"
        >
          <Mail class="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share via Email</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Copy link"
          @click="copyLink"
        >
          <Check v-if="copied" class="w-5 h-5 text-green-600" />
          <Link v-else class="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ copied ? "Link copied!" : "Copy link" }}</p>
      </TooltipContent>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  X,
  Linkedin,
  Facebook,
  MessageCircle,
  Mail,
  Link,
  Printer,
  Check,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
});

const copied = ref(false);
const currentPath = ref("");

// Initialize URL only on client-side to prevent SSR errors
onMounted(() => {
  currentPath.value = window.location.href;
});

const sharePlatforms = [
  { id: "twitter", name: "X", icon: X },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle },
];

const printPage = () => {
  if (typeof window !== "undefined") window.print();
};

const share = (platform: string) => {
  const url = encodeURIComponent(currentPath.value);
  const title = encodeURIComponent(props.title);
  const text = encodeURIComponent(`Check out this: ${props.title}`);

  let shareUrl = "";

  switch (platform) {
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
      break;
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
    case "whatsapp":
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      break;
    case "email":
      shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
      break;
    default:
      return;
  }

  if (platform === "email") {
    window.location.href = shareUrl;
  } else {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentPath.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
};
</script>

<style scoped>
@media print {
  /* Hides the entire share bar when printing */
  .print\:hidden {
    display: none !important;
  }
}
</style>
