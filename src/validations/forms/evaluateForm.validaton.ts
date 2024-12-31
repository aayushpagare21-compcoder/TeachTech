import { Languages, Subjects } from "teachtech/lib/types/evaluationTypes";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  question: Yup.string().required(
    "Please enter the question for which answer would be evaluated.",
  ),
  evaluationCriteria: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(
          "Please enter the name of the evaluation criteria.",
        ),
        description: Yup.string().required(
          "Please enter the description of the evaluation criteria",
        ),
        weightage: Yup.number()
          .required("Please enter the weightage of the evaluation criteria")
          .min(0, "Weightage must be greater than zero")
          .max(100, "Weightage cannot exceed 100"),
      }),
    )
    .test("weightage-validation", "", function (value) {
      if (!value || !Array.isArray(value)) return true;

      // Calculate total weightage
      const totalWeightage = value.reduce(
        (sum, criteria) => sum + (Number(criteria.weightage) || 0),
        0,
      );

      // Check if all fields are filled
      const allFieldsFilled = value.every(
        (criteria) =>
          criteria.weightage !== undefined && criteria.weightage !== null,
      );

      if (!allFieldsFilled) return true;

      if (totalWeightage !== 100) {
        const lastIndex = value.length - 1;
        return this.createError({
          path: `evaluationCriteria[${lastIndex}].weightage`,
          message:
            totalWeightage !== 100
              ? "Weightage of all the criteria must sum up to 100."
              : "",
        });
      }

      return true;
    }),
  totalScore: Yup.number().required("Please enter the total score."),
  subject: Yup.mixed<Subjects>().oneOf(
    Object.values(Subjects),
    "The entered subject is not valid",
  ),
  language: Yup.mixed<Languages>().oneOf(
    Object.values(Languages),
    "The entered language is not valid",
  ),
  images: Yup.array()
    .of(Yup.mixed().required("Each image must be valid"))
    .min(1, "Please upload at least one image."),
});
