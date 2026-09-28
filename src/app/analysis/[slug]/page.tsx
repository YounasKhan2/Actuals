import { PublishedArticle, publishedMetadata } from "@/components/publication/published-article";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return publishedMetadata(slug,"analysis");}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <PublishedArticle slug={slug} kind="analysis" />;}
