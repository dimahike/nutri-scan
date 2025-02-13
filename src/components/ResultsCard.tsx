import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import NutritionalInfo from "./NutritionalInfo";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Product {
  name: string;
  imageUrl: string;
  isSafe: boolean;
  nutritionalValues?: Array<{
    name: string;
    amount: string;
    unit: string;
    isRestricted?: boolean;
    warningMessage?: string;
  }>;
  allergens?: string[];
}

interface ResultsCardProps {
  product?: Product;
}

const defaultProduct: Product = {
  name: "Sample Food Product",
  imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
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

const ResultsCard = ({ product = defaultProduct }: ResultsCardProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image and Basic Info */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Badge
                className={`absolute top-4 right-4 ${product.isSafe ? "bg-green-500" : "bg-red-500"}`}
              >
                {product.isSafe ? "Safe to Consume" : "Review Restrictions"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{product.name}</h2>

              <Alert variant={product.isSafe ? "success" : "destructive"}>
                {product.isSafe ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {product.isSafe ? "Safe for Consumption" : "Review Required"}
                </AlertTitle>
                <AlertDescription>
                  {product.isSafe
                    ? "This product meets your dietary requirements."
                    : "Please review the nutritional information carefully."}
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Nutritional Information */}
          <div className="space-y-4">
            <NutritionalInfo
              nutritionalValues={product.nutritionalValues}
              allergensPresent={product.allergens}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsCard;
