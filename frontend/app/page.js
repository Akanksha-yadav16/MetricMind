import Sidebar from "../components/layout/Sidebar";
import KPICard from "../components/dashboard/KPICard";

export default function Home() {
  return (
    <main className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <section className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to MetricMind Analytics Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

          <KPICard
            title="Total Revenue"
            value="₹0"
            color="border-green-500"
          />

          <KPICard
            title="Total Orders"
            value="0"
            color="border-blue-500"
          />

          <KPICard
            title="Customers"
            value="0"
            color="border-purple-500"
          />

          <KPICard
            title="Average Order Value"
            value="₹0"
            color="border-orange-500"
          />

        </div>

      </section>

    </main>
  );
}