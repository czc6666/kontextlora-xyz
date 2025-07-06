"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

type RestoreResultPanelProps = {
  imageUrl: string | null;
};

export default function RestoreResultPanel({ imageUrl }: RestoreResultPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Photo Restore Image Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          {imageUrl ? (
            <Image src={imageUrl} alt="Restored image" width={512} height={512} className="object-contain rounded-md" />
          ) : (
            <p className="text-muted-foreground">The restored image results will appear here.</p>
          )}
        </div>
        <Button 
          className="w-full mt-4" 
          variant="outline" 
          disabled={!imageUrl}
          asChild
        >
          <a href={imageUrl || ""} download="restored-image.png">
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardContent>
    </Card>
  );
} 