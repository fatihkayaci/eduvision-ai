using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class ClassScheduleConfiguration : IEntityTypeConfiguration<ClassSchedule>
{
    public void Configure(EntityTypeBuilder<ClassSchedule> builder)
    {
        builder.ToTable("ClassSchedules");

        builder.HasKey(cs => cs.Id);

        builder.Property(cs => cs.CreatedAtUtc).IsRequired();

        builder.Property(cs => cs.Weekday)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(cs => cs.StartTime).IsRequired();

        builder.Property(cs => cs.EndTime).IsRequired();

        builder.HasOne(cs => cs.ClassroomCourse)
            .WithMany()
            .HasForeignKey(cs => cs.ClassroomCourseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Term>()
            .WithMany()
            .HasForeignKey(cs => cs.TermId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(cs => new { cs.ClassroomCourseId, cs.TermId, cs.Weekday, cs.StartTime })
            .IsUnique();
    }
}
