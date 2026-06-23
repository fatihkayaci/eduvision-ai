using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class ClassroomCourseConfiguration : IEntityTypeConfiguration<ClassroomCourse>
{
    public void Configure(EntityTypeBuilder<ClassroomCourse> builder)
    {
        builder.ToTable("ClassroomCourses");

        builder.HasKey(cc => cc.Id);

        builder.Property(cc => cc.CreatedAtUtc).IsRequired();

        builder.HasOne(cc => cc.ClassRoom)
            .WithMany()
            .HasForeignKey(cc => cc.ClassRoomId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cc => cc.Course)
            .WithMany()
            .HasForeignKey(cc => cc.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(cc => cc.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(cc => new { cc.ClassRoomId, cc.CourseId })
            .IsUnique();
    }
}
