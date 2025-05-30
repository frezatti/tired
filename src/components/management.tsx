"use client";

import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import ProductModal from './stock/modal';
import ProductsTable from './stock/table';
import type { Product } from '@/types';
import { api } from '@/trpc/react';


interface ProductManagerProps { }

const ProductManager: React.FC<ProductManagerProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [refreshTable, setRefreshTable] = useState<number>(0);


    const utils = api.useUtils();

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setRefreshTable(prev => prev + 1);
        // Remove await - invalidate is typically synchronous
        utils.product.getAllProducts.invalidate();
    };

    return (
        <Card className="shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <CardHeader className="flex justify-end">
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
