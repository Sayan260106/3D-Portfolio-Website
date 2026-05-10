export const portfolioData = {
  name: "Sayan Sinha",
  role: "B.Tech Computer Science Student",
  location: "Kolkata, West Bengal, India",
  about:
    "B.Tech Computer Science student with a strong interest in machine learning and artificial intelligence. Skilled in building data-driven applications and interactive web platforms, with a focus on practical problem solving, modern tools, and thoughtful user experiences.",
  contact: {
    email: "sayan.sinha.26.01.2006@gmail.com",
    phone: "+91 89027 70591",
    address: "Ghasiara More, Natunpally (Purba), Sonarpur, Kolkata - 700150",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
  skills: [
    {
      category: "Programming Languages",
      items: ["C", "C++", "Java", "JavaScript", "TypeScript", "Python"],
    },
    {
      category: "Web Development",
      items: ["HTML", "CSS", "Three.js"],
    },
    {
      category: "Tools & Technologies",
      items: ["Git", "Docker"],
    },
    {
      category: "Data Science",
      items: ["NumPy", "Pandas", "Data Analysis", "Data Visualization"],
    },
  ],
  languages: [
    { name: "English", level: "Intermediate" },
    { name: "Hindi", level: "Professional" },
    { name: "Bengali", level: "Native" },
    { name: "French", level: "Basic" },
  ],
  interests: ["Reading about Mythology", "Photography", "Drawing", "Sometimes Singing"],
  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      school: "Heritage Institute of Technology",
      location: "994 Madurdaha, Chowbaga Road, Anandapur, Kolkata - 700107",
      period: "Aug 2024 - Present",
      score: "GPA: 8.81/10",
    },
    {
      degree: "Higher Secondary Education",
      school: "Sarada Vidyapith (H.S.)",
      location: "Sri Ramkrishna Pally, Sonarpur, Kolkata - 700150",
      period: "May 2022 - Mar 2024",
      score: "GPA: 86.7%",
    },
    {
      degree: "Secondary Education",
      school: "Sarada Vidyapith (H.S.)",
      location: "Sri Ramkrishna Pally, Sonarpur, Kolkata - 700150",
      period: "Jan 2017 - Apr 2022",
      score: "GPA: 92.3%",
    },
  ],
  projects: [
    {
      title: "LabZero",
      period: "Mar 2026 - Present",
      subtitle: "Educational Web App for Virtual Lab Learning",
      highlights: [
        "Developed an interactive web application to simulate science experiments virtually.",
        "Integrated 3D visualizations using Three.js to improve conceptual understanding.",
        "Designed for students with limited access to physical lab infrastructure.",
      ],
      tech: ["TypeScript", "HTML", "CSS", "Three.js"],
    },
    {
      title: "MindBloom",
      period: "Aug 2025 - Feb 2026",
      subtitle: "Holistic Health Tracking & Support Platform",
      highlights: [
        "Built a platform integrating mental and physical health tracking.",
        "Implemented features for emotional tracking and self-reflection.",
        "Designed a user-centric system promoting overall well-being.",
      ],
      tech: ["JavaScript", "HTML", "CSS", "Python", "Dockerfile"],
    },
    {
      title: "Habit-Quest",
      period: "Jan 2026 - Present",
      subtitle: "Gamified Habit Tracker Web Application",
      highlights: [
        "Developing a habit tracking application with gamification elements.",
        "Implemented rewards, progress tracking, and achievement systems.",
        "Focused on improving user engagement and long-term habit consistency.",
      ],
      tech: ["TypeScript", "HTML", "JavaScript"],
    },
    {
      title: "Sea-Level-Predictor",
      period: "Nov 2025",
      subtitle: "Sea Level Rise Prediction using Linear Regression",
      highlights: [
        "Built a predictive model using linear regression on climate data.",
        "Analyzed long-term trends and forecasted sea level rise till 2050.",
        "Visualized insights using scatter plots and regression techniques.",
      ],
      tech: ["Python"],
    },
    {
      title: "Data Analysis & Visualization Projects",
      period: "Nov 2025",
      subtitle: "Real-world dataset analysis and visualization",
      highlights: [
        "Performed data cleaning, analysis, and visualization on real-world datasets.",
        "Used statistical methods to identify trends, correlations, and patterns.",
        "Created visualizations such as line plots, bar charts, and heatmaps.",
      ],
      tech: ["Python"],
    },
    {
      title: "Jarvis -- Voice Assistant",
      period: "Oct 2025 - Present",
      subtitle: "Personal Voice Assistant",
      highlights: [
        "Built a voice assistant using Python with SpeechRecognition and NLP libraries.",
        "Implemented voice command processing and task automation.",
        "Enabled web search, reminders, and system control for hands-free interaction.",
      ],
      tech: ["Python"],
    },
  ],
  certifications: [
    { title: "Solutions Architecture Job Simulation", issuer: "Amazon Web Service", date: "Oct 2025" },
    { title: "Coding Speed", issuer: "CodinGame", date: "Jul 2025" },
    { title: "C Certification", issuer: "CodinGame", date: "Jul 2025" },
    { title: "HackHeritage 3.0", issuer: "Heritage Institute of Technology", date: "Sep 2025" },
    { title: "Intro to Machine Learning", issuer: "Kaggle", date: "Dec 2025" },
  ],
};

export type PortfolioData = typeof portfolioData;
