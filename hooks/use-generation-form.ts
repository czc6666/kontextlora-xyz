import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateSchema } from "@/lib/schemas";
import { generateImageAction } from "@/app/image-generator/actions";
import type { HistoryItem } from "@/components/features/history-item-type";

interface UseGenerationFormProps {
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGenerationForm({ setHistory, setIsPending }: UseGenerationFormProps) {
  const form = useForm<z.infer<typeof generateSchema>>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      model: "Kwai-Kolors/Kolors",
      prompt: "",
      width: 1024,
      height: 1024,
      steps: 20,
      cfg: 4.5,
      num_images: 1,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);

    const newHistoryId = Date.now();
    const newHistoryItem: HistoryItem = {
      id: newHistoryId,
      status: 'loading',
      message: "",
      errors: null,
      imageUrls: [],
      inputs: data,
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    try {
      const generatedUrls: string[] = [];
      const numImages = data.num_images || 1;

      for (let i = 0; i < numImages; i++) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        
        const result = await generateImageAction(null, formData);
        
        if (result.errors || !result.imageUrl) {
          setHistory(prev => prev.map(item => 
            item.id === newHistoryId 
            ? { ...item, status: 'error', errors: result.errors, message: result.message || "生成失败" } 
            : item
          ));
          // Stop if one image fails
          return;
        }
        
        generatedUrls.push(result.imageUrl);
        
        setHistory(prev => prev.map(item => 
          item.id === newHistoryId 
          ? { ...item, imageUrls: [...generatedUrls] } 
          : item
        ));
      }

      setHistory(prev => prev.map(item => 
        item.id === newHistoryId 
        ? { ...item, status: 'success' } 
        : item
      ));

    } catch (error) {
      console.error("图片生成流程失败:", error);
       setHistory(prev => prev.map(item => 
        item.id === newHistoryId 
        ? { ...item, status: 'error', message: "An unexpected error occurred." } 
        : item
      ));
    } finally {
      setIsPending(false);
    }
  });

  return { form, onSubmit };
} 