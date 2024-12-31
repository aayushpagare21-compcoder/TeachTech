import { Field } from "formik";
import { Input } from "teachtech/components/ui/input";
import { Button } from "teachtech/components/ui/button";
import { Trash2 } from "lucide-react";

interface EvaluationCriteriaErrors {
  name?: string;
  description?: string;
  weightage?: string;
}

interface EvaluationCriteriaFieldProps {
  index: number;
  onRemove: () => void;
  isRemoveDisabled: boolean;
  errors: EvaluationCriteriaErrors;
}

export const EvaluationCriteriaField: React.FC<
  EvaluationCriteriaFieldProps
> = ({ index, onRemove, isRemoveDisabled, errors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <div>
      <Field
        as={Input}
        name={`evaluationCriteria[${index}].name`}
        placeholder="Name"
      />
      {errors?.name && (
        <div className="text-red-500 text-sm">{errors.name}</div>
      )}
    </div>

    <div>
      <Field
        as={Input}
        name={`evaluationCriteria[${index}].description`}
        placeholder="Description"
      />
      {errors?.description && (
        <div className="text-red-500 text-sm">{errors.description}</div>
      )}
    </div>

    <div>
      <Field
        as={Input}
        type="number"
        name={`evaluationCriteria[${index}].weightage`}
        placeholder="Weightage"
        max={100}
        min={1}
      />
      {errors?.weightage && (
        <div className="text-red-500 text-sm">{errors.weightage}</div>
      )}
    </div>

    <div className="flex items-start h-full">
      <Button
        onClick={onRemove}
        disabled={isRemoveDisabled}
        variant="destructive"
      >
        <Trash2 />
      </Button>
    </div>
  </div>
);
