using Arkan.Server;
using Arkan.Server.AuthServices;
using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_Repositories;
using Arkan.Server.Data;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.LoggerFilter;
using Arkan.Server.Messages_Interfaces;
using Arkan.Server.Messages_Services;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.PagesServices;
using Arkan.Server.PermissionsServices;
using Arkan.Server.Repository;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddScoped<ILoggerService, LoggerService>();
builder.Services.AddScoped<IFrequentlyQuestions, FrequentlyQuestionsRepository>();
builder.Services.AddScoped<ILiveSession, LiveSessionsRepository>();
builder.Services.AddScoped<IManageHiddenChapters, ManageHiddenChaptersRepository>();
builder.Services.AddScoped<IChatRoom, ChatRoomRepository>();
builder.Services.AddScoped<ISupportChat, SupportChatRepository>();
builder.Services.AddScoped<IClientMessages, ClientMessagesRepository>();
builder.Services.AddScoped<IUserPassword, UserPasswordRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IForgotPassword, ForgotPasswordRepository>();
builder.Services.AddScoped<IAdminStatistics, AdminStatisticsRepository>();
builder.Services.AddScoped<ISessions, SessionsRepository>();
builder.Services.AddScoped<IArkanCode, ArkanCodeRepository>();
builder.Services.AddScoped<IPromoCodes, PromoCodesRepository>();
builder.Services.AddScoped<IQuizStudentsAttempts, QuizStudentsAttemptsRepository>();
builder.Services.AddScoped<IClientCategories, ClientCategoriesRepository>();
builder.Services.AddScoped<IClientPackages, ClientPackagesRepository>();
builder.Services.AddScoped<IInstructorQuizReview, InstructorQuizReviewRepository>();
builder.Services.AddScoped<IInstructorAnswers, InstructorAnswersRepository>();
builder.Services.AddScoped<IInstructorQuestion, InstructorQuestionRepository>();
builder.Services.AddScoped<IInstructorCourse, InstructorCourseRepositroy>();
builder.Services.AddScoped<ICourseStudents, CourseStudentsRepository>();
builder.Services.AddScoped<IInstructorQuiz, InstructorQuizRepository>();
builder.Services.AddScoped<IMyCourses, MyCoursesRepository>();
builder.Services.AddScoped<IInstructors, ClientInstructorRepository>();
builder.Services.AddScoped<IOrdersFilter, OrdersFilterRepository>();
builder.Services.AddScoped<IOrderPaymentsInterface, OrderPaymentsRepository>();
builder.Services.AddScoped<IOrderPaymentsInterface, OrderPaymentsRepository>();
builder.Services.AddScoped<IOrdersInterface, OrdersRepository>();
builder.Services.AddScoped<IStudentQuizRepository, StudentQuizRepository>();
builder.Services.AddScoped<IInstructorPublicProfile, InstructorPublicProfileRepository>();
builder.Services.AddScoped<IUserOrders, UserOrdersRepository>();
builder.Services.AddScoped<IUserCart, UserCartRepository>();
builder.Services.AddScoped<IDropDown, DropDownRepository>();
builder.Services.AddScoped<IClientChapters, ClientChaptersRepository>();
builder.Services.AddScoped<IClientCourses, ClientCoursesRepository>();
builder.Services.AddScoped<IHomePageInterface, HomePageRepository>();
builder.Services.AddScoped<IProfileInterFace, ProfileRepository>();
builder.Services.AddScoped<IStudentPackagesInterface, StudentPackagesRepository>();
builder.Services.AddScoped<IUniversityInterFace, UniversityRepository>();
builder.Services.AddScoped<IPackageInterface, PackageRepository>();
builder.Services.AddScoped<IAnswerInterface, AnswerRepository>();
builder.Services.AddScoped<IQuestionInterface, QuestionRepository>();
builder.Services.AddScoped<ImageHelperInterface, ImageHelper>();
builder.Services.AddScoped<ILessonInterface, LessonRepository>();
builder.Services.AddScoped<IQuizInterface, QuizRepository>();
builder.Services.AddScoped<IPagesService, PagesRepository>();
builder.Services.AddScoped<IChapterInterface, ChapterRepository>();
builder.Services.AddScoped<ICourseInterface, CourseRepository>();
builder.Services.AddScoped<ICategoryInterface, CategoryRepository>();
builder.Services.AddScoped<IRolePagePermission, RolePagePermissionsService>();
builder.Services.AddScoped<IInstructorInterface, InstructorRepository>();
builder.Services.AddScoped<IStudentInterface, StudentRepository>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IRoles, RoleService>();
builder.Services.AddScoped<IPermissionsService, PermissionsService>();
builder.Services.AddScoped<IBaseRepository, BaseRepository>();
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
    policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSignalR();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<JWT>(builder.Configuration.GetSection("JWT"));
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDBContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(option => { 
   option.DefaultAuthenticateScheme=JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

})
.AddJwtBearer(o => 
{
    o.RequireHttpsMetadata= false;
    o.SaveToken = false;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
        ClockSkew = TimeSpan.Zero
    };
}
);
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseWebSockets();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotificationHub>("/Notifications");
    endpoints.MapHub<ChatHub>("/Chat");
    endpoints.MapControllers(); 
});
app.UseCors(MyAllowSpecificOrigins);
app.MapFallbackToFile("/index.html");

app.Run();
