'use client';
import { useState } from 'react';

export default function GenericForm({ onSubmit, config, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || config.category,
    ...initialData.customFields
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, category, ...customFields } = formData;
    onSubmit({ name, description, category, customFields });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full p-2 border rounded"
      />
      
      {Object.entries(config.fields).map(([fieldName, field]) => (
        <div key={fieldName}>
          <label className="block text-sm font-medium">{field.label}</label>
          <input
            type={field.type}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
}