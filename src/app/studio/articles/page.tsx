import Link from "next/link";
import { StudioQueryService } from "@/application/studio-query-service";
import { createArticleAction } from "../actions";

export default async function ArticlesPage() {
  const query = new StudioQueryService();
  const [items, authors] = await Promise.all([query.listArticles(), query.listAuthors()]);
  return <><header className="studio-header"><p className="eyebrow">Publication</p><h1>Articles</h1><p>Create content containers first; research and typed blocks remain separate from article identity.</p></header>
    <form className="studio-form" action={createArticleAction}>
      <input name="title" placeholder="Working title" required />
      <input name="slug" placeholder="article-slug" required />
      <select name="kind" defaultValue="overview">{["comparison","review","overview","alternatives","guide","explainer","analysis"].map(x=><option key={x}>{x}</option>)}</select>
      <select name="authorId" defaultValue=""><option value="">No byline yet</option>{authors.map(author=><option key={author.id} value={author.id}>{author.name}</option>)}</select>
      <input name="dek" placeholder="Optional deck" />
      <button>Create draft</button>
    </form>
    <div className="studio-list">{items.map(item=><Link className="studio-list-link" href={`/studio/articles/${item.id}`} key={item.id}><article><div><strong>{item.slug}</strong><p>{item.kind}</p></div><div><span>{item.status}</span><small>{item.updatedAt.toISOString().slice(0,10)}</small></div></article></Link>)}</div>
  </>;
}
