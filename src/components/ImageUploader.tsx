import React, { useCallback, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  isLoading?: boolean;
}

const ImageUploader = ({
  onImageUpload = () => {},
  isLoading = false,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);
      }
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
  });

  return (
    <Card className="w-full max-w-[600px] h-[400px] bg-white p-6">
      <div
        {...getRootProps()}
        className={`h-full w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400"}`}
      >
        <input {...getInputProps()} disabled={isLoading} />

        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="text-center">
            {isDragActive ? (
              <Upload className="mx-auto h-12 w-12 text-blue-500" />
            ) : (
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {isDragActive ? "Drop the image here" : "Drag & Drop your image"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">or</p>
            <Button variant="secondary" className="mt-2" disabled={isLoading}>
              Browse Files
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              Supported formats: JPEG, PNG, WebP
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageUploader;
