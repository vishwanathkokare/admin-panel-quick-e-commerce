import { type Product } from '@/components/datatable-products'

const productsData: Product[] = [
  {
    id: 'PROD-1',
    name: 'Veg Thali',
    price: 150,
    stock: 50,
    category: 'Main Course',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop',
  },
  {
    id: 'PROD-2',
    name: 'Butter Naan',
    price: 40,
    stock: 100,
    category: 'Breads',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&h=300&fit=crop',
  },
  {
    id: 'PROD-3',
    name: 'Paneer Butter Masala',
    price: 260,
    stock: 30,
    category: 'Main Course',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop',
  },
  {
    id: 'PROD-4',
    name: 'Chicken Biryani',
    price: 320,
    stock: 45,
    category: 'Main Course',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=300&fit=crop',
  },
  {
    id: 'PROD-5',
    name: 'Veg Burger',
    price: 120,
    stock: 20,
    category: 'Fast Food',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
  },
]

export default productsData