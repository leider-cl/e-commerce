import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { SiteHeader } from "./components/SiteHeader";
import { HeroSection } from "./components/HeroSection";
import { CategoryStrip } from "./components/CategoryStrip";
import { CatalogSection } from "./components/CatalogSection";
import { CartSection } from "./components/CartSection";
import { ContactSection } from "./components/ContactSection";
import { SiteFooter } from "./components/SiteFooter";
import { ProductModal } from "./components/ProductModal";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function App() {
  const pageRef = useRef(null);
  const cartLinkRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Todas"]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState(0);
  const [cartNotice, setCartNotice] = useState("");

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }),
    [],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData);
        setCategories(["Todas", ...categoriesData]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartQuantityByProductId = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems],
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function animateProductToCart({ imageUrl, sourceElement }) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !imageUrl || !sourceElement || !cartLinkRef.current) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = cartLinkRef.current.getBoundingClientRect();
    const floatingImage = document.createElement("img");

    floatingImage.src = imageUrl;
    floatingImage.alt = "";
    floatingImage.className = "cart-flyer";
    floatingImage.style.left = `${sourceRect.left}px`;
    floatingImage.style.top = `${sourceRect.top}px`;
    floatingImage.style.width = `${sourceRect.width}px`;
    floatingImage.style.height = `${sourceRect.height}px`;
    document.body.appendChild(floatingImage);

    gsap.to(floatingImage, {
      x: targetRect.left + targetRect.width / 2 - sourceRect.left - sourceRect.width / 2,
      y: targetRect.top + targetRect.height / 2 - sourceRect.top - sourceRect.height / 2,
      scale: 0.16,
      rotate: -5,
      autoAlpha: 0.35,
      duration: 0.72,
      ease: "power3.inOut",
      onComplete: () => {
        floatingImage.remove();
        gsap.fromTo(
          cartLinkRef.current,
          { scale: 1 },
          { scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
        );
      },
    });
  }

  function clampCartQuantity(value, stock) {
    const numericValue = Number.parseInt(value, 10);
    if (Number.isNaN(numericValue) || numericValue <= 0) return 0;
    return Math.min(numericValue, stock);
  }

  function addToCart(product, animationPayload) {
    const currentQuantity = cartQuantityByProductId.get(product.id) ?? 0;

    if (currentQuantity >= product.stock) {
      setCartNotice(`No hay más stock disponible para ${product.name}. Stock máximo: ${product.stock}.`);
      return;
    }

    setCartNotice("");
    animateProductToCart(animationPayload ?? {});

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function updateCartItemQuantity(productId, value) {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== productId) return [item];

        const nextQuantity = clampCartQuantity(value, item.stock);

        if (nextQuantity >= item.stock && Number.parseInt(value, 10) > item.stock) {
          setCartNotice(`Solo hay ${item.stock} unidades disponibles de ${item.name}.`);
        } else {
          setCartNotice("");
        }

        if (nextQuantity === 0) return [];
        return [{ ...item, quantity: nextQuantity }];
      }),
    );
  }

  function decreaseCartItem(productId) {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;
    updateCartItemQuantity(productId, String(item.quantity - 1));
  }

  function increaseCartItem(productId) {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;
    if (item.quantity >= item.stock) {
      setCartNotice(`Solo hay ${item.stock} unidades disponibles de ${item.name}.`);
      return;
    }
    updateCartItemQuantity(productId, String(item.quantity + 1));
  }

  function removeFromCart(productId) {
    setCartNotice("");
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function openProductDetails(product) {
    setSelectedProduct(product);
    setSelectedProductImageIndex(0);
  }

  function closeProductDetails() {
    setSelectedProduct(null);
    setSelectedProductImageIndex(0);
  }

  useEffect(() => {
    if (!selectedProduct) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeProductDetails();
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });

      timeline
        .from(".site-header", { y: -18, autoAlpha: 0 })
        .from(".eyebrow", { y: 14, autoAlpha: 0 }, "-=0.35")
        .from(".hero-copy h1", { y: 24, autoAlpha: 0 }, "-=0.45")
        .from(".hero-copy p", { y: 18, autoAlpha: 0 }, "-=0.45")
        .from(".hero-actions a", { y: 12, autoAlpha: 0, stagger: 0.08 }, "-=0.35")
        .from(".category-strip button", { y: 14, autoAlpha: 0, stagger: 0.06 }, "-=0.3")
        .from(".catalog-tools", { y: 16, autoAlpha: 0 }, "-=0.25")
        .from(".product-card", { y: 22, autoAlpha: 0, stagger: 0.08 }, "-=0.15")
        .from(".cart-summary", { y: 20, autoAlpha: 0 }, "-=0.2")
        .from(".contact-card", { y: 20, autoAlpha: 0, stagger: 0.08 }, "-=0.2");
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="site-shell" ref={pageRef}>
      <SiteHeader cartCount={cartCount} cartLinkRef={cartLinkRef} />
      <HeroSection />
      <CategoryStrip
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <CatalogSection
        loading={loading}
        filteredProducts={filteredProducts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currencyFormatter={currencyFormatter}
        cartQuantityByProductId={cartQuantityByProductId}
        onAddToCart={addToCart}
        onViewDetails={openProductDetails}
      />
      <CartSection
        cartItems={cartItems}
        cartNotice={cartNotice}
        currencyFormatter={currencyFormatter}
        cartTotal={cartTotal}
        onDecreaseItem={decreaseCartItem}
        onIncreaseItem={increaseCartItem}
        onRemoveFromCart={removeFromCart}
      />
      <ContactSection />
      <SiteFooter />

      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          selectedImageIndex={selectedProductImageIndex}
          currencyFormatter={currencyFormatter}
          cartQuantityByProductId={cartQuantityByProductId}
          onClose={closeProductDetails}
          onAddToCart={addToCart}
          onSelectImageIndex={setSelectedProductImageIndex}
        />
      ) : null}
    </main>
  );
}

export default App;
