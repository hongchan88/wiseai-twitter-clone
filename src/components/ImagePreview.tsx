'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewProps {
  images: string[];
  onRemove: (index: number) => void;
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {images.map((image, index) => (
        <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200">
          <div className="relative h-48">
            <Image
              src={image}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}