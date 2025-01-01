import { Languages, Subjects } from "teachtech/lib/types/evaluationTypes";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  question: Yup.string().required(
    "Inserisci la domanda per la quale verrebbe valutata la risposta."
  ),
  evaluationCriteria: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(
          "Inserisci il nome dei criteri di valutazione."
        ),
        description: Yup.string().required(
          "Inserisci la descrizione dei criteri di valutazione"
        ),
        weightage: Yup.number()
          .required("Inserire la ponderazione dei criteri di valutazione")
          .min(0, "Il peso deve essere maggiore di zero")
          .max(100, "Il peso non può superare i 100"),
      })
    )
    .test("weightage-validation", "", function (value) {
      if (!value || !Array.isArray(value)) return true;

      // Calculate total weightage
      const totalWeightage = value.reduce(
        (sum, criteria) => sum + (Number(criteria.weightage) || 0),
        0
      );

      // Check if all fields are filled
      const allFieldsFilled = value.every(
        (criteria) =>
          criteria.weightage !== undefined && criteria.weightage !== null
      );

      if (!allFieldsFilled) return true;

      if (totalWeightage !== 100) {
        const lastIndex = value.length - 1;
        return this.createError({
          path: `evaluationCriteria[${lastIndex}].weightage`,
          message:
            totalWeightage !== 100
              ? "La ponderazione di tutti i criteri deve essere pari a 100."
              : "",
        });
      }

      return true;
    }),
  totalScore: Yup.number().required("Inserisci il punteggio totale."),
  subject: Yup.mixed<Subjects>().oneOf(
    Object.values(Subjects),
    "L'oggetto inserito non è valido"
  ),
  language: Yup.mixed<Languages>().oneOf(
    Object.values(Languages),
    "La lingua inserita non è valida"
  ),
  images: Yup.array()
    .of(Yup.mixed().required("Ogni immagine deve essere valida"))
    .min(1, "Si prega di caricare almeno un'immagine."),
});
