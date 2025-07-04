import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// آیکون‌های Lucide React (با استفاده از SVG داخلی برای سادگی و کنترل مستقیم)
const Icon = ({ name, className = '', size = 24, fill = 'none', stroke = 'currentColor', children, ...props }) => {
    const icons = {
        'muscle-building': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M12 20v-8M12 12V4M18 18l-3-3M6 18l3-3M18 6l-3 3M6 6l3 3M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            </svg>
        ),
        'fat-loss': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M12 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM12 14v-4M12 10l-2-2M12 10l2-2"/>
            </svg>
        ),
        'general-health': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l2 2" />
            </svg>
        ),
        'athletic-performance': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M18 8c0-2.21-1.79-4-4-4s-4 1.79-4 4c0 1.62 1.05 3.01 2.5 3.53V20h3V11.53c1.45-.52 2.5-1.91 2.5-3.53zM12 2v2M4 12h2M20 12h2M12 22v2"/>
            </svg>
        ),
        'bmi-calculator': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M12 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM12 14v-4M12 10l-2-2M12 10l2-2"/>
            </svg>
        ),
        'food-science': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M19.4 10.4c.9 1.1 1.4 2.6 1.4 4.1 0 3.9-3.1 7-7 7s-7-3.1-7-7c0-1.5.5-3 1.4-4.1M12 2v6M12 14v6M8 10h8M6 16h12"/>
            </svg>
        ),
        'sports-nutrition': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M12 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM12 14v-4M12 10l-2-2M12 10l2-2"/>
            </svg>
        ),
        'personalized': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <circle cx="12" cy="7" r="4" />
                <path d="M12 20v-2c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
        ),
        'mail': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="22" y1="6" x2="12" y2="13"></line>
                <line x1="2" y1="6" x2="12" y2="13"></line>
            </svg>
        ),
        'phone': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
        ),
        'back': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        ),
        'user': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        ),
        'clipboard': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
        ),
        'star': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        ),
        'settings': (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82-.33H9a1.65 1.65 0 0 0 1.51-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 .33 1.82V15z"></path>
            </svg>
        )
    };
    return icons[name] || null;
};

