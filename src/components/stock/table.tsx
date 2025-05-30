"use client";

import React, { useState, useEffect } from 'react';

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Avatar,
    Button,
    Spinner
} from '@heroui/react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { api } from '@/trpc/react';
import type { Product } from '@/types';

const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "image", label: "IMAGEM", sortable: false },
    { key: "name", label: "PRODUTO", sortable: true },
    { key: "sku", label: "SKU", sortable: true },
    { key: "price", label: "PREÇO", sortable: true },
    { key: "cost", label: "CUSTO", sortable: true },
    { key: "quantity", label: "ESTOQUE", sortable: true },
];

interface ProductsTableProps {
    onEditAction: (product: Product) => void;
    refreshTrigger?: number;
}


export default function ProductsTable({ onEditAction, refreshTrigger }: ProductsTableProps) {

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showRadialMenu, setShowRadialMenu] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const { data: products, isLoading, error, refetch } = api.product.getAllProducts.useQuery();
    const deleteProduct = api.product.deleteProduct_by_id.useMutation({
        onSuccess: async () => {
            await refetch();
            setShowRadialMenu(false);
        },
    });


    useEffect(() => {
        const refreshData = async () => {
            if (refreshTrigger && refreshTrigger > 0) {
                await refetch();
            }
        };
        refreshData();
    }, [refreshTrigger]);

    const handleRowRightClick = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        setSelectedProduct(product);
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setShowRadialMenu(true);
    };



    const handleDeleteProduct = async (product: Product) => {
        deleteProduct.mutate({ id: product.id });
        setShowRadialMenu(false);
        refetch();
    };


    const handleEditProduct = (product: Product) => {
        onEditAction(product);
        setShowRadialMenu(false);
    };
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const calculateProfit = (price: number, cost: number) => {
        return price - cost;
    };

    const getProfitColor = (profit: number) => {
        if (profit > 0) return 'success';
        if (profit < 0) return 'danger';
        return 'warning';
    };

    const getStockColor = (quantity: number) => {
        if (quantity === 0) return 'danger';
        if (quantity < 10) return 'warning';
        return 'success';
    };
    const RadialMenu = () => (
        showRadialMenu && selectedProduct && (
            <>
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRadialMenu(false)}
                />
                <div
                    className="fixed z-50 bg-slate-800 rounded-full p-4 shadow-2xl border border-slate-600"
                    style={{
                        left: menuPosition.x - 60,
                        top: menuPosition.y - 60,
                        width: '120px',
                        height: '120px'
                    }}
                >
                    <div className="relative w-full h-full">
                        {/* Edit Button - Top (0°) */}
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="warning"
                            className="absolute"
                            style={{
                                left: '50%',
                                top: '15%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            onPress={() => handleEditProduct(selectedProduct)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        {/* Delete Button - Bottom Right (120°) */}
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="absolute"
                            style={{
                                left: '78%',
                                top: '78%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            onPress={() => handleDeleteProduct(selectedProduct)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        {/* View Button - Bottom Left (240°) */}
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="absolute"
                            style={{
                                left: '22%',
                                top: '78%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            onPress={() => {
                                console.log('View product:', selectedProduct.id);
                                setShowRadialMenu(false);
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </>
        )
    );
    const renderCell = (product: Product, columnKey: React.Key) => {
        const cellValue = product[columnKey as keyof Product];

        switch (columnKey) {
            case "image":
                return (
                    <Avatar
                        src={product.imageUrl || undefined}
                        alt={product.name}
                        size="lg"
                        radius="md"
                        className="bg-gradient-to-br from-blue-400 to-purple-500"
                        fallback={
                            <div className="text-white font-semibold text-lg">
                                {product.name.charAt(0).toUpperCase()}
                            </div>
                        }
                    />
                );
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize text-white">
                            {product.name}
                        </p>
                        <p className="text-tiny text-default-500 capitalize">
                            {product.description != null
                                ? product.description.substring(0, 50) +
                                (product.description.length > 50 ? '...' : '')
                                : 'No description'}
                        </p>
                    </div>
                );
            case "sku":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-mono"
                    >
                        {product.sku}
                    </Chip>
                );
            case "price":
                return (
                    <span className="text-bold text-small text-green-400">
                        {formatCurrency(product.price)}
                    </span>
                );
            case "cost":
                return (
                    <span className="text-bold text-small text-red-400">
                        {formatCurrency(product.cost)}
                    </span>
                );
            case "quantity":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={getStockColor(product.quantity)}
                    >
                        {product.quantity} un
                    </Chip>
                );
            case "profit":
                const profit = calculateProfit(product.price, product.cost);
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={getProfitColor(profit)}
                    >
                        {formatCurrency(profit)}
                    </Chip>
                );
            default:
                return cellValue?.toString() || '';
        }
    };

    if (error) {
        return (
            <Card className="max-w-6xl mx-auto">
                <CardBody className="text-center py-8">
                    <p className="text-danger">Erro ao carregar produtos: {error.message}</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <Card className="shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-none ">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Produtos em Estoque
                            </h2>
                            <p className="text-gray-400">
                                {products ? `${products.length} produtos cadastrados` : 'Carregando...'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Chip
                                size="lg"
                                variant="flat"
                                color="success"
                                className="px-4 py-2"
                            >
                                Total: {products ? formatCurrency(
                                    products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
                                ) : '---'}
                            </Chip>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table
                        removeWrapper
                        aria-label="Tabela de produtos"
                        color="primary"
                        classNames={{
                            wrapper: "min-h-[400px] bg-transparent",
                            th: "bg-slate-800 text-white font-semibold",
                            td: "text-gray-200",
                            tbody: "divide-y divide-slate-700",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn
                                    key={column.key}
                                    allowsSorting={column.sortable}
                                    className="text-center"
                                >
                                    {column.label}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={products || []}
                            isLoading={isLoading}
                            loadingContent={
                                <div className="flex justify-center items-center py-8">
                                    <Spinner
                                        size="lg"
                                        color="primary"
                                        label="Carregando produtos..."
                                        labelColor="primary"
                                    />
                                </div>
                            }
                            emptyContent={
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-lg mb-2">
                                        Nenhum produto encontrado
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Adicione produtos usando o botão "Adicionar Produto"
                                    </p>
                                </div>
                            }
                        >
                            {(product) => (
                                <TableRow
                                    key={product.id}
                                    onContextMenu={(e) => handleRowRightClick(e, product)}
                                    className="cursor-context-menu hover:bg-slate-700/50"
                                >
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(product, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
            <RadialMenu />
        </div>
    );
}



