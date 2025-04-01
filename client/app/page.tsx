'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { movieConfig } from '@/config/config'
import GenericForm from '../components/GenericForm'

type Item = {
  _id: string
  name: string
  description: string
  category: string
  customFields: {
    rating: number
    director: string
    [key: string]: any
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [config] = useState(movieConfig)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items?category=movies")
      setItems(res.data)
    } catch (error) {
      console.error('Error:', error)
      showNotification('Error cargando películas', 'error')
    }
  }

  const handleSubmit = async (data: Omit<Item, '_id'>) => {
    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/items/${editingItem._id}`, data)
        showNotification('Película actualizada!', 'success')
      } else {
        await axios.post('http://localhost:5000/api/items', data)
        showNotification('Película creada!', 'success')
      }
      fetchItems()
      setEditingItem(null)
    } catch (error) {
      console.error('Error:', error)
      showNotification('Error guardando película', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta película?')) return
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`)
      showNotification('Película eliminada!', 'success')
      fetchItems()
    } catch (error) {
      console.error('Error:', error)
      showNotification('Error eliminando película', 'error')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white shadow-lg z-50`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Administrador de Películas</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingItem ? 'Editar Película' : 'Agregar Nueva Película'}
        </h2>
        <GenericForm 
          onSubmit={handleSubmit} 
          config={config} 
          initialData={editingItem || undefined}
        />
        {editingItem && (
          <button
            onClick={() => setEditingItem(null)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-3">{item.description}</p>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Calificación: </span>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star} 
                      className={`text-xl ${
                        star <= Math.round(item.customFields.rating) ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2">({item.customFields.rating}/5)</span>
                </div>
              </div>

              <p className="text-sm">
                <span className="font-medium">Director: </span>
                <span>{item.customFields.director}</span>
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditingItem(item)}
                className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="flex-1 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
