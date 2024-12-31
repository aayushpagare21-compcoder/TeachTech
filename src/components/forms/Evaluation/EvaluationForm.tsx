"use client";
import React, { useState } from "react";
import { Formik, Form, FieldArray, Field, FormikHelpers } from "formik";
import { Input } from "teachtech/components/ui/input";
import { Button } from "teachtech/components/ui/button";
import { ImageUpload } from "teachtech/components/shared/ImageUpload";
import { EvaluationCriteriaField } from "./EvaluationCriteriaField";
import { validationSchema } from "teachtech/validations/forms/evaluateForm.validaton";
import {
  MAX_EVALUATION_CRITERIA_ALLOWED,
  subjectOptions,
  languageOptions,
  FormValues,
} from "teachtech/lib/types/evaluationTypes";

const EvaluationForm: React.FC = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File[]) => void,
    existingFiles: File[],
  ) => {
    const files = Array.from(e.target.files || []);
    const uniqueFiles = [...existingFiles, ...files].filter(
      (file, index, self) =>
        self.findIndex((f) => f.name === file.name && f.size === file.size) ===
        index,
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
    values: FormValues,
  ) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = values.images.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFieldValue("images", updatedFiles);
  };

  const initialValues: FormValues = {
    question: "",
    evaluationCriteria: [{ name: "", description: "", weightage: 0 }],
    totalScore: 0,
    subject: "",
    language: "",
    images: [],
  };

  const handleSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    console.log(values);
    resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg my-8">
      <h1 className="text-2xl font-bold mb-6 text-center">TeachTech</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          isSubmitting,
        }) => (
          <Form className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium">Question</label>
              <Field
                as={Input}
                name="question"
                placeholder="Enter your question here"
              />
              {errors.question && touched.question && (
                <div className="text-red-500 text-sm">{errors.question}</div>
              )}
            </div>

            <FieldArray name="evaluationCriteria">
              {({ remove, push }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Criteria
                  </label>
                  {values.evaluationCriteria.map((_, index) => (
                    <EvaluationCriteriaField
                      key={index}
                      index={index}
                      onRemove={() => remove(index)}
                      isRemoveDisabled={values.evaluationCriteria.length <= 1}
                      errors={
                        typeof errors.evaluationCriteria?.[index] === "object"
                          ? errors.evaluationCriteria[index]
                          : {}
                      }
                    />
                  ))}
                  <Button
                    variant="default"
                    onClick={() =>
                      push({ name: "", description: "", weightage: 0 })
                    }
                    disabled={
                      values.evaluationCriteria.length >=
                      MAX_EVALUATION_CRITERIA_ALLOWED
                    }
                  >
                    Add Criteria
                  </Button>
                  {values.evaluationCriteria.length >=
                    MAX_EVALUATION_CRITERIA_ALLOWED && (
                    <div className="text-red-500">
                      Only {MAX_EVALUATION_CRITERIA_ALLOWED} evaluation criteria
                      are allowed at this moment.
                    </div>
                  )}
                </div>
              )}
            </FieldArray>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Total Score</label>
                <Field
                  as={Input}
                  type="number"
                  name="totalScore"
                  placeholder="Total Score"
                />
                {errors.totalScore && touched.totalScore && (
                  <div className="text-red-500 text-sm">
                    {errors.totalScore}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium">Subject</label>
                <Field
                  as="select"
                  name="subject"
                  className="block w-full border border-gray-300 p-2 rounded-md"
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </Field>
                {errors.subject && touched.subject && (
                  <div className="text-red-500 text-sm">{errors.subject}</div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium">Language</label>
                <Field
                  as="select"
                  name="language"
                  className="block w-full border border-gray-300 rounded-md p-2"
                >
                  {languageOptions.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </Field>
                {errors.language && touched.language && (
                  <div className="text-red-500 text-sm">{errors.language}</div>
                )}
              </div>
            </div>

            <ImageUpload
              imagePreviews={imagePreviews}
              onImageUpload={(e) =>
                handleImageUpload(e, setFieldValue, values.images)
              }
              onRemoveImage={(index) =>
                handleRemoveImage(index, setFieldValue, values)
              }
            />
            {errors.images &&
              Array.isArray(errors.images) &&
              errors.images.map((error, index) => (
                <div key={index} className="text-red-500 text-sm">
                  {error as string}
                </div>
              ))}
            <div className="w-full flex justify-center">
              <Button
                type="submit"
                className="w-[200px]"
                disabled={!isValid || isSubmitting}
              >
                Evaluate
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EvaluationForm;
