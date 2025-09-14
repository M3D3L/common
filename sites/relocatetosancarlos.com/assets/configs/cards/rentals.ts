interface Rentals {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    cover_image: string;
    slug: string;
    tags: string[];
    // tech?: string[]; // Uncomment if you want to include technology stack
}
export const rentalData: Rentals[] = [
    {
        "id": 1,
        "title": "1320 N Lake Shore Drive",
        "sub_title": "$2,500,000",
        "description": "1 bed, 2 baths, 1,200 sqft",
        "cover_image": "https://ap.rdcpix.com/93c209d70226d22e27bcda8817a91b91l-m2445986928rd-w1280_h960.webp",
        "slug": "/real-estate/1320-n-lake-shore-drive",
        "tags": ["Luxury", "Condo", "Lakefront"],
        // "tech": ["Vue.js", "Nuxt", "Tailwind CSS", "Storyblok", "Node.js"]
    },
    {
        "id": 2,
        "title": "1234 W Diversey Parkway",
        "sub_title": "$1,200,000",
        "description": "3 beds, 2 baths, 1,800 sqft",
        "cover_image": "https://ap.rdcpix.com/3b0c8f1d5e2a4c6b7f9d5e8f1c2a3b4dl-m2445986928rd-w1280_h960.webp",
        "slug": "/real-estate/1320-n-lake-shore-drive",
        "tags": ["Family Home", "Renovated", "Garden"],
    },
    {
        "id": 3,
        "title": "4567 S Michigan Avenue",
        "sub_title": "$850,000",
        "description": "2 beds, 1 bath, 1,500 sqft",
        "cover_image": "https://ap.rdcpix.com/4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9fl-m2445986928rd-w1280_h960.webp",
        "slug": "/real-estate/1320-n-lake-shore-drive",
        "tags": ["Urban Living", "Modern", "Close to Transit"],
    },
    {
        "id": 4,
        "title": "7890 N Sheridan Road",
        "sub_title": "$1,750,000",
        "description": "4 beds, 3 baths, 2,500 sqft",
        "cover_image": "https://ap.rdcpix.com/5e6f7a8b9c0d1e2f3g4h5i6j7k8l9m0nl-m2445986928rd-w1280_h960.webp",
        "slug": "/real-estate/1320-n-lake-shore-drive",
        "tags": ["Spacious", "Family Friendly", "Lake View"],
    },
    {
        "id": 5,
        "title": "1011 W North Avenue",
        "sub_title": "$950,000",
        "description": "2 beds, 2 baths, 1,400 sqft",
        "cover_image": "https://ap.rdcpix.com/6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1pl-m2445986928rd-w1280_h960.webp",
        "slug": "/real-estate/1320-n-lake-shore-drive",
        "tags": ["Condo", "City Living", "Balcony"],
    },
    {
        "id": 6,
        "title": "1213 E 53rd Street",
        "sub_title": "$1,100,000",
        "description": "3 beds, 2 baths, 1,900 sqft",
        "cover_image": "https://ap.rdcpix.com/7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2ql-m2445986928rd-w1280_h960.webp",
        "slug": "/real-estate/1320-n-lake-shore-drive",
        "tags": ["Historic", "Renovated", "Close to Parks"],
    }
]