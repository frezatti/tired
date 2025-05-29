"use client";

import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Card,
    CardBody,
    useDisclosure,
    Alert
} from '@heroui/react';
import { Upload, Image } from 'lucide-react';
import { api } from '@/trpc/react';
import type { ProductData } from '@/types';


export default function ProductModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [productData, setProductData] = useState<ProductData>({
        name: '',
        sku: '',
        price: '',
        cost: '',
        quantity: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // FIXED: Move the useMutation hook outside of the handleSubmit function
    const createProduct = api.product.createProduct.useMutation({
        onSuccess: () => {
            // Handle success (e.g., show toast, reset form, etc.)
            console.log('Product created successfully!');
            resetForm();
        },
        onError: (error) => {
            // Handle error
            console.error('Error creating product:', error);
        }
    });

    const handleInputChange = (field: string, value: string) => {
        setProductData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'name' && !productData.sku) {
            const sku = value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 8);
            if (sku) {
                setProductData(prev => ({
                    ...prev,
                    sku: sku + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
                }));
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProductData((prev) => ({
                ...prev,
                image: file,
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result && typeof e.target.result === "string") {
                    setImagePreview(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            let img64 = null;
            if (productData.image) {
                const reader = new FileReader();
                img64 = await new Promise<string>((resolve, reject) => {
                    reader.onload = (e) => {
                        if (e.target?.result && typeof e.target.result === "string") {
                            resolve(e.target.result);
                        } else {
                            reject(new Error("Failed to read file"));
                        }
                    };
                    reader.onerror = () => reject(new Error("file no good. Cant read"));
                    reader.readAsDataURL(productData.image!);
                });
                img64 = img64.split(",")[1];
            }

            await createProduct.mutateAsync({
                name: productData.name,
                sku: productData.sku,
                price: productData.price,
                cost: productData.cost,
                quantity: productData.quantity,
                description: productData.description,
                image64: img64 || undefined
            });

        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };

    const resetForm = () => {
        setProductData({
            name: '',
            sku: '',
            price: '',
            cost: '',
            quantity: '',
            description: '',
            image: null
        });
        setImagePreview(null);
    };

    return (
        <div>
            <Button
                onPress={onOpen}
                color="primary"
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
                Adicionar Produto
            </Button>

            <Modal
                isOpen={isOpen}
                scrollBehavior="inside"
                placement="top-center"
                size="4xl"
                onOpenChange={onOpenChange}
                backdrop="opaque"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col items-center gap-2 border-b pb-4">
                                <h3 className="text-xl font-semibold text-white">Inserir Produto</h3>
                                <p className="text-sm text-gray-500">Adicione os detalhes do produto ao estoque</p>
                            </ModalHeader>

                            <ModalBody className="py-6 px-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 flex flex-col items-center space-y-4">
                                        <Card className="w-full max-w-sm">
                                            <CardBody className="p-4">
                                                <div
                                                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 overflow-hidden group"
                                                    onClick={() => {
                                                        const input = document.getElementById('imageInput');
                                                        if (input) input.click();
                                                    }}
                                                >
                                                    {imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Product preview"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-gray-500">
                                                            <Image className="w-12 h-12 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                                                            <p className="text-sm font-medium">Clique para upload</p>
                                                            <p className="text-xs text-gray-400">imagem do produto</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    id="imageInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <Button
                                                    className="w-full mt-4"
                                                    variant="bordered"
                                                    startContent={<Upload className="w-4 h-4" />}
                                                    onPress={() => {
                                                        const input = document.getElementById('imageInput');
                                                        if (input) input.click();
                                                    }}
                                                >
                                                    Escolher Imagem
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Nome do Produto"
                                                placeholder="Ex. Chocolate Premium"
                                                type="text"
                                                variant="bordered"
                                                value={productData.name}
                                                onValueChange={(value) => handleInputChange('name', value)}
                                                className="w-full"
                                                isRequired
                                            />
                                            <Input
                                                label="SKU"
                                                placeholder="Ex. ABC-12345-S-BL"
                                                type="text"
                                                variant="bordered"
                                                value={productData.sku}
                                                onValueChange={(value) => handleInputChange('sku', value)}
                                                className="w-full"
                                                isRequired
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Preço de Venda"
                                                placeholder="50.00"
                                                type="number"
                                                variant="bordered"
                                                value={productData.price}
                                                onValueChange={(value) => handleInputChange('price', value)}
                                                className="w-full"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">R$</span>
                                                    </div>
                                                }
                                                isRequired
                                            />
                                            <Input
                                                label="Custo"
                                                placeholder="20.00"
                                                type="number"
                                                variant="bordered"
                                                value={productData.cost}
                                                onValueChange={(value) => handleInputChange('cost', value)}
                                                className="w-full"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">R$</span>
                                                    </div>
                                                }
                                                isRequired
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Quantidade"
                                                placeholder="100"
                                                type="number"
                                                variant="bordered"
                                                value={productData.quantity}
                                                onValueChange={(value) => handleInputChange('quantity', value)}
                                                className="w-full"
                                            />
                                            <div></div>
                                        </div>

                                        <Textarea
                                            label="Descrição"
                                            placeholder="Digite uma descrição detalhada do produto..."
                                            variant="bordered"
                                            value={productData.description}
                                            onValueChange={(value) => handleInputChange('description', value)}
                                            className="w-full"
                                            minRows={3}
                                        />
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter className="border-t pt-4">
                                <div className="flex gap-3 w-full justify-end">
                                    <Button
                                        color="default"
                                        variant="faded"
                                        onPress={() => {
                                            resetForm();
                                            onClose();
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="shadow"
                                        onPress={() => {
                                            handleSubmit();
                                            onClose();
                                        }}
                                        className="bg-gradient-to-r from-green-500 to-green-600"
                                        isDisabled={!productData.name || !productData.sku || !productData.price || !productData.cost || createProduct.isPending}
                                        isLoading={createProduct.isPending}
                                    >
                                        Salvar Produto
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
