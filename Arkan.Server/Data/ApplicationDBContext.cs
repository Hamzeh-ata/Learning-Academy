using Arkan.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace Arkan.Server.Data
{
    public class ApplicationDBContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne()
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Instructor>()
                .HasOne(s => s.User)
                .WithOne()
                .HasForeignKey<Instructor>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany()
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Enrollment>()
                 .HasOne(e => e.Course)
                 .WithMany(c => c.Enrollments)
                 .HasForeignKey(e => e.CourseId)
                 .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Category>()
               .HasMany(c => c.CoursesCategories)
               .WithOne(cc => cc.Category)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Course>()
               .HasMany(course => course.Chapters)
               .WithOne(chapter => chapter.Course)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Chapter>()
             .HasMany(c => c.Lessons)
             .WithOne(l => l.Chapter)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Quiz>()
              .HasOne(q => q.Lesson)
              .WithOne(l => l.Quiz)
              .HasForeignKey<Quiz>(q => q.LessonId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UsersRoles>()
              .HasOne(ur => ur.User)
              .WithMany(u => u.UserRoles)
              .HasForeignKey(ur => ur.UserId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Role>()
             .HasMany(r => r.UserRoles)
             .WithOne(ur => ur.Role)
             .HasForeignKey(ur => ur.RoleId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Role>()
              .HasMany(r => r.RolePermissions)
              .WithOne(rp => rp.Role)
              .HasForeignKey(rp => rp.RoleId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Models.Permissions>()
              .HasMany(p => p.RolePermissions)
              .WithOne(rp => rp.Permissions)
              .HasForeignKey(rp => rp.PermissionsId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Models.Permissions>()
              .HasMany(p => p.PagePermissions)
              .WithOne(pp => pp.Permissions)
              .HasForeignKey(pp => pp.PermissionsId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Models.Page>()
             .HasMany(p => p.PagePermissions)
             .WithOne(pp => pp.Page)
             .HasForeignKey(pp => pp.PageId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Quiz>()
             .HasMany(q => q.Questions)
             .WithOne(q => q.Quiz)
             .HasForeignKey(Question => Question.QuizId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Question>()
             .HasMany(q => q.Answers)
             .WithOne(a => a.Question)
             .HasForeignKey(a => a.QuestionId)
             .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<UserQuizAttempt>()
            .HasOne(ua => ua.Quiz)
            .WithMany()
            .HasForeignKey(ua => ua.QuizId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserAnswer>()
             .HasOne(ua => ua.UserQuizAttempt)
             .WithMany(uqa => uqa.UserAnswers)
             .HasForeignKey(ua => ua.UserQuizAttemptId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserQuizAttempt>()
            .HasOne(uqa => uqa.User)
            .WithMany(u => u.UserQuizAttempts)
            .HasForeignKey(uqa => uqa.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesPackages>()
             .HasOne(cp => cp.Course)
             .WithMany(c => c.CoursesPackages)
             .HasForeignKey(cp => cp.CourseId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesPackages>()
             .HasOne(cp => cp.Package)
             .WithMany(p => p.CoursesPackages)
             .HasForeignKey(cp => cp.PackageId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesUnviersites>()
            .HasOne(cu => cu.Course)
            .WithMany(c => c.CoursesUnviersites)
            .HasForeignKey(cu => cu.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesUnviersites>()
            .HasOne(cu => cu.University)
            .WithMany(c => c.CoursesUnviersites)
            .HasForeignKey(cu => cu.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentsPackages>()
           .HasOne(sp => sp.Student)
           .WithMany(s => s.StudentsPackages)
           .HasForeignKey(sp => sp.StudentId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentsPackages>()
            .HasOne(sp => sp.Package)
            .WithMany(p => p.StudentsPackages)
            .HasForeignKey(sp => sp.PackageId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesSection>()
            .HasOne(cs => cs.Course)
            .WithMany()
            .HasForeignKey(cs => cs.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UniversitiesSection>()
            .HasOne(us => us.University)
            .WithMany()
            .HasForeignKey(us => us.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InstructorsSection>()
           .HasOne(ns => ns.Instructor)
           .WithMany()
           .HasForeignKey(ns => ns.InstructorId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CategoriesSection>()
            .HasOne(ns => ns.Category)
            .WithMany()
            .HasForeignKey(ns => ns.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentCompletedLessons>()
            .HasOne(sc => sc.Student)
            .WithMany(s => s.StudentCompletedLessons)
            .HasForeignKey(sc => sc.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentCompletedLessons>()
           .HasOne(sc => sc.Lesson)
           .WithMany(l => l.StudentCompletedLessons)
           .HasForeignKey(sc => sc.LessonId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserOrder>()
            .HasMany(uo => uo.OrderItems)
            .WithOne(oi => oi.UserOrder)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderPayments>()
             .HasOne(p => p.Order)
             .WithMany()
             .HasForeignKey(p => p.OrderId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ForgotPasswordRequests>()
             .HasOne(r => r.User)
             .WithMany()
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Sessions>()
             .HasOne(r => r.User)
             .WithMany()
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseNotifications>()
            .HasOne(r => r.Course)
            .WithMany()
            .HasForeignKey(r => r.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClientMessagesReaction>()
            .HasOne(cr => cr.ClientMessages)
            .WithMany(c => c.Reactions)
            .HasForeignKey(cr => cr.ClientMessagesId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClientMessagesReaction>()
            .HasOne(cr => cr.User)
            .WithMany()
            .HasForeignKey(cr => cr.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SupportChatMessage>()
           .HasOne(sch => sch.SupportChatRoom)
           .WithMany()
           .HasForeignKey(sch => sch.SupportChatRoomId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClientMessages>()
           .HasOne(sch => sch.ClientChatRoom)
           .WithMany()
           .HasForeignKey(sch => sch.ClientChatRoomId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserNotifications>()
            .HasOne(un => un.User)
            .WithMany()
            .HasForeignKey(un => un.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserNotifications>()
            .HasOne(un => un.Notifications)
            .WithMany()
            .HasForeignKey(un => un.NotificationsId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesChatRooms>()
            .HasOne(cr => cr.Course)
            .WithMany()
            .HasForeignKey(cr => cr.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesChatMutedStudents>()
            .HasOne(cm => cm.Course)
            .WithMany()
            .HasForeignKey(cm => cm.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesChatMutedStudents>()
            .HasOne(cm => cm.User)
            .WithMany()
            .HasForeignKey(cm => cm.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesMessagesReaction>()
            .HasOne(cr => cr.User)
            .WithMany()
            .HasForeignKey(cr => cr.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesRoomMessages>()
             .HasOne(sch => sch.CoursesChatRooms)
              .WithMany(ccr => ccr.CoursesRoomMessages)
             .HasForeignKey(sch => sch.CoursesChatRoomsId)
             .OnDelete(DeleteBehavior.Cascade);

           modelBuilder.Entity<CoursesRoomMessages>()
            .HasOne(sch => sch.User)
            .WithMany()
            .HasForeignKey(sch => sch.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserSeenMessages>()
            .HasOne(sch => sch.User)
            .WithMany()
            .HasForeignKey(sch => sch.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserSeenMessages>()
            .HasOne(sch => sch.User)
            .WithMany()
            .HasForeignKey(sch => sch.UserId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursesMessagesReaction>()
            .HasOne(cr => cr.CoursesRoomMessages)
            .WithMany(cr => cr.Reactions)
            .HasForeignKey(cr => cr.CoursesRoomMessagesId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NoneStudentChapters>()
            .HasOne(nsc => nsc.Chapter)
            .WithMany()
            .HasForeignKey(nsc => nsc.ChapterId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LiveSession>()
            .HasOne(ls => ls.instructor)
            .WithMany()
            .HasForeignKey(ls => ls.InstructorId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LiveSession>()
            .HasOne(ls => ls.Course)
            .WithMany()
            .HasForeignKey(ls => ls.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdminActivity>()
            .HasOne(aa => aa.User)
            .WithMany()
            .HasForeignKey(aa => aa.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        }
       public DbSet<Student> Students { get; set; }
       public DbSet<Enrollment> Enrollments { get; set; }
       public DbSet<Course> Courses { get; set; }
       public DbSet<Instructor> Instructors { get; set; }
       public DbSet<Category> Categories { get; set; }
       public DbSet<CoursesCategories> CoursesCategories { get; set; }
       public DbSet<Chapter> Chapters { get; set; }
       public DbSet<Lesson> Lessons { get; set; }
       public DbSet<PagePermissions> PagePermissions { get; set; }
       public DbSet<Models.Permissions> Permissions { get; set; }
       public DbSet<Models.Page> Pages { get; set; }
       public DbSet<RolePermissions> RolePermissions { get; set; }
       public DbSet<UsersRoles> UsersRoles { get; set; }
       public DbSet<Role> Role { get; set; }
       public DbSet<Quiz> Quiz { get; set; }
       public DbSet<Question> Question { get; set; }
       public DbSet<Answer> Answer { get; set; }
       public DbSet<UserQuizAttempt> UserQuizAttempt { get; set; }
       public DbSet<UserAnswer> UserAnswer { get; set; }
       public DbSet<Package> Package { get; set; }
       public DbSet<CoursesPackages> CoursesPackages { get; set; }
       public DbSet<University> Unviersites { get; set; }
       public DbSet<StudentsPackages> StudentsPackages { get; set; }
       public DbSet<CoursesUnviersites> CoursesUnviersites { get; set; }
       public DbSet<CoursesSection> CoursesSection { get; set; }
       public DbSet<HeroSection> HeroSection { get; set; }
       public DbSet<UniversitiesSection> UniversitiesSection { get; set; }
       public DbSet<InstructorsSection> InstructorsSection { get; set; }
       public DbSet<CompanyInfo> CompanyInfo { get; set; }
       public DbSet<CategoriesSection> CategoriesSection { get; set; }
       public DbSet<StudentCompletedLessons> StudentWatchedLessons { get; set; }
       public DbSet<UserCart> UserCart { get; set; }
       public DbSet<UserOrder> UserOrder { get; set; }
       public DbSet<OrderItems> OrderItems { get; set; }
       public DbSet<OrderPayments> OrderPayments { get; set; }
       public DbSet<PromoCodes> PromoCodes { get; set; }
       public DbSet<ArkanCodes> ArkanCodes { get; set; }
       public DbSet<Sessions> Sessions { get; set; }
       public DbSet<ForgotPasswordRequests> ForgotPasswordRequests { get; set; }
       public DbSet<CourseNotifications> CourseNotifications { get; set; }
       public DbSet<Models.Notifications> Notifications { get; set; }
       public DbSet<ClientMessages> ClientMessages { get; set; }
       public DbSet<ClientMessagesReaction> ClientMessagesReaction { get; set; }
       public DbSet<ClientChatRoom> ClientChatRoom { get; set; }
       public DbSet<SupportChatRoom> SupportChatRoom { get; set; }
       public DbSet<SupportChatMessage> SupportChatMessage { get; set; }
       public DbSet<UserNotifications> UserNotifications { get; set; }
       public DbSet<CoursesChatRooms> CoursesChatRooms { get; set; }
       public DbSet<CoursesRoomMessages> CoursesRoomMessages { get; set; }
       public DbSet<CoursesChatMutedStudents> CoursesChatMutedStudents { get; set; }
       public DbSet<CoursesMessagesReaction> CoursesMessagesReactions { get; set; }
       public DbSet<UserSeenMessages> UserSeenMessages { get; set; }
       public DbSet<NoneStudentChapters> NoneStudentChapters { get; set; }
       public DbSet<LiveSession> LiveSessions { get; set; }
       public DbSet<FrequentlyQuestions> FrequentlyQuestions { get; set; }
        public DbSet<AdminActivity> AdminActivity { get; set; }

        
    }
}
