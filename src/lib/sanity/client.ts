import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const config = {
    projectId: "92vptbbq",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
}

export const client = createClient(config)

//Admin level client, used for backend
//admin client for mutations

const adminConfig = {
    ...config,
    token: process.env.SANITY_API_TOKEN,
}

const builder = imageUrlBuilder(config)
export const urlFor = (source: string) => builder.image(source)