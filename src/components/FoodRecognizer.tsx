import React, { useCallback, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Upload,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

interface FoodRecognizerProps {
  onImageUpload?: (files: File[], details: ImageDetails) => void;
  isLoading?: boolean;
  onRecognize?: () => void;
}

interface ImageDetails {
  weight?: string;
  servingSize?: string;
  additionalNotes?: string;
}

const FoodRecognizer = ({
  onImageUpload = () => {},
  isLoading = false,
}: FoodRecognizerProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [details, setDetails] = useState<ImageDetails>({
    weight: "",
    servingSize: "",
    additionalNotes: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev" && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (
      direction === "next" &&
      currentImageIndex < previews.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <Card className="w-full max-w-[800px] bg-white p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          {previews.length > 0 ? (
            <div className="space-y-4">
              {/* Main Preview */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previews[currentImageIndex]}
                  alt={`Preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(currentImageIndex)}
                  className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full"
                >
                  <X className="h-4 w-4 text-gray-700" />
                </button>
                {/* Navigation Overlays */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  {currentImageIndex > 0 && (
                    <button
                      onClick={() => navigateImage("prev")}
                      className="p-1 bg-white/80 hover:bg-white rounded-full"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                  )}
                  {currentImageIndex < previews.length - 1 && (
                    <button
                      onClick={() => navigateImage("next")}
                      className="p-1 bg-white/80 hover:bg-white rounded-full"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden ${index === currentImageIndex ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <img
                      src={preview}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setCurrentImageIndex(index)}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-white/80 hover:bg-white rounded-full"
                    >
                      <X className="h-3 w-3 text-gray-700" />
                    </button>
                  </div>
                ))}
                <div
                  {...getRootProps()}
                  className="w-16 h-16 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400"
                >
                  <input {...getInputProps()} disabled={isLoading} />
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`h-[300px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 transition-colors
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400"}`}
            >
              <input {...getInputProps()} disabled={isLoading} />
              <div className="text-center">
                {isDragActive ? (
                  <Upload className="mx-auto h-12 w-12 text-blue-500" />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {isDragActive
                    ? "Drop the images here"
                    : "Drag & Drop your images"}
                </h3>
                <p className="mt-2 text-sm text-gray-500">or</p>
                <Button
                  variant="secondary"
                  className="mt-2"
                  disabled={isLoading}
                >
                  Browse Files
                </Button>
                <p className="mt-4 text-xs text-gray-500">
                  Supported formats: JPEG, PNG, WebP
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="weight">Product Weight</Label>
            <Input
              id="weight"
              name="weight"
              placeholder="e.g. 100g"
              value={details.weight}
              onChange={handleDetailsChange}
            />
          </div>

          <div>
            <Label htmlFor="servingSize">Serving Size</Label>
            <Input
              id="servingSize"
              name="servingSize"
              placeholder="e.g. 1 cup, 30g"
              value={details.servingSize}
              onChange={handleDetailsChange}
            />
          </div>

          <div>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Any additional details about the product..."
              value={details.additionalNotes}
              onChange={handleDetailsChange}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => onImageUpload?.(uploadedFiles, details)}
              disabled={isLoading || previews.length === 0}
              className="w-40"
            >
              {isLoading ? (
                <span>Recognizing...</span>
              ) : (
                <span>Recognize Food</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FoodRecognizer;
