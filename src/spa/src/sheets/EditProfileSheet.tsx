import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { useSheet } from "@/hooks/useSheet";
import { useUser, useUpdateProfile } from "@/hooks/useUser";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "very_active", label: "Very Active" },
];

const FASTING_GOALS = [12, 14, 16, 18, 20, 22, 24];

export function EditProfileSheet() {
  const { sheetState, closeSheet } = useSheet();
  const isOpen = sheetState.sheet === "edit-profile";
  const { data: user } = useUser();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState({
    name: "",
    age: "",
    weight_kg: "",
    height_cm: "",
    sex: "" as "" | "M" | "F",
    activity_level: "moderate",
    fasting_goal_hours: 16,
  });

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        name: user.name,
        age: user.age?.toString() ?? "",
        weight_kg: user.weight_kg?.toString() ?? "",
        height_cm: user.height_cm?.toString() ?? "",
        sex: user.sex ?? "",
        activity_level: user.activity_level ?? "moderate",
        fasting_goal_hours: user.fasting_goal_hours ?? 16,
      });
    }
  }, [isOpen, user]);

  function handleSave() {
    updateProfile.mutate(
      {
        name: form.name || undefined,
        age: form.age ? Number(form.age) : undefined,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
        height_cm: form.height_cm ? Number(form.height_cm) : undefined,
        sex: form.sex || undefined,
        activity_level: form.activity_level || undefined,
        fasting_goal_hours: form.fasting_goal_hours,
      },
      { onSuccess: closeSheet },
    );
  }

  const inputSx = { "& .MuiInputBase-root": { borderRadius: "12px" } };

  return (
    <BottomSheet open={isOpen} onClose={closeSheet} title="Edit Profile">
      <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          fullWidth
          sx={inputSx}
        />

        <Box sx={{ display: "flex", gap: "10px" }}>
          <TextField
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            sx={{ ...inputSx, flex: 1 }}
          />
          <TextField
            label="Weight (kg)"
            type="number"
            value={form.weight_kg}
            onChange={(e) => setForm((f) => ({ ...f, weight_kg: e.target.value }))}
            sx={{ ...inputSx, flex: 1 }}
          />
          <TextField
            label="Height (cm)"
            type="number"
            value={form.height_cm}
            onChange={(e) => setForm((f) => ({ ...f, height_cm: e.target.value }))}
            sx={{ ...inputSx, flex: 1 }}
          />
        </Box>

        <Box>
          <Box sx={{ font: "500 13px Inter", color: "text.secondary", mb: 1 }}>Sex</Box>
          <Box sx={{ display: "flex", gap: "8px" }}>
            {(["M", "F"] as const).map((v) => (
              <Box
                key={v}
                component="button"
                onClick={() => setForm((f) => ({ ...f, sex: v }))}
                sx={{
                  flex: 1,
                  py: "10px",
                  borderRadius: "12px",
                  border: "none",
                  font: "600 14px Inter",
                  cursor: "pointer",
                  bgcolor: form.sex === v ? "primary.main" : "background.paper",
                  color: form.sex === v ? "#fff" : "text.secondary",
                  transition: "all 0.15s",
                }}
              >
                {v === "M" ? "Male" : "Female"}
              </Box>
            ))}
          </Box>
        </Box>

        <TextField
          select
          label="Activity Level"
          value={form.activity_level}
          onChange={(e) => setForm((f) => ({ ...f, activity_level: e.target.value }))}
          fullWidth
          sx={inputSx}
        >
          {ACTIVITY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Box sx={{ font: "500 13px Inter", color: "text.secondary", mb: 1 }}>
            Fasting Goal: {form.fasting_goal_hours}h
          </Box>
          <Box sx={{ display: "flex", gap: "6px" }}>
            {FASTING_GOALS.map((h) => (
              <Box
                key={h}
                component="button"
                onClick={() => setForm((f) => ({ ...f, fasting_goal_hours: h }))}
                sx={{
                  flex: 1,
                  py: "8px",
                  borderRadius: "10px",
                  border: "none",
                  font: "600 13px Inter",
                  cursor: "pointer",
                  bgcolor: form.fasting_goal_hours === h ? "primary.main" : "background.paper",
                  color: form.fasting_goal_hours === h ? "#fff" : "text.secondary",
                  transition: "all 0.15s",
                }}
              >
                {h}h
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          disabled={updateProfile.isPending}
          sx={{
            mt: 1,
            borderRadius: "14px",
            textTransform: "none",
            font: "600 15px Inter",
            py: "12px",
          }}
        >
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </BottomSheet>
  );
}
