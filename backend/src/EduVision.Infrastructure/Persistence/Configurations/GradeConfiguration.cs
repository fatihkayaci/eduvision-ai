using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class GradeConfiguration : IEntityTypeConfiguration<Grade>
{
    public void Configure(EntityTypeBuilder<Grade> builder)
    {
        builder.ToTable("Grades");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.CreatedAtUtc).IsRequired();

        builder.Property(g => g.Value)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(g => g.ExamType)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(g => g.Date).IsRequired();

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(g => g.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<ClassroomCourse>()
            .WithMany()
            .HasForeignKey(g => g.ClassroomCourseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
