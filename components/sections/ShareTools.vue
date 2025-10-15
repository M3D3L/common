<template>
  <div class="flex gap-2">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Print article"
          @click="printPage"
        >
          <Printer class="w-5 h-5 text-background" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Print</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Share on X (formerly Twitter)"
          @click="share('twitter')"
        >
          <X class="w-5 h-5 text-background" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share on X</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Share on Facebook"
          @click="share('facebook')"
        >
          <Facebook class="w-5 h-5 text-background" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share on Facebook</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Share on LinkedIn"
          @click="share('linkedin')"
        >
          <Linkedin class="w-5 h-5 text-background" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share on LinkedIn</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="hover:bg-accent/50"
          aria-label="Share on WhatsApp"
          @click="share('whatsapp')"
        >
          <MessageCircle class="w-5 h-5 text-background" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share on WhatsApp</p>
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
          <Mail class="w-5 h-5 text-background" />
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
          <Link class="w-5 h-5 text-background" /> 
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy link</p>
      </TooltipContent>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { 
  X, 
  Linkedin, 
  Facebook, 
  MessageCircle, 
  Mail, 
  Link, 
  Printer // NEW: Added Printer icon
} from 'lucide-vue-next' 
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' }
})

// --- NEW: Print Function ---
const printPage = () => {
  // Triggers the browser's native print dialog
  window.print()
}

// --- Share Logic (Unchanged) ---
const share = (platform: string) => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(document.title || props.title)
  const text = encodeURIComponent(`Check out this article: ${props.title}`)

  let shareUrl = ''

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      break
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
      break
    case 'email':
      shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`
      break
    default:
      return
  }
  
  if (platform === 'email') {
    window.location.href = shareUrl
  } else {
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    console.log('Link copied to clipboard')
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}
</script>