import { FormState } from "@/lib/utils/system";

interface FormErrorMessageProps<T> {
  formState: FormState<T>;
}

export default function FormErrorMessage<T>({
  formState,
}: FormErrorMessageProps<T>) {
  return (
    <>
      {formState?.message && (
        <p className="error text-red-900 mt-2">{formState.message}</p>
      )}
    </>
  );
}
