import { TwitterLogoIcon, GithubLogoIcon, LinkedinLogoIcon, DiscordLogoIcon } from '@radix-icons/vue'

interface Link {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: Link[]
}

interface FooterData {
  socialLinks: { icon: any; label: string; href: string }[]
  footerColumns: FooterColumn[]
  bottomLinks: Link[]
}

export const footerData: FooterData = {
  socialLinks: [
    { icon: TwitterLogoIcon, label: 'Twitter', href: '#' },
    { icon: GithubLogoIcon, label: 'GitHub', href: '#' },
    { icon: LinkedinLogoIcon, label: 'LinkedIn', href: '#' },
    { icon: DiscordLogoIcon, label: 'Discord', href: '#' },
  ],
  footerColumns: [
    {
      title: 'General',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Portfolio', href: '/#portfilio' },
        { label: 'Skills', href: '/#skills' },
        { label: 'Blog', href: '/#contact' },
      ],
    },
    // {
    //   title: 'Company',
    //   links: [
    //     { label: 'About', href: '#' },
    //     { label: 'Careers', href: '#' },
    //     { label: 'Press', href: '#' },
    //     { label: 'Contact', href: '#' },
    //   ],
    // },
  ],
  bottomLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
}
