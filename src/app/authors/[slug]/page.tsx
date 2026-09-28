import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialService } from "@/application/editorial-service";
import { articlePath } from "@/publication/routes";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params; const result=await new EditorialService().getAuthorPublication(slug);
 return result?{title:result.author.name,description:result.author.bio??`Articles by ${result.author.name} on Actuals.`}:{};
}
export default async function AuthorPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const result=await new EditorialService().getAuthorPublication(slug); if(!result)notFound();
 return <main className="shell publication-directory"><header><p className="eyebrow">Author</p><h1>{result.author.name}</h1>{result.author.bio?<p className="lede">{result.author.bio}</p>:null}{result.author.websiteUrl?<a className="publication-source" href={result.author.websiteUrl} target="_blank" rel="noreferrer">Website ↗</a>:null}</header>
 <section className="publication-index"><div className="publication-index-head"><p className="eyebrow">Published research</p><span>{result.articles.length} articles</span></div>{result.articles.map(article=><Link className="publication-index-row" href={articlePath(article.kind,article.slug)} key={article.id}><span>{article.kind}</span><div><strong>{article.title}</strong>{article.dek?<p>{article.dek}</p>:null}</div><time>{article.publishedAt?.toISOString().slice(0,10)}</time></Link>)}</section></main>;
}
