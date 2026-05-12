import { notFound } from "next/navigation";
import ProductView from "@/components/product/ProductView";
import Container from "@/components/ui/Container";
import { getProductById } from "@/services/product.Service";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>
        <ProductView product={product} />
      </Container>
    </main>
  );
}
