"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full" size="lg">
      {isPending ? "正在生成..." : "生成图像"}
    </Button>
  );
}

type ErrorState = {
  [key: string]: string[] | undefined;
} | null;

export function GenerationSidebar({ 
  lastInputs, 
  isPending,
  errors 
}: { 
  lastInputs: any, 
  isPending: boolean,
  errors: ErrorState
}) {
  const [prompt, setPrompt] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(25);
  const [cfg, setCfg] = useState(7.5);

  useEffect(() => {
    if (lastInputs) {
      setPrompt(lastInputs.prompt || "");
      setWidth(Number(lastInputs.width) || 1024);
      setHeight(Number(lastInputs.height) || 1024);
      setSteps(Number(lastInputs.steps) || 25);
      setCfg(Number(lastInputs.cfg) || 7.5);
    }
  }, [lastInputs]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt">你的灵感 ✨</Label>
        <Textarea
          id="prompt"
          name="prompt"
          placeholder="例如：一只宇航员服的可爱猫咪，漂浮在赛博朋克风格的宇宙空间里，电影级光效"
          rows={5}
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          aria-invalid={errors?.prompt ? "true" : "false"}
          className={errors?.prompt ? "border-destructive" : ""}
        />
        {errors?.prompt && (
          <p className="text-sm font-medium text-destructive">
            {errors.prompt[0]}
          </p>
        )}
      </div>

      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer">
            <span className="text-sm font-medium">高级参数设置 (Pro)</span>
            <Button variant="ghost" size="sm" className="text-sm">
              {isAdvancedOpen ? '收起' : '展开'}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">宽度</Label>
              <Input id="width" type="number" name="width" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">高度</Label>
              <Input id="height" type="number" name="height" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>生成步数: {steps}</Label>
            <Slider name="steps" value={[steps]} onValueChange={(v: number[]) => setSteps(v[0])} max={50} step={1} />
          </div>
          <div className="space-y-2">
            <Label>引导强度 (CFG): {cfg}</Label>
            <Slider name="cfg" value={[cfg]} onValueChange={(v: number[]) => setCfg(v[0])} max={15} step={0.5} />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <SubmitButton isPending={isPending} />
    </div>
  );
} 