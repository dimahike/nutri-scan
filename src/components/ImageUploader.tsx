import React, { useCallback, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  onImageUpload?: (files: File[], details: ImageDetails) => void;
  isLoading?: boolean;
}

interface ImageDetails {
  weight?: string;
  servingSize?: string;
  additionalNotes?: string;
}

const ImageUploader = ({
  onImageUpload = () => {},
  isLoading = false,
}: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [details, setDetails] = useState<ImageDetails>({
    weight: "",
    servingSize: "",
    additionalNotes: "",
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
      onImageUpload(acceptedFiles, details);
    },
    [onImageUpload, details],
  );

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

  return (
    <Card className="w-full max-w-[800px] bg-white p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
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
            <Button variant="secondary" className="mt-2" disabled={isLoading}>
              Browse Files
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              Supported formats: JPEG, PNG, WebP
            </p>
          </div>
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
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ImageUploader;
