import React from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

interface NutritionalValue {
  name: string;
  amount: string;
  unit: string;
  isRestricted?: boolean;
  warningMessage?: string;
}

interface NutritionalInfoProps {
  nutritionalValues?: NutritionalValue[];
  allergensPresent?: string[];
}

const defaultNutritionalValues: NutritionalValue[] = [
  { name: "Calories", amount: "250", unit: "kcal" },
  { name: "Protein", amount: "12", unit: "g" },
  { name: "Carbohydrates", amount: "30", unit: "g" },
  { name: "Fat", amount: "8", unit: "g" },
  {
    name: "Potassium",
    amount: "450",
    unit: "mg",
    isRestricted: true,
    warningMessage:
      "High potassium content - Restricted for kidney transplant patients",
  },
  { name: "Sodium", amount: "400", unit: "mg" },
];

const defaultAllergens = ["Nuts", "Dairy"];

const NutritionalInfo = ({
  nutritionalValues = defaultNutritionalValues,
  allergensPresent = defaultAllergens,
}: NutritionalInfoProps) => {
  const restrictedItems = nutritionalValues.filter((item) => item.isRestricted);

  return (
    <div className="w-full max-w-2xl p-4 space-y-4 bg-white">
      {restrictedItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dietary Restrictions Detected</AlertTitle>
          <AlertDescription>
            This food contains items that may be restricted for your diet.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Nutritional Information</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nutrient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nutritionalValues.map((item, index) => (
              <TableRow
                key={index}
                className={item.isRestricted ? "bg-red-50" : ""}
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {allergensPresent.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Allergen Information</h3>
          <div className="flex flex-wrap gap-2">
            {allergensPresent.map((allergen, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm"
              >
                {allergen}
              </span>
            ))}
          </div>
        </Card>
      )}

      {restrictedItems.map(
        (item, index) =>
          item.warningMessage && (
            <Alert key={index} variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{item.warningMessage}</AlertDescription>
            </Alert>
          ),
      )}
    </div>
  );
};

export default NutritionalInfo;
