'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { movieConfig, musicConfig } from '@/app/config/config';
import GenericForm from '@/components/GenericForm';

// ==================== TIPOS ====================
type FieldConfig = {
  type: string;
  label: string;
  min?: number;
  max?: number;
};

type AppConfig = {
  category: string;
  fields: Record<string, FieldConfig>;
};

type Item = {
  _id: string;
  name: string;
  description: string;
  category: string;
  customFields?: Record<string, unknown>;
};
// ================================================

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [config, setConfig] = useState<AppConfig>(movieConfig);
  const [editingItem, setEditingItem] = useState<Item | null>(null); // [1] Nuevo estado para edición
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null); // [2] Estado para notificaciones

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/items?category=${config.category}`);
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setNotification({message: 'Error cargando items', type: 'error'});
    }
  };

  useEffect(() => {
    fetchItems();
  }, [config]);

  // [3] Función unificada para crear/editar
  const handleSubmit = async (data: Omit<Item, '_id'>) => {
    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/items/${editingItem._id}`, data);
        setNotification({message: 'Ítem actualizado!', type: 'success'});
      } else {
        await axios.post('http://localhost:5000/api/items', data);
        setNotification({message: 'Ítem creado!', type: 'success'});
      }
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      setNotification({message: 'Error guardando ítem', type: 'error'});
    }
  };

  // [4] Función para eliminar
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este ítem?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setNotification({message: 'Ítem eliminado!', type: 'success'});
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({message: 'Error eliminando ítem', type: 'error'});
    }
  };

  // [5] Cierra notificaciones automáticamente después de 3 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container mx-auto p-4">
      {/* [6] Notificación flotante */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white shadow-lg z-50`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">CRUD Universal</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setConfig(movieConfig)} 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
        >
          Modo Películas
        </button>
        <button 
          onClick={() => setConfig(musicConfig)} 
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
        >
          Modo Música
        </button>
      </div>

      {/* [7] Botón Cancelar visible solo al editar */}
      <div className="flex items-center gap-4 mb-6">
        <GenericForm 
          onSubmit={handleSubmit} 
          config={config} 
          initialData={editingItem || undefined}
        />
        {editingItem && (
          <button
            onClick={() => setEditingItem(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item._id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
            <h2 className="font-bold text-xl mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-3">{item.description}</p>
            
            {item.customFields && Object.entries(item.customFields).map(([key, value]) => (
              <p key={key} className="text-sm">
                <span className="font-semibold">{key}:</span> {String(value)}
              </p>
            ))}
            
            {/* [8] Botones de acción con estilos mejorados */}
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => setEditingItem(item)}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(item._id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}