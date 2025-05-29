"use client";

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import ProductModal from './stock/modal';
import ProductsTable from './stock/table';
import type { Product } from '@/types';

interface ProductManagerProps { }

const ProductManager: React.FC<ProductManagerProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <Button
                onPress={handleAdd}
                color="primary"
                size="lg"
                className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600"
            >
                Adicionar Produto
            </Button>
            <ProductModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSave={handleSave}
                initialData={editingProduct}
            />
            <ProductsTable onEdit={handleEdit} />
        </div>
    );
};

export default ProductManager;
