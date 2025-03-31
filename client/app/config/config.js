// Configuración para películas
export const movieConfig = {
  category: 'movies',
  fields: {
    rating: { type: 'number', label: '⭐ Rating', min: 0, max: 5 },
    director: { type: 'text', label: '🎬 Director' }
  }
};

// Configuración para música
export const musicConfig = {
  category: 'music',
  fields: {
    artist: { type: 'text', label: '🎵 Artista' },
    duration: { type: 'text', label: '⏱ Duración' }
  }
};

