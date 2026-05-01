package com.lms.config;

import com.lms.entity.Category;
import com.lms.entity.Course;
import com.lms.entity.Lesson;
import com.lms.entity.User;
import com.lms.repository.CategoryRepository;
import com.lms.repository.CourseRepository;
import com.lms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    private record CourseSeed(String title,
                              String description,
                              String thumbnail,
                              String shortDescription,
                              BigDecimal price,
                              BigDecimal discountPrice,
                              Course.CourseLevel level,
                              int duration,
                              String requirements,
                              String outcomes,
                              List<String> learningPoints,
                              Category category,
                              User instructor,
                              List<Lesson> lessons) {}

    private record LessonSeed(String title,
                              String description,
                              Lesson.LessonType type,
                              String videoUrl,
                              String content,
                              int duration,
                              int orderIndex,
                              boolean free) {}

    @Override
    @Transactional
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            return;
        }

        createUser("admin@codecamp.test", "Admin", "User", "Admin123!", User.Role.ADMIN);
        User instructor = createUser("instructor@codecamp.test", "CodeCamp", "Instructor", "Instructor123!", User.Role.INSTRUCTOR);
        createUser("student@codecamp.test", "Test", "Student", "Student123!", User.Role.STUDENT);

        Category web = getOrCreateCategory("Web Development", "Courses that teach modern web development from frontend to backend.", "web-icon");
        Category data = getOrCreateCategory("Data Science", "Data analysis, visualization, and machine learning workflows.", "data-icon");
        Category cloud = getOrCreateCategory("Cloud & DevOps", "Cloud platforms, deployment pipelines, and infrastructure best practices.", "cloud-icon");
        Category mobile = getOrCreateCategory("Mobile Development", "Build cross-platform mobile applications with modern tools.", "mobile-icon");
        Category ai = getOrCreateCategory("AI & Machine Learning", "Artificial intelligence, deep learning, and model deployment.", "ai-icon");

        createCourse(new CourseSeed(
                "Java 17 & Spring Boot 3 CodeCamp",
                "A practical course on building modern Java backend applications with Spring Boot 3 and Java 17 features.",
                "https://img.youtube.com/vi/4hCq2yQy5O0/hqdefault.jpg",
                "Build a professional Java backend using modern Spring Boot practices.",
                new BigDecimal("49.99"),
                new BigDecimal("29.99"),
                Course.CourseLevel.INTERMEDIATE,
                12,
                "Basic Java knowledge",
                "Modern Spring Boot API development, JWT security, JPA, testing",
                List.of(
                        "Build production-grade Spring Boot REST APIs",
                        "Secure endpoints with JWT authentication",
                        "Use JPA and Hibernate for data persistence",
                        "Structure real-world backend services",
                        "Ship maintainable Java applications"
                ),
                web,
                instructor,
                List.of(
                        lesson(new LessonSeed("Spring Boot 3 Introduction", "Why Spring Boot 3 and Java 17 matter for modern applications.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=9u8VITVKPzI", "", 20, 1, true)),
                        lesson(new LessonSeed("Java 17 Records & Text Blocks", "Use Java 17 language features to simplify DTOs and configuration.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=6nfj4XyVUw0", "", 25, 2, false)),
                        lesson(new LessonSeed("JWT Authentication in Spring", "Secure your API with JWT and Spring Security.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=V6Kq8-L2P1M", "", 30, 3, false)),
                        lesson(new LessonSeed("Building REST Endpoints", "Create maintainable REST controllers and service layers.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=VT0AtDfza0I", "", 35, 4, false)),
                        lesson(new LessonSeed("Testing Spring Boot APIs", "Write clean integration tests for Spring Boot endpoints.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=oUE3Yez4SIE", "", 28, 5, false))
                )
        ));

        createCourse(new CourseSeed(
                "Angular + Spring Boot Full Stack",
                "A complete full stack course focused on building Angular UI and Spring Boot backend integration.",
                "https://img.youtube.com/vi/k5E2AVpwsko/hqdefault.jpg",
                "From login screens to authenticated APIs, build a full stack app end-to-end.",
                new BigDecimal("39.99"),
                new BigDecimal("24.99"),
                Course.CourseLevel.INTERMEDIATE,
                10,
                "Basic HTML, CSS, and JavaScript",
                "Angular components, services, routing, REST API integration",
                List.of(
                        "Build dynamic Angular user interfaces",
                        "Integrate Angular with Spring Boot APIs",
                        "Implement secure client-side authentication",
                        "Use services for state and HTTP flow",
                        "Deploy a modern full stack app"
                ),
                web,
                instructor,
                List.of(
                        lesson(new LessonSeed("Angular Project Setup", "Create an Angular app and configure routing.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=3qBXWUpoPHo", "", 22, 1, true)),
                        lesson(new LessonSeed("Building Reusable Components", "Create a dynamic course listing and detail page.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=ZqgiuPt5QZo", "", 26, 2, false)),
                        lesson(new LessonSeed("HTTP Client & Auth", "Connect to Spring Boot APIs and manage JWT tokens.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=KnKGwH6XkS0", "", 30, 3, false)),
                        lesson(new LessonSeed("State Management Basics", "Use Angular services for shared state and authentication.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=MrR0nKVTf_g", "", 24, 4, false)),
                        lesson(new LessonSeed("Deploying Full Stack App", "Prepare your app for production deployment.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=njZOLcIDnCE", "", 18, 5, false))
                )
        ));

        createCourse(new CourseSeed(
                "Python Data Science Crash Course",
                "A hands-on introduction to Python tools for data analysis, visualization, and machine learning.",
                "https://img.youtube.com/vi/r-uOLxNrNk8/hqdefault.jpg",
                "Learn pandas, matplotlib, NumPy, and model evaluation techniques.",
                new BigDecimal("44.99"),
                new BigDecimal("27.99"),
                Course.CourseLevel.BEGINNER,
                14,
                "Basic Python skills",
                "Data processing, visualization, exploratory analysis",
                List.of(
                        "Analyze datasets using Python and pandas",
                        "Create visual dashboards with matplotlib",
                        "Prepare data for machine learning",
                        "Build reproducible analysis workflows",
                        "Interpret model outputs confidently"
                ),
                data,
                instructor,
                List.of(
                        lesson(new LessonSeed("NumPy for Data Science", "Work with arrays, matrices, and numerical operations.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=QUT1VHiLmmI", "", 25, 1, true)),
                        lesson(new LessonSeed("Pandas DataFrames", "Load, transform, and summarize real datasets.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=vmEHCJofslg", "", 28, 2, true)),
                        lesson(new LessonSeed("Data Visualization", "Create charts and dashboards with matplotlib and seaborn.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=YrjQu2w0V2o", "", 32, 3, false)),
                        lesson(new LessonSeed("Feature Engineering", "Prepare data for machine learning workflows.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=HZGCoVF3YvM", "", 29, 4, false)),
                        lesson(new LessonSeed("Intro to Machine Learning", "Train a simple model and evaluate results.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=7eh4d6sabA0", "", 35, 5, false))
                )
        ));

        createCourse(new CourseSeed(
                "Docker & Kubernetes Fundamentals",
                "Learn containerization and orchestration for modern deployment workflows.",
                "https://img.youtube.com/vi/3c-iBn73dDE/hqdefault.jpg",
                "Understand Docker files, images, containers, and basic Kubernetes clusters.",
                new BigDecimal("34.99"),
                new BigDecimal("19.99"),
                Course.CourseLevel.BEGINNER,
                12,
                "Basic terminal knowledge",
                "Docker build, Kubernetes pods, services, and deployments",
                List.of(
                        "Containerize applications with Docker",
                        "Define multi-container stacks with Compose",
                        "Deploy apps onto Kubernetes clusters",
                        "Manage infrastructure with Helm and CI",
                        "Monitor containerized services effectively"
                ),
                cloud,
                instructor,
                List.of(
                        lesson(new LessonSeed("Docker Basics", "Build containers, images, and manage Docker workflows.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=fqMOX6JJhGo", "", 24, 1, true)),
                        lesson(new LessonSeed("Docker Compose", "Define multi-container apps with Compose files.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=Qw9zlE3t8Ko", "", 27, 2, false)),
                        lesson(new LessonSeed("Kubernetes Introduction", "Learn pods, deployments, and services.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=X48VuDVv0do", "", 31, 3, false)),
                        lesson(new LessonSeed("Helm & CI/CD", "Use Helm charts and automated deployment pipelines.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=Z4tYy7xniVg", "", 30, 4, false)),
                        lesson(new LessonSeed("Monitoring Kubernetes", "Measure cluster health and logs.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=6oRfFMg9w_Y", "", 22, 5, false))
                )
        ));

        createCourse(new CourseSeed(
                "AI Prompt Engineering & ChatGPT APIs",
                "A practical guide to prompt engineering, API integrations, and deploying AI assistants.",
                "https://img.youtube.com/vi/nhbY7uKjsCI/hqdefault.jpg",
                "Explore how to build intelligent assistants and automate workflows with AI APIs.",
                new BigDecimal("54.99"),
                new BigDecimal("34.99"),
                Course.CourseLevel.INTERMEDIATE,
                15,
                "Basic programming knowledge",
                "Prompt design, API requests, assistant workflows",
                List.of(
                        "Design effective prompts for AI systems",
                        "Integrate AI APIs in real applications",
                        "Build reliable conversational workflows",
                        "Evaluate and improve AI outputs",
                        "Deploy safe AI assistants"
                ),
                ai,
                instructor,
                List.of(
                        lesson(new LessonSeed("Prompt Engineering Basics", "Design prompts that get reliable AI responses.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=DLKsjc72v2M", "", 26, 1, true)),
                        lesson(new LessonSeed("OpenAI API Integration", "Connect your app to AI services using API keys.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=0MMwZsN5_hs", "", 28, 2, false)),
                        lesson(new LessonSeed("AI Chatbot Workflows", "Create conversational flows and context handling.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=0kqH8X8FRf8", "", 34, 3, false)),
                        lesson(new LessonSeed("Evaluating AI Outputs", "Analyze response quality and improve prompts.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=5m_1-z05PB8", "", 25, 4, false)),
                        lesson(new LessonSeed("Deploying AI Apps", "Publish your AI app with security and monitoring.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=2IwVgRssZz4", "", 30, 5, false))
                )
        ));

        createCourse(new CourseSeed(
                "Mobile App Development with Flutter",
                "Build beautiful cross-platform mobile apps using Flutter and Dart.",
                "https://img.youtube.com/vi/VPvVD8t02U8/hqdefault.jpg",
                "Learn layout, state management, and deployment for mobile applications.",
                new BigDecimal("42.99"),
                new BigDecimal("25.99"),
                Course.CourseLevel.BEGINNER,
                13,
                "Basic Dart or JavaScript knowledge",
                "Flutter widgets, navigation, and responsive UI",
                List.of(
                        "Build cross-platform Flutter apps",
                        "Create responsive and animated UIs",
                        "Manage app state efficiently",
                        "Fetch remote data and display it cleanly",
                        "Publish mobile apps to stores"
                ),
                mobile,
                instructor,
                List.of(
                        lesson(new LessonSeed("Flutter Setup & Widgets", "Install Flutter and build UI using widgets.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=1gDhl4leEzA", "", 23, 1, true)),
                        lesson(new LessonSeed("State Management", "Manage app state using providers and controllers.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=RS36gBEp8OI", "", 28, 2, false)),
                        lesson(new LessonSeed("Animations in Flutter", "Create smooth animated transitions.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=GLSG_Wh_YWc", "", 26, 3, false)),
                        lesson(new LessonSeed("Data & Networking", "Fetch remote data and show it in your UI.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=R5oB9qCL6Hs", "", 30, 4, false)),
                        lesson(new LessonSeed("Publishing Apps", "Deploy your app to iOS and Android stores.", Lesson.LessonType.VIDEO, "https://www.youtube.com/watch?v=3QoI9FU9VSc", "", 22, 5, false))
                )
        ));
    }

    private User createUser(String email, String firstName, String lastName, String password, User.Role role) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .firstName(firstName)
                        .lastName(lastName)
                        .role(role)
                        .enabled(true)
                        .build()));
    }

    private Category getOrCreateCategory(String name, String description, String icon) {
        return categoryRepository.findAll().stream()
                .filter(category -> category.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .description(description)
                        .icon(icon)
                        .build()));
    }

    private void createCourse(CourseSeed seed) {
        Course course = Course.builder()
                .title(seed.title())
                .description(seed.description())
                .thumbnail(seed.thumbnail())
                .shortDescription(seed.shortDescription())
                .price(seed.price())
                .discountPrice(seed.discountPrice())
                .level(seed.level())
                .duration(seed.duration())
                .requirements(seed.requirements())
                .outcomes(seed.outcomes())
                .learningPoints(seed.learningPoints())
                .instructor(seed.instructor())
                .category(seed.category())
                .published(true)
                .approved(true)
                .rating(4.8)
                .totalStudents(120)
                .build();

        seed.lessons().forEach(lesson -> lesson.setCourse(course));
        course.setLessons(seed.lessons());
        courseRepository.save(course);
    }

    private Lesson lesson(LessonSeed seed) {
        return Lesson.builder()
                .title(seed.title())
                .description(seed.description())
                .type(seed.type())
                .videoUrl(seed.videoUrl())
                .content(seed.content())
                .duration(seed.duration())
                .orderIndex(seed.orderIndex())
                .free(seed.free())
                .published(true)
                .build();
    }
}
