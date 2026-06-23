import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { MealPhotoView } from "@/components/shared/MealPhotoView";
import { MealResultView } from "@/components/shared/MealResultView";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { useTheme } from "@mui/material/styles";
import { useSheet } from "@/hooks/useSheet";
import { useAnalyzeMeal, useSaveMeal } from "@/hooks/useMeals";
import type { MealAnalysis } from "@/types";

type Tab = "Text" | "Photo";

const EMPTY_MEAL: MealAnalysis = { description: "", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };

export function LogMealSheet() {
  const { tokens } = useTheme();
  const { sheetState, closeSheet } = useSheet();
  const isOpen = sheetState.sheet === "log-meal";

  const [tab, setTab] = useState<Tab>("Text");
  const [textInput, setTextInput] = useState("");
  const [mealData, setMealData] = useState<MealAnalysis>(EMPTY_MEAL);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = useAnalyzeMeal();
  const save = useSaveMeal();

  const reset = useCallback(() => {
    setTextInput("");
    setMealData(EMPTY_MEAL);
    setPhotoPreview(null);
    setAnalyzed(false);
    analyze.reset();
    save.reset();
  }, [analyze, save]);

  const handleClose = () => {
    closeSheet();
    reset();
  };

  const handleTabChange = (v: string) => {
    setTab(v as Tab);
    reset();
  };

  const handleTextAnalyze = () => {
    if (!textInput.trim()) return;
    analyze.mutate({ text: textInput }, {
      onSuccess: (result) => {
        setMealData(result);
        setAnalyzed(true);
      },
    });
  };

  const handlePhotoCapture = (base64: string, mediaType: string) => {
    setPhotoPreview(base64);
    analyze.mutate({ image_base64: base64, media_type: mediaType }, {
      onSuccess: (result) => {
        setMealData(result);
        setAnalyzed(true);
      },
    });
  };

  const handleSave = () => {
    const source = tab === "Photo" ? "LLM_PHOTO" : "LLM_TEXT";
    save.mutate({
      description: mealData.description,
      calories: mealData.calories,
      protein_g: mealData.protein_g,
      carbs_g: mealData.carbs_g,
      fat_g: mealData.fat_g,
      source,
    }, { onSuccess: handleClose });
  };

  const showResult = analyzed;
  const showTextInput = tab === "Text" && !analyzed;
  const showPhoto = tab === "Photo" && !analyzed;
  const isAnalyzing = analyze.isPending;

  return (
    <BottomSheet open={isOpen} onClose={handleClose} title="Log Meal">
      <SegmentedControl
        options={["Text", "Photo"]}
        value={tab}
        onChange={handleTabChange}
      />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {showTextInput && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Describe your meal... e.g. 2 huevos revueltos con tostada"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              sx={{ "& .MuiInputBase-root": { borderRadius: "12px" } }}
            />
            <Box
              component="button"
              onClick={handleTextAnalyze}
              disabled={isAnalyzing || !textInput.trim()}
              sx={{
                height: 50,
                borderRadius: "12px",
                bgcolor: "primary.main",
                border: "none",
                color: "#fff",
                font: "600 15px Inter",
                cursor: "pointer",
                boxShadow: tokens.fabGlow,
                opacity: isAnalyzing || !textInput.trim() ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isAnalyzing ? <CircularProgress size={20} color="inherit" /> : "Analyze with AI"}
            </Box>
          </Box>
        )}

        {showPhoto && (
          <MealPhotoView
            preview={photoPreview}
            loading={isAnalyzing}
            onCapture={handlePhotoCapture}
          />
        )}

        {showResult && (
          <MealResultView
            data={mealData}
            editable
            onChange={setMealData}
          />
        )}
      </Box>

      {showResult && (
        <Box sx={{ display: "flex", gap: "10px", mt: "auto", pt: 2 }}>
          <Box
            component="button"
            onClick={handleClose}
            sx={{
              flex: 1,
              height: 50,
              borderRadius: "12px",
              bgcolor: "background.paper",
              border: "none",
              color: "text.primary",
              font: "600 15px Inter",
              cursor: "pointer",
            }}
          >
            Cancel
          </Box>
          <Box
            component="button"
            onClick={handleSave}
            disabled={save.isPending}
            sx={{
              flex: 2,
              height: 50,
              borderRadius: "12px",
              bgcolor: "primary.main",
              border: "none",
              color: "#fff",
              font: "600 15px Inter",
              cursor: "pointer",
              boxShadow: tokens.fabGlow,
              opacity: save.isPending ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {save.isPending ? <CircularProgress size={20} color="inherit" /> : "Save Meal"}
          </Box>
        </Box>
      )}
    </BottomSheet>
  );
}
