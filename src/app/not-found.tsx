import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="font-bold text-9xl">Erro 404</h1>
                <p>Esta página não existe</p>
                <Link href="/" className="text-blue-700">Voltar para homepage</Link>
            </div>
        </>
    )
}