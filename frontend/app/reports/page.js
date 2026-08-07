"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import StatsCard from "../../components/reports/StatsCard";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function ReportsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [sortField, setSortField] = useState("revenue");
    const [sortDirection, setSortDirection] = useState("desc");

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await fetch(`${API_BASE_URL}/product-report`);
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            }
        }

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {

        const filtered = products.filter((item) =>
            item.product.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) => {

            let valueA = a[sortField];
            let valueB = b[sortField];

            if (typeof valueA === "string") {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (sortDirection === "asc") {
                return valueA > valueB ? 1 : -1;
            }

            return valueA < valueB ? 1 : -1;

        });

        return filtered;

    }, [products, search, sortField, sortDirection]);

    const totalRevenue = filteredProducts.reduce(
        (sum, item) => sum + item.revenue,
        0
    );

    const averageRevenue =
        filteredProducts.length > 0
            ? totalRevenue / filteredProducts.length
            : 0;

    const exportCSV = () => {
        const headers = ["Product", "Quantity", "Revenue"];

        const rows = filteredProducts.map((item) => [
            item.product,
            item.quantity,
            item.revenue,
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "MetricMind_Product_Report.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const handleSort = (field) => {

        if (sortField === field) {

            setSortDirection(
                sortDirection === "asc" ? "desc" : "asc"
            );

        } else {

            setSortField(field);
            setSortDirection("asc");

        }

    };

    return (
        <main className="flex min-h-screen bg-slate-100">
            <Sidebar />

            <section className="flex-1 p-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Reports
                        </h1>

                        <p className="text-gray-700 mt-2 text-lg">
                            Business Performance Report
                        </p>
                    </div>

                    <button
                        onClick={exportCSV}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition duration-200"
                    >
                        Export CSV
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Products"
                        value={filteredProducts.length}
                        color="bg-blue-500"
                    />

                    <StatsCard
                        title="Revenue"
                        value={`₹${totalRevenue.toLocaleString()}`}
                        color="bg-green-500"
                    />

                    <StatsCard
                        title="Average Revenue"
                        value={`₹${averageRevenue.toFixed(0)}`}
                        color="bg-purple-500"
                    />
                </div>

                {/* Search */}
                <div className="flex justify-between items-center mb-6">

                    <div className="relative w-full max-w-md">

                        <Search
                            className="absolute left-4 top-3.5 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                            <tr>
                                <th
                                    onClick={() => handleSort("product")}
                                    className="p-4 text-left font-semibold cursor-pointer hover:bg-blue-800"
                                >
                                    Product {sortField === "product" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>

                                <th
                                    onClick={() => handleSort("quantity")}
                                    className="p-4 text-left font-semibold cursor-pointer hover:bg-blue-800"
                                >
                                    Quantity {sortField === "quantity" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>

                                <th
                                    onClick={() => handleSort("revenue")}
                                    className="p-4 text-left font-semibold cursor-pointer hover:bg-blue-800"
                                >
                                    Revenue {sortField === "revenue" && (sortDirection === "asc" ? "▲" : "▼")}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((item) => (
                                <tr
                                    key={item.product}
                                    className="border-b even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <td className="p-4 font-medium text-gray-800">
                                        {item.product}
                                    </td>

                                    <td className="p-4 text-gray-700">
                                        {item.quantity}
                                    </td>

                                    <td className="p-4 font-bold text-green-700">
                                        ₹{item.revenue.toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="p-8 text-center text-gray-500"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}