import React, { useCallback, useState } from "react";
import ResultsCard from "./ResultsCard";
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
import {
  Upload,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

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

const removeImage = (
  index: number,
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
  currentImageIndex: number,
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>,
) => {
  setPreviews((prev) => prev.filter((_, i) => i !== index));
  if (currentImageIndex >= index && currentImageIndex > 0) {
    setCurrentImageIndex(currentImageIndex - 1);
  }
};

const navigateImage = (
  direction: "prev" | "next",
  currentImageIndex: number,
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>,
  previewsLength: number,
) => {
  if (direction === "prev" && currentImageIndex > 0) {
    setCurrentImageIndex(currentImageIndex - 1);
  } else if (direction === "next" && currentImageIndex < previewsLength - 1) {
    setCurrentImageIndex(currentImageIndex + 1);
  }
};

const ManualEntryForm = ({
  onSubmit: externalOnSubmit = () => {},
  isLoading: externalIsLoading = false,
}: ManualEntryFormProps) => {
  const [showResults, setShowResults] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
        <form
          onSubmit={handleSubmit((data) => {
            setIsLoading(true);
            externalOnSubmit(data);

            const newProduct = {
              name: data.productName,
              imageUrl:
                data.image && data.image.length > 0
                  ? URL.createObjectURL(data.image[0])
                  : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
              isSafe: Number(data.potassium) < 400,
              nutritionalValues: [
                { name: "Calories", amount: data.calories, unit: "kcal" },
                { name: "Protein", amount: data.protein, unit: "g" },
                {
                  name: "Carbohydrates",
                  amount: data.carbohydrates,
                  unit: "g",
                },
                { name: "Fat", amount: data.fat, unit: "g" },
                {
                  name: "Potassium",
                  amount: data.potassium,
                  unit: "mg",
                  isRestricted: Number(data.potassium) >= 400,
                  warningMessage:
                    Number(data.potassium) >= 400
                      ? "High potassium content - Restricted for kidney transplant patients"
                      : undefined,
                },
                { name: "Sodium", amount: data.sodium, unit: "mg" },
              ],
              allergens: data.allergens || [],
            };

            setSubmittedData(newProduct);
            setShowResults(true);
            setIsLoading(false);
          })}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Manual Product Entry</h2>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Images</Label>
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
                      onClick={() =>
                        removeImage(
                          currentImageIndex,
                          setPreviews,
                          currentImageIndex,
                          setCurrentImageIndex,
                        )
                      }
                      className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-700" />
                    </button>
                    {/* Navigation Overlays */}
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      {currentImageIndex > 0 && (
                        <button
                          onClick={() =>
                            navigateImage(
                              "prev",
                              currentImageIndex,
                              setCurrentImageIndex,
                              previews.length,
                            )
                          }
                          className="p-1 bg-white/80 hover:bg-white rounded-full"
                        >
                          <ChevronLeft className="h-6 w-6 text-gray-700" />
                        </button>
                      )}
                      {currentImageIndex < previews.length - 1 && (
                        <button
                          onClick={() =>
                            navigateImage(
                              "next",
                              currentImageIndex,
                              setCurrentImageIndex,
                              previews.length,
                            )
                          }
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
                          onClick={() =>
                            removeImage(
                              index,
                              setPreviews,
                              currentImageIndex,
                              setCurrentImageIndex,
                            )
                          }
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
