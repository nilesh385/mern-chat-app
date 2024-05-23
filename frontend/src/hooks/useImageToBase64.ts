// hooks/useImageToBase64.ts
import { useEffect, useState } from "react";

const useImageToBase64 = (
  inputElementRef: React.RefObject<HTMLInputElement>
) => {
  const [base64String, setBase64String] = useState<string | null>(null);

  useEffect(() => {
    if (!inputElementRef.current) return;

    const handleFileRead = (event: ProgressEvent<FileReader>) => {
      const content = event.target.result as string;
      setBase64String(content);
    };

    const fileInput = inputElementRef.current;
    if (fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", handleFileRead);
    reader.readAsDataURL(file);

    return () => {
      reader.removeEventListener("load", handleFileRead);
    };
  }, [inputElementRef]);

  return { base64String };
};

export default useImageToBase64;
