// @/config/highlightsData.ts
import video from '~/assets/videos/beach.mp4'

export interface Card {
    title: string
    description: string
}

export interface Button {
    title: string
    link: string
}

export interface Hero {
    title: string
    description: string
    image: string
    link: string
    cards: Card[],
    buttons: Button[],
    video: string
}

export const heroData: Hero = {
    title: 'Guillermo Medel | Full Stack Developer | Digital Experiences',
    description: "Hey, I’m a full-stack developer based in San Carlos, Sonora, crafting complete web experiences—from sleek frontends to robust backends. I’ve contributed to platforms like Law.com, and when I’m not coding, I’m offering drone photography to help local businesses elevate their online presence—literally.",
    image: 'https://images.pexels.com/photos/31317409/pexels-photo-31317409/free-photo-of-serene-white-sands-in-new-mexico-s-desert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    link: '#',
    cards: [
        {
            title: 'End-to-End Development',
            description: 'Complete solutions from user interfaces to server logic and databases'
        },
        {
            title: 'Responsive Web Design',
            description: 'Beautiful, functional websites that work on all devices'
        },
        {
            title: 'Performance Optimization',
            description: 'Fast, efficient applications with modern best practices'
        },
        {
            title: 'Aerial Photography',
            description: 'High-quality drone footage for property and business marketing'
        }
    ],
    buttons: [
        {
            title: 'Get in Touch',
            link: '#contact'
        },
        {
            title: 'See My Projects',
            link: '#portfolio'
        }
    ],
    video
}