"use client";

import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import ProductModal from './stock/modal';
import ProductsTable from './stock/table';
import type { Product } from '@/types';
import { setRequestMeta } from 'next/dist/server/request-meta';

interface ProductManagerProps { }

const ProductManager: React.FC<ProductManagerProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [refreshTable, setRefreshTable] = useState<number>(0);

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
        setRefreshTable(prev => prev + 1);
    };

    return (
        <Card className="shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <CardHeader>
                <Button
                    onPress={handleAdd}
                    color="primary"
                    size="lg"
                    className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                    Adicionar Produto
                </Button>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col items-center w-full">
                    <ProductModal
                        isOpen={isModalOpen}
                        onOpenChangeAction={setIsModalOpen}
                        onSaveAction={handleSave}
                        initialData={editingProduct}
                    />
                    <ProductsTable onEditAction={handleEdit} refreshTrigger={refreshTable} />
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductManager;
