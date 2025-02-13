import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import ResultsCard from "./ResultsCard";
import ManualEntryForm from "./ManualEntryForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";

interface HomeProps {
  initialTab?: string;
}

const Home = ({ initialTab = "upload" }: HomeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedProduct, setRecognizedProduct] = useState<{
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
  } | null>(null);

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
      setRecognizedProduct({
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
      });
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

        <Card className="p-6">
          <Tabs defaultValue={initialTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload">Image Upload</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="flex flex-col items-center space-y-6">
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  isLoading={isLoading}
                />
                {recognizedProduct && (
                  <ResultsCard product={recognizedProduct} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <ManualEntryForm
                onSubmit={(data) => {
                  console.log("Manual entry data:", data);
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Home;
