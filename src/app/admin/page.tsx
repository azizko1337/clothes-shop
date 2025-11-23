'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react'
import { Spinner } from "@/components/ui/spinner"

interface Product {
  id: number;
  name: string;
  description: string;
  composition: string;
  price: number;
  collectionId: number;
  modelUrl?: string;
  sizes: { size: string }[];
  images: { url: string }[];
}

interface ProductFormData {
  name: string;
  description: string;
  composition: string;
  price: string;
  collectionId: string;
  modelUrl: string;
  images: string; // comma separated
  sizes: string; // comma separated
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  composition: '',
  price: '',
  collectionId: '',
  modelUrl: '',
  images: '',
  sizes: '',
};

interface Collection {
  id: number;
  name: string;
  description: string;
  releaseDate: string;
}

interface CollectionFormData {
  name: string;
  description: string;
  releaseDate: string;
}

const initialCollectionFormData: CollectionFormData = {
  name: '',
  description: '',
  releaseDate: '',
};

interface Order {
  id: number;
  address: string;
  status: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  totalProductsPrice: number;
  deliveryPrice: number;
  products: Product[];
}

interface OrderFormData {
  status: string;
  address: string;
  shippedAt: string;
  deliveredAt: string;
}

const initialOrderFormData: OrderFormData = {
  status: '',
  address: '',
  shippedAt: '',
  deliveredAt: '',
};

interface ProductFormProps {
  formData: ProductFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  collections: Collection[];
  submitLabel: string;
}

