import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { api } from "@/lib/api";

interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

interface LoginProps {
  onLogin: (token: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token } = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", token);
      onLogin(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: "24px",
        bgcolor: "background.default",
      }}
    >
      <Box
        component="img"
        src="/assets/aeterna-logo-white.png"
        alt="Aeterna"
        sx={{ width: 180, mb: "40px" }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: 360 }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: "16px" }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: "16px" }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: "24px" }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            height: 48,
            font: "600 16px Inter",
            borderRadius: "12px",
            textTransform: "none",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Log in"}
        </Button>

        <Typography
          sx={{
            font: "400 13px Inter",
            color: "text.secondary",
            textAlign: "center",
            mt: "24px",
          }}
        >
          For family & friends only
        </Typography>
      </Box>
    </Box>
  );
}
