import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImagePlus } from "lucide-react";

interface FormData {
  productName: string;
  description: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  potassium: string;
  sodium: string;
  allergens: string[];
  image: File[];
}

interface ManualEntryFormProps {
  onSubmit?: (data: FormData) => void;
  isLoading?: boolean;
}

const commonAllergens = [
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Tree nuts",
  "Peanuts",
  "Wheat",
  "Soy",
];

const ManualEntryForm = ({
  onSubmit = (data) => console.log(data),
  isLoading = false,
}: ManualEntryFormProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      allergens: [],
      productName: "",
      description: "",
      calories: "0",
      protein: "0",
      carbohydrates: "0",
      fat: "0",
      potassium: "0",
      sodium: "0",
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
      setValue("image", acceptedFiles);
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  return (
    <div className="w-full max-w-2xl p-6 bg-white">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Manual Product Entry</h2>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Images</Label>
              <div
                {...getRootProps()}
                className={`h-[200px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 transition-colors
                  ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                  ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400"}`}
              >
                <input {...getInputProps()} disabled={isLoading} />
                <div className="text-center">
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
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
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
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
            </div>

            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                {...register("productName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                {...register("description")}
              />
            </div>

            {/* Nutritional Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  {...register("calories")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="0"
                  {...register("protein")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbohydrates">Carbohydrates (g)</Label>
                <Input
                  id="carbohydrates"
                  type="number"
                  placeholder="0"
                  {...register("carbohydrates")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="0"
                  {...register("fat")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium">Potassium (mg)</Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="0"
                  {...register("potassium")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sodium">Sodium (mg)</Label>
                <Input
                  id="sodium"
                  type="number"
                  placeholder="0"
                  {...register("sodium")}
                />
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <Label>Allergens</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonAllergens.map((allergen) => (
                  <div key={allergen} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergen}
                      onCheckedChange={(checked) => {
                        const currentAllergens =
                          register("allergens").value || [];
                        if (checked) {
                          setValue("allergens", [
                            ...currentAllergens,
                            allergen,
                          ]);
                        } else {
                          setValue(
                            "allergens",
                            currentAllergens.filter(
                              (a: string) => a !== allergen,
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={allergen}>{allergen}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Food"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ManualEntryForm;
