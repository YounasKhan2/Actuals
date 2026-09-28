import { StudioQueryService } from "@/application/studio-query-service";
import { createProductAction } from "../actions";

export default async function ProductsPage() {
  const products = await new StudioQueryService().listProducts();
  return <><header className="studio-header"><p className="eyebrow">Catalog</p><h1>Products</h1><p>Technology entities referenced by research and editorial content.</p></header>
    <form className="studio-form studio-form-products" action={createProductAction}>
      <input name="name" placeholder="Product name" required />
      <input name="slug" placeholder="product-slug" required />
      <input name="websiteUrl" type="url" placeholder="Official website" />
      <input name="description" placeholder="Short description" />
      <label className="studio-check"><input name="isOpenSource" type="checkbox" /> Open source</label>
      <button>Create product</button>
    </form>
    <div className="studio-list">{products.map(product=><article key={product.id}><div><strong>{product.name}</strong><p>{product.description ?? "No description yet"}</p></div><div><span>{product.slug}</span><small>{product.isOpenSource ? "open source" : "managed / proprietary"}</small></div></article>)}</div>
  </>;
}
