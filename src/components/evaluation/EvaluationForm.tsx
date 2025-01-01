"use client";
import React, { useState } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import { Input } from "teachtech/components/ui/input";
import { Button } from "teachtech/components/ui/button";
import { ImageUpload } from "teachtech/components/shared/ImageUpload";
import { EvaluationCriteriaField } from "teachtech/components/evaluation/EvaluationCriteriaField";
import { validationSchema } from "teachtech/validations/forms/evaluateForm.validaton";
import {
  MAX_EVALUATION_CRITERIA_ALLOWED,
  subjectOptions,
  languageOptions,
  FormValues,
  Languages,
  Subjects,
  EvaluationCriteria,
} from "teachtech/lib/types/evaluationTypes";
import { sumBy } from "lodash";
import { Textarea } from "teachtech/components/ui/textarea";
import { Label } from "teachtech/components/ui/label";
import { FieldError } from "teachtech/components/shared/FieldError";
import { PlusIcon, Loader2 } from "lucide-react";
import { useAsyncFn } from "react-use";
import EvaluationResults from "./EvaluationResults";
import { ErrorState, LoadingState } from "./LoadingAndErrorState";
import { Card, CardContent } from "teachtech/components/ui/card";
import { Separator } from "teachtech/components/ui/separator";
async function evaluateQuestion(formdata: FormValues) {
  const formData = new FormData();
  formData.append("question", formdata.question);
  formData.append("totalScore", formdata.totalScore.toString());
  formData.append("subject", formdata.subject);
  formData.append("language", formdata.language);
  formData.append(
    "evaluationCriteria",
    JSON.stringify(formdata.evaluationCriteria)
  );
  formdata.images.forEach((image, index) => {
    formData.append(`${index}-image`, image);
  });

  const data = await fetch("/api/evaluate", {
    method: "POST",
    body: formData,
  });

  const res = await data.json();
  return res.result;
}

const EvaluationForm: React.FC = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [{ loading, error, value }, makeRequest] = useAsyncFn(evaluateQuestion);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File[]) => void,
    existingFiles: File[]
  ) => {
    const files = Array.from(e.target.files || []);
    const uniqueFiles = [...existingFiles, ...files].filter(
      (file, index, self) =>
        self.findIndex((f) => f.name === file.name && f.size === file.size) ===
        index
    );
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setFieldValue("images", uniqueFiles);
  };

  const handleRemoveImage = (
    index: number,
    setFieldValue: (field: string, value: File[]) => void,
    values: FormValues
  ) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = values.images.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFieldValue("images", updatedFiles);
  };

  const initialValues: FormValues = {
    question: "",
    evaluationCriteria: [
      {
        name: "Description one",
        description: "Sample Description one",
        weightage: 20,
      },
    ],
    totalScore: 0,
    subject: Subjects.ESSAY,
    language: Languages.ITALIAN,
    images: [],
  };
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-lg my-4 md:my-8">
      <h1 className="text-[3rem] mb-4 md:mb-8 text-center">TeachTech</h1>
      {loading && <LoadingState />}

      {error && <ErrorState error={error} />}

      {!loading && !error && !value && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={makeRequest}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            isSubmitting,
          }) => (
            <Form className="flex flex-col gap-4 md:gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">
                        Question
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Write your question clearly and concisely
                      </p>
                      <Field
                        as={Textarea}
                        name="question"
                        placeholder="e.g., Write a 250-word essay on The Effects of Global Warming"
                        className="min-h-[120px]"
                      />
                      {errors.question && touched.question && (
                        <FieldError>{errors.question}</FieldError>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-base font-semibold">
                          Total Score
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Maximum possible score
                        </p>
                        <Field
                          as={Input}
                          type="number"
                          name="totalScore"
                          placeholder="Enter total score"
                        />
                        {errors.totalScore && touched.totalScore && (
                          <FieldError>{errors.totalScore}</FieldError>
                        )}
                      </div>

                      <div>
                        <Label className="text-base font-semibold">
                          Subject
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Choose the relevant subject
                        </p>
                        <Field
                          as="select"
                          name="subject"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          {subjectOptions.map((subject) => (
                            <option key={subject.value} value={subject.value}>
                              {subject.label}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">
                          Language
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Select answer language
                        </p>
                        <Field
                          as="select"
                          name="language"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          {languageOptions.map((language) => (
                            <option key={language.value} value={language.value}>
                              {language.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-md font-bold md:-mb-4 ml-2">
                Evaluation Criteria (Add five or less criteria)
              </div>
              <FieldArray name="evaluationCriteria">
                {({ remove, push }) => (
                  <div className="space-y-4">
                    {values.evaluationCriteria.map((_, index) => (
                      <div key={index}>
                        <EvaluationCriteriaField
                          index={index}
                          onRemove={() => remove(index)}
                          isRemoveDisabled={
                            values.evaluationCriteria.length <= 1
                          }
                          errors={
                            typeof errors.evaluationCriteria?.[index] ===
                            "object"
                              ? errors.evaluationCriteria[index]
                              : {}
                          }
                        />
                      </div>
                    ))}
                    <div className="w-full flex justify-end">
                      <Button
                        type="button"
                        onClick={() =>
                          push({ name: "", description: "", weightage: 0 })
                        }
                        disabled={
                          values.evaluationCriteria.length ===
                            MAX_EVALUATION_CRITERIA_ALLOWED ||
                          sumBy(
                            values.evaluationCriteria,
                            (s: EvaluationCriteria) => s.weightage
                          ) >= 100
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {values.evaluationCriteria.length >=
                      MAX_EVALUATION_CRITERIA_ALLOWED && (
                      <div className="text-red-500 text-right">
                        Only {MAX_EVALUATION_CRITERIA_ALLOWED} evaluation
                        criteria are allowed.
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>

              <div className="flex justify-center md:justify-start">
                <ImageUpload
                  imagePreviews={imagePreviews}
                  onImageUpload={(e) =>
                    handleImageUpload(e, setFieldValue, values.images)
                  }
                  onRemoveImage={(index) =>
                    handleRemoveImage(index, setFieldValue, values)
                  }
                />
              </div>
              <hr />
              <div className="w-full flex justify-center pt-4">
                <Button
                  type="submit"
                  className="w-[200px] px-4 py-6"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Evaluate Question
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {value && (
        <div>
          <EvaluationResults value={value} />
        </div>
      )}
    </div>
  );
};

export default EvaluationForm;
