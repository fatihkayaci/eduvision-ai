using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<School> Schools => Set<School>();

    public DbSet<Term> Terms => Set<Term>();

    public DbSet<SchoolMembership> SchoolMemberships => Set<SchoolMembership>();

    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();

    public DbSet<ClassRoom> ClassRooms => Set<ClassRoom>();

    public DbSet<ClassEnrollment> ClassEnrollments => Set<ClassEnrollment>();

    public DbSet<StudentParent> StudentParents => Set<StudentParent>();

    public DbSet<Course> Courses => Set<Course>();

    public DbSet<ClassroomCourse> ClassroomCourses => Set<ClassroomCourse>();

    public DbSet<Grade> Grades => Set<Grade>();

    public DbSet<Attendance> Attendances => Set<Attendance>();

    public DbSet<Assignment> Assignments => Set<Assignment>();

    public DbSet<ClassSchedule> ClassSchedules => Set<ClassSchedule>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
