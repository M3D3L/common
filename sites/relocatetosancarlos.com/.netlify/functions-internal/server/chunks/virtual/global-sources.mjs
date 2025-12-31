const sources = [
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [
            {
                "loc": "/"
            },
            {
                "loc": "/blog/"
            },
            {
                "loc": "/real-estate/"
            },
            {
                "loc": "/real-estate/lots/"
            },
            {
                "loc": "/real-estate/rentals/"
            },
            {
                "loc": "/real-estate/properties/"
            }
        ],
        "sourceType": "user"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/"
            },
            {
                "loc": "/blog"
            },
            {
                "loc": "/login"
            },
            {
                "loc": "/register"
            },
            {
                "loc": "/blog/admin"
            },
            {
                "loc": "/onboarding"
            },
            {
                "loc": "/real-estate"
            },
            {
                "loc": "/real-estate/admin"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
