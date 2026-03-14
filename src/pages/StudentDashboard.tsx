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
  Avatar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const courses = [
    {
      id: "financial-foundations",
      title: "Financial Foundations",
      description: "Master the fundamentals of money management",
      icon: "💰",
      difficulty: "Beginner",
      lessons: 12,
      progress: 0,
      color: "#2d6a4f",
      isNew: true,
      isLocked: false,
    },
    {
      id: "investing-101",
      title: "Investing 101",
      description: "Stocks, bonds, and portfolio building",
      icon: "📈",
      difficulty: "Intermediate",
      lessons: 10,
      progress: 0,
      color: "#1e5f74",
      isNew: false,
      isLocked: true,
    },
    {
      id: "smart-spending",
      title: "Smart Spending",
      description: "Budgeting and smart financial decisions",
      icon: "🛒",
      difficulty: "Beginner",
      lessons: 8,
      progress: 0,
      color: "#7b2d8b",
      isNew: false,
      isLocked: true,
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
              onClick={() => navigate("/student/dashboard")}
              sx={{
                color: "#2d6a4f",
                fontSize: "0.875rem",
                fontWeight: 500,
                px: 2,
                py: 0.75,
                borderRadius: "50px",
                textTransform: "none",
                bgcolor: "rgba(45,106,79,0.08)",
              }}
            >
              Courses
            </Button>
          </Box>

          {/* User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                fontSize: "0.8125rem",
                color: "#6b7280",
                display: { xs: "none", sm: "block" },
              }}
            >
              Welcome back,
            </Typography>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#2d6a4f",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              A
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pt: 8 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: { xs: "2rem", md: "2.25rem" },
                fontWeight: 700,
                color: "#1a3a2a",
                letterSpacing: "-0.01em",
                mb: 0.75,
              }}
            >
              Learning Paths
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "0.9375rem" }}>
              Step-by-step paths to financial mastery
            </Typography>
          </Box>

          {/* Path Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3.5,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: "rgba(45,106,79,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
              }}
            >
              🌱
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.375rem",
                  fontWeight: 600,
                  color: "#1a3a2a",
                }}
              >
                Foundation of Investing
              </Typography>
              <Typography
                sx={{ fontSize: "0.8125rem", color: "#6b7280", mt: 0.25 }}
              >
                Learn how to manage your money
              </Typography>
            </Box>
          </Box>

          {/* Courses Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {courses.map((course) => (
              <Card
                key={course.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: course.isLocked ? "not-allowed" : "pointer",
                  opacity: course.isLocked ? 0.6 : 1,
                  transition: "all 0.25s ease",
                  "&:hover": course.isLocked
                    ? {}
                    : {
                        transform: "translateY(-4px)",
                        boxShadow: "0 20px 48px rgba(0,0,0,0.08)",
                      },
                }}
                onClick={() =>
                  !course.isLocked && navigate(`/student/course/${course.id}`)
                }
              >
                {/* Card Header */}
                <Box
                  sx={{
                    height: 160,
                    background: course.isLocked
                      ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                      : course.color,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {course.isNew && !course.isLocked && (
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        bgcolor: "#d4a017",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.6875rem",
                        letterSpacing: "0.05em",
                        height: 24,
                      }}
                    />
                  )}
                  {/* Decorative orbs */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.08)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -30,
                      left: -20,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                  {course.isLocked ? (
                    <LockIcon
                      sx={{
                        fontSize: 52,
                        color: "rgba(255,255,255,0.7)",
                        position: "relative",
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "3.25rem",
                        position: "relative",
                        animation: "float 4s ease-in-out infinite",
                        "@keyframes float": {
                          "0%, 100%": { transform: "translateY(0px)" },
                          "50%": { transform: "translateY(-8px)" },
                        },
                      }}
                    >
                      {course.icon}
                    </Typography>
                  )}
                </Box>

                {/* Card Body */}
                <CardContent sx={{ p: 2.75 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: "1.1875rem",
                      fontWeight: 600,
                      color: "#1a3a2a",
                      mb: 0.75,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2.25,
                    }}
                  >
                    <Chip
                      label={course.difficulty}
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#15803d",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: 24,
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "0.8125rem", color: "#6b7280" }}
                    >
                      {course.lessons} lessons
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={course.isLocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!course.isLocked) {
                        navigate(`/student/course/${course.id}`);
                      }
                    }}
                    sx={{
                      py: 1.5,
                      borderRadius: "50px",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderColor: course.isLocked
                        ? "rgba(0,0,0,0.12)"
                        : "#2d6a4f",
                      color: course.isLocked ? "#9ca3af" : "#2d6a4f",
                      borderWidth: 1.5,
                      "&:hover": course.isLocked
                        ? {}
                        : {
                            bgcolor: "#2d6a4f",
                            color: "white",
                            borderColor: "#2d6a4f",
                          },
                    }}
                  >
                    {course.isLocked ? "Locked" : "Start Course"}
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