const ProductForm = ({ formData, handleInputChange, handleSubmit, loading, collections, submitLabel }: ProductFormProps) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nazwa</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Opis</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="composition" className="text-right">Skład</Label>
        <Input id="composition" name="composition" value={formData.composition} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Cena</Label>
        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collectionId" className="text-right">Kolekcja</Label>
        <select 
          id="collectionId" 
          name="collectionId" 
          value={formData.collectionId} 
          onChange={handleInputChange} 
          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
          required
        >
          <option value="" disabled>Wybierz kolekcję</option>
          {collections.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="modelUrl" className="text-right">URL Modelu</Label>
        <Input id="modelUrl" name="modelUrl" value={formData.modelUrl} onChange={handleInputChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sizes" className="text-right">Rozmiary (oddzielone przecinkami)</Label>
        <Input id="sizes" name="sizes" value={formData.sizes} onChange={handleInputChange} className="col-span-3" placeholder="S, M, L, XL" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="images" className="text-right">Zdjęcia (oddzielone przecinkami)</Label>
        <Textarea id="images" name="images" value={formData.images} onChange={handleInputChange} className="col-span-3" placeholder="http://..., http://..." />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" disabled={loading}>
        {loading ? <><Spinner className="mr-2 h-4 w-4" /> Zapisywanie...</> : submitLabel}
      </Button>
    </DialogFooter>
  </form>
);

interface CollectionFormProps {
  collectionFormData: CollectionFormData;
  handleCollectionInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCollectionSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitLabel?: string;
}

const CollectionForm = ({ collectionFormData, handleCollectionInputChange, handleCollectionSubmit, loading, submitLabel = 'Utwórz kolekcję' }: CollectionFormProps) => (
  <form onSubmit={handleCollectionSubmit} className="space-y-4">
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collectionName" className="text-right">Nazwa</Label>
        <Input id="collectionName" name="name" value={collectionFormData.name} onChange={handleCollectionInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collectionDescription" className="text-right">Opis</Label>
        <Textarea id="collectionDescription" name="description" value={collectionFormData.description} onChange={handleCollectionInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="releaseDate" className="text-right">Data wydania</Label>
        <Input id="releaseDate" name="releaseDate" type="date" value={collectionFormData.releaseDate} onChange={handleCollectionInputChange} className="col-span-3" required />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" disabled={loading}>
        {loading ? <><Spinner className="mr-2 h-4 w-4" /> Zapisywanie...</> : submitLabel}
      </Button>
    </DialogFooter>
  </form>
);

interface OrderFormProps {
  orderFormData: OrderFormData;
  handleOrderInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleOrderSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const OrderForm = ({ orderFormData, handleOrderInputChange, handleOrderSubmit, loading }: OrderFormProps) => (
  <form onSubmit={handleOrderSubmit} className="space-y-4">
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <select
          id="status"
          name="status"
          value={orderFormData.status}
          onChange={handleOrderInputChange}
          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="PENDING">Oczekujące (PENDING)</option>
          <option value="PAID">Opłacone (PAID)</option>
          <option value="COMPLETED">Zakończone (COMPLETED)</option>
          <option value="CANCELED">Anulowane (CANCELED)</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">Adres</Label>
        <Textarea id="address" name="address" value={orderFormData.address} onChange={handleOrderInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="shippedAt" className="text-right">Data wysyłki</Label>
        <Input id="shippedAt" name="shippedAt" type="datetime-local" value={orderFormData.shippedAt} onChange={handleOrderInputChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deliveredAt" className="text-right">Data dostarczenia</Label>
        <Input id="deliveredAt" name="deliveredAt" type="datetime-local" value={orderFormData.deliveredAt} onChange={handleOrderInputChange} className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" disabled={loading}>
        {loading ? <><Spinner className="mr-2 h-4 w-4" /> Zapisywanie...</> : "Zapisz zmiany"}
      </Button>
    </DialogFooter>
  </form>
);

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Product state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Collection state
  const [collectionFormData, setCollectionFormData] = useState<CollectionFormData>(initialCollectionFormData);
  const [isAddCollectionDialogOpen, setIsAddCollectionDialogOpen] = useState(false);
  const [isEditCollectionDialogOpen, setIsEditCollectionDialogOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<number | null>(null);

  // Order state
  const [orderFormData, setOrderFormData] = useState<OrderFormData>(initialOrderFormData);
  const [isEditOrderDialogOpen, setIsEditOrderDialogOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
      await Promise.all([fetchProducts(), fetchCollections(), fetchOrders()]);
      setIsInitialLoading(false);
    };
    init();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (error) {
      console.error("Failed to fetch collections", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const imagesArray = formData.images.split(',').map(s => s.trim()).filter(s => s);
    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      collectionId: parseInt(formData.collectionId),
      images: imagesArray,
      sizes: sizesArray,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchProducts();
        setFormData(initialFormData);
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingId(null);
      } else {
        alert('Nie udało się zapisać produktu');
      }
    } catch (error) {
      console.error("Error saving product", error);
      alert('Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      composition: product.composition,
      price: product.price.toString(),
      collectionId: product.collectionId.toString(),
      modelUrl: product.modelUrl || '',
      images: product.images.map(i => i.url).join(', '),
      sizes: product.sizes.map(s => s.size).join(', '),
    });
    setEditingId(product.id);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productToDelete}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchProducts();
        } else {
          alert('Nie udało się usunąć produktu');
        }
      } catch (error) {
        console.error("Error deleting product", error);
      } finally {
        setLoading(false);
        setProductToDelete(null);
      }
    }
  };

  const handleCollectionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCollectionFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCollectionClick = (collection: Collection) => {
    setCollectionFormData({
      name: collection.name,
      description: collection.description,
      releaseDate: new Date(collection.releaseDate).toISOString().split('T')[0],
    });
    setEditingCollectionId(collection.id);
    setIsEditCollectionDialogOpen(true);
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCollectionId ? `/api/collections/${editingCollectionId}` : '/api/collections';
      const method = editingCollectionId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionFormData),
      });

      if (res.ok) {
        fetchCollections();
        setCollectionFormData(initialCollectionFormData);
        setIsAddCollectionDialogOpen(false);
        setIsEditCollectionDialogOpen(false);
        setEditingCollectionId(null);
      } else {
        alert('Nie udało się zapisać kolekcji');
      }
    } catch (error) {
      console.error("Error saving collection", error);
      alert('Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollectionClick = (id: number) => {
    setCollectionToDelete(id);
  };

  const confirmDeleteCollection = async () => {
    if (collectionToDelete) {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/${collectionToDelete}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchCollections();
        } else {
          alert('Nie udało się usunąć kolekcji');
        }
      } catch (error) {
        console.error("Error deleting collection", error);
      } finally {
        setLoading(false);
        setCollectionToDelete(null);
      }
    }
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditOrderClick = (order: Order) => {
    setOrderFormData({
      status: order.status,
      address: order.address,
      shippedAt: order.shippedAt ? new Date(order.shippedAt).toISOString().slice(0, 16) : '',
      deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toISOString().slice(0, 16) : '',
    });
    setEditingOrderId(order.id);
    setIsEditOrderDialogOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${editingOrderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderFormData),
      });

      if (res.ok) {
        fetchOrders();
        setOrderFormData(initialOrderFormData);
        setIsEditOrderDialogOpen(false);
        setEditingOrderId(null);
      } else {
        alert('Nie udało się zaktualizować zamówienia');
      }
    } catch (error) {
      console.error("Error updating order", error);
      alert('Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      {isInitialLoading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Spinner size={48} />
        </div>
      ) : (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel Administratora</h1>
            <p className="text-muted-foreground">Zarządzaj produktami i magazynem.</p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Wyloguj
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produkty</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setFormData(initialFormData);
                  setEditingId(null);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Dodaj produkt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Dodaj nowy produkt</DialogTitle>
                  <DialogDescription>
                    Wypełnij szczegóły, aby utworzyć nowy produkt.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  collections={collections}
                  submitLabel="Utwórz produkt" 
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Nazwa</TableHead>
                  <TableHead className="hidden md:table-cell">Opis</TableHead>
                  <TableHead className="hidden md:table-cell">Skład</TableHead>
                  <TableHead>Rozmiary</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate" title={product.description}>
                      {product.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.composition}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((s, i) => (
                          <span key={i} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            {s.size}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nie znaleziono produktów. Dodaj jeden, aby rozpocząć.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edytuj produkt</DialogTitle>
              <DialogDescription>
                Wprowadź zmiany w produkcie. Kliknij zapisz, gdy skończysz.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              loading={loading}
              collections={collections}
              submitLabel="Zapisz zmiany" 
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
              <AlertDialogDescription>
                Tej operacji nie można cofnąć. Spowoduje to trwałe usunięcie produktu
                i usunięcie go z naszych serwerów.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Anuluj</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  confirmDelete();
                }} 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? <><Spinner className="mr-2 h-4 w-4" /> Usuwanie...</> : "Usuń"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kolekcje</CardTitle>
            <Dialog open={isAddCollectionDialogOpen} onOpenChange={setIsAddCollectionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCollectionFormData(initialCollectionFormData)}>
                  <Plus className="mr-2 h-4 w-4" /> Dodaj kolekcję
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Dodaj nową kolekcję</DialogTitle>
                  <DialogDescription>
                    Utwórz nową kolekcję dla swoich produktów.
                  </DialogDescription>
                </DialogHeader>
                <CollectionForm 
                  collectionFormData={collectionFormData}
                  handleCollectionInputChange={handleCollectionInputChange}
                  handleCollectionSubmit={handleCollectionSubmit}
                  loading={loading}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead>Data wydania</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell>{collection.description}</TableCell>
                    <TableCell>{new Date(collection.releaseDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCollectionClick(collection)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteCollectionClick(collection.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Zamówienia</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Wartość</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{(order.totalProductsPrice + order.deliveryPrice).toFixed(2)} zł</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditOrderClick(order)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Brak zamówień.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditCollectionDialogOpen} onOpenChange={setIsEditCollectionDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edytuj kolekcję</DialogTitle>
              <DialogDescription>
                Wprowadź zmiany w kolekcji. Kliknij zapisz, gdy skończysz.
              </DialogDescription>
            </DialogHeader>
            <CollectionForm 
              collectionFormData={collectionFormData}
              handleCollectionInputChange={handleCollectionInputChange}
              handleCollectionSubmit={handleCollectionSubmit}
              loading={loading}
              submitLabel="Zapisz zmiany"
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOrderDialogOpen} onOpenChange={setIsEditOrderDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edytuj zamówienie</DialogTitle>
              <DialogDescription>
                Zmień status lub dane zamówienia.
              </DialogDescription>
            </DialogHeader>
            <OrderForm
              orderFormData={orderFormData}
              handleOrderInputChange={handleOrderInputChange}
              handleOrderSubmit={handleOrderSubmit}
              loading={loading}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!collectionToDelete} onOpenChange={(open) => !open && setCollectionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
              <AlertDialogDescription>
                Tej operacji nie można cofnąć. Spowoduje to trwałe usunięcie kolekcji.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Anuluj</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  confirmDeleteCollection();
                }}
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? <><Spinner className="mr-2 h-4 w-4" /> Usuwanie...</> : "Usuń"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      )}
    </div>
  );
}
