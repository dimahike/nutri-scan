import React from "react";
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
  image: FileList;
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
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <div className="w-full max-w-2xl p-6 bg-white">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Manual Product Entry</h2>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                />
                <label htmlFor="image" className="cursor-pointer">
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                </label>
              </div>
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
                    <Checkbox id={allergen} {...register("allergens")} />
                    <Label htmlFor={allergen}>{allergen}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ManualEntryForm;
