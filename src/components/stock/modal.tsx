"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Link,
} from "@heroui/react";


export default function OpenModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Open Modal
            </Button>
            <Modal isOpen={isOpen} scrollBehavior="inside" placement="top-center" size="3xl" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col items-center gap-2 border-b pb-4">
                                <h3 className="text-lg font-semibold">Inserir Produto</h3>
                            </ModalHeader>
                            <ModalBody className="py-6 px-4">
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Nome do Produto"
                                            placeholder="Ex. Chocolate"
                                            type="text"
                                            variant="bordered"
                                            className="w-full"
                                        />
                                        <Input
                                            label="SKU"
                                            placeholder="Ex. ABC-12345-S-BL"
                                            type="text"
                                            variant="bordered"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Preço"
                                            placeholder="Ex. $50"
                                            type="number"
                                            variant="bordered"
                                            className="w-full [&>div>input]:[-moz-appearance:textfield] [&>div>input]:appearance-none [&>div>input::-webkit-outer-spin-button]:[-webkit-appearance:none] [&>div>input::-webkit-inner-spin-button]:[-webkit-appearance:none]"
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">$</span>
                                                </div>
                                            }
                                        />
                                        <Input
                                            label="Custo"
                                            placeholder="Ex. $20"
                                            type="number"
                                            variant="bordered"
                                            className="w-full"
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">$</span>
                                                </div>
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Quantidade"
                                            placeholder="Ex. 100"
                                            type="number"
                                            variant="bordered"
                                            className="w-full [&>div>input]:[-moz-appearance:textfield] [&>div>input]:appearance-none [&>div>input::-webkit-outer-spin-button]:[-webkit-appearance:none] [&>div>input::-webkit-inner-spin-button]:[-webkit-appearance:none]"
                                        />
                                        <div></div> {/* Placeholder for symmetry */}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Salvar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
