import { FormState } from "@/lib/utils/system";

interface FormFieldErrorMessageProps<T, K extends keyof T> {
  formState: FormState<T>;
  fieldName: K;
}

export default function FormFieldErrorMessage<T, K extends keyof T>({
  formState,
  fieldName,
}: FormFieldErrorMessageProps<T, K>) {
  const fieldErrors = formState?.errors?.[fieldName];

  return (
    <>
      {fieldErrors && fieldErrors.length && (
        <p className="error text-red-900 mt-2">{fieldErrors[0]}</p>
      )}
    </>
  );
}
