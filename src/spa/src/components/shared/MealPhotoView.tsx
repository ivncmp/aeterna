import { useRef } from "react";
import Box from "@mui/material/Box";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

interface MealPhotoViewProps {
  preview: string | null;
  loading?: boolean;
  onCapture: (base64: string, mediaType: string) => void;
}

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1]!;
      resolve({ base64, mediaType: file.type || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function MealPhotoView({ preview, loading, onCapture }: MealPhotoViewProps) {
  const { tokens } = useTheme();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const { base64, mediaType } = await fileToBase64(file);
    onCapture(base64, mediaType);
  };

  return (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <Box
        sx={{
          flex: 1,
          border: preview ? "none" : `2px dashed ${tokens.track}`,
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 2,
          p: "20px",
          minHeight: 240,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress size={40} />
            <Box sx={{ font: "500 14px Inter", color: "text.secondary" }}>
              Analyzing...
            </Box>
          </Box>
        )}

        {!loading && preview && (
          <Box
            component="img"
            src={`data:image/jpeg;base64,${preview}`}
            sx={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: "12px" }}
          />
        )}

        {!loading && !preview && (
          <>
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
          </>
        )}
      </Box>

      {!loading && !preview && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box
            component="button"
            onClick={() => cameraRef.current?.click()}
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
            onClick={() => galleryRef.current?.click()}
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
      )}
    </>
  );
}
