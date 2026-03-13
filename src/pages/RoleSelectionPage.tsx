import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "student",
      emoji: "🎓",
      title: "Students",
      subtitle: "Grades 7–10",
      desc: "Ready to learn about money, investing, and building a strong financial future through interactive games and challenges.",
      features: [
        "Interactive learning modules and simulations",
        "Gamified challenges with points and rewards",
        "Track your progress and achievements",
        "Age-appropriate financial content",
      ],
      action: "Start as Student",
      path: "/student/dashboard",
      accent: "#2d6a4f",
    },
    {
      id: "educator",
      emoji: "👩‍🏫",
      title: "Parents & Teachers",
      subtitle: "Educators",
      desc: "Educators and parents looking to guide young learners through financial literacy concepts and monitor their progress.",
      features: [
        "Monitor student progress and performance",
        "Access comprehensive teaching resources",
        "Customize learning paths for students",
        "Generate detailed progress reports",
      ],
      action: "Start as Educator",
      path: "/educator/dashboard",
      accent: "#1a3a2a",
    },
  ];

  return (
    <>
      {/* Fixed Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(248,253,245,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 5 } }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <Typography sx={{ fontSize: "1.75rem" }}>🌱</Typography>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1a3a2a",
              }}
            >
              Green Sapling
            </Typography>
          </Box>

          {/* Nav Links */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.5 }}>
            <Button
              onClick={() => navigate("/")}
              sx={{
                color: "#1c1c1e",
                fontSize: "0.875rem",
                fontWeight: 400,
                px: 2,
                py: 0.75,
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(45,106,79,0.08)",
                  color: "#2d6a4f",
                },
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => navigate("/select-role")}
              sx={{
                color: "#1c1c1e",
                fontSize: "0.875rem",
                fontWeight: 400,
                px: 2,
                py: 0.75,
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(45,106,79,0.08)",
                  color: "#2d6a4f",
                },
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={() => navigate("/select-role")}
            sx={{
              bgcolor: "#2d6a4f",
              color: "white",
              fontSize: "0.8125rem",
              px: 3,
              py: 1.25,
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#1a3a2a",
              },
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fdf5",
          pt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Typography sx={{ fontSize: "2rem" }}>🌱</Typography>
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "#1a3a2a",
                }}
              >
                Green Sapling
              </Typography>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: { xs: "2.5rem", md: "3rem" },
                fontWeight: 700,
                color: "#1a3a2a",
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              Choose Your Path
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "1rem" }}>
              Select your role to begin your financial literacy journey
            </Typography>
          </Box>

          {/* Role Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3.5,
              maxWidth: "820px",
              mx: "auto",
            }}
          >
            {roles.map((role, _i) => (
              <Card
                key={role.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "2px solid transparent",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: role.accent,
                    boxShadow: "0 20px 48px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => navigate(role.path)}
              >
                <CardContent sx={{ p: { xs: 4, md: 4.5 } }}>
                  <Box
                    sx={{
                      fontSize: "3.25rem",
                      mb: 2.5,
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-8px)" },
                      },
                    }}
                  >
                    {role.emoji}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: "#1a3a2a",
                        mb: 0.5,
                      }}
                    >
                      {role.title}
                    </Typography>
                    <Chip
                      label={role.subtitle}
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#15803d",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      lineHeight: 1.7,
                      my: 2,
                    }}
                  >
                    {role.desc}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.25,
                      mb: 4,
                    }}
                  >
                    {role.features.map((f) => (
                      <Box
                        key={f}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.25,
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: "rgba(45,106,79,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            mt: 0.125,
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 11, color: "#2d6a4f" }}
                          />
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.8125rem", color: "#1c1c1e" }}
                        >
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(role.path)}
                    sx={{
                      bgcolor: role.accent,
                      color: "white",
                      py: 1.5,
                      borderRadius: "50px",
                      textTransform: "none",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: role.id === "student" ? "#1a3a2a" : "#0f2419",
                      },
                    }}
                  >
                    {role.action} →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}
