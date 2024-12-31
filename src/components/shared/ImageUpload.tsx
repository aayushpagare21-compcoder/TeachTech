import React from "react";
import Image from "next/image";
import { Button } from "teachtech/components/ui/button";
import { Input } from "teachtech/components/ui/input";
import { Trash2, Upload } from "lucide-react";

interface ImageUploadProps {
  imagePreviews: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}
export const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreviews,
  onImageUpload,
  onRemoveImage,
}) => (
  <div className="flex flex-col items-center md:items-start ml-2">
    <label
      htmlFor="imageUpload"
      className="flex items-center justify-center gap-2 w-[200px] h-[40px] p-2 text-sm font-medium text-white bg-black rounded-md cursor-pointer hover:bg-black/80"
    >
      <Upload size={18} /> Upload Images
    </label>
    <Input
      id="imageUpload"
      type="file"
      accept="image/*"
      multiple
      className="hidden"
      onChange={onImageUpload}
    />
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {imagePreviews.map((src, index) => (
        <div
          key={index}
          className="relative w-32 h-32 overflow-hidden rounded-md shadow-sm border border-gray-300"
        >
          <Image
            src={src}
            alt="Preview"
            className="w-full h-full object-cover"
            width={128}
            height={128}
          />
          <Button
            className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 hover:bg-red-100"
            onClick={() => onRemoveImage(index)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  </div>
);
