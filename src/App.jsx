import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, X, ChevronRight, Circle, Globe, ArrowUp, Home, Briefcase, BookOpen, User, MapPin, GraduationCap } from 'lucide-react';
import GlassSurface from './GlassSurface';
import CurvedLoop from './components/CurvedLoop';

// --- DATA ---
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                        <div className="bg-gray-100 p-4 rounded overflow-auto mb-4">
                            <p className="font-mono text-sm text-red-500 mb-2">{this.state.error && this.state.error.toString()}</p>
                            <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const RESUME_DATA = {
    name: "Krishna Thakar",
    role: "Masters in CS • Web Developer • Researcher",
    location: "Cape Girardeau, MO",
    email: "krsnathkr@gmail.com",
    socials: {
        github: "https://github.com/krsnathkr/",
        linkedin: "https://www.linkedin.com/in/krsnathkr/"
    },
    about: "I bridge the gap between raw data and human experience. My work spans from full-stack web platforms solving real-world campus logistics to deep learning models analyzing sentiment and autonomous systems.",
    skills: [
        "Python", "TensorFlow", "Pandas", "Docker", "Scikit-learn", "RAG LLM", "SQL",
        "PyTorch", "Hadoop", "Streamlit", "MongoDB", "Keras", "Apache Spark", "NumPy", "CI/CD pipelines", "OpenCV", "Scala",
        "Matplotlib", "Databricks", "Hugging Face Transformers", "R", "Kubernetes", "Seaborn", "CUDA", "Plotly", "LSTM",
        "Snowflake", "NLTK", "Apache Beam", "CNN"
    ],
    experience: [
        {
            role: "Web Developer",
            company: "Southeast Missouri State University",
            period: "Aug 2025 - Present",
            summary: "I handle my own university - SEMO's official website (semo.edu) as a Graduate Assistant.",
            points: [
                "Developing reusable web components and custom page templates.",
                "Maintaining official university website semo.edu."
            ],
            featured: true
        },
        {
            role: "Founder / VP",
            company: "Hacklabs SEMO",
            period: "Sep 2025 - Present",
            summary: "Organizing student teams and building industry connections for SEMO's official hackathon club.",
            points: [
                "HackLab is SEMO's official hackathon club.",
                "Organizing student teams for hackathons at regional and national competitions.",
                "Building connections with industry professionals to support members' career growth.",
                "Developing a space for students to collaborate on real-world technology projects.",
                "Creating workshops and hands-on projects to help students build practical tech skills."
            ],
            featured: true
        },
        {
            role: "Machine Learning Researcher",
            company: "SEMO Department of Computer Science",
            period: "Jan 2025 - May 2025",
            summary: "Conducted comparative analysis of ML and Deep Learning models on ~7 million Yelp reviews, achieving top performance with RoBERTa.",
            points: [
                "Worked under the mentorship of Dr. Mohamed Abu Sheha and Dr. Emmanuel Thompson, comparing traditional ML models and deep learning models against fine-tuned RoBERTa for three-way sentiment classification.",
                "Processed ~7 million Yelp reviews, performing text cleaning, tokenization, lemmatization, negation handling, vectorization, and balancing sentiment classes into equal thirds.",
                "Developed and evaluated multiple models - including Logistic Regression, SVM, Naïve Bayes, Random Forest, BiLSTM, LSTM, CNN, RNN, GRU, and a fine tuned RoBERTa.",
                "Used stratified cross validation, confusion matrices, and ROC curves to measure accuracy, precision, recall, F1, and ROC AUC.",
                "Demonstrated that RoBERTa achieved top performance (accuracy 0.80112, AUC 0.93237) through systematic cross-validation and in-depth analysis."
            ],
            featured: true
        },
        {
            role: "Resident Assistant",
            company: "Southeast Missouri State University",
            period: "Jan 2023 - May 2025",
            summary: "Mentored 100+ residents and organized campus events to foster a supportive and inclusive community.",
            points: [
                "Cultivating effective communication and mentoring skills by guiding 100+ residents through academic and personal challenges, offering tailored advice, and connecting them with campus resources.",
                "Demonstrating strong organizational abilities by planning and executing 10+ events annually, ensuring seamless coordination and active participation.",
                "Strengthening interpersonal skills by fostering a collaborative and inclusive environment, resolving conflicts, and providing ongoing support to residents."
            ]
        },
        {
            role: "Information Technology Staff",
            company: "SEMO IT",
            period: "Sep 2023 - Jan 2025",
            summary: "Provided technical support to 100+ users and managed IT inventory for SEMO IT.",
            points: [
                "Developed problem-solving and analytical skills by providing timely technical support to 100+ students and staff, diagnosing and resolving complex hardware and software issues.",
                "Strengthening organizational skills by managing IT inventory, maintaining accurate records of hardware and software assets, and ensuring compliance with licensing requirements.",
                "Enhanced communication skills through clear and effective explanations of technical concepts to non-technical users, fostering understanding and independence in technology use."
            ]
        },
        {
            role: "Concession Stand Attendant",
            company: "Show Me Center",
            period: "Nov 2021 - May 2025",
            summary: "Ensured smooth operations and provided excellent customer service during high-volume events.",
            points: [
                "Quickly made decisions and delegated tasks to ensure smooth operation during busy events.",
                "Improved problem-solving skills by thinking on my feet and finding creative solutions to unexpected challenges.",
                "Provided excellent customer service in a fast-paced environment, handling transactions efficiently and ensuring a positive experience for customers."
            ]
        }
    ],
    education: [
        {
            id: 1,
            school: "Southeast Missouri State University",
            degree: "Master of Science - MS, Computer Science",
            period: "Aug 2025 - May 2027",
            grade: "4.0",
            desc: "Graduate studies in Computer Science with focus on AI/ML and Data Science.",
            type: "University",
            featured: true,
            timeline: true
        },
        {
            id: 3,
            school: "Codefi",
            degree: "Data Analytics Student",
            period: "Aug 2025 - Dec 2025",
            desc: "Course focused on data analytics and real-world data projects.",
            type: "Course",
            featured: false,
            timeline: true
        },
        {
            id: 4,
            school: "CodePath",
            degree: "Technical Interview Prep - TIP-102 Course",
            period: "Aug 2025 - Nov 2025",
            desc: "Intensive course focused on technical interview preparation and coding challenges.",
            type: "Course",
            featured: false,
            timeline: true
        },
        {
            id: 2,
            school: "Southeast Missouri State University",
            degree: "Bachelor of Science - BS, Computer Science and Data Science Minor",
            period: "Aug 2021 - May 2025",
            grade: "3.9",
            desc: "Undergraduate studies in Computer Science with a minor in Data Science.",
            type: "University",
            featured: true,
            timeline: true
        },
        {
            id: 5,
            school: "IBM",
            degree: "Exploratory Data Analysis for Machine Learning (with Honors)",
            period: "Issued Jun 2024",
            desc: "Professional certification in Machine Learning and Data Science.",
            type: "Extracurricular",
            featured: false,
            timeline: false,
            link: "https://www.coursera.org/account/accomplishments/verify/DPFV3ZYXRJ8H"
        },
        {
            id: 6,
            school: "Coursera",
            degree: "Supervised Machine Learning: Regression and Classification",
            period: "Issued Feb 2024",
            desc: "Professional certification in supervised machine learning techniques.",
            type: "Extracurricular",
            featured: false,
            timeline: false,
            link: "https://coursera.org/share/86f27f2cc516156e19aba50491736265"
        }
    ],
    research: [
        {
            title: "Sentiment Analysis of Yelp Review Dataset",
            type: "Comparative Study",
            date: "April 2025",
            desc: "Investigated effectiveness of SVM, Random Forest vs CNN, BILSTM, and ROBERTa. ROBERTa outperformed others.",
            link: "https://github.com/Abusheha80/Student-Research-Conference-Natural-Language-Processing"
        },
        {
            title: "From War Machine to Peacemaker: Duality of AI",
            type: "Ethics Paper",
            date: "April 2024",
            desc: "Explored ethical concerns of autonomous weapons vs AI in peace negotiations.",
            link: "https://www.linkedin.com/posts/krsnathkr_i-recently-had-the-amazing-opportunity-to-activity-7189376764937232384-uRCu?utm_source=share&utm_medium=member_desktop&rcm=ACoAADr7XNgB8aXwuDeMHC8K4BnWKnQ7mrV9gZI"
        }
    ],
    projects: [
        {
            id: 1,
            title: "StealthChess.AI",
            cat: "AI/ML",
            tags: ["OpenCV", "YOLOv8", "Stockfish"],
            desc: "Real-time chess assistant analyzing live streams from Meta Ray-Ban glasses.",
            link: "https://github.com/krsnathkr/cheat-in-chess",
            color: "#FF4D4D", // Vibrant Red
            archived: true,
            featured: true
        },
        {
            id: 3,
            title: "Knowbl Agentic RAG",
            cat: "AI/ML",
            tags: ["LangChain", "FAISS", "OpenAI"],
            desc: "Agentic RAG pipeline combining real-time web search and document Q&A.",
            link: "https://github.com/krsnathkr/rag-mcp-agenticAI",
            color: "#FFD600", // Yellow
            archived: true,
            featured: true
        },
        {
            id: 6,
            title: "ASA DataFest Winner",
            cat: "Data",
            tags: ["R", "Random Forest"],
            desc: "Analysis of 200k+ office lease transactions. Best Use of Statistical Analysis.",
            link: "https://www.linkedin.com/feed/update/urn:li:activity:7315084829555847168/",
            color: "#2D3436",
            archived: true,
            featured: true
        },
        {
            id: 13,
            title: "Medi-Compare",
            cat: "Data",
            tags: ["Healthcare", "Comparison"],
            desc: "Healthcare price transparency platform that empowers patients to compare medical procedure costs across hospitals",
            link: "https://www.linkedin.com/posts/krsnathkr_this-weekend-was-intense-in-the-best-way-activity-7396238223242551296-pQFl?utm_source=share&utm_medium=member_desktop&rcm=ACoAADr7XNgB8aXwuDeMHC8K4BnWKnQ7mrV9gZI",
            color: "#FF5733",
            archived: true,
        },
        {
            id: 4,
            title: "Sales Data Pipeline",
            cat: "Data",
            tags: ["Azure", "dbt", "Spark"],
            desc: "Medallion architecture pipeline processing 1M+ records.",
            link: "https://github.com/krsnathkr/dataPipeline",
            color: "#FF8800", // Orange
            archived: true,
            featured: true
        },
        {
            id: 2,
            title: "SEMO Esports Platform",
            cat: "Web Dev",
            tags: ["React", "Node.js", "PostgreSQL"],
            desc: "Full-stack booking system for 150+ students. Reduced congestion by 70%.",
            link: "https://github.com/anuragbhattarai31/EsportsWeb",
            color: "#00D4FF", // Cyan
            archived: true,
            featured: true
        },
        {
            id: 5,
            title: "Echo Chamber",
            cat: "AI/ML",
            tags: ["Python", "Streamlit", "NLP"],
            desc: "News bias combat platform with 98% sentiment accuracy.",
            link: "https://github.com/krsnathkr/NewsML",
            color: "#111111",
            archived: true
        },
        {
            id: 7,
            title: "Market Radar",
            cat: "AI/ML",
            tags: ["Gemini API", "Streamlit"],
            desc: "Real-time financial insights and stock visualization.",
            link: "https://stockmarketinsights.streamlit.app/",
            color: "#FF4D4D",
            archived: true
        },
        {
            id: 8,
            title: "Penny Planner",
            cat: "AI/ML",
            tags: ["OpenAI API", "Plotly"],
            desc: "Bank statement analyzer for personal finance insights.",
            link: "https://github.com/krsnathkr/finance-assistant",
            color: "#00D4FF",
            archived: true
        },
        {
            id: 9,
            title: "Titanic Predictor",
            cat: "AI/ML",
            tags: ["Scikit-learn", "Pandas"],
            desc: "Survival rate predictor with 83.24% accuracy.",
            link: "https://github.com/krsnathkr/TitanicMLprediction",
            color: "#FFD600",
            archived: true
        },
        {
            id: 10,
            title: "NY Housing Analysis",
            cat: "Data",
            tags: ["Python", "Plotly"],
            desc: "Geospatial analysis of housing prices.",
            link: "https://github.com/krsnathkr/NYHousingPrices",
            color: "#FF8800",
            archived: true
        },
        {
            id: 11,
            title: "Tic-Tac-Toe",
            cat: "Web Dev",
            tags: ["JS", "HTML/CSS"],
            desc: "Classic game with local storage and themes.",
            link: "https://github.com/krsnathkr/Tic-Tac-toe",
            color: "#111111",
            archived: true,
        },
        {
            id: 12,
            title: "Multi-Port Server",
            cat: "Web Dev",
            tags: ["Flask", "Socket"],
            desc: "Fault-tolerant distributed system.",
            link: "https://github.com/krsnathkr/FlaskMessagingSystem",
            color: "#2D3436",
            archived: true
        },

        {
            id: 14,
            title: "Comparative Study on ML Models for YELP Review Classification",
            cat: "Research",
            tags: ["Conference", "Student", "Research"],
            desc: "Compared the performance of different machine learning models for Yelp review classification.",
            link: "https://github.com/Abusheha80/Student-Research-Conference-Natural-Language-Processing",
            color: "#33C3FF",
            archived: true
        }
    ]
};

