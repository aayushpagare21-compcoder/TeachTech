import React from "react";
import { Field, FormikErrors } from "formik";
import { Input } from "teachtech/components/ui/input";
import { Button } from "teachtech/components/ui/button";
import { Label } from "teachtech/components/ui/label";
import { FieldError } from "teachtech/components/shared/FieldError";
import { Textarea } from "teachtech/components/ui/textarea";
import { Card, CardContent } from "teachtech/components/ui/card";
import { Badge } from "teachtech/components/ui/badge";
import { Trash2, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "teachtech/components/ui/tooltip";
import { cn } from "teachtech/lib/utils";
import { EvaluationCriteria } from "teachtech/lib/types/evaluationTypes";

export interface EvaluationCriteriaFieldProps {
  index: number;
  onRemove: () => void;
  isRemoveDisabled: boolean;
  errors: FormikErrors<EvaluationCriteria>;
}

export const EvaluationCriteriaField: React.FC<
  EvaluationCriteriaFieldProps
> = ({ index, onRemove, isRemoveDisabled, errors }) => (
  <Card
    className={cn(
      "transition-all duration-200 hover:shadow-md",
      errors && Object.keys(errors).length > 0 && "border-red-200",
    )}
  >
    <CardContent className="p-4 md:p-6">
      <div className="flex justify-between items-start mb-4">
        <Badge variant="outline" className="text-sm">
          Criteri {index + 1}
        </Badge>
        <Button
          onClick={onRemove}
          disabled={isRemoveDisabled}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm font-medium">Nome</Label>
            {index === 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">
                      {`ad esempio, "rilevanza per la domanda", "analisi critica", "supporto dell'evidenza"`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Field
            as={Input}
            name={`evaluationCriteria[${index}].name`}
            placeholder="e.g. Regno di Sicilia"
            className={cn(
              "w-full",
              errors?.name && "border-red-500 focus:border-red-500",
            )}
          />
          {errors?.name && <FieldError>{errors.name}</FieldError>}
        </div>

        <div className="md:col-span-6">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm font-medium">Descrizione</Label>
            {index === 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">
                      Fornisci una chiara descrizione di 50-60 parole di come
                      verrà valutato questo criterio
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Field
            as={Textarea}
            name={`evaluationCriteria[${index}].description`}
            placeholder="e.g. Regno di Sicilia deve essere discusso"
            className={cn(
              "resize-none h-24",
              errors?.description && "border-red-500 focus:border-red-500",
            )}
          />
          {errors?.description && <FieldError>{errors.description}</FieldError>}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm font-medium">Peso (%)</Label>
            {index === 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">
                      La somma dei pesi totali deve essere del 100%
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Field
            as={Input}
            type="number"
            name={`evaluationCriteria[${index}].weightage`}
            placeholder="0-100"
            max={100}
            min={1}
            className={cn(
              "w-full",
              errors?.weightage && "border-red-500 focus:border-red-500",
            )}
          />
          {errors?.weightage && <FieldError>{errors.weightage}</FieldError>}
        </div>
      </div>
    </CardContent>
  </Card>
);
