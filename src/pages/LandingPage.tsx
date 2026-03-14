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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
      title: "Money Management",
      description:
        "Learn budgeting, saving strategies, and smart spending habits through interactive simulations.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      title: "Investing Basics",
      description:
        "Understand stocks, bonds, portfolios, and risk management in age-appropriate ways.",
    },
    {
      icon: <SportsEsportsIcon sx={{ fontSize: 28 }} />,
      title: "Gamified Learning",
      description:
        "Earn points, unlock achievements, and compete with friends while learning financial concepts.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 28 }} />,
      title: "Real-World Skills",
      description:
        "Practice with simulated bank accounts and make decisions that actually matter.",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
      title: "Track Progress",
      description:
        "Detailed progress reports and milestones to celebrate every achievement.",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 28 }} />,
      title: "For Everyone",
      description:
        "Students, parents and teachers — guidance from a unified platform built for everyone.",
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
              Green Sapling{" "}
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

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fdf5", pt: 8 }}>
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              py: { xs: 12, md: 16 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative orbs */}
            <Box
              sx={{
                position: "absolute",
                top: "10%",
                left: "5%",
                width: { xs: 200, md: 400 },
                height: { xs: 200, md: 400 },
                background:
                  "radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "15%",
                right: "5%",
                width: { xs: 180, md: 350 },
                height: { xs: 180, md: 350 },
                background:
                  "radial-gradient(circle, rgba(212,160,23,0.10) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />

            <Box sx={{ mb: 4, position: "relative", zIndex: 1 }}>
              <Chip
                label="FINANCIAL LITERACY FOR GRADES 7–10"
                sx={{
                  bgcolor: "rgba(45,106,79,0.08)",
                  border: "1px solid rgba(45,106,79,0.15)",
                  color: "#2d6a4f",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  mb: 4,
                  px: 1,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: { xs: "3rem", sm: "4rem", md: "6rem" },
                  fontWeight: 700,
                  color: "#1a3a2a",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  mb: 2,
                }}
              >
                Grow Your
                <br />
                <Box
                  component="span"
                  sx={{ color: "#52b788", fontStyle: "italic" }}
                >
                  Financial
                </Box>{" "}
                Future
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#6b7280",
                maxWidth: "540px",
                lineHeight: 1.7,
                mb: 6,
                position: "relative",
                zIndex: 1,
              }}
            >
              Where financial education meets gamification. Interactive
              simulations, real-world scenarios, and a path to money mastery.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
                mb: 10,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/select-role")}
                sx={{
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: 500,
                  bgcolor: "#2d6a4f",
                  "&:hover": {
                    bgcolor: "#1a3a2a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(45,106,79,0.3)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Get Started Free →
              </Button>
            </Box>

            {/* Floating stats */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 4, md: 8 },
                flexWrap: "wrap",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {[
                ["7–10", "Grade Levels"],
                ["100%", "Interactive"],
                ["∞", "Growth Potential"],
              ].map(([val, label]) => (
                <Box key={label} sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: { xs: "2rem", md: "2.25rem" },
                      fontWeight: 700,
                      color: "#2d6a4f",
                    }}
                  >
                    {val}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      mt: 0.5,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: { xs: "2rem", md: "2.625rem" },
                fontWeight: 700,
                color: "#1a3a2a",
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              Why Choose Green Sapling?
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "1rem" }}>
              Everything a student needs to become financially confident
            </Typography>
          </Box>

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
            {features.map((feature, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(0,0,0,0.06)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 48px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "rgba(45,106,79,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2d6a4f",
                      mb: 2.5,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#1a3a2a",
                      mb: 1.25,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>

        {/* CTA Section */}
        <Container
          maxWidth="md"
          sx={{ py: { xs: 5, md: 5 }, px: { xs: 3, md: 5 } }}
        >
          <Card
            elevation={0}
            sx={{
              bgcolor: "#1a3a2a",
              borderRadius: 4,
              p: { xs: 6, md: 8 },
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative orbs */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 300,
                height: 300,
                background: "rgba(82,183,136,0.15)",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 240,
                height: 240,
                background: "rgba(212,160,23,0.1)",
                borderRadius: "50%",
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                mb: 2,
                position: "relative",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to Start Your
              <br />
              <Box component="span" sx={{ color: "#52b788" }}>
                Financial Journey?
              </Box>
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                mb: 4.5,
                position: "relative",
              }}
            >
              Join thousands of students, teachers, and parents building
              financial literacy together.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/select-role")}
              sx={{
                fontSize: "1rem",
                px: 5,
                py: 2,
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 500,
                bgcolor: "#52b788",
                position: "relative",
                "&:hover": {
                  bgcolor: "#2d6a4f",
                },
              }}
            >
              Choose Your Path →
            </Button>
          </Card>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            color: "#6b7280",
            fontSize: "0.8125rem",
          }}
        >
          Building financial confidence, one sapling at a time 🌱
        </Box>
      </Box>
    </>
  );
}