// --- COMPONENTS ---

// Location Rotating Badge Component
const LocationBadge = () => {
    const [index, setIndex] = useState(0);
    const states = [
        { text: "Open to Relocation", icon: <MapPin size={12} /> },
        { text: "Available Worldwide", icon: <Globe size={12} /> }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % states.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <GlassSurface
            borderRadius={9999}
            width="220px"
            height="auto"
            opacity={0.6}
            blur={10}
            className="px-3 py-1 text-xs font-bold uppercase flex items-center gap-2 justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] hover:!bg-white/70 relative after:absolute after:inset-0 after:z-0 after:backdrop-blur-sm after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:rounded-[inherit] cursor-default"
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    className="relative z-10 flex items-center gap-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                >
                    {states[index].icon}
                    {states[index].text}
                </motion.span>
            </AnimatePresence>
        </GlassSurface>
    );
}

// Flickering Grid (Interactive Background)
const FlickeringGrid = ({
    squareSize = 4,
    gridGap = 6,
    flickerChance = 0.3,
    color = "rgb(0, 0, 0)",
    width,
    height,
    className,
    maxOpacity = 0.15,
    hoverIntensity = 0.8,
    style
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isInView, setIsInView] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const mousePosition = useRef({ x: -100, y: -100 });

    useEffect(() => {
        console.log("FlickeringGrid mounted");
    }, []);

    const memoizedColor = useMemo(() => {
        const toRGBA = (color) => {
            if (typeof window === "undefined") {
                return `rgba(0, 0, 0,`;
            }
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return "rgba(255, 0, 0,";
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
            return `rgba(${r}, ${g}, ${b},`;
        };
        return toRGBA(color);
    }, [color]);

    const setupCanvas = useCallback(
        (canvas, width, height) => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const cols = Math.floor(width / (squareSize + gridGap));
            const rows = Math.floor(height / (squareSize + gridGap));

            const squares = new Float32Array(cols * rows);
            const gridValues = new Float32Array(cols * rows);

            for (let i = 0; i < squares.length; i++) {
                squares[i] = Math.random() * maxOpacity;
                gridValues[i] = Math.floor(Math.random() * 10);
            }

            return { cols, rows, squares, gridValues, dpr };
        },
        [squareSize, gridGap, maxOpacity],
    );

    const updateSquares = useCallback(
        (squares, gridValues, deltaTime, { cols, rows }) => {
            // 1. Decay and Standard random flicker
            for (let i = 0; i < squares.length; i++) {
                // Decay high opacity values (trails)
                if (squares[i] > maxOpacity) {
                    squares[i] -= 1.0 * deltaTime; // Slower decay for longer trails
                    if (squares[i] < maxOpacity) squares[i] = maxOpacity;
                }

                // Random flicker
                if (Math.random() < flickerChance * deltaTime) {
                    squares[i] = Math.random() * maxOpacity;
                    gridValues[i] = Math.floor(Math.random() * 10);
                }
            }

            // 2. Mouse interaction (Highlight)
            // Check if mouse is roughly over the canvas
            if (mousePosition.current.x >= 0 && mousePosition.current.y >= 0) {
                const x = mousePosition.current.x;
                const y = mousePosition.current.y;

                // Map mouse coordinates to grid coordinates
                const col = Math.floor(x / (squareSize + gridGap));
                const row = Math.floor(y / (squareSize + gridGap));

                // Highlight a circular area (radius 12 - Larger) around the cursor
                const radius = 12;
                const radiusSq = radius * radius;

                for (let dx = -radius; dx <= radius; dx++) {
                    for (let dy = -radius; dy <= radius; dy++) {
                        const distSq = dx * dx + dy * dy;
                        if (distSq > radiusSq) continue;

                        const targetCol = col + dx;
                        const targetRow = row + dy;

                        if (targetCol >= 0 && targetCol < cols && targetRow >= 0 && targetRow < rows) {
                            const index = targetCol * rows + targetRow;

                            // Calculate falloff based on distance
                            const dist = Math.sqrt(distSq);
                            const falloff = Math.max(0, 1 - dist / radius);
                            const targetOpacity = hoverIntensity * falloff;

                            // Apply target opacity if it's higher than current
                            if (squares[index] < targetOpacity) {
                                squares[index] = targetOpacity;
                                // Throttle the flicker speed (0.2 = ~12 times per second at 60fps)
                                if (Math.random() < 0.2) {
                                    gridValues[index] = Math.floor(Math.random() * 10);
                                }
                            }
                        }
                    }
                }
            }
        },
        [flickerChance, maxOpacity, squareSize, gridGap, hoverIntensity],
    );

    const drawGrid = useCallback(
        (ctx, width, height, cols, rows, squares, gridValues, dpr) => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, width, height);

            ctx.font = `bold ${squareSize * dpr}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const opacity = squares[i * rows + j];
                    const value = gridValues[i * rows + j];
                    ctx.fillStyle = `${memoizedColor}${opacity})`;
                    ctx.fillText(
                        value,
                        (i * (squareSize + gridGap) + squareSize / 2) * dpr,
                        (j * (squareSize + gridGap) + squareSize / 2) * dpr
                    );
                }
            }
        },
        [memoizedColor, squareSize, gridGap],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let gridParams;

        const updateCanvasSize = () => {
            const newWidth = width || container.clientWidth;
            const newHeight = height || container.clientHeight;
            setCanvasSize({ width: newWidth, height: newHeight });
            gridParams = setupCanvas(canvas, newWidth, newHeight);
        };

        // Handle Mouse Move
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mousePosition.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        // Reset mouse when leaving to prevent "stuck" highlights
        const handleMouseLeave = () => {
            mousePosition.current = { x: -100, y: -100 };
        };

        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        updateCanvasSize();

        let lastTime = 0;
        const animate = (time) => {
            if (!isInView) return;

            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;

            if (gridParams) {
                updateSquares(gridParams.squares, gridParams.gridValues, deltaTime, gridParams);
                drawGrid(
                    ctx,
                    canvas.width,
                    canvas.height,
                    gridParams.cols,
                    gridParams.rows,
                    gridParams.squares,
                    gridParams.gridValues,
                    gridParams.dpr,
                );
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const resizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
        });

        resizeObserver.observe(container);

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0 },
        );

        intersectionObserver.observe(canvas);

        if (isInView) {
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`} style={style}>
            <canvas
                ref={canvasRef}
                className="pointer-events-none"
                style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                }}
            />
        </div>
    );
};





const FilterButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`
      px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border
      ${active
                ? 'bg-black text-white border-black'
                : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'}
    `}
    >
        {children}
    </button>
);



const ProjectListItem = ({ project, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full border-t border-gray-200 cursor-pointer transition-colors duration-300 hover:bg-gray-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.open(project.link, '_blank')}
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-24 py-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-0">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-6">
                        <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-gray-400">{project.cat}</span>
                        <ArrowUpRight className={`w-8 h-8 text-gray-300 transition-all duration-300 ${isHovered ? 'rotate-45 text-black scale-110' : ''}`} />
                    </div>
                </div>

                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 md:w-2/3">
                                <p className="text-lg text-gray-500 leading-relaxed mb-6">
                                    {project.desc}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded-full text-gray-500 bg-white">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};




const FullScreenArchive = ({ isOpen, onClose, projects }) => {
    const [filter, setFilter] = useState("All");
    // Only show archived projects in the archive
    const archivedProjects = projects.filter(p => p.archived);
    const filteredProjects = filter === "All" ? archivedProjects : archivedProjects.filter(p => p.cat.includes(filter));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl overflow-y-auto"
                >
                    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-20">
                        <div className="flex justify-between items-center mb-20">
                            <h2 className="text-6xl font-black tracking-tighter">ARCHIVE</h2>
                            <div className="flex items-center gap-4">
                                <a
                                    href={RESUME_DATA.socials.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-full bg-black text-white font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                                >
                                    <Github size={18} />
                                    <span className="hidden md:inline">More on GitHub</span>
                                </a>
                                <button
                                    onClick={onClose}
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
                            {["All", "Data", "AI/ML", "Web Dev"].map((cat) => (
                                <FilterButton key={cat} active={filter === cat} onClick={() => setFilter(cat)}>
                                    {cat}
                                </FilterButton>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative h-full"
                                >
                                    <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 relative overflow-hidden h-full flex flex-col justify-between">

                                        <div className="absolute -right-20 -top-20 w-48 h-48 bg-gray-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black bg-gray-100 rounded-full border border-gray-200 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                                    {project.cat}
                                                </span>
                                                <div className="flex gap-2">
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all duration-300"
                                                    >
                                                        <ArrowUpRight size={18} />
                                                    </a>
                                                </div>
                                            </div>

                                            <h3 className="text-3xl font-black mb-4 leading-tight text-gray-900 group-hover:text-black transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                                                {project.desc}
                                            </p>
                                        </div>

                                        <div className="relative z-10 flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase px-2 py-1 bg-white border border-gray-200 rounded text-gray-400 group-hover:border-gray-300 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- HORIZONTAL TIMELINE EXPERIENCE ---
// --- CONNECTED THREAD EXPERIENCE ---
const ConnectedThreadExperience = ({ experiences, onViewArchive }) => {
    return (
        <section id="experience" className="container mx-auto px-6 md:px-12 lg:px-24 mb-48">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
                <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                        EXPERIENCE.
                    </h2>
                </div>
            </div>

            <div className="relative pl-4 md:pl-8">
                {/* The Continuous Thread Line */}
                <div className="absolute left-[19px] md:left-[35px] top-2 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-16">
                    {experiences.map((job, index) => (
                        <ExperienceNode key={index} job={job} index={index} />
                    ))}
                </div>
            </div>

            <div className="mt-24 text-center">
                <button
                    onClick={onViewArchive}
                    className="group text-xl font-bold inline-flex items-center gap-2 border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                >
                    VIEW FULL ARCHIVE <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
};

const ExperienceNode = ({ job, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const isActive = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0.5, 1], [0.3, 1]);
    const scale = useTransform(scrollYProgress, [0.5, 1], [0.95, 1]);

    // Animate date badge colors
    const dateBg = useTransform(scrollYProgress, [0.6, 1], ["#f3f4f6", "#000000"]); // gray-100 to black
    const dateColor = useTransform(scrollYProgress, [0.6, 1], ["#6b7280", "#ffffff"]); // gray-500 to white

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className="relative pl-12 md:pl-24 py-4"
        >
            {/* The Node Dot */}
            <div className="absolute left-0 md:left-4 top-6 w-10 h-10 flex items-center justify-center bg-white z-10">
                <motion.div
                    style={{ scale: isActive }}
                    className="w-4 h-4 bg-black rounded-full ring-4 ring-white shadow-lg"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                    <motion.span
                        style={{ backgroundColor: dateBg, color: dateColor }}
                        className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors duration-500"
                    >
                        {job.period}
                    </motion.span>

                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-1">
                        {job.role}
                    </h3>

                    <div className="text-lg font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        {job.company}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};



// --- CONNECTED THREAD EDUCATION ---
const ConnectedThreadEducation = ({ education }) => {
    return (
        <section id="education" className="container mx-auto px-6 md:px-12 lg:px-24 mb-48">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
                <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                        EDUCATION.
                    </h2>
                </div>
            </div>

            <div className="relative pl-4 md:pl-8">
                {/* The Continuous Thread Line */}
                <div className="absolute left-[19px] md:left-[35px] top-2 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-16">
                    {education.map((edu, index) => (
                        <EducationNode key={index} edu={edu} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const EducationNode = ({ edu, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const isActive = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0.5, 1], [0.3, 1]);
    const scale = useTransform(scrollYProgress, [0.5, 1], [0.95, 1]);

    // Animate date badge colors
    const dateBg = useTransform(scrollYProgress, [0.6, 1], ["#f3f4f6", "#000000"]); // gray-100 to black
    const dateColor = useTransform(scrollYProgress, [0.6, 1], ["#6b7280", "#ffffff"]); // gray-500 to white

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className="relative pl-12 md:pl-24 py-4"
        >
            {/* The Node Dot */}
            <div className="absolute left-0 md:left-4 top-6 w-10 h-10 flex items-center justify-center bg-white z-10">
                <motion.div
                    style={{ scale: isActive }}
                    className="w-4 h-4 bg-black rounded-full ring-4 ring-white shadow-lg"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                    <motion.span
                        style={{ backgroundColor: dateBg, color: dateColor }}
                        className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors duration-500"
                    >
                        {edu.period}
                    </motion.span>

                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-1">
                        {edu.school}
                    </h3>

                    <div className="text-lg font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        {edu.degree}
                    </div>

                    <div className="flex gap-3 items-center flex-wrap">
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black bg-gray-100 rounded-full border border-gray-200">
                            {edu.type}
                        </span>
                        {edu.grade && (
                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 rounded-full">
                                GPA: {edu.grade}
                            </span>
                        )}
                    </div>
                </div>

                {edu.link && (
                    <div className="md:pt-8">
                        <a
                            href={edu.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                        >
                            View Certificate <ArrowUpRight size={12} />
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- EXPERIENCE ARCHIVE ---
const ExperienceArchive = ({ isOpen, onClose, experiences }) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl overflow-y-auto"
                >
                    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-20">
                        <div className="flex justify-between items-center mb-20">
                            <h2 className="text-6xl font-black tracking-tighter">EXPERIENCE ARCHIVE</h2>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-12 pb-12">
                            {experiences.map((job, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative pl-8 md:pl-12"
                                >
                                    {/* Dot */}
                                    <div className="absolute -left-[9px] top-2 w-4 h-4 bg-black rounded-full border-4 border-white shadow-sm"></div>

                                    <div className="bg-white border border-gray-200 rounded-[2rem] p-8 hover:shadow-lg transition-all duration-300 group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                            <div>
                                                <h3 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-black transition-colors">{job.role}</h3>
                                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-black transition-colors duration-500" />
                                                    {job.company}
                                                </div>
                                            </div>
                                            <span className="px-4 py-2 text-xs font-black uppercase tracking-widest text-black bg-gray-100 rounded-full border border-gray-200 group-hover:bg-black group-hover:text-white transition-colors duration-500 whitespace-nowrap">
                                                {job.period}
                                            </span>
                                        </div>
                                        <ul className="space-y-3">
                                            {job.points.map((point, j) => (
                                                <li key={j} className="flex items-start gap-3 text-gray-500 text-sm font-medium leading-relaxed">
                                                    <span className="mt-2 w-1 h-1 bg-gray-300 rounded-full flex-shrink-0 group-hover:bg-black transition-colors duration-500" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- FLOATING DOCK NAVIGATION ---
const FloatingDock = () => {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -100; // Offset for breathing room
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'work', icon: Briefcase, label: 'Work' },
        { id: 'research', icon: BookOpen, label: 'Research' },
        { id: 'experience', icon: User, label: 'Experience' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
            >
                <GlassSurface
                    borderRadius={9999}
                    width="auto"
                    height="auto"
                    className="flex items-center gap-2 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                    opacity={0.6}
                    blur={10}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className="relative group p-3 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <item.icon size={20} className="text-gray-600 group-hover:text-black transition-colors" />
                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </GlassSurface>
            </motion.div>
        </div>
    );
};



// --- SCROLL PROGRESS INDICATOR ---
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            style={{ opacity: pathLength }}
            className="fixed bottom-8 right-8 z-40 w-14 h-14 hidden md:flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <svg width="50" height="50" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="30" pathLength="1" className="stroke-gray-200 stroke-[4px] fill-none" />
                <motion.circle
                    cx="50" cy="50" r="30" pathLength="1"
                    className="stroke-black stroke-[4px] fill-none"
                    style={{ pathLength }}
                />
            </svg>
            <ArrowUp size={18} className="absolute text-black" />
        </motion.div>
    )
}

const PaperItem = ({ paper, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => paper.link && window.open(paper.link, '_blank')}
            className="relative border-b border-gray-200 py-12 px-6 -mx-6 md:px-8 md:-mx-8 rounded-[2rem] cursor-pointer transition-all duration-300 hover:bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                <div className="md:w-3/4">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            {paper.date}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            {paper.type}
                        </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black leading-[0.9] tracking-tighter text-gray-900 transition-colors duration-300">
                        {paper.title}
                    </h3>
                </div>

                <div className="md:w-1/4 flex flex-col items-end justify-between h-full gap-4">
                    <ArrowUpRight className={`w-12 h-12 text-gray-200 transition-all duration-300 ${isHovered ? 'text-black rotate-45' : ''}`} />
                    <motion.p
                        className="text-sm text-gray-500 text-right max-w-[200px]"
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    >
                        {paper.desc}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};

const PaperList = ({ papers }) => {
    return (
        <div className="flex flex-col">
            {papers.map((paper, i) => (
                <PaperItem
                    key={i}
                    paper={paper}
                    index={i}
                />
            ))}
        </div>
    );
};

const App = () => {

    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isExperienceArchiveOpen, setIsExperienceArchiveOpen] = useState(false);
    const [projectFilter, setProjectFilter] = useState("All");

    const filteredHomeProjects = projectFilter === "All"
        ? RESUME_DATA.projects.filter(p => p.featured)
        : RESUME_DATA.projects.filter(p => p.featured && p.cat.includes(projectFilter));

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white relative">


                <FullScreenArchive isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} projects={RESUME_DATA.projects} />
                <ExperienceArchive isOpen={isExperienceArchiveOpen} onClose={() => setIsExperienceArchiveOpen(false)} experiences={RESUME_DATA.experience} />

                {/* Floating Dock Navigation */}
                <FloatingDock />

                <ScrollProgress />

                <main className="relative z-10">

                    {/* --- HERO --- */}
                    <section id="home" className="relative w-full pt-32 md:pt-48 pb-24 overflow-hidden">

                        {/* Flickering Grid Background ONLY in Hero */}
                        <FlickeringGrid
                            squareSize={10}
                            gridGap={6}
                            color="rgb(0, 0, 0)"
                            maxOpacity={0.15}
                            flickerChance={0.1}
                            hoverIntensity={1.0}
                            className="absolute inset-0 z-0"
                            style={{
                                maskImage: 'radial-gradient(circle at 25% 85%, transparent 150px, black 600px)',
                                WebkitMaskImage: 'radial-gradient(circle at 25% 85%, transparent 150px, black 600px)'
                            }}
                        />

                        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <GlassSurface
                                        borderRadius={9999}
                                        width="auto"
                                        height="auto"
                                        opacity={0.6}
                                        blur={10}
                                        className="px-3 py-1 text-xs font-bold uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] hover:!bg-white/70 relative after:absolute after:inset-0 after:z-0 after:backdrop-blur-sm after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:rounded-[inherit] cursor-default"
                                    >
                                        Available for work
                                    </GlassSurface>
                                    {/* Updated Location Badge */}
                                    <LocationBadge />
                                </div>

                                <h1 className="text-[17vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-black tracking-tighter text-black mb-12">
                                    KRISHNA<br />
                                    THAKAR.
                                </h1>

                                <div className="md:flex justify-between items-end pt-8">
                                    <div className="md:w-1/2 mb-8 md:mb-0">
                                        <p className="text-2xl md:text-3xl font-medium leading-tight text-gray-600">
                                            Full Stack Developer & AI Researcher.
                                        </p>
                                        <p className="text-lg text-gray-400 mt-2">
                                            Masters in Computer Science @ SEMO.
                                        </p>
                                        <p className="text-lg text-gray-400">
                                            Minor in Data Science.
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <a href={RESUME_DATA.socials.github} className="block group">
                                            <GlassSurface
                                                borderRadius={9999}
                                                width="auto"
                                                height="auto"
                                                opacity={0.6}
                                                blur={10}
                                                className="p-4 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] group-hover:!bg-white/70 relative after:absolute after:inset-0 after:z-0 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300 after:rounded-[inherit]"
                                            >
                                                <Github size={24} className="relative z-10" />
                                            </GlassSurface>
                                        </a>
                                        <a href={RESUME_DATA.socials.linkedin} className="block group">
                                            <GlassSurface
                                                borderRadius={9999}
                                                width="auto"
                                                height="auto"
                                                opacity={0.6}
                                                blur={10}
                                                className="p-4 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] group-hover:!bg-white/70 relative after:absolute after:inset-0 after:z-0 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300 after:rounded-[inherit]"
                                            >
                                                <Linkedin size={24} className="relative z-10" />
                                            </GlassSurface>
                                        </a>
                                        <a href="/cv.pdf" className="block group">
                                            <GlassSurface
                                                borderRadius={9999}
                                                width="auto"
                                                height="auto"
                                                opacity={0.6}
                                                blur={10}
                                                className="px-8 py-4 font-bold transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] group-hover:!bg-white/70 relative after:absolute after:inset-0 after:z-0 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300 after:rounded-[inherit]"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">Resume <ArrowUpRight size={20} /></span>
                                            </GlassSurface>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </section>

                    {/* --- SKILLS TICKER (CurvedLoop) --- */}
                    <div className="w-full relative z-20 mt-10 md:-mt-20">
                        <CurvedLoop
                            marqueeText={RESUME_DATA.skills.join(' ✦ ')}
                            speed={0.5}
                            curveAmount={80}
                            direction="left"
                            interactive={true}
                            className="fill-black text-[140px] md:text-[100px] lg:text-6xl font-black uppercase tracking-wider"
                        />
                    </div>

                    {/* --- PROJECTS --- */}
                    <section id="work" className="mb-48 mt-40">
                        <div className="container mx-auto px-6 md:px-12 lg:px-24">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                                <div>

                                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                                        FEATURED<br />PROJECTS.
                                    </h2>
                                </div>
                                <div className="flex gap-2 mt-8 md:mt-0">
                                    {["All", "Data", "AI/ML", "Web Dev"].map((cat) => (
                                        <FilterButton key={cat} active={projectFilter === cat} onClick={() => setProjectFilter(cat)}>
                                            {cat}
                                        </FilterButton>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            {filteredHomeProjects.map((project, index) => (
                                <ProjectListItem
                                    key={project.id}
                                    project={project}
                                    index={index}
                                />
                            ))}
                        </div>

                        <div className="container mx-auto px-6 md:px-12 lg:px-24 mt-16 text-center">
                            <button
                                onClick={() => setIsArchiveOpen(true)}
                                className="group text-xl font-bold inline-flex items-center gap-2 border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                            >
                                VIEW FULL ARCHIVE <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </section>

                    {/* --- RESEARCH --- */}
                    <section id="research" className="container mx-auto px-6 md:px-12 lg:px-24 mb-48">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                            <div>

                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                                    ACADEMIC<br />PAPERS.
                                </h2>
                            </div>
                        </div>

                        <PaperList papers={RESUME_DATA.research} />
                    </section>

                    {/* --- EXPERIENCE --- */}
                    <ConnectedThreadExperience
                        experiences={RESUME_DATA.experience.filter(job => job.featured)}
                        onViewArchive={() => setIsExperienceArchiveOpen(true)}
                    />

                    {/* --- EDUCATION --- */}
                    <ConnectedThreadEducation education={RESUME_DATA.education} />

                    {/* --- FOOTER --- */}
                    <footer className="w-full bg-black text-white py-32">
                        <div className="container mx-auto px-6 md:px-12 lg:px-24">
                            <h2 className="text-[10vw] leading-none font-black tracking-tighter text-white mb-12">
                                LET'S TALK.
                            </h2>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                                <div className="flex flex-col gap-4">
                                    <a href={`mailto:${RESUME_DATA.email}`} className="text-2xl md:text-4xl font-bold border-b-2 border-white pb-2 inline-block hover:text-gray-300 hover:border-gray-300 transition-colors">
                                        {RESUME_DATA.email}
                                    </a>
                                </div>
                                <div className="flex gap-8">
                                    <a href={RESUME_DATA.socials.linkedin} className="text-lg font-bold uppercase tracking-wider hover:underline inline-block p-2">LinkedIn</a>
                                    <a href={RESUME_DATA.socials.github} className="text-lg font-bold uppercase tracking-wider hover:underline inline-block p-2">GitHub</a>
                                    <a href="/cv.pdf" className="text-lg font-bold uppercase tracking-wider hover:underline inline-block p-2">Resume</a>
                                </div>
                            </div>
                        </div>
                    </footer>

                </main>

                <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* Smooth Scroll */
        html {
          scroll-behavior: smooth;
        }
        body {
          overflow-x: hidden;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }
      `}</style>
            </div>
        </ErrorBoundary>
    );
};

export default App;
