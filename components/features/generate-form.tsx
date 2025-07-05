"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateImageAction } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/form-message";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 提交按钮组件，用于显示加载状态
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "正在生成..." : "生成图像"}
    </Button>
  );
}

interface FormState {
  message: string | null;
  errors: {
    prompt?: string[];
  } | null;
  imageUrl: string | null;
}

const initialState: FormState = {
  message: null,
  errors: null,
  imageUrl: null,
};

export function GenerateForm() {
  const [state, formAction] = useActionState(generateImageAction, initialState);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(25);
  const [cfg, setCfg] = useState(7.5);

  return (
    <motion.div 
      className="relative max-w-xl mx-auto p-1 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
       <div className="rounded-xl bg-background p-4 md:p-6">
        {/* 结果显示区域 */}
        <div className="bg-muted rounded-lg aspect-square mb-4 flex items-center justify-center">
          {state.imageUrl ? (
            <img src={state.imageUrl} alt="Generated image" className="rounded-lg object-cover w-full h-full" />
          ) : (
            <p className="text-muted-foreground">这里将显示您生成的图像</p>
          )}
        </div>
        
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">你的灵感 ✨</Label>
              <Textarea
                id="prompt"
                name="prompt"
                placeholder="例如：一只宇航员服的可爱猫咪，漂浮在赛博朋克风格的宇宙空间里，电影级光效"
                rows={3}
                required
              />
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
            
            <SubmitButton />
            {state.message && (
             <FormMessage type="error" message={state.message} />
            )}
           {state.errors?.prompt && (
             <FormMessage type="error" message={state.errors.prompt[0]} />
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
} 