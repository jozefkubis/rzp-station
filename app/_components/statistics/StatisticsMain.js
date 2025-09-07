"use client";

export default function StatisticsMain({ profiles, shifts }) {

    return (
        <div className="h-screen">
            <div className="h-full p-[4rem] flex flex-col gap-4">
                <table className="table-fixed border-collapse border border-gray-300 w-full text-center ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Meno</th>
                            <th className="border px-4 py-2">D</th>
                            <th className="border px-4 py-2">N</th>
                            <th className="border px-4 py-2">RD</th>
                            <th className="border px-4 py-2">PN</th>
                            <th className="border px-4 py-2">X</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile) => (
                            <tr key={profile.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2 text-left text-primary-700 font-semibold">
                                    {profile.full_name}
                                </td>
                                <td className="border px-4 py-2">0</td>
                                <td className="border px-4 py-2">0</td>
                                <td className="border px-4 py-2">0</td>
                                <td className="border px-4 py-2">0</td>
                                <td className="border px-4 py-2">0</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

