import App from "../src/App";

const PRODUCTS_API_URL =
  process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.startsWith("/")
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://170.168.0.31/api";

async function fetchJson(path) {
  try {
    const response = await fetch(`${PRODUCTS_API_URL}${path}`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([fetchJson("/products"), fetchJson("/categories")]);
  return <App initialProducts={products} initialCategories={categories} />;
}
