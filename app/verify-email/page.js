import Link from "next/link";

export default function page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">📨 Potvrď svoj e-mail</h1>
                <h2 className="text-lg font-semibold">
                    Registrácia bola úspešná 🎉
                </h2>
                <p className="text-gray-600">
                    Na tvoju e-mailovú adresu sme poslali potvrdzovací e-mail.
                    <br />
                    Klikni na odkaz v správe, aby si aktivoval svoj účet.
                </p>
                <p className="text-sm text-gray-500">
                    Ak si správu nedostal, skontroluj si spam alebo počkaj pár minút.
                </p>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="bg-gray-300 text-primary-800 px-6 py-3 text-lg rounded-md hover:bg-gray-500 hover:text-primary-50 active:scale-95"
                    >
                        🏠 Domov
                    </Link>
                </div>
            </div>

        </div>
    )
}
