import { createClient } from "next-sanity";

export const client = createClient({
    projectId: "xp5cx30j",
    dataset: "production",
    apiVersion: "2026-05-15",
    useCdn: false,
});