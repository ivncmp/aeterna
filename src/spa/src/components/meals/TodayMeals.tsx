import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import StarOutlined from "@mui/icons-material/StarOutlined";
import StarBorderOutlined from "@mui/icons-material/StarBorderOutlined";
import { useTheme } from "@mui/material/styles";
import { useMeals, useDeleteMeal, useToggleFavorite } from "@/hooks/useMeals";
import { useSheet } from "@/hooks/useSheet";
import type { Meal } from "@/types";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MealRow({ meal }: { meal: Meal }) {
  const { tokens } = useTheme();
  const deleteMeal = useDeleteMeal();
  const toggleFav = useToggleFavorite();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        py: "10px",
        "&:not(:last-child)": {
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            font: "500 14px Inter",
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {meal.description || "Meal"}
        </Box>
        <Box sx={{ display: "flex", gap: "8px", mt: "2px" }}>
          <Box component="span" sx={{ font: "400 12px Inter", color: tokens.textTertiary }}>
            {formatTime(meal.logged_at)}
          </Box>
          {meal.calories != null && (
            <Box component="span" sx={{ font: "500 12px Inter", color: "text.secondary" }}>
              {meal.calories} kcal
            </Box>
          )}
          {meal.protein_g != null && (
            <Box component="span" sx={{ font: "500 12px Inter", color: "primary.main" }}>
              {meal.protein_g}g prot
            </Box>
          )}
        </Box>
      </Box>
      <IconButton
        size="small"
        onClick={() => toggleFav.mutate(meal.id)}
        sx={{ color: meal.is_favorite ? "#F8BF24" : tokens.textTertiary }}
      >
        {meal.is_favorite ? (
          <StarOutlined sx={{ fontSize: 18 }} />
        ) : (
          <StarBorderOutlined sx={{ fontSize: 18 }} />
        )}
      </IconButton>
      <IconButton
        size="small"
        onClick={() => deleteMeal.mutate(meal.id)}
        sx={{ color: tokens.textTertiary }}
      >
        <DeleteOutlined sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

export function TodayMeals() {
  const { tokens } = useTheme();
  const { openSheet } = useSheet();
  const { data: meals = [] } = useMeals();

  if (meals.length === 0) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "14px",
        p: "12px 16px",
        boxShadow: tokens.cardShadow,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "4px",
        }}
      >
        <Box component="span" sx={{ font: "600 14px Inter", color: "text.primary" }}>
          Today's Meals
        </Box>
        <Box
          component="button"
          onClick={() => openSheet({ sheet: "log-meal", tab: "text" })}
          sx={{
            font: "600 12px Inter",
            color: "primary.main",
            background: "none",
            border: "none",
            cursor: "pointer",
            p: 0,
          }}
        >
          + Add
        </Box>
      </Box>
      {meals.map((m) => (
        <MealRow key={m.id} meal={m} />
      ))}
    </Box>
  );
}
