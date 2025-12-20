import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import type { Transaction } from '../../types/wallet.types';
import { walletAPI } from '../../services/api/walletAPI';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await walletAPI.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter.toUpperCase();
    const matchesSearch = tx.assetSymbol.toLowerCase().includes(search.toLowerCase()) ||
                         tx.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Tipo', 'Activo', 'Cantidad', 'Precio', 'Total', 'Fecha', 'Estado'],
      ...filteredTransactions.map(tx => [
        tx.id,
        tx.type,
        tx.assetSymbol,
        tx.amount,
        tx.price,
        tx.total,
        new Date(tx.timestamp).toLocaleDateString(),
        tx.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transacciones.csv';
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Transacciones</h1>
        <p className="text-gray-600">Todas tus operaciones de compra y venta</p>
      </div>

      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transacción..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="buy">Compras</option>
              <option value="sell">Ventas</option>
              <option value="deposit">Depósitos</option>
            </select>
          </div>
        </div>

        {/* Botón Exportar */}
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          Exportar CSV
        </button>
      </div>

      {/* Tabla de Transacciones */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === 'BUY' 
                        ? 'bg-green-100 text-green-800'
                        : tx.type === 'SELL'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tx.type === 'BUY' ? 'COMPRA' : tx.type === 'SELL' ? 'VENTA' : tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tx.assetSymbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${tx.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${tx.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.status === 'COMPLETED' ? 'COMPLETADO' : 
                       tx.status === 'PENDING' ? 'PENDIENTE' : 'FALLIDO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Transacciones</h3>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Compras Realizadas</h3>
          <p className="text-3xl font-bold text-green-600">
            {transactions.filter(t => t.type === 'BUY').length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Ventas Realizadas</h3>
          <p className="text-3xl font-bold text-red-600">
            {transactions.filter(t => t.type === 'SELL').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transactions;