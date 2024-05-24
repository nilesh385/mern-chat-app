import { useEffect, useState } from "react";

const useImageToBase64 = (
  inputElementRef: React.RefObject<HTMLInputElement>
) => {
  const [base64String, setBase64String] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<File | null>(null);

  useEffect(() => {
    if (!inputElementRef.current) return;

    const handleFileRead = (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string;
      setBase64String(content);
    };

    const handleFileSelection = () => {
      if (
        !inputElementRef.current ||
        !inputElementRef.current.files ||
        !inputElementRef.current.files.length
      ) {
        return;
      }

      const file = inputElementRef.current.files[0];
      setImgUrl(file);

      if (file && file instanceof Blob) {
        const reader = new FileReader();
        reader.addEventListener("load", handleFileRead);
        reader.readAsDataURL(file);
      } else {
        console.error("Selected file is not a valid Blob object");
      }
    };

    inputElementRef.current.addEventListener("change", handleFileSelection);

    return () => {
      inputElementRef.current?.removeEventListener(
        "change",
        handleFileSelection
      );
    };
  }, [inputElementRef]);

  return { base64String, setBase64String, imgUrl, setImgUrl };
};

export default useImageToBase64;

// hooks/useImageToBase64.tsx
/*import { useState, useRef, useCallback } from "react";

interface UseImageToBase64Return {
  base64String: string | null;
  resetSelection: () => void;
}

const useImageToBase64 = (): UseImageToBase64Return => {
  const [base64String, setBase64String] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setBase64String(reader.result);
          }
        };
        reader.onerror = () => {
          console.error("Error reading file:", reader.error);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const resetSelection = useCallback(() => {
    setBase64String(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return { base64String, resetSelection };
};

export default useImageToBase64; */