// کامپوننت اصلی اپلیکیشن
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    const [user, setUser] = useState(null); // تغییر نام userId به user برای نگهداری شیء کاربر
    const [hoveredService, setHoveredService] = useState(null);
    const [bmiData, setBmiData] = useState({ weight: 70, height: 175 });
    const [bmiResult, setBmiResult] = useState(null);
    const [questionnaireData, setQuestionnaireData] = useState({
        gender: 'male',
        age: 25,
        currentWeight: 70,
        height: 175,
        targetWeight: 65,
        bodyFat: 15, // اختیاری
        activityLevel: 'moderate',
        dietaryPreferences: [],
        allergies: [],
        healthConditions: [],
        sleepHours: '7-8',
        sleepQuality: 'good',
        energyLevels: 'normal',
        lateNightEating: 'rarely',
        stressLevels: 'moderate',
        hydration: '8-10 glasses',
        cookingFrequency: 'often',
        mealPrepAbility: 'yes',
        budget: 'moderate',
        timeCommitment: 'moderate',
        sport: '',
        sportFrequency: '',
        sportDuration: '',
        medicalHistory: [],
        commonFoods: '',
        cravings: '',
        motivation: '',
        challenges: '',
        cookingSkills: 'basic',
        accessToGym: 'yes',
        accessToHealthyFood: 'yes',
        eatingOutFrequency: 'rarely',
        stressCoping: 'exercise',
        specificGoals: '',
        pastDietExperience: '',
        profileName: '', // برای حساب کاربری
        profilePicUrl: '', // برای حساب کاربری
    });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [dietPlan, setDietPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userQuestion, setUserQuestion] = useState('');
    const [geminiResponse, setGeminiResponse] = useState(null);
    const [askingGemini, setAskingGemini] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [userDietPlans, setUserDietPlans] = useState([]); // برای نمایش برنامه های غذایی کاربر

    // مقداردهی اولیه Firebase
    useEffect(() => {
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

            const app = initializeApp(firebaseConfig);
            const authInstance = getAuth(app);
            const dbInstance = getFirestore(app);

            setAuth(authInstance);
            setDb(dbInstance);

            onAuthStateChanged(authInstance, async (currentUser) => {
                setUser(currentUser);
                if (currentUser) {
                    // دریافت اطلاعات کاربر در صورت وجود
                    const userDocRef = doc(dbInstance, `artifacts/${appId}/users/${currentUser.uid}/profile/data`);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setQuestionnaireData(prev => ({ ...prev, ...userDocSnap.data() }));
                    }
                    // دریافت برنامه های غذایی کاربر
                    const q = query(collection(dbInstance, `artifacts/${appId}/users/${currentUser.uid}/dietPlans`));
                    const querySnapshot = await getDocs(q);
                    const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserDietPlans(plans);

                } else {
                    // ورود ناشناس در صورت عدم ورود کاربر
                    try {
                        const anonymousUser = await signInAnonymously(authInstance);
                        setUser(anonymousUser.user);
                    } catch (error) {
                        console.error("خطا در ورود ناشناس:", error);
                        setMessage("ورود با مشکل مواجه شد. لطفا دوباره تلاش کنید.");
                    }
                }
            });
        } catch (error) {
            console.error("خطا در مقداردهی اولیه Firebase:", error);
            setMessage("مقداردهی اولیه اپلیکیشن با مشکل مواجه شد. لطفا بعدا دوباره تلاش کنید.");
        }
    }, []);

    // ذخیره اطلاعات کاربر در Firestore
    const saveUserData = useCallback(async (data) => {
        if (db && user) {
            try {
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile/data`);
                await setDoc(userDocRef, data, { merge: true });
                setMessage("اطلاعات با موفقیت ذخیره شد!");
            } catch (error) {
                console.error("خطا در ذخیره اطلاعات کاربر:", error);
                setMessage("ذخیره اطلاعات با مشکل مواجه شد. لطفا دوباره تلاش کنید.");
            }
        }
    }, [db, user]);

    // افکت پس‌زمینه متحرک
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const numParticles = 100;
        const colors = ['#A8E6CF', '#DCEDC1', '#FFD3B5', '#FFAAA5', '#FF8B94']; // رنگ‌های سبز و گرم

        class Particle {
            constructor(x, y, radius, color, velocity) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.velocity = velocity;
                this.alpha = 1;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.draw();
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.005;
                if (this.alpha < 0) {
                    this.alpha = 1;
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.velocity = {
                        x: (Math.random() - 0.5) * 0.5,
                        y: (Math.random() - 0.5) * 0.5
                    };
                }
            }
        }

        for (let i = 0; i < numParticles; i++) {
            const radius = Math.random() * 2 + 1;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const velocity = {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
            };
            particles.push(new Particle(x, y, radius, color, velocity));
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
            });
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // منطق ماشین حساب BMI
    const calculateBMI = useCallback(() => {
        const weightKg = parseFloat(bmiData.weight);
        const heightCm = parseFloat(bmiData.height);

        if (isNaN(weightKg) || isNaN(heightCm) || heightCm === 0) {
            setBmiResult({ value: 'ورودی نامعتبر', category: '', risk: '' });
            return;
        }

        const heightM = heightCm / 100;
        const bmiValue = weightKg / (heightM * heightM);
        let category = '';
        let risk = '';
        let colorClass = '';

        if (bmiValue < 18.5) {
            category = 'کم‌وزن';
            risk = 'حداقل خطر';
            colorClass = 'bg-blue-500';
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            category = 'وزن نرمال';
            risk = 'حداقل خطر';
            colorClass = 'bg-green-500';
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            category = 'اضافه وزن';
            risk = 'افزایش خطر';
            colorClass = 'bg-yellow-500';
        } else if (bmiValue >= 30 && bmiValue < 34.9) {
            category = 'چاق (کلاس I)';
            risk = 'خطر بالا';
            colorClass = 'bg-orange-500'; // Changed from red to orange for Class I
        } else if (bmiValue >= 35 && bmiValue < 39.9) {
            category = 'چاق (کلاس II)';
            risk = 'خطر بسیار بالا';
            colorClass = 'bg-red-500'; // Red for Class II
        } else {
            category = 'چاق (کلاس III)';
            risk = 'خطر بسیار شدید';
            colorClass = 'bg-red-700'; // Darker red for Class III
        }

        setBmiResult({ value: bmiValue.toFixed(1), category, risk, colorClass });
    }, [bmiData]);

    useEffect(() => {
        if (currentPage === 'bmi-calculator') {
            calculateBMI();
        }
    }, [bmiData, currentPage, calculateBMI]);

    // سوالات پرسش‌نامه
    const questions = [
        {
            id: 'gender-age',
            title: 'اطلاعات اولیه',
            description: 'برای شخصی‌سازی برنامه، کمی درباره خودتان بگویید.',
            fields: [
                { name: 'gender', label: 'جنسیت', type: 'select', options: ['male', 'female', 'other'], displayOptions: ['مرد', 'زن', 'دیگر'] },
                { name: 'age', label: 'سن', type: 'range', min: 10, max: 90, step: 1 },
            ],
            characterUpdate: true,
        },
        {
            id: 'physical-stats',
            title: 'آمار فیزیکی و اهداف',
            description: 'معیارهای فعلی و هدف شما.',
            fields: [
                { name: 'currentWeight', label: 'وزن فعلی (کیلوگرم)', type: 'range', min: 30, max: 200, step: 1 },
                { name: 'height', label: 'قد (سانتی‌متر)', type: 'range', min: 120, max: 220, step: 1 },
                { name: 'targetWeight', label: 'وزن هدف (کیلوگرم)', type: 'range', min: 30, max: 200, step: 1 },
                { name: 'bodyFat', label: 'درصد چربی بدن (اختیاری)', type: 'range', min: 5, max: 50, step: 1 },
            ],
            characterUpdate: true,
        },
        {
            id: 'activity-level',
            title: 'سطح فعالیت',
            description: 'شما چقدر فعال هستید؟',
            fields: [
                { name: 'activityLevel', label: 'سطح فعالیت', type: 'select', options: ['sedentary', 'lightly active', 'moderate', 'very active', 'extra active'], displayOptions: ['کم‌تحرک', 'فعالیت سبک', 'متوسط', 'بسیار فعال', 'فوق‌العاده فعال'] },
            ],
        },
        {
            id: 'sports-activities',
            title: 'ورزش و فعالیت‌ها',
            description: 'درباره روتین ورزشی خود بگویید.',
            fields: [
                { name: 'sport', label: 'ورزش/فعالیت اصلی', type: 'datalist', options: ['Running', 'Weightlifting', 'Swimming', 'Cycling', 'Yoga', 'Basketball', 'Soccer', 'Tennis', 'Martial Arts', 'Hiking', 'Dancing', 'Gymnastics', 'CrossFit', 'Boxing', 'Rowing', 'Skiing', 'Snowboarding', 'Surfing', 'Volleyball', 'Badminton', 'Table Tennis', 'Golf', 'Hockey', 'Rugby', 'Baseball', 'Softball', 'Climbing', 'Pilates', 'Zumba', 'Aerobics', 'Other'], displayOptions: ['دویدن', 'وزنه‌برداری', 'شنا', 'دوچرخه‌سواری', 'یوگا', 'بسکتبال', 'فوتبال', 'تنیس', 'هنرهای رزمی', 'کوه‌نوردی', 'رقص', 'ژیمناستیک', 'کراس‌فیت', 'بوکس', 'قایقرانی', 'اسکی', 'اسنوبرد', 'موج‌سواری', 'والیبال', 'بدمینتون', 'تنیس روی میز', 'گلف', 'هاکی', 'راگبی', 'بیسبال', 'سافتبال', 'صخره‌نوردی', 'پیلاتس', 'زومبا', 'ایروبیک', 'سایر'] },
                { name: 'sportFrequency', label: 'چند وقت یکبار این ورزش را انجام می‌دهید؟', type: 'select', options: ['Rarely', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'Daily'], displayOptions: ['به ندرت', '۱-۲ بار در هفته', '۳-۴ بار در هفته', '۵-۶ بار در هفته', 'روزانه'] },
                { name: 'sportDuration', label: 'میانگین مدت زمان هر جلسه (دقیقه)', type: 'range', min: 15, max: 240, step: 15 },
            ],
        },
        {
            id: 'dietary-preferences',
            title: 'ترجیحات غذایی و آلرژی‌ها',
            description: 'آیا رژیم غذایی خاصی یا ترجیحات غذایی دارید؟',
            fields: [
                { name: 'dietaryPreferences', label: 'ترجیحات غذایی (موارد مورد نظر را انتخاب کنید)', type: 'checkbox-group', options: ['Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Mediterranean', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein', 'No Red Meat', 'Halal', 'Kosher', 'Other'], displayOptions: ['گیاهخواری', 'وگان', 'پسکاتارین', 'کتوژنیک', 'پالئو', 'مدیترانه‌ای', 'بدون گلوتن', 'بدون لبنیات', 'کم کربوهیدرات', 'پروتئین بالا', 'بدون گوشت قرمز', 'حلال', 'کوشر', 'سایر'] },
                {
                    name: 'allergies',
                    label: 'آلرژی‌ها/عدم تحمل غذایی',
                    type: 'datalist',
                    options: [
                        'بادام‌زمینی', 'درخت آجیل (بادام، گردو، پسته و غیره)', 'شیر', 'تخم‌مرغ', 'گندم', 'سویا', 'ماهی', 'صدف',
                        'گلوتن', 'لاکتوز', 'فروکتوز', 'هیستامین', 'سولفیت', 'کافئین', 'نیکل', 'کنجد', 'خردل', 'کرفس',
                        'لوپین', 'ملاس', 'ذرت', 'برنج', 'سیب‌زمینی', 'گوجه‌فرنگی', 'فلفل دلمه‌ای', 'بادمجان', 'مرکبات',
                        'توت‌فرنگی', 'کیوی', 'آووکادو', 'موز', 'سیب', 'هلو', 'گیلاس', 'آلو', 'لوبیا', 'نخود', 'عدس',
                        'جو دوسر', 'چاودار', 'جو', 'گوشت گاو', 'گوشت مرغ', 'گوشت خوک', 'گوشت بره', 'ژلاتین', 'مخمر',
                        'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً بادام‌زمینی، لاکتوز)'
                },
            ],
        },
        {
            id: 'health-conditions',
            title: 'شرایط سلامتی و دارو',
            description: 'آیا شرایط سلامتی خاصی دارید یا داروی خاصی مصرف می‌کنید؟',
            fields: [
                {
                    name: 'healthConditions',
                    label: 'شرایط سلامتی مرتبط',
                    type: 'datalist',
                    options: [
                        'دیابت نوع ۱', 'دیابت نوع ۲', 'فشار خون بالا (هایپرتنشن)', 'کلسترول بالا (هایپرلیپیدمی)',
                        'بیماری قلبی عروقی', 'بیماری کلیوی', 'بیماری کبد چرب', 'سندروم روده تحریک‌پذیر (IBS)',
                        'بیماری کرون', 'کولیت اولسراتیو', 'بیماری سلیاک', 'تیروئید کم‌کار (هیپوتیروئیدیسم)',
                        'تیروئید پرکار (هیپرتیروئیدیسم)', 'سندروم تخمدان پلی‌کیستیک (PCOS)', 'کم‌خونی',
                        'پوکی استخوان', 'نقرس', 'آرتریت روماتوئید', 'رفلاکس معده (GERD)', 'سنگ کلیه', 'فیبرومیالژیا',
                        'سندروم خستگی مزمن', 'میگرن', 'افسردگی', 'اضطراب', 'اختلالات خوردن', 'آسم', 'صرع',
                        'بیماری پارکینسون', 'مولتیپل اسکلروزیس (MS)', 'لوپوس', 'پسوریازیس', 'اگزما', 'بیماری آدیسون',
                        'سندروم کوشینگ', 'هموکروماتوز', 'بیماری ویلسون', 'سیستیک فیبروزیس', 'سندروم داون', 'اوتیسم',
                        'بیماری‌های خودایمنی', 'سابقه سرطان', 'سابقه سکته مغزی', 'سابقه حمله قلبی', 'بیماری‌های التهابی روده (IBD)',
                        'فشار خون پایین (هایپوتنشن)', 'هموروئید', 'واریس', 'آرتروز', 'دیسک کمر/گردن',
                        'آسیب‌های مفصلی', 'فشار چشم بالا (گلوکوم)', 'آب مروارید', 'مشکلات شنوایی', 'آپنه خواب',
                        'سندروم پای بی‌قرار', 'نارسایی مزمن کلیه', 'سنگ صفرا', 'پانکراتیت', 'هپاتیت', 'ایدز/HIV',
                        'سایر موارد'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً دیابت، فشار خون بالا)'
                },
                {
                    name: 'medicalHistory',
                    label: 'داروهای مصرفی و سابقه جراحی مرتبط (اختیاری)',
                    type: 'datalist',
                    options: [
                        'انسولین', 'متفورمین', 'لیزینوپریل', 'آتورواستاتین', 'لِووتیروکسین', 'آلبوترول', 'پردنیزون',
                        'متوترکسات', 'هیدروکسی‌کلروکین', 'سولفاسالازین', 'آزاتیوپرین', 'سیکلوسپورین', 'تاکرولیموس',
                        'مایکوفنولات موفتیل', 'ریتوکسی‌ماب', 'اینفلیکسیماب', 'آدالیموماب', 'اتانرسپت', 'گولیموماب',
                        'سرچشمه‌نوماب', 'سیکوکینوماب', 'اوسِکینوماب', 'توفاسیتینیب', 'باریسیتینیب', 'آپرمیلاست',
                        'فومارات دی‌متیل', 'ناتالیزوماب', 'اوکرلیزوماب', 'فینگولیمود', 'تریفلوئونوماید', 'کلادریبین',
                        'آلِمتوزوماب', 'داکلوزوماب', 'گلاتیرامر استات', 'اینترفرون بتا', 'تتراسایکلین', 'داکسی‌سایکلین',
                        'آموکسی‌سیلین', 'آزیترومایسین', 'سفالکسین', 'سیپروفلوکساسین', 'لووفلوکساسین', 'مترونیدازول',
                        'فلوکونازول', 'وریکونازول', 'کاسپوفونژین', 'میکافونژین', 'آنیدولافونژین', 'آسیکلوویر',
                        'والاسیکلوویر', 'فامسیکلوویر', 'گانسیکلوویر', 'والگانسیکلوویر', 'فوسکارنت', 'سیدوفوویر',
                        'لامی‌وودین', 'تنوفوویر', 'امتری‌سیتابین', 'اباکاویر', 'زیدوودین', 'دیدانوزین', 'استاوودین',
                        'نویراپین', 'افاویرنز', 'ریتوناویر', 'لوپیناویر', 'آتازاناویر', 'داروناویر', 'رالتگراویر',
                        'دولوتگراویر', 'بیکتگراویر', 'الویتگراویر', 'کابوتگراویر', 'پره‌گابالین', 'گاباپنتین',
                        'کاربامازپین', 'اکس‌کاربازپین', 'لاموتریژین', 'فنی‌توئین', 'والپروات سدیم', 'توپیرامات',
                        'زونیساماید', 'لوتیراستام', 'پریمیدون', 'فنوباربیتال', 'اتوسوکسیماید', 'کلونازپام',
                        'دیازپام', 'لورازپام', 'آلپرازولام', 'بوسپیرون', 'ونلافاکسین', 'دولوکستین', 'میلناسیپران',
                        'سیتالوپرام', 'اس‌سیتالوپرام', 'فلوکستین', 'فلووکسامین', 'پاروکستین', 'سرترالین',
                        'ترازودون', 'میرتازاپین', 'بوپروپیون', 'ایمی‌پرامین', 'آمی‌تریپتیلین', 'نورتریپتیلین',
                        'دوکسپین', 'کلومی‌پرامین', 'لیتیوم', 'والپروات', 'کاربامازپین', 'لاموتریژین', 'آری‌پیپرازول',
                        'اولانزاپین', 'کوتیاپین', 'ریسپریدون', 'زیپراسیدون', 'آسناپین', 'لوراسیدون', 'کلوزاپین',
                        'هالوپریدول', 'کلرپرومازین', 'فلوفنازین', 'پرفنازین', 'تیوریدازین', 'تری‌فلئوپرازین',
                        'جراحی بای‌پس معده', 'جراحی اسلیو معده', 'جراحی کیسه صفرا', 'آپاندکتومی', 'هیسترکتومی',
                        'ماستکتومی', 'جراحی تعویض مفصل', 'جراحی قلب باز', 'آنژیوپلاستی', 'جراحی کاتاراکت',
                        'جراحی لیزیک', 'جراحی تیروئید', 'جراحی دیسک کمر', 'جراحی رباط صلیبی', 'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً انسولین، جراحی بای‌پس معده)'
                },
            ],
        },
        {
            id: 'sleep-stress',
            title: 'مدیریت خواب و استرس',
            description: 'چگونه استراحت و استرس خود را مدیریت می‌کنید؟',
            fields: [
                { name: 'sleepHours', label: 'میانگین ساعات خواب در شب', type: 'select', options: ['< 5 hours', '5-6 hours', '7-8 hours', '9-10 hours', '> 10 hours'], displayOptions: ['کمتر از ۵ ساعت', '۵-۶ ساعت', '۷-۸ ساعت', '۹-۱۰ ساعت', 'بیشتر از ۱۰ ساعت'] },
                { name: 'sleepQuality', label: 'کیفیت خواب', type: 'select', options: ['Poor (often restless)', 'Fair (some interruptions)', 'Good (mostly rested)', 'Excellent (always refreshed)'], displayOptions: ['ضعیف (اغلب بی‌قرار)', 'متوسط (با وقفه‌هایی)', 'خوب (اغلب با استراحت کامل)', 'عالی (همیشه سرحال)'] },
                { name: 'energyLevels', label: 'سطح کلی انرژی', type: 'select', options: ['Low (fatigued often)', 'Moderate (some dips)', 'Normal energy', 'High (energetic)'], displayOptions: ['پایین (اغلب خسته)', 'متوسط (نوساناتی دارد)', 'انرژی نرمال', 'بالا (پرانرژی)'] },
                { name: 'stressLevels', label: 'سطح استرس', type: 'select', options: ['Very High', 'High', 'Moderate', 'Low', 'Very Low'], displayOptions: ['بسیار بالا', 'بالا', 'متوسط', 'پایین', 'بسیار پایین'] },
                { name: 'stressCoping', label: 'روش‌های مقابله با استرس', type: 'select', options: ['exercise', 'meditation', 'hobbies', 'socializing', 'reading', 'other'], displayOptions: ['ورزش', 'مدیتیشن', 'سرگرمی‌ها', 'تعامل اجتماعی', 'مطالعه', 'سایر'] }, // جدید
            ],
        },
        {
            id: 'dietary-habits',
            title: 'عادات غذایی روزمره',
            description: 'درباره الگوی غذایی معمول خود بگویید.',
            fields: [
                { name: 'mealFrequency', label: 'تعداد وعده‌های غذایی در روز', type: 'select', options: ['1-2', '3', '4-5', '6+'], displayOptions: ['۱-۲ وعده', '۳ وعده', '۴-۵ وعده', '۶+ وعده'] }, // جدید
                { name: 'eatingOutFrequency', label: 'چند وقت یکبار بیرون غذا می‌خورید؟', type: 'select', options: ['rarely', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'daily'], displayOptions: ['به ندرت', '۱-۲ بار در هفته', '۳-۴ بار در هفته', '۵-۶ بار در هفته', 'روزانه'] }, // جدید
                {
                    name: 'commonFoods',
                    label: 'غذاهای معمول مصرفی',
                    type: 'datalist',
                    options: [
                        'مرغ', 'گوشت گاو', 'ماهی', 'تخم‌مرغ', 'لبنیات (شیر، ماست، پنیر)', 'برنج', 'نان', 'پاستا', 'سیب‌زمینی',
                        'جو دوسر', 'نان تست', 'میوه‌ها (سیب، موز، پرتقال)', 'سبزیجات (بروکلی، اسفناج، هویج)', 'آجیل و دانه‌ها',
                        'حبوبات (عدس، لوبیا، نخود)', 'روغن زیتون', 'روغن نارگیل', 'کره', 'آبمیوه', 'نوشابه', 'قهوه', 'چای',
                        'شیرینی‌جات', 'شکلات', 'فست‌فود', 'پیتزا', 'ساندویچ', 'سالاد', 'سوپ', 'ماست یونانی', 'پنیر کاتیج',
                        'کینوا', 'گندم سیاه', 'سیب‌زمینی شیرین', 'آووکادو', 'توفو', 'تمپه', 'لوبیای سیاه', 'نخود سبز',
                        'کلم بروکلی', 'کلم پیچ', 'اسفناج', 'فلفل دلمه‌ای', 'گوجه‌فرنگی', 'خیار', 'پیاز', 'سیر', 'زنجبیل',
                        'زردچوبه', 'دارچین', 'فلفل سیاه', 'نمک', 'عسل', 'شیره افرا', 'شکر قهوه‌ای', 'شکر سفید',
                        'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً مرغ، برنج، بروکلی)'
                },
                {
                    name: 'cravings',
                    label: 'هوس‌های غذایی رایج',
                    type: 'datalist',
                    options: [
                        'شیرینی‌جات', 'شکلات', 'چیپس', 'فست‌فود', 'پیتزا', 'نوشابه', 'بستنی', 'کیک', 'کلوچه', 'آب‌نبات',
                        'غذاهای شور', 'غذاهای چرب', 'غذاهای سرخ‌شده', 'کربوهیدرات‌های ساده', 'نان سفید', 'پاستا سفید',
                        'پنیر', 'گوشت قرمز', 'قهوه', 'چای', 'نوشیدنی‌های انرژی‌زا', 'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً شکلات، چیپس، پیتزا)'
                },
                { name: 'lateNightEating', label: 'خوردن در اواخر شب', type: 'select', options: ['Frequently', 'Sometimes', 'Rarely', 'Never'], displayOptions: ['اغلب', 'گاهی اوقات', 'به ندرت', 'هرگز'] },
            ],
        },
        {
            id: 'lifestyle-habits',
            title: 'عادات سبک زندگی و آمادگی',
            description: 'جزئیات بیشتری درباره روتین روزانه شما.',
            fields: [
                { name: 'hydration', label: 'مصرف روزانه آب', type: 'select', options: ['< 4 glasses', '4-7 glasses', '8-10 glasses', '> 10 glasses'], displayOptions: ['کمتر از ۴ لیوان', '۴-۷ لیوان', '۸-۱۰ لیوان', 'بیشتر از ۱۰ لیوان'] },
                { name: 'cookingFrequency', label: 'چند وقت یکبار در خانه آشپزی می‌کنید؟', type: 'select', options: ['Rarely', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'Daily'], displayOptions: ['به ندرت', '۱-۲ بار در هفته', '۳-۴ بار در هفته', '۵-۶ بار در هفته', 'روزانه'] },
                { name: 'cookingSkills', label: 'سطح مهارت آشپزی', type: 'select', options: ['basic', 'intermediate', 'advanced'], displayOptions: ['مبتدی', 'متوسط', 'پیشرفته'] }, // جدید
                { name: 'mealPrepAbility', label: 'آیا قادر به آماده‌سازی وعده‌های غذایی هستید؟', type: 'select', options: ['yes', 'no', 'sometimes'], displayOptions: ['بله', 'خیر', 'گاهی اوقات'] },
                { name: 'budget', label: 'بودجه برای غذا', type: 'select', options: ['Low', 'Moderate', 'High'], displayOptions: ['کم', 'متوسط', 'زیاد'] },
                { name: 'timeCommitment', label: 'میزان تعهد زمانی برای آماده‌سازی وعده‌های غذایی', type: 'select', options: ['Low', 'Moderate', 'High'], displayOptions: ['کم', 'متوسط', 'زیاد'] },
                { name: 'accessToHealthyFood', label: 'دسترسی به غذاهای سالم', type: 'select', options: ['easy', 'moderate', 'difficult'], displayOptions: ['آسان', 'متوسط', 'دشوار'] }, // جدید
                { name: 'accessToGym', label: 'دسترسی به باشگاه/امکانات ورزشی', type: 'select', options: ['yes', 'no', 'limited'], displayOptions: ['بله', 'خیر', 'محدود'] }, // جدید
            ],
        },
        {
            id: 'goals-motivation',
            title: 'اهداف و انگیزه',
            description: 'چه چیزی شما را برای این تحول برانگیخته است؟',
            fields: [
                {
                    name: 'specificGoals',
                    label: 'اهداف سلامتی/تناسب اندام مشخص (اختیاری)',
                    type: 'datalist',
                    options: [
                        'کاهش وزن', 'افزایش عضله', 'کاهش چربی بدن', 'افزایش استقامت', 'افزایش قدرت', 'بهبود عملکرد ورزشی',
                        'بهبود سلامت قلب', 'کنترل دیابت', 'کاهش کلسترول', 'کاهش فشار خون', 'بهبود سلامت روده',
                        'کاهش التهاب', 'افزایش انرژی', 'بهبود کیفیت خواب', 'کاهش استرس', 'بهبود خلق و خو',
                        'افزایش تمرکز', 'تقویت سیستم ایمنی', 'مدیریت آلرژی‌های غذایی', 'بهبود سلامت پوست',
                        'افزایش انعطاف‌پذیری', 'بهبود تعادل', 'آماده شدن برای ماراتن', 'آماده شدن برای مسابقات',
                        'کاهش درد مفاصل', 'افزایش تراکم استخوان', 'بهبود هضم', 'کاهش نفخ', 'افزایش میل جنسی',
                        'بهبود باروری', 'کاهش علائم PMS', 'بهبود سلامت مو و ناخن', 'افزایش طول عمر', 'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً آماده شدن برای ماراتن، کاهش درد مفاصل)'
                },
                { name: 'motivation', label: 'سطح انگیزه شما', type: 'select', options: ['low', 'moderate', 'high', 'very high'], displayOptions: ['پایین', 'متوسط', 'بالا', 'بسیار بالا'] }, // جدید
                {
                    name: 'challenges',
                    label: 'بزرگترین چالش‌های شما در گذشته برای رسیدن به اهداف سلامتی چه بوده است؟',
                    type: 'datalist',
                    options: [
                        'کمبود وقت', 'عدم آگاهی', 'هوس‌های غذایی', 'عدم انگیزه', 'مشکل در پایبندی به رژیم',
                        'هزینه بالای غذاهای سالم', 'دسترسی محدود به غذاهای سالم', 'محیط اجتماعی نامناسب',
                        'استرس زیاد', 'مشکلات خواب', 'آسیب‌های جسمی', 'بیماری‌های مزمن', 'سفر زیاد',
                        'شیفت کاری نامنظم', 'عدم حمایت خانواده/دوستان', 'نتایج کند یا ناامیدکننده',
                        'عدم دسترسی به باشگاه/مربی', 'عادت‌های بد قدیمی', 'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً کمبود وقت، عدم آگاهی، هوس‌ها)'
                },
                {
                    name: 'pastDietExperience',
                    label: 'تجربه قبلی با رژیم‌های غذایی (اختیاری)',
                    type: 'datalist',
                    options: [
                        'رژیم کتوژنیک', 'رژیم مدیترانه‌ای', 'رژیم پالئو', 'رژیم وگان', 'رژیم گیاهخواری', 'رژیم کم کربوهیدرات',
                        'رژیم پروتئین بالا', 'رژیم فستینگ متناوب', 'رژیم بدون گلوتن', 'رژیم بدون لبنیات', 'رژیم غذایی مایع',
                        'رژیم سم‌زدایی', 'رژیم غذایی کالری محدود', 'رژیم غذایی کم چرب', 'رژیم غذایی کم سدیم',
                        'رژیم DASH', 'رژیم اتکینز', 'رژیم زون', 'رژیم Weight Watchers', 'رژیم Jenny Craig',
                        'رژیم غذایی خام‌خواری', 'رژیم غذایی مدیترانه‌ای', 'رژیم غذایی DASH', 'رژیم غذایی MIND',
                        'رژیم غذایی فلکسترین', 'رژیم غذایی بدون قند', 'رژیم غذایی بدون نمک', 'رژیم غذایی بدون چربی',
                        'رژیم غذایی بدون پروتئین', 'رژیم غذایی بدون کربوهیدرات', 'رژیم غذایی بدون گلوتن', 'رژیم غذایی بدون لبنیات',
                        'رژیم غذایی بدون سویا', 'رژیم غذایی بدون آجیل', 'رژیم غذایی بدون تخم‌مرغ', 'رژیم غذایی بدون ماهی',
                        'رژیم غذایی بدون صدف', 'رژیم غذایی بدون ذرت', 'رژیم غذایی بدون برنج', 'رژیم غذایی بدون سیب‌زمینی',
                        'رژیم غذایی بدون گوجه‌فرنگی', 'رژیم غذایی بدون فلفل دلمه‌ای', 'رژیم غذایی بدون بادمجان', 'رژیم غذایی بدون مرکبات',
                        'رژیم غذایی بدون توت‌فرنگی', 'رژیم غذایی بدون کیوی', 'رژیم غذایی بدون آووکادو', 'رژیم غذایی بدون موز',
                        'رژیم غذایی بدون سیب', 'رژیم غذایی بدون هلو', 'رژیم غذایی بدون گیلاس', 'رژیم غذایی بدون آلو',
                        'رژیم غذایی بدون لوبیا', 'رژیم غذایی بدون نخود', 'رژیم غذایی بدون عدس', 'رژیم غذایی بدون جو دوسر',
                        'رژیم غذایی بدون چاودار', 'رژیم غذایی بدون جو', 'رژیم غذایی بدون گوشت گاو', 'رژیم غذایی بدون گوشت مرغ',
                        'رژیم غذایی بدون گوشت خوک', 'رژیم غذایی بدون گوشت بره', 'رژیم غذایی بدون ژلاتین', 'رژیم غذایی بدون مخمر',
                        'سایر'
                    ],
                    placeholder: 'جستجو یا انتخاب کنید (مثلاً رژیم کتو، رژیم مدیترانه‌ای)'
                },
            ],
        },
    ];

    const handleQuestionnaireChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setQuestionnaireData(prev => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter(item => item !== value)
            }));
        } else if (type === 'datalist' || type === 'text') { // Allow direct text input for datalist too
            setQuestionnaireData(prev => ({ ...prev, [name]: value }));
        }
        else {
            setQuestionnaireData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            generateDietPlan();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // کامپوننت مدل کاراکتر (جایگزین با منطق مدل سه‌بعدی واقعی در صورت نیاز)
    const CharacterModel = ({ gender, age, currentWeight, height }) => {
        const bmi = currentWeight / ((height / 100) * (height / 100));
        let bodyColor = '#a8e6cf'; // سبز روشن
        let bodyShapeFactor = 1; // 1 for normal, >1 for chubby, <1 for lean

        if (bmi < 18.5) { // Underweight
            bodyColor = '#a5d8ff'; // Light blue
            bodyShapeFactor = 0.8;
        } else if (bmi >= 18.5 && bmi < 24.9) { // Normal Weight (toned/six-pack)
            bodyColor = '#34D399'; // Stronger green for toned
            bodyShapeFactor = 1;
        } else if (bmi >= 25 && bmi < 29.9) { // Overweight
            bodyColor = '#ffd3b5'; // Orange-ish
            bodyShapeFactor = 1.2;
        } else { // Obese
            bodyColor = '#ff8b94'; // Red-ish
            bodyShapeFactor = 1.4;
        }

        const baseBodyWidth = 40;
        const baseBodyHeight = 80;
        const baseArmLegWidth = 10;
        const baseArmLegHeight = 50;

        let headRadius = 20;

        if (gender === 'female') {
            headRadius = 18;
        }

        const bodyWidth = baseBodyWidth * bodyShapeFactor;
        const bodyHeight = baseBodyHeight + (height - 175) * 0.5; // Adjust body height based on actual height
        const armLegWidth = baseArmLegWidth * bodyShapeFactor * 0.8;
        const armLegHeight = baseArmLegHeight + (height - 175) * 0.3;

        // Six-pack lines for normal/toned body
        const sixPackLines = (bmi >= 18.5 && bmi < 24.9) ? (
            <>
                <line x1="50" y1="60" x2="50" y2="90" stroke="#065F46" strokeWidth="1" />
                <line x1="45" y1="70" x2="55" y2="70" stroke="#065F46" strokeWidth="1" />
                <line x1="45" y1="80" x2="55" y2="80" stroke="#065F46" strokeWidth="1" />
            </>
        ) : null;

        return (
            <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-inner">
                <svg width="120" height="180" viewBox="0 0 120 180">
                    {/* سر */}
                    <circle cx="60" cy="30" r={headRadius} fill="#f0d9b5" />
                    {/* بدن */}
                    <rect x={60 - bodyWidth / 2} y="50" width={bodyWidth} height={bodyHeight} rx="10" ry="10" fill={bodyColor} />
                    {sixPackLines}
                    {/* دست‌ها */}
                    <rect x={60 - bodyWidth / 2 - armLegWidth - 5} y="60" width={armLegWidth} height={armLegHeight} rx="5" ry="5" fill={bodyColor} />
                    <rect x={60 + bodyWidth / 2 + 5} y="60" width={armLegWidth} height={armLegHeight} rx="5" ry="5" fill={bodyColor} />
                    {/* پاها */}
                    <rect x={60 - bodyWidth / 2 + 5} y={50 + bodyHeight} width={armLegWidth + 5} height={armLegHeight + 10} rx="5" ry="5" fill={bodyColor} />
                    <rect x={60 + bodyWidth / 2 - armLegWidth - 10} y={50 + bodyHeight} width={armLegWidth + 5} height={armLegHeight + 10} rx="5" ry="5" fill={bodyColor} />
                    {/* سن روی سر */}
                    <text x="60" y="35" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold">{age}</text>
                </svg>
                <p className="mt-2 text-sm text-gray-700">نمایش بصری</p>
                <p className="text-xs text-gray-500">({gender === 'male' ? 'مرد' : gender === 'female' ? 'زن' : 'دیگر'}, {age} سال، BMI: {bmi.toFixed(1)})</p>
            </div>
        );
    };

    // تولید برنامه غذایی با استفاده از Gemini API
    const generateDietPlan = async () => {
        setLoading(true);
        setMessage("در حال تولید برنامه غذایی شخصی‌سازی شده شما...");

        const prompt = `یک برنامه غذایی شخصی‌سازی شده در قالب PDF (ساختار markdown برای تبدیل به PDF) بر اساس اطلاعات کاربری زیر تولید کنید. بر علوم غذایی، علوم ورزشی، علوم آناتومی و علوم بیولوژیکی تمرکز کنید. اطمینان حاصل کنید که برنامه دقیق، عملی و قابل درک است. هیچ اطلاعاتی در مورد الکل را شامل نشود.

اطلاعات کاربر:
- جنسیت: ${questionnaireData.gender === 'male' ? 'مرد' : questionnaireData.gender === 'female' ? 'زن' : 'دیگر'}
- سن: ${questionnaireData.age}
- وزن فعلی: ${questionnaireData.currentWeight} کیلوگرم
- قد: ${questionnaireData.height} سانتی‌متر
- وزن هدف: ${questionnaireData.targetWeight} کیلوگرم
- درصد چربی بدن تخمینی: ${questionnaireData.bodyFat}% (اختیاری)
- سطح فعالیت: ${questionnaireData.activityLevel}
- ورزش/فعالیت اصلی: ${questionnaireData.sport}
- دفعات ورزش: ${questionnaireData.sportFrequency}
- مدت زمان ورزش: ${questionnaireData.sportDuration} دقیقه در هر جلسه
- ترجیحات غذایی: ${questionnaireData.dietaryPreferences.join(', ')}
- آلرژی‌ها/عدم تحمل غذایی: ${questionnaireData.allergies.join(', ')}
- شرایط سلامتی: ${questionnaireData.healthConditions.join(', ')}
- داروهای مصرفی و سابقه جراحی مرتبط: ${questionnaireData.medicalHistory.join(', ')}
- میانگین ساعات خواب در شب: ${questionnaireData.sleepHours}
- کیفیت خواب: ${questionnaireData.sleepQuality}
- سطح کلی انرژی: ${questionnaireData.energyLevels}
- سطح استرس: ${questionnaireData.stressLevels}
- روش‌های مقابله با استرس: ${questionnaireData.stressCoping}
- تعداد وعده‌های غذایی در روز: ${questionnaireData.mealFrequency}
- دفعات غذا خوردن بیرون: ${questionnaireData.eatingOutFrequency}
- غذاهای معمول مصرفی: ${questionnaireData.commonFoods}
- هوس‌های غذایی رایج: ${questionnaireData.cravings}
- خوردن در اواخر شب: ${questionnaireData.lateNightEating}
- مصرف روزانه آب: ${questionnaireData.hydration}
- دفعات آشپزی در خانه: ${questionnaireData.cookingFrequency}
- سطح مهارت آشپزی: ${questionnaireData.cookingSkills}
- توانایی آماده‌سازی وعده‌های غذایی: ${questionnaireData.mealPrepAbility}
- بودجه برای غذا: ${questionnaireData.budget}
- میزان تعهد زمانی برای آماده‌سازی وعده‌های غذایی: ${questionnaireData.timeCommitment}
- دسترسی به غذاهای سالم: ${questionnaireData.accessToHealthyFood}
- دسترسی به باشگاه/امکانات ورزشی: ${questionnaireData.accessToGym}
- اهداف سلامتی/تناسب اندام مشخص: ${questionnaireData.specificGoals}
- سطح انگیزه: ${questionnaireData.motivation}
- بزرگترین چالش‌ها در گذشته: ${questionnaireData.challenges}
- تجربه قبلی با رژیم‌های غذایی: ${questionnaireData.pastDietExperience}

برنامه غذایی باید شامل موارد زیر باشد:
1.  **مقدمه**: یک مرور کلی کوتاه از برنامه و مبنای علمی آن.
2.  **اهداف**: هدف اصلی کاربر (مثلاً افزایش عضله، کاهش چربی، سلامت عمومی، عملکرد ورزشی) و نحوه حمایت برنامه از آن را به وضوح بیان کنید.
3.  **تقسیم‌بندی درشت‌مغذی‌ها**: میزان توصیه شده روزانه پروتئین، کربوهیدرات و چربی (بر حسب گرم و درصد از کل کالری).
4.  **نمونه برنامه غذایی (۷ روز)**:
    * برای هر روز: صبحانه، ناهار، شام و ۲-۳ میان‌وعده.
    * شامل اقلام غذایی خاص و اندازه‌های تقریبی وعده‌ها.
    * به طور خلاصه توجیه علمی انتخاب‌های غذایی خاص را توضیح دهید (مثلاً "پروتئین کم‌چرب برای ترمیم عضلات"، "کربوهیدرات‌های پیچیده برای انرژی پایدار").
5.  **دستورالعمل‌های هیدراتاسیون**: توصیه‌های خاص برای مصرف آب.
6.  **توصیه‌های مکمل (اختیاری)**: اگر کاربر شرایط سلامتی خاصی ندارد و مناسب است، دسته‌های کلی مکمل‌ها (مثلاً پودر پروتئین، کراتین، مولتی‌ویتامین‌ها) را با یک سلب مسئولیت برای مشورت با متخصص بهداشت توصیه کنید.
7.  **ادغام فعالیت**: نحوه تکمیل رژیم غذایی با ورزش/فعالیت مشخص شده کاربر.
8.  **ملاحظات مهم**:
    * زمان‌بندی وعده‌های غذایی (قبل/بعد از تمرین و غیره).
    * اهمیت خواب و مدیریت استرس.
    * انعطاف‌پذیری و پایداری برنامه.
9.  **سلب مسئولیت**: توصیه کنید قبل از شروع هر برنامه غذایی جدید با یک متخصص بهداشت یا متخصص تغذیه مشورت شود.

خروجی را به صورت یک رشته Markdown فرمت کنید که به راحتی قابل تبدیل به PDF باشد. از عنوان‌های واضح و نقطه‌گذاری استفاده کنید.`;

        try {
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // بدون تغییر، Canvas آن را فراهم می‌کند
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setDietPlan(text);
                setCurrentPage('diet-plan-result');
                setMessage("برنامه غذایی تولید شد!");

                // ذخیره برنامه غذایی در فایراستور برای کاربر لاگین شده
                if (user && db) {
                    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                    await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/dietPlans`), {
                        dateGenerated: new Date(),
                        planContent: text,
                        questionnaireData: questionnaireData, // ذخیره داده های پرسشنامه برای ارجاع
                    });
                    // به‌روزرسانی لیست برنامه‌های کاربر
                    const q = query(collection(db, `artifacts/${appId}/users/${user.uid}/dietPlans`));
                    const querySnapshot = await getDocs(q);
                    const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserDietPlans(plans);
                }

            } else {
                setMessage("تولید برنامه غذایی با مشکل مواجه شد. لطفا دوباره تلاش کنید.");
                console.error("ساختار پاسخ API غیرمنتظره:", result);
            }
        } catch (error) {
            console.error("خطا در تولید برنامه غذایی:", error);
            setMessage("خطا در تولید برنامه غذایی. لطفا کلید API خود را بررسی کنید یا بعدا دوباره تلاش کنید.");
        } finally {
            setLoading(false);
        }
    };

    // تابع برای پرسیدن سوال از Gemini در مورد برنامه غذایی تولید شده
    const askGeminiAboutPlan = async () => {
        if (!userQuestion.trim() || !dietPlan) {
            setMessage("لطفا یک سوال وارد کنید و مطمئن شوید که برنامه غذایی تولید شده است.");
            return;
        }

        setAskingGemini(true);
        setGeminiResponse(null); // پاک کردن پاسخ قبلی
        setMessage("در حال پرسیدن از Gemini...");

        const fullPrompt = `بر اساس برنامه غذایی زیر، به سوال کاربر پاسخ دهید. اگر سوال درخواست تغییر است، بخش اصلاح شده برنامه را ارائه دهید یا توضیح دهید که چگونه می‌توان آن را اصلاح کرد. هیچ اطلاعاتی در مورد الکل را شامل نشود.

برنامه غذایی:
${dietPlan}

سوال کاربر:
${userQuestion}`;

        try {
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: fullPrompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // بدون تغییر، Canvas آن را فراهم می‌کند
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setGeminiResponse(text);
                setMessage("Gemini پاسخ داد!");
            } else {
                setMessage("دریافت پاسخ از Gemini با مشکل مواجه شد. لطفا دوباره تلاش کنید.");
                console.error("ساختار پاسخ Gemini API غیرمنتظره:", result);
            }
        } catch (error) {
            console.error("خطا در پرسیدن از Gemini:", error);
            setMessage("خطا در ارتباط با Gemini. لطفا بعدا دوباره تلاش کنید.");
        } finally {
            setAskingGemini(false);
        }
    };

    // ناوبری صفحات
    const navigateTo = (page) => {
        setCurrentPage(page);
        setMessage(''); // پاک کردن پیام‌ها هنگام تغییر صفحه
        setGeminiResponse(null); // پاک کردن پاسخ Gemini هنگام تغییر صفحه
        setUserQuestion(''); // پاک کردن سوال کاربر هنگام تغییر صفحه
        if (page === 'home') {
            setQuestionnaireData({ // بازنشانی اطلاعات پرسش‌نامه هنگام بازگشت به خانه
                gender: 'male', age: 25, currentWeight: 70, height: 175, targetWeight: 65, bodyFat: 15,
                activityLevel: 'moderate', dietaryPreferences: [], allergies: [], healthConditions: [],
                sleepHours: '7-8', sleepQuality: 'good', energyLevels: 'normal', lateNightEating: 'rarely',
                stressLevels: 'moderate', hydration: '8-10 glasses', cookingFrequency: 'often',
                mealPrepAbility: 'yes', budget: 'moderate', timeCommitment: 'moderate',
                sport: '', sportFrequency: '', sportDuration: '',
                medicalHistory: [],
                commonFoods: '',
                cravings: '',
                motivation: '',
                challenges: '',
                cookingSkills: 'basic',
                accessToGym: 'yes',
                accessToHealthyFood: 'yes',
                eatingOutFrequency: 'rarely',
                stressCoping: 'exercise',
                specificGoals: '',
                pastDietExperience: '',
                profileName: user?.displayName || '', // حفظ نام پروفایل اگر وجود دارد
                profilePicUrl: user?.photoURL || '', // حفظ عکس پروفایل اگر وجود دارد
            });
            setDietPlan(null); // پاک کردن برنامه غذایی
            setSelectedService(null); // پاک کردن سرویس انتخاب شده
        } else if (page === 'questionnaire') {
            setCurrentQuestion(0); // شروع پرسش‌نامه از ابتدا
        }
    };

    // توابع احراز هویت
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setMessage('با موفقیت وارد شدید!');
            navigateTo('user-dashboard');
        } catch (error) {
            console.error("خطا در ورود:", error);
            setMessage('خطا در ورود: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (registerPassword !== registerConfirmPassword) {
            setMessage('رمز عبور و تکرار آن مطابقت ندارند!');
            setLoading(false);
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const newUser = userCredential.user;
            // ذخیره اطلاعات اولیه کاربر در فایراستور
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            await setDoc(doc(db, `artifacts/${appId}/users/${newUser.uid}/profile/data`), {
                email: newUser.email,
                profileName: 'کاربر جدید',
                profilePicUrl: '',
                createdAt: new Date(),
            });
            setMessage('ثبت‌نام با موفقیت انجام شد! وارد شدید.');
            navigateTo('user-dashboard');
        } catch (error) {
            console.error("خطا در ثبت‌نام:", error);
            setMessage('خطا در ثبت‌نام: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setMessage('');
        try {
            await signOut(auth);
            setMessage('با موفقیت خارج شدید.');
            navigateTo('home');
        } catch (error) {
            console.error("خطا در خروج:", error);
            setMessage('خطا در خروج: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // لوگوی جدید تن‌فیت
    const TanFitLogo = ({ size = 32 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="50" fill="url(#paint0_linear_logo)"/>
            <defs>
                <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A8E6CF"/>
                    <stop offset="1" stopColor="#34D399"/>
                </linearGradient>
            </defs>
            {/* Male figure - blueish green */}
            <path d="M40 30 C40 25 45 20 50 20 C55 20 60 25 60 30 L60 45 C60 50 55 55 50 55 C45 55 40 50 40 45 L40 30 Z" fill="#22C55E"/> {/* Body */}
            <circle cx="50" cy="25" r="5" fill="#22C55E"/> {/* Head */}
            <path d="M40 40 L35 55 M60 40 L65 55" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/> {/* Arms */}
            <path d="M45 55 L40 70 M55 55 L60 70" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/> {/* Legs */}

            {/* Female figure - slightly lighter green */}
            <path d="M60 30 C60 25 65 20 70 20 C75 20 80 25 80 30 L80 45 C80 50 75 55 70 55 C65 55 60 50 60 45 L60 30 Z" fill="#10B981"/> {/* Body */}
            <circle cx="70" cy="25" r="5" fill="#10B981"/> {/* Head */}
            <path d="M60 40 L55 55 M80 40 L85 55" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/> {/* Arms */}
            <path d="M65 55 L60 70 M75 55 L80 70" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/> {/* Legs */}

            {/* TanFit text (optional, can be outside SVG too) */}
            <text x="50" y="85" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#065F46">TanFit</text>
        </svg>
    );


    // رندر صفحه اصلی
    const renderHomePage = () => (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <header className="flex justify-between items-center py-6 px-4">
                    <div className="text-2xl font-bold text-green-700 flex items-center">
                        <TanFitLogo size={40} className="ml-2"/> {/* لوگوی جدید */}
                        تن‌فیت
                    </div>
                    <nav className="space-x-6">
                        <a href="#" className="text-green-700 hover:text-green-900 font-medium rounded-md px-3 py-2 transition-colors duration-200">خدمات</a>
                        <a href="#" className="text-green-700 hover:text-green-900 font-medium rounded-md px-3 py-2 transition-colors duration-200">درباره ما</a>
                        <a href="#" onClick={() => navigateTo('contact')} className="text-green-700 hover:text-green-900 font-medium rounded-md px-3 py-2 transition-colors duration-200">تماس</a>
                        {user ? (
                            <a href="#" onClick={() => navigateTo('user-dashboard')} className="text-green-700 hover:text-green-900 font-medium rounded-md px-3 py-2 transition-colors duration-200">حساب کاربری</a>
                        ) : (
                            <a href="#" onClick={() => navigateTo('auth')} className="text-green-700 hover:text-green-900 font-medium rounded-md px-3 py-2 transition-colors duration-200">ورود/ثبت‌نام</a>
                        )}
                    </nav>
                </header>

                <main className="text-center py-16">
                    <h1 className="text-6xl font-extrabold text-green-800 leading-tight mb-6" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
                        برنامه‌های تغذیه <br /> مبتنی بر علوم غذایی و ورزشی
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 font-medium">
                        توصیه‌های رژیم غذایی شخصی‌سازی شده بر اساس علوم غذایی، تغذیه ورزشی، آناتومی و تحقیقات بیولوژیکی. سلامتی خود را با تغذیه مبتنی بر شواهد متحول کنید.
                    </p>
                    <div className="flex justify-center space-x-4 mb-12">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 shadow-sm">
                            <Icon name="food-science" size={18} className="ml-2" /> علوم غذایی
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 shadow-sm">
                            <Icon name="sports-nutrition" size={18} className="ml-2" /> تغذیه ورزشی
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 shadow-sm">
                            <Icon name="personalized" size={18} className="ml-2" /> شخصی‌سازی شده
                        </span>
                    </div>
                    <button
                        onClick={() => navigateTo('services')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                        تحول خود را آغاز کنید
                    </button>
                </main>

                <section className="py-16">
                    <h2 className="text-4xl font-bold text-green-800 text-center mb-12">مسیر خود را انتخاب کنید</h2>
                    <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
                        برنامه تغذیه‌ای را انتخاب کنید که با اهداف خاص شما همسو است. هر برنامه به صورت علمی برای نتایج بهینه فرموله شده است.
                    </p>
                    {/* چهار فرم اصلی در یک ردیف */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {[
                            {
                                id: 'muscle-building',
                                title: 'عضله‌سازی',
                                description: 'برنامه‌های تغذیه مبتنی بر علم برای به حداکثر رساندن سنتز پروتئین عضلانی و حمایت از افزایش توده عضلانی خالص از طریق زمان‌بندی بهینه درشت‌مغذی‌ها و ریزمغذی‌ها.',
                                hoverDetails: ['افزایش توده عضلانی', 'ترمیم عضلات', 'بهبود ریکاوری', 'بهینه‌سازی هورمونی'],
                                icon: 'muscle-building'
                            },
                            {
                                id: 'fat-loss',
                                title: 'کاهش چربی',
                                description: 'استراتژی‌های تغذیه آگاهانه متابولیکی که کسری کالری پایدار را ایجاد می‌کنند، در حالی که بافت لاغر را حفظ کرده و تعادل هورمونی را بهینه می‌کنند.',
                                hoverDetails: ['چربی‌سوزی موثر', 'حفظ عضلات', 'بهبود متابولیسم', 'کاهش وزن پایدار'],
                                icon: 'fat-loss'
                            },
                             {
                                id: 'healthy-weight-gain',
                                title: 'افزایش وزن سالم',
                                description: 'برنامه‌های غذایی با دقت طراحی شده برای افزایش وزن سالم و توسعه بدن.',
                                hoverDetails: ['افزایش وزن سالم', 'تراکم کالری', 'تعادل تغذیه‌ای', 'پیشرفت تدریجی'],
                                icon: 'athletic-performance' // Using athletic performance icon for weight gain
                            },
                            {
                                id: 'athletic-performance',
                                title: 'عملکرد ورزشی',
                                description: 'پروتکل‌های تغذیه عملکردی بر اساس تحقیقات فیزیولوژی ورزشی برای افزایش توان خروجی، ظرفیت استقامتی و کارایی ریکاوری.',
                                hoverDetails: ['افزایش انرژی', 'بهبود استقامت', 'ریکاوری سریع', 'بهینه‌سازی عملکرد'],
                                icon: 'athletic-performance'
                            },
                        ].map((service) => (
                            <div
                                key={service.id}
                                className={`bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === service.id ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'} group ${selectedService && selectedService !== service.id ? 'opacity-50 blur-sm' : ''}`}
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                                onClick={() => {
                                    setSelectedService(service.id);
                                    navigateTo('questionnaire');
                                }}
                            >
                                <div className="p-4 bg-green-100 rounded-full mb-4">
                                    <Icon name={service.icon} size={48} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-green-700 mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm group-hover:hidden">{service.description}</p>
                                <ul className="text-gray-600 text-sm text-right w-full list-disc list-inside hidden group-hover:block">
                                    {service.hoverDetails.map((detail, index) => (
                                        <li key={index}>{detail}</li>
                                    ))}
                                </ul>
                                <button className="mt-4 text-green-600 hover:text-green-800 font-medium flex items-center">
                                    سفر خود را آغاز کنید
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* BMI Calculator به صورت خطی زیر بقیه */}
                    <div className="flex justify-center">
                        {[
                            {
                                id: 'bmi-calculator',
                                title: 'ماشین حساب BMI',
                                description: 'ابزار حرفه‌ای ارزیابی شاخص توده بدنی با بینش‌های دقیق سلامتی، محدوده‌های وزن ایده‌آل و توصیه‌های شخصی‌سازی شده.',
                                hoverDetails: ['محاسبه دقیق BMI', 'بینش‌های سلامتی', 'محدوده وزن ایده‌آل'],
                                icon: 'bmi-calculator'
                            },
                        ].map((service) => (
                            <div
                                key={service.id}
                                className={`bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === service.id ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'} group w-full md:w-1/2 lg:w-1/3 ${selectedService && selectedService !== service.id ? 'opacity-50 blur-sm' : ''}`} // عرض را تنظیم کنید
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                                onClick={() => {
                                    setSelectedService(service.id);
                                    navigateTo('bmi-calculator');
                                }}
                            >
                                <div className="p-4 bg-green-100 rounded-full mb-4">
                                    <Icon name={service.icon} size={48} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-green-700 mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm group-hover:hidden">{service.description}</p>
                                <ul className="text-gray-600 text-sm text-right w-full list-disc list-inside hidden group-hover:block">
                                    {service.hoverDetails.map((detail, index) => (
                                        <li key={index}>{detail}</li>
                                    ))}
                                </ul>
                                <button className="mt-4 text-green-600 hover:text-green-800 font-medium flex items-center">
                                    سفر خود را آغاز کنید
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-16 text-center">
                    <h2 className="text-4xl font-bold text-green-800 mb-12">چرا تن‌فیت را انتخاب کنید؟</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">رویکرد علمی</h3>
                            <p className="text-gray-600">برنامه‌های ما بر اساس آخرین تحقیقات در علوم غذایی، ورزشی، آناتومی و بیولوژیکی ساخته شده‌اند.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">شخصی‌سازی شده برای شما</h3>
                            <p className="text-gray-600">متناسب با بدن، اهداف و سبک زندگی منحصر به فرد شما برای نتایج بهینه.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">نتایج پایدار</h3>
                            <p className="text-gray-600">تمرکز بر سلامت و عادات بلندمدت، نه فقط راه‌حل‌های سریع.</p>
                        </div>
                    </div>
                </section>

                <footer className="py-8 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} تن‌فیت. تمامی حقوق محفوظ است.
                </footer>
            </div>
        </div>
    );

    // رندر صفحه ماشین حساب BMI
    const renderBMICalculatorPage = () => (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    بازگشت
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">ماشین حساب BMI</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* بخش ورودی */}
                    <div className="flex flex-col space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                                BMI خود را محاسبه کنید
                            </h3>
                            <div className="mb-8"> {/* Increased margin-bottom for slider value */}
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">وزن (کیلوگرم): <span className="font-bold text-green-700">{bmiData.weight}</span> کیلوگرم</label>
                                <input
                                    type="range"
                                    id="weight"
                                    name="weight"
                                    min="30"
                                    max="200"
                                    value={bmiData.weight}
                                    onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer mt-2"
                                />
                            </div>
                            <div className="mt-8"> {/* Increased margin-top for slider value */}
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700">قد (سانتی‌متر): <span className="font-bold text-green-700">{bmiData.height}</span> سانتی‌متر</label>
                                <input
                                    type="range"
                                    id="height"
                                    name="height"
                                    min="120"
                                    max="220"
                                    value={bmiData.height}
                                    onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer mt-2"
                                />
                            </div>
                            <div className="flex justify-between mt-6 text-sm text-gray-600">
                                <span>وزن (کیلوگرم)</span>
                                <span>قد (سانتی‌متر)</span>
                            </div>
                            <div className="flex justify-between mt-2 font-semibold text-gray-800">
                                <span>{bmiData.weight}</span>
                                <span>{bmiData.height}</span>
                            </div>
                        </div>
                    </div>

                    {/* بخش نتیجه */}
                    <div className="flex flex-col space-y-6">
                        <div className="bg-green-50 p-6 rounded-lg shadow-inner text-center">
                            <h3 className="text-xl font-semibold text-green-700 mb-4">نتیجه BMI شما</h3>
                            {bmiResult && (
                                <>
                                    <p className={`text-5xl font-extrabold mb-2 ${bmiResult.colorClass.replace('bg-', 'text-')}`}>{bmiResult.value}</p>
                                    <p className="text-xl font-semibold text-gray-800">{bmiResult.category}</p>
                                    <p className="text-md text-gray-600">{bmiResult.risk}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden"> {/* Added overflow-hidden */}
                                        <div
                                            className={`h-2.5 rounded-full ${bmiResult.colorClass}`}
                                            style={{ width: `${Math.min(100, (parseFloat(bmiResult.value) / 40) * 100)}%` }} // Capped width at 100%
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>کم‌وزن</span>
                                        <span>نرمال</span>
                                        <span>اضافه وزن</span>
                                        <span>چاق</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">محدوده وزن ایده‌آل</h3>
                            {bmiResult && bmiResult.value !== 'ورودی نامعتبر' && (
                                <p className="text-2xl font-bold text-green-600">
                                    {Math.round(18.5 * (bmiData.height / 100) * (bmiData.height / 100))} کیلوگرم - {Math.round(24.9 * (bmiData.height / 100) * (bmiData.height / 100))} کیلوگرم
                                </p>
                            )}
                            {bmiResult && bmiResult.category === 'وزن نرمال' && (
                                <p className="text-green-500 text-sm mt-2">
                                    شما در محدوده وزن ایده‌آل قرار دارید!
                                </p>
                            )}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">توصیه‌ها</h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                <li>وزن سالم فعلی خود را حفظ کنید</li>
                                <li>فعالیت بدنی منظم را ادامه دهید</li>
                                <li>رژیم غذایی متعادل و مغذی را دنبال کنید</li>
                                <li>تغییرات وزن را به طور منظم پایش کنید</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => navigateTo('questionnaire')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                        >
                            دریافت برنامه غذایی شخصی‌سازی شده
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // رندر صفحه پرسش‌نامه
    const renderQuestionnairePage = () => {
        const currentQ = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden questionnaire-page">
                <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
                <div className="relative z-10 w-full max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <button onClick={() => currentQuestion === 0 ? navigateTo('home') : handlePreviousQuestion()} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                        <Icon name="back" className="ml-1" />
                        بازگشت
                    </button>
                    <h2 className="text-3xl font-bold text-green-800 text-center mb-8">برنامه غذایی شخصی‌سازی شده</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* مدل کاراکتر / خلاصه */}
                        <div className="md:w-1/3 flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-inner">
                            <CharacterModel
                                gender={questionnaireData.gender}
                                age={questionnaireData.age}
                                currentWeight={questionnaireData.currentWeight}
                                height={questionnaireData.height}
                            />
                            <div className="mt-6 text-sm text-gray-700 w-full">
                                <p className="flex justify-between mb-2">
                                    <span className="font-semibold">وزن:</span> {questionnaireData.currentWeight} کیلوگرم
                                </p>
                                <p className="flex justify-between mb-2">
                                    <span className="font-semibold">قد:</span> {questionnaireData.height} سانتی‌متر
                                </p>
                                <p className="flex justify-between mb-2">
                                    <span className="font-semibold">BMI:</span> {(questionnaireData.currentWeight / ((questionnaireData.height / 100) * (questionnaireData.height / 100))).toFixed(1)}
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-semibold">سطح:</span> مبتدی
                                </p>
                            </div>
                        </div>

                        {/* بخش سوالات */}
                        <div className="md:w-2/3 bg-gray-50 p-8 rounded-lg shadow-inner">
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-2">مرحله {currentQuestion + 1} از {questions.length}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{currentQ.title}</h3>
                            <p className="text-gray-600 mb-6">{currentQ.description}</p>

                            <div className="space-y-6">
                                {currentQ.fields.map(field => (
                                    <div key={field.name} className="relative"> {/* Added relative for slider value positioning */}
                                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                            {field.label}
                                            {field.type === 'range' && `: `}
                                            {field.type === 'range' && <span className="font-bold text-green-700">{questionnaireData[field.name]}</span>}
                                            {field.name === 'currentWeight' && ' کیلوگرم'}
                                            {field.name === 'height' && ' سانتی‌متر'}
                                            {field.name === 'targetWeight' && ' کیلوگرم'}
                                            {field.name === 'bodyFat' && '%'}
                                            {field.name === 'sportDuration' && ' دقیقه'}
                                        </label>
                                        {field.type === 'select' && (
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                value={questionnaireData[field.name]}
                                                onChange={handleQuestionnaireChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
                                                dir="rtl" // برای نمایش راست به چپ
                                            >
                                                {field.options.map((option, index) => (
                                                    <option key={option} value={option}>{field.displayOptions ? field.displayOptions[index] : option}</option>
                                                ))}
                                            </select>
                                        )}
                                        {field.type === 'range' && (
                                            <>
                                                <input
                                                    type="range"
                                                    id={field.name}
                                                    name={field.name}
                                                    min={field.min}
                                                    max={field.max}
                                                    step={field.step}
                                                    value={questionnaireData[field.name]}
                                                    onChange={handleQuestionnaireChange}
                                                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer mt-2"
                                                />
                                            </>
                                        )}
                                        {field.type === 'checkbox-group' && (
                                            <div className="mt-2 space-y-2">
                                                {field.options.map((option, index) => (
                                                    <div key={option} className="flex items-center">
                                                        <input
                                                            id={`${field.name}-${option}`}
                                                            name={field.name}
                                                            type="checkbox"
                                                            value={option}
                                                            checked={questionnaireData[field.name].includes(option)}
                                                            onChange={handleQuestionnaireChange}
                                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                            dir="rtl" // برای نمایش راست به چپ
                                                        />
                                                        <label htmlFor={`${field.name}-${option}`} className="mr-2 block text-sm text-gray-900">
                                                            {field.displayOptions ? field.displayOptions[index] : option}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {field.type === 'text-list' || field.type === 'datalist' ? (
                                            <>
                                                <input
                                                    list={`${field.name}-options`}
                                                    id={field.name}
                                                    name={field.name}
                                                    value={questionnaireData[field.name]}
                                                    onChange={handleQuestionnaireChange}
                                                    placeholder={field.placeholder}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                    dir="rtl" // برای نمایش راست به چپ
                                                />
                                                {field.options && (
                                                    <datalist id={`${field.name}-options`}>
                                                        {field.options.map((option, index) => (
                                                            <option key={option} value={option}>{field.displayOptions ? field.displayOptions[index] : option}</option>
                                                        ))}
                                                    </datalist>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                                >
                                    قبلی
                                </button>
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                                >
                                    {loading ? 'در حال تولید...' : (currentQuestion === questions.length - 1 ? 'تولید برنامه' : 'بعدی')}
                                </button>
                            </div>
                            {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // رندر صفحه نتیجه برنامه غذایی
    const renderDietPlanResultPage = () => (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg my-8">
                <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    صفحه اصلی
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">برنامه غذایی شخصی‌سازی شده شما</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                        <p className="mt-4 text-gray-700">{message}</p>
                    </div>
                ) : dietPlan ? (
                    <div className="prose max-w-none text-right" dangerouslySetInnerHTML={{ __html: marked.parse(dietPlan) }}></div>
                ) : (
                    <p className="text-center text-gray-600">هنوز برنامه غذایی تولید نشده است. لطفا پرسش‌نامه را تکمیل کنید.</p>
                )}

                {dietPlan && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                // تابع برای کپی کردن برنامه غذایی در کلیپ‌بورد
                                const el = document.createElement('textarea');
                                el.value = dietPlan;
                                document.body.appendChild(el);
                                el.select();
                                document.execCommand('copy');
                                document.body.removeChild(el);
                                setMessage('برنامه غذایی در کلیپ‌بورد کپی شد!');
                                setTimeout(() => setMessage(''), 3000); // پاک کردن پیام پس از ۳ ثانیه
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md ml-4 transition-colors duration-200"
                        >
                            کپی برنامه در کلیپ‌بورد
                        </button>
                         <button
                            onClick={() => {
                                // تابع برای دانلود برنامه غذایی به عنوان PDF
                                const element = document.createElement('a');
                                const file = new Blob([dietPlan], { type: 'text/markdown' });
                                element.href = URL.createObjectURL(file);
                                element.download = 'TanFit_Diet_Plan.md'; // دانلود به عنوان markdown، کاربر می‌تواند به PDF تبدیل کند
                                document.body.appendChild(element); // برای فایرفاکس لازم است
                                element.click();
                                document.body.removeChild(element); // پاکسازی
                                setMessage('برنامه غذایی به صورت Markdown دانلود شد!');
                                setTimeout(() => setMessage(''), 3000); // پاک کردن پیام پس از ۳ ثانیه
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
                        >
                            دانلود به صورت Markdown
                        </button>
                        {message && <p className="text-center mt-4 text-sm text-green-500">{message}</p>}

                        {/* بخش جدید برای پرسیدن از Gemini در مورد برنامه */}
                        <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-inner text-right">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                                ✨ از Gemini در مورد برنامه بپرسید ✨
                            </h3>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 resize-y min-h-[80px] text-right"
                                placeholder="مثلاً: 'آیا می‌توانم مرغ را با ماهی جایگزین کنم؟' یا 'این بخش از برنامه را بیشتر توضیح دهید.'"
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                rows="3"
                                dir="rtl" // برای نمایش راست به چپ
                            ></textarea>
                            <button
                                onClick={askGeminiAboutPlan}
                                disabled={askingGemini || !dietPlan}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                            >
                                {askingGemini ? 'در حال پرسیدن...' : 'از Gemini بپرس'}
                            </button>

                            {geminiResponse && (
                                <div className="mt-6 p-4 bg-purple-50 rounded-lg text-right">
                                    <h4 className="font-semibold text-purple-800 mb-2">پاسخ Gemini:</h4>
                                    <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: marked.parse(geminiResponse) }}></div>
                                </div>
                            )}
                            {askingGemini && (
                                <div className="flex items-center justify-center mt-4 text-gray-600">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 ml-3"></div>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // رندر صفحه تماس با ما
    const renderContactPage = () => (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    بازگشت به صفحه اصلی
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">تماس با ما</h2>

                <p className="text-lg text-gray-700 mb-8">
                    برای هرگونه سوال، مشاوره یا پشتیبانی، می‌توانید از طریق راه‌های ارتباطی زیر با ما در تماس باشید.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* کارت تماس تلفنی */}
                    <div className={`bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === 'phone-contact' ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'}`}
                         onMouseEnter={() => setHoveredService('phone-contact')}
                         onMouseLeave={() => setHoveredService(null)}>
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <Icon name="phone" size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">تماس تلفنی</h3>
                        <p className="text-gray-600 text-sm">
                            با شماره‌های زیر تماس بگیرید:
                        </p>
                        <ul className="text-gray-800 font-bold mt-2 list-none p-0">
                            <li>09100400633</li>
                            <li>09382069110</li>
                        </ul>
                        <p className="text-gray-600 text-sm mt-4">
                            ساعات پاسخگویی: شنبه تا چهارشنبه، ۹ صبح تا ۵ عصر
                        </p>
                    </div>

                    {/* کارت ارتباط ایمیلی */}
                    <div className={`bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === 'email-contact' ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'}`}
                         onMouseEnter={() => setHoveredService('email-contact')}
                         onMouseLeave={() => setHoveredService(null)}>
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <Icon name="mail" size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">ارتباط از طریق ایمیل</h3>
                        <p className="text-gray-600 text-sm">
                            سوالات و نظرات خود را برای ما ایمیل کنید:
                        </p>
                        <p className="text-gray-800 font-bold mt-2">
                            moein.kh.82@gmail.com
                        </p>
                        <p className="text-gray-600 text-sm mt-4">
                            ما در اسرع وقت به ایمیل‌های شما پاسخ خواهیم داد.
                        </p>
                    </div>
                </div>

                <footer className="py-4 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} تن‌فیت. تمامی حقوق محفوظ است.
                </footer>
            </div>
        </div>
    );

    // رندر صفحه احراز هویت (ورود/ثبت نام)
    const renderAuthPage = () => (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    بازگشت
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">ورود / ثبت‌نام</h2>

                {/* فرم ورود */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">ورود به حساب کاربری</h3>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="ایمیل"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-right"
                            required
                            dir="rtl"
                        />
                        <input
                            type="password"
                            placeholder="رمز عبور"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-right"
                            required
                            dir="rtl"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </form>
                </div>

                {/* فرم ثبت نام */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">ثبت‌نام حساب جدید</h3>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="email"
                            placeholder="ایمیل"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-right"
                            required
                            dir="rtl"
                        />
                        <input
                            type="password"
                            placeholder="رمز عبور"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-right"
                            required
                            dir="rtl"
                        />
                        <input
                            type="password"
                            placeholder="تکرار رمز عبور"
                            value={registerConfirmPassword}
                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-right"
                            required
                            dir="rtl"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                        </button>
                    </form>
                </div>
                {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
            </div>
        </div>
    );

    // رندر صفحه داشبورد کاربر
    const renderUserDashboardPage = () => (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg my-8">
                <button onClick={handleLogout} className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                    خروج
                </button>
                <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    صفحه اصلی
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">حساب کاربری</h2>

                <div className="flex flex-col items-center mb-8">
                    <img src={questionnaireData.profilePicUrl || "https://placehold.co/100x100/aabbcc/ffffff?text=عکس"} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-green-400" />
                    <h3 className="text-2xl font-bold text-gray-800">{questionnaireData.profileName || user?.email}</h3>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* برنامه‌های من */}
                    <div className={`bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === 'my-plans' ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'}`}
                         onMouseEnter={() => setHoveredService('my-plans')}
                         onMouseLeave={() => setHoveredService(null)}
                         onClick={() => navigateTo('my-plans')}>
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <Icon name="clipboard" size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">برنامه‌های من</h3>
                        <p className="text-gray-600 text-sm">برنامه‌های غذایی قبلی خود را مشاهده و مدیریت کنید.</p>
                    </div>

                    {/* نظرسنجی */}
                    <div className={`bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === 'surveys' ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'}`}
                         onMouseEnter={() => setHoveredService('surveys')}
                         onMouseLeave={() => setHoveredService(null)}
                         onClick={() => navigateTo('surveys')}>
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <Icon name="star" size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">نظرسنجی</h3>
                        <p className="text-gray-600 text-sm">بازخورد خود را ارائه دهید و به بهبود خدمات ما کمک کنید.</p>
                    </div>

                    {/* تغییر اطلاعات حساب کاربری */}
                    <div className={`bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300 border-2 ${hoveredService === 'account-settings' ? 'scale-105 border-green-500 shadow-xl' : 'border-transparent'}`}
                         onMouseEnter={() => setHoveredService('account-settings')}
                         onMouseLeave={() => setHoveredService(null)}
                         onClick={() => navigateTo('account-settings')}>
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                            <Icon name="settings" size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">تنظیمات حساب کاربری</h3>
                        <p className="text-gray-600 text-sm">اطلاعات پروفایل خود را ویرایش کنید.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // رندر صفحه "برنامه های من"
    const renderMyPlansPage = () => (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg my-8">
                <button onClick={() => navigateTo('user-dashboard')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    بازگشت به داشبورد
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">برنامه‌های غذایی من</h2>
                {userDietPlans.length > 0 ? (
                    <div className="space-y-4">
                        {userDietPlans.map(plan => (
                            <div key={plan.id} className="bg-gray-50 p-4 rounded-lg shadow-inner text-right">
                                <p className="font-semibold text-gray-800">تاریخ تولید: {new Date(plan.dateGenerated.seconds * 1000).toLocaleDateString('fa-IR')}</p>
                                <p className="text-gray-600 text-sm">هدف: {plan.questionnaireData.targetWeight} کیلوگرم</p>
                                <button
                                    onClick={() => {
                                        setDietPlan(plan.planContent);
                                        setCurrentPage('diet-plan-result');
                                    }}
                                    className="mt-2 bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded-full"
                                >
                                    مشاهده برنامه
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">هنوز برنامه‌ای برای شما ذخیره نشده است.</p>
                )}
            </div>
        </div>
    );

    // رندر صفحه "نظرسنجی" (Placeholder)
    const renderSurveysPage = () => (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg my-8">
                <button onClick={() => navigateTo('user-dashboard')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    بازگشت به داشبورد
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">نظرسنجی‌ها</h2>
                <p className="text-center text-gray-600">این بخش در آینده برای جمع‌آوری بازخورد شما فعال خواهد شد.</p>
            </div>
        </div>
    );

    // رندر صفحه "تنظیمات حساب کاربری"
    const renderAccountSettingsPage = () => (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg my-8 text-right">
                <button onClick={() => navigateTo('user-dashboard')} className="absolute top-4 right-4 text-green-600 hover:text-green-800 flex items-center font-medium">
                    <Icon name="back" className="ml-1" />
                    بازگشت به داشبورد
                </button>
                <h2 className="text-3xl font-bold text-green-800 text-center mb-8">تنظیمات حساب کاربری</h2>
                <form onSubmit={(e) => { e.preventDefault(); saveUserData({ profileName: questionnaireData.profileName, profilePicUrl: questionnaireData.profilePicUrl }); }} className="space-y-6">
                    <div>
                        <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                        <input
                            type="text"
                            id="profileName"
                            name="profileName"
                            value={questionnaireData.profileName}
                            onChange={(e) => setQuestionnaireData(prev => ({ ...prev, profileName: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-right"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label htmlFor="profilePicUrl" className="block text-sm font-medium text-gray-700 mb-1">لینک عکس پروفایل (اختیاری)</label>
                        <input
                            type="url"
                            id="profilePicUrl"
                            name="profilePicUrl"
                            value={questionnaireData.profilePicUrl}
                            onChange={(e) => setQuestionnaireData(prev => ({ ...prev, profilePicUrl: e.target.value }))}
                            placeholder="مثلاً: https://example.com/your-image.jpg"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-left"
                            dir="ltr"
                        />
                        {questionnaireData.profilePicUrl && (
                            <img src={questionnaireData.profilePicUrl} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover mt-4 mx-auto" />
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                </form>
                {message && <p className="text-center mt-4 text-sm text-green-500">{message}</p>}
            </div>
        </div>
    );


    // منطق رندر اصلی بر اساس وضعیت currentPage
    let content;
    switch (currentPage) {
        case 'home':
            content = renderHomePage();
            break;
        case 'bmi-calculator':
            content = renderBMICalculatorPage();
            break;
        case 'questionnaire':
            content = renderQuestionnairePage();
            break;
        case 'diet-plan-result':
            content = renderDietPlanResultPage();
            break;
        case 'contact':
            content = renderContactPage();
            break;
        case 'auth':
            content = renderAuthPage();
            break;
        case 'user-dashboard':
            content = renderUserDashboardPage();
            break;
        case 'my-plans':
            content = renderMyPlansPage();
            break;
        case 'surveys':
            content = renderSurveysPage();
            break;
        case 'account-settings':
            content = renderAccountSettingsPage();
            break;
        default:
            content = renderHomePage();
    }

    return (
        <div className="font-sans antialiased text-gray-900" dir="rtl"> {/* تنظیم جهت کلی صفحه به راست به چپ */}
            {/* CDN تایل‌ویند CSS */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Marked.js برای تجزیه Markdown */}
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                /* فونت فارسی (مثلاً Vazirmatn) را برای پشتیبانی بهتر اضافه کنید */
                @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-Variable.css');

                body {
                    font-family: 'Vazirmatn', 'Inter', sans-serif; /* اولویت با فونت فارسی */
                    margin: 0;
                    background: linear-gradient(135deg, #e0ffe0, #c0f0c0); /* گرادیان سبز روشن */
                }
                .rounded-xl {
                    border-radius: 1rem;
                }
                .rounded-full {
                    border-radius: 9999px;
                }
                .shadow-lg {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .shadow-xl {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                .shadow-inner {
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #10B981; /* سبز-500 */
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #10B981; /* سبز-500 */
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                /* اطمینان از اینکه canvas عرض و ارتفاع کامل را بگیرد */
                canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                /* استایل برای نمایشگر عدد روی اسلایدر */
                input[type="range"] {
                    position: relative;
                }
                /* برای نمایشگر عدد روی اسلایدر در BMI و Questionnaire */
                .bmi-calculator label span.font-bold, .questionnaire-page label span.font-bold {
                    /* این استایل‌ها باعث می‌شوند عدد در کنار لیبل اصلی نمایش داده شود */
                    display: inline-block;
                    margin-right: 5px; /* فاصله از لیبل */
                }
                /* مخفی کردن نمایشگر عدد پیش‌فرض مرورگر */
                input[type="range"]::-webkit-slider-runnable-track {
                    -webkit-appearance: none;
                    background: transparent;
                }
                input[type="range"]::-moz-range-track {
                    background: transparent;
                }
                /* استایل برای متن Markdown */
                .prose {
                    font-family: 'Vazirmatn', 'Inter', sans-serif;
                    line-height: 1.8;
                }
                .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    font-family: 'Vazirmatn', 'Inter', sans-serif;
                    font-weight: 800; /* Extra bold for headings */
                }
                .prose ul, .prose ol {
                    padding-right: 1.5em; /* برای لیست‌های راست به چپ */
                }
                /* استایل برای فیلدهای دیتالیست */
                input[list]::-webkit-calendar-picker-indicator {
                    display: none; /* مخفی کردن آیکون پیش‌فرض دیتالیست */
                }
                input[list] {
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>');
                    background-repeat: no-repeat;
                    background-position: left 0.75rem center; /* آیکون در سمت چپ */
                    padding-left: 2.5rem; /* فضای کافی برای آیکون */
                }
                `}
            </style>
            {content}
        </div>
    );
};

export default App;
