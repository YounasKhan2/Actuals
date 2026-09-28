import { StudioQueryService } from "@/application/studio-query-service";
import { createAuthorAction } from "../actions";
export default async function AuthorsPage(){
 const authors=await new StudioQueryService().listAuthors();
 return <><header className="studio-header"><p className="eyebrow">Identity</p><h1>Authors</h1><p>Manage accountable public bylines separately from Studio login accounts.</p></header>
 <form className="studio-form studio-editor" action={createAuthorAction}><input name="name" placeholder="Public name" required/><input name="slug" placeholder="author-slug" required/><textarea name="bio" placeholder="Short public bio"/><input name="websiteUrl" type="url" placeholder="Website URL"/><input name="avatarUrl" type="url" placeholder="Avatar URL"/><button>Create author</button></form>
 <div className="studio-list">{authors.map(author=><article key={author.id}><div><strong>{author.name}</strong><p>{author.bio}</p></div><span>/{author.slug}</span></article>)}</div></>;
}
