import React, { useState } from 'react';
import { useTappi } from '../../services/tappiStore';
import { X, Star, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RatingModal: React.FC = () => {
  const { ratingModalOpen, activeRatingTrip, closeRatingModal, submitRating } = useTappi();
  const [score, setScore] = useState(5);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Manejo prudente', 'Puntualidad']);
  const [comment, setComment] = useState('');

  if (!ratingModalOpen) return null;

  const availableTags = [
    'Manejo prudente',
    'Puntualidad',
    'Vehículo limpio',
    'Aire acondicionado',
    'Amabilidad',
    'Ruta directa',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    submitRating(score, selectedTags, comment);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center"
        >
          <div className="w-full flex justify-end">
            <button
              onClick={closeRatingModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Driver Avatar */}
          <div className="relative mb-3">
            <img
              src={
                activeRatingTrip?.driverAvatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
              }
              alt="Driver"
              className="w-20 h-20 rounded-full object-cover border-4 border-violet-100 shadow-md"
            />
            <span className="absolute bottom-0 right-0 bg-[#4A3184] text-white p-1 rounded-full text-xs shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-[#AB2E81] text-[#AB2E81]" />
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            ¿Cómo estuvo tu viaje con {activeRatingTrip?.driverName?.split(' ')[0] || 'Carlos'}?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeRatingTrip?.vehicleModel || 'Mercedes-Benz Sprinter'} • {activeRatingTrip?.vehiclePlate || 'B8X-720'}
          </p>

          {/* 5 Stars */}
          <div className="flex items-center gap-2 my-4">
            {[1, 2, 3, 4, 5].map(starVal => {
              const active = (hoveredScore ?? score) >= starVal;
              return (
                <button
                  key={starVal}
                  type="button"
                  onMouseEnter={() => setHoveredScore(starVal)}
                  onMouseLeave={() => setHoveredScore(null)}
                  onClick={() => setScore(starVal)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      active ? 'text-[#F3A81A] fill-[#F3A81A]' : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Tag Badges */}
          <div className="w-full flex flex-wrap gap-1.5 justify-center mb-4">
            {availableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-[#4A3184] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Comment text area */}
          <textarea
            rows={2}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comentario opcional para el conductor..."
            className="w-full text-xs p-3 border border-slate-200 rounded-xl mb-4 focus:outline-hidden focus:ring-2 focus:ring-[#4A3184]"
          ></textarea>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#4A3184] hover:bg-[#3c256d] text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Enviar Calificación
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
