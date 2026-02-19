import ProductsDatatable from "@/components/datatable-products"

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
      </div>
      <ProductsDatatable />
    </div>
  )
}