import type { RecordModel } from "pocketbase";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";

const REFERRAL_COOKIE = "relocate_referral_partner";
const REFERRAL_MAX_AGE = 60 * 60 * 24 * 90;
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function useReferralPartner() {
  const route = useRoute();
  const config = useRuntimeConfig();
  const { fetchCollection } = usePocketBaseCore();
  const partner = useState<RecordModel | null>("referral-partner", () => null);
  const referralCookie = useCookie<string | null>(REFERRAL_COOKIE, {
    maxAge: REFERRAL_MAX_AGE,
    sameSite: "lax",
  });

  const querySlug = computed(() => {
    const value = Array.isArray(route.query.ref)
      ? route.query.ref[0]
      : route.query.ref;
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  });

  const activeSlug = computed(
    () => querySlug.value || referralCookie.value || "",
  );
  const isPartnerLanding = computed(() => Boolean(partner.value));
  const getPartnerFileUrl = (field: string) => {
    const filename = partner.value?.[field];
    if (!filename) return "";
    return `${config.public.pocketbaseUrl}api/files/${partner.value?.collectionId}/${partner.value?.id}/${filename}`;
  };
  const partnerPhotoUrl = computed(
    () => partner.value?.photo_url || getPartnerFileUrl("photo"),
  );
  const partnerHeroImageUrl = computed(() => getPartnerFileUrl("hero_image"));
  const partnerHeroVideoUrl = computed(() => getPartnerFileUrl("hero_video"));
  const partnerLandingContent = computed<Record<string, any>>(
    () => partner.value?.landing_content || {},
  );

  const loadReferralPartner = async () => {
    const slug = activeSlug.value;

    if (!slug || !VALID_SLUG.test(slug)) {
      partner.value = null;
      if (querySlug.value) referralCookie.value = null;
      return;
    }

    try {
      const result = await fetchCollection(
        "referralPartners",
        1,
        1,
        `slug="${slug}" && active=true`,
        "-created",
        null,
        null,
        true,
        { requestKey: null },
      );

      partner.value = result.items[0] || null;
      if (partner.value) {
        referralCookie.value = partner.value.slug;
      } else if (querySlug.value) {
        referralCookie.value = null;
      }
    } catch (error) {
      partner.value = null;
      console.warn("Referral partner could not be loaded", error);
    }
  };

  return {
    partner: readonly(partner),
    partnerPhotoUrl,
    partnerHeroImageUrl,
    partnerHeroVideoUrl,
    partnerLandingContent,
    isPartnerLanding,
    loadReferralPartner,
  };
}
