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
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="composition" className="text-right">Composition</Label>
        <Input id="composition" name="composition" value={formData.composition} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Price</Label>
        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collectionId" className="text-right">Collection</Label>
        <select 
          id="collectionId" 
          name="collectionId" 
          value={formData.collectionId} 
          onChange={handleInputChange} 
          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
          required
        >
          <option value="" disabled>Select a collection</option>
          {collections.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="modelUrl" className="text-right">Model URL</Label>
        <Input id="modelUrl" name="modelUrl" value={formData.modelUrl} onChange={handleInputChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sizes" className="text-right">Sizes (comma sep)</Label>
        <Input id="sizes" name="sizes" value={formData.sizes} onChange={handleInputChange} className="col-span-3" placeholder="S, M, L, XL" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="images" className="text-right">Images (comma sep)</Label>
        <Textarea id="images" name="images" value={formData.images} onChange={handleInputChange} className="col-span-3" placeholder="http://..., http://..." />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : submitLabel}</Button>
    </DialogFooter>
  </form>
);

interface CollectionFormProps {
  collectionFormData: CollectionFormData;
  handleCollectionInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCollectionSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const CollectionForm = ({ collectionFormData, handleCollectionInputChange, handleCollectionSubmit, loading }: CollectionFormProps) => (
  <form onSubmit={handleCollectionSubmit} className="space-y-4">
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collectionName" className="text-right">Name</Label>
        <Input id="collectionName" name="name" value={collectionFormData.name} onChange={handleCollectionInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collectionDescription" className="text-right">Description</Label>
        <Textarea id="collectionDescription" name="description" value={collectionFormData.description} onChange={handleCollectionInputChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="releaseDate" className="text-right">Release Date</Label>
        <Input id="releaseDate" name="releaseDate" type="date" value={collectionFormData.releaseDate} onChange={handleCollectionInputChange} className="col-span-3" required />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Collection'}</Button>
    </DialogFooter>
  </form>
);

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  
  // Product state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Collection state
  const [collectionFormData, setCollectionFormData] = useState<CollectionFormData>(initialCollectionFormData);
  const [isAddCollectionDialogOpen, setIsAddCollectionDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
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
        alert('Failed to save product');
      }
    } catch (error) {
      console.error("Error saving product", error);
      alert('An error occurred');
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
      try {
        const res = await fetch(`/api/products/${productToDelete}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchProducts();
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error("Error deleting product", error);
      } finally {
        setProductToDelete(null);
      }
    }
  };

  const handleCollectionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCollectionFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionFormData),
      });

      if (res.ok) {
        fetchCollections();
        setCollectionFormData(initialCollectionFormData);
        setIsAddCollectionDialogOpen(false);
      } else {
        alert('Failed to save collection');
      }
    } catch (error) {
      console.error("Error saving collection", error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollectionClick = (id: number) => {
    setCollectionToDelete(id);
  };

  const confirmDeleteCollection = async () => {
    if (collectionToDelete) {
      try {
        const res = await fetch(`/api/collections/${collectionToDelete}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchCollections();
        } else {
          alert('Failed to delete collection');
        }
      } catch (error) {
        console.error("Error deleting collection", error);
      } finally {
        setCollectionToDelete(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and inventory.</p>
          </div>
          <div className="flex gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setFormData(initialFormData);
                  setEditingId(null);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new product.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  collections={collections}
                  submitLabel="Create Product" 
                />
              </DialogContent>
            </Dialog>
            
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Composition</TableHead>
                  <TableHead>Sizes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      No products found. Add one to get started.
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
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              loading={loading}
              collections={collections}
              submitLabel="Save Changes" 
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Collections</CardTitle>
            <Dialog open={isAddCollectionDialogOpen} onOpenChange={setIsAddCollectionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCollectionFormData(initialCollectionFormData)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Collection</DialogTitle>
                  <DialogDescription>
                    Create a new collection for your products.
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
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell>{collection.description}</TableCell>
                    <TableCell>{new Date(collection.releaseDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCollectionClick(collection.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog open={!!collectionToDelete} onOpenChange={(open) => !open && setCollectionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCollection}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
