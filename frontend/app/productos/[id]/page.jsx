import App from "../../../src/App";

const PRODUCTS_API_URL =
  process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.startsWith("/")
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://170.168.0.31/api";

async function fetchProducts() {
  try {
    const response = await fetch(`${PRODUCTS_API_URL}/products`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${PRODUCTS_API_URL}/categories`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const products = await fetchProducts();
  const product = products.find((item) => String(item.id) === String(id) || item.slug === String(id));

  if (product) {
    return {
      title: `${product.name} | LEIDER Shop`,
      description: product.description || "Detalle de producto LEIDER Shop.",
      openGraph: {
        title: `${product.name} | LEIDER Shop`,
        description: product.description || "Detalle de producto LEIDER Shop.",
        type: "website",
      },
    };
  }

  return {
    title: `Producto ${id} | LEIDER Shop`,
    description: "Detalle de producto LEIDER Shop con especificaciones, precio y disponibilidad.",
  };
}

export default async function ProductPage() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  return <App initialProducts={products} initialCategories={categories} />;
}
