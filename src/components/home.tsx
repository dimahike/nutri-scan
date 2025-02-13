import React, { useState } from "react";
import FoodRecognizer from "./FoodRecognizer";
import ResultsCard from "./ResultsCard";
import ManualEntryForm from "./ManualEntryForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Plus } from "lucide-react";

interface Product {
  name: string;
  imageUrl: string;
  isSafe: boolean;
  nutritionalValues: Array<{
    name: string;
    amount: string;
    unit: string;
    isRestricted?: boolean;
    warningMessage?: string;
  }>;
  allergens: string[];
}

interface HomeProps {
  initialTab?: string;
}

const Home = ({ initialTab = "upload" }: HomeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [recognizedProduct, setRecognizedProduct] = useState<Product | null>(
    null,
  );
  const [foodList, setFoodList] = useState<Product[]>([]);

  const handleImageUpload = async (
    files: File[],
    details: {
      weight?: string;
      servingSize?: string;
      additionalNotes?: string;
    },
  ) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const product = {
        name: "Sample Food Product",
        imageUrl: URL.createObjectURL(files[0]),
        isSafe: false,
        nutritionalValues: [
          { name: "Calories", amount: "250", unit: "kcal" },
          { name: "Protein", amount: "12", unit: "g" },
          {
            name: "Potassium",
            amount: "450",
            unit: "mg",
            isRestricted: true,
            warningMessage:
              "High potassium content - Restricted for kidney transplant patients",
          },
        ],
        allergens: ["Nuts", "Dairy"],
      };
      setRecognizedProduct(product);
      setFoodList((prev) => [...prev, product]);
      setShowForm(false);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Food Product Recognition
          </h1>
          <p className="text-gray-600">
            Upload a food product image or manually enter details to get
            nutritional information
          </p>
        </div>

        <div className="space-y-6">
          {!showForm && (
            <div className="flex justify-end">
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Food
              </Button>
            </div>
          )}

          {showForm ? (
            <Card className="p-6">
              <Tabs defaultValue={initialTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Food Recognition</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  <div className="flex flex-col items-center space-y-6">
                    <FoodRecognizer
                      onImageUpload={handleImageUpload}
                      isLoading={isLoading}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="manual">
                  <ManualEntryForm
                    onSubmit={(data) => {
                      const newProduct: Product = {
                        name: data.productName,
                        imageUrl:
                          data.image && data.image.length > 0
                            ? URL.createObjectURL(data.image[0])
                            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                        isSafe: Number(data.potassium) < 400,
                        nutritionalValues: [
                          {
                            name: "Calories",
                            amount: data.calories,
                            unit: "kcal",
                          },
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
                      setFoodList((prev) => [...prev, newProduct]);
                      setShowForm(false);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            recognizedProduct && <ResultsCard product={recognizedProduct} />
          )}

          {foodList.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Added Foods</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Allergens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodList.map((food, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{food.name}</TableCell>
                      <TableCell>
                        {food.nutritionalValues.find(
                          (n) => n.name === "Calories",
                        )?.amount || "0"}{" "}
                        kcal
                      </TableCell>
                      <TableCell>
                        {food.nutritionalValues.find(
                          (n) => n.name === "Protein",
                        )?.amount || "0"}{" "}
                        g
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${food.isSafe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {food.isSafe ? "Safe" : "Review"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {food.allergens.join(", ") || "None"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
