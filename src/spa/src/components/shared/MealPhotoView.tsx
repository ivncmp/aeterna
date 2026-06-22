import Box from "@mui/material/Box";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import { useTheme } from "@mui/material/styles";

export function MealPhotoView() {
  const { tokens } = useTheme();

  return (
    <>
      <Box
        sx={{
          flex: 1,
          border: `2px dashed ${tokens.track}`,
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 2,
          p: "20px",
          minHeight: 240,
        }}
      >
        <Box
          sx={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            bgcolor: "color-mix(in srgb, #F0932C 14%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.main",
          }}
        >
          <CameraAltOutlined sx={{ fontSize: 34 }} />
        </Box>
        <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "5px" }}>
          <Box component="span" sx={{ font: "600 16px Inter", color: "text.primary" }}>
            Add a photo of your meal
          </Box>
          <Box
            component="span"
            sx={{
              font: "400 13px Inter",
              color: "text.secondary",
              maxWidth: 240,
              lineHeight: 1.45,
              mx: "auto",
            }}
          >
            Aeterna AI estima las calorías y macros a partir de la imagen
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box
          component="button"
          sx={{
            height: 50,
            borderRadius: "12px",
            bgcolor: "primary.main",
            border: "none",
            color: "#fff",
            font: "600 15px Inter",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
            boxShadow: tokens.fabGlow,
          }}
        >
          <CameraAltOutlined sx={{ fontSize: 19 }} />
          Take Photo
        </Box>
        <Box
          component="button"
          sx={{
            height: 50,
            borderRadius: "12px",
            bgcolor: "background.paper",
            border: "none",
            color: "text.primary",
            font: "600 15px Inter",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
          }}
        >
          <ImageOutlined sx={{ fontSize: 19 }} />
          Choose from Gallery
        </Box>
      </Box>
    </>
  );
}
