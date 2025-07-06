import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateSchema } from "@/lib/schemas";

export function useGenerationForm() {
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

  return form;
} 