import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { SiteHeader } from "./components/SiteHeader";
import { CatalogSection } from "./components/CatalogSection";
import { CartSection } from "./components/CartSection";
import { ContactSection } from "./components/ContactSection";
import { SiteFooter } from "./components/SiteFooter";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { AuthModal } from "./components/AuthModal";
import { PaymentResult } from "./components/PaymentResult";
import { useAuth } from "./context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const paymentParams = new URLSearchParams(window.location.search);
const initialPaymentResult = (() => {
  const status = paymentParams.get("status");
  if (status) {
    return { status, orderId: paymentParams.get("order_id") || null };
  }
  return null;
})();

function App() {
  const { user } = useAuth();
  const pageRef = useRef(null);
  const cartLinkRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Todas"]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState(0);
  const [cartNotice, setCartNotice] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(initialPaymentResult);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

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

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((product) => product.price);
    return { min: 0, max: Math.max(...prices, 3500000) };
  }, [products]);

  const activePriceRange = selectedPriceRange ?? priceBounds;

  useEffect(() => {
    if (products.length === 0) return;
    setSelectedPriceRange((currentRange) => {
      if (currentRange === null) return priceBounds;
      return {
        min: Math.max(priceBounds.min, Math.min(currentRange.min, priceBounds.max)),
        max: Math.min(priceBounds.max, Math.max(currentRange.max, priceBounds.min)),
      };
    });
  }, [products.length, priceBounds.min, priceBounds.max]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
      const matchesPrice = priceBounds.max === 0 || (product.price >= activePriceRange.min && product.price <= activePriceRange.max);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [selectedCategory, searchTerm, products, activePriceRange.min, activePriceRange.max, priceBounds.max]);

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
      scale: 0.18,
      rotate: -3,
      autoAlpha: 0,
      duration: 0.34,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        floatingImage.remove();
        gsap.fromTo(
          cartLinkRef.current,
          { scale: 1 },
          { scale: 1.06, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.out", overwrite: "auto" },
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
    setCartOpen(true);
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

  async function handleCheckout() {
    if (!cartItems.length) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPaymentResult({ status: "failure", orderId: null });
      }
    } catch {
      setPaymentResult({ status: "failure", orderId: null });
    } finally {
      setCheckoutLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenWs = params.get("token_ws");

    if (!tokenWs) return;

    fetch(`${API_URL}/checkout/return?token_ws=${encodeURIComponent(tokenWs)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setPaymentResult({ status: data.status || "success", orderId: data.order_id || null });
      })
      .catch(() => setPaymentResult({ status: "failure", orderId: null }));
  }, []);

  function dismissPaymentResult() {
    setPaymentResult(null);
    if (paymentResult?.status === "success") {
      setCartItems([]);
    }
  }

  const productIdFromPath = currentPath.startsWith("/productos/")
    ? decodeURIComponent(currentPath.replace("/productos/", "").split("/")[0])
    : null;
  const currentProduct = productIdFromPath
    ? products.find((product) => String(product.id) === productIdFromPath || product.slug === productIdFromPath)
    : null;
  const isProductDetailPage = Boolean(productIdFromPath);
  const relatedProducts = currentProduct
    ? products
        .filter((product) => product.id !== currentProduct.id && product.category === currentProduct.category)
        .slice(0, 3)
    : products.filter((product) => String(product.id) !== productIdFromPath && product.slug !== productIdFromPath).slice(0, 3);

  function navigateTo(path, { scrollToId } = {}) {
    window.history.pushState({}, "", path);
    setCurrentPath(window.location.pathname);

    window.requestAnimationFrame(() => {
      if (scrollToId) {
        document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function navigateHome() {
    setSelectedProductImageIndex(0);
    navigateTo("/");
  }

  function navigateToSection(sectionId) {
    setSelectedProductImageIndex(0);
    navigateTo(`/#${sectionId}`, { scrollToId: sectionId });
  }

  function openProductDetails(product) {
    setSelectedProductImageIndex(0);
    navigateTo(`/productos/${product.id}`);
  }

  function openCartProductDetails(product) {
    setCartOpen(false);
    openProductDetails(product);
  }

  function backToCatalog() {
    setSelectedProductImageIndex(0);
    navigateTo("/");
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  useEffect(() => {
    if (window.location.pathname === "/" && window.location.hash) {
      window.history.replaceState({}, "", "/");
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    }
  }, []);
  useEffect(() => {
    if (!cartOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [cartOpen]);


  return (
    <main className="mx-auto w-full max-w-[96rem] px-3 pb-8 sm:px-4 lg:px-5" ref={pageRef}>
      <SiteHeader
        cartCount={cartCount}
        cartLinkRef={cartLinkRef}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigateHome={navigateHome}
        onNavigateToSection={navigateToSection}
        onSearchChange={setSearchTerm}
        onOpenCart={() => setCartOpen(true)}
      />
      {isProductDetailPage ? (
        <>
          <ProductDetailPage
            product={currentProduct}
            selectedImageIndex={selectedProductImageIndex}
            currencyFormatter={currencyFormatter}
            cartQuantityByProductId={cartQuantityByProductId}
            onBackToCatalog={backToCatalog}
            onAddToCart={addToCart}
            onSelectImageIndex={setSelectedProductImageIndex}
            relatedProducts={relatedProducts}
            onViewProduct={openProductDetails}
            loading={loading}
          />
          <SiteFooter />
        </>
      ) : (
        <>
          <CatalogSection
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            loading={loading}
            products={products}
            priceBounds={priceBounds}
            selectedPriceRange={activePriceRange}
            onPriceRangeChange={setSelectedPriceRange}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currencyFormatter={currencyFormatter}
            cartQuantityByProductId={cartQuantityByProductId}
            onAddToCart={addToCart}
            onViewDetails={openProductDetails}
          />
          <ContactSection />
          <SiteFooter />
        </>
      )}

      <CartSection
        isOpen={cartOpen}
        cartItems={cartItems}
        cartNotice={cartNotice}
        currencyFormatter={currencyFormatter}
        cartTotal={cartTotal}
        user={user}
        checkoutLoading={checkoutLoading}
        onCheckout={handleCheckout}
        onDecreaseItem={decreaseCartItem}
        onIncreaseItem={increaseCartItem}
        onRemoveFromCart={removeFromCart}
        onClose={() => setCartOpen(false)}
        onRequestLogin={() => setAuthModalOpen(true)}
        onViewProduct={openCartProductDetails}
      />

      {authModalOpen ? <AuthModal onClose={() => setAuthModalOpen(false)} /> : null}

      {paymentResult ? (
        <PaymentResult status={paymentResult.status} orderId={paymentResult.orderId} onDismiss={dismissPaymentResult} />
      ) : null}
    </main>
  );
}

export default App;
