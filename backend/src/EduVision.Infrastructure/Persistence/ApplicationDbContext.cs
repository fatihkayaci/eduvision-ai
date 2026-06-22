using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<School> Schools => Set<School>();

    public DbSet<SchoolMembership> SchoolMemberships => Set<SchoolMembership>();

    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();

    public DbSet<ClassRoom> ClassRooms => Set<ClassRoom>();

    public DbSet<ClassEnrollment> ClassEnrollments => Set<ClassEnrollment>();

    public DbSet<StudentParent> StudentParents => Set<StudentParent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
