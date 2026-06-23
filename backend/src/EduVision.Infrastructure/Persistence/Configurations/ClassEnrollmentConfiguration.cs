using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class ClassEnrollmentConfiguration : IEntityTypeConfiguration<ClassEnrollment>
{
    public void Configure(EntityTypeBuilder<ClassEnrollment> builder)
    {
        builder.ToTable("ClassEnrollments");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.CreatedAtUtc).IsRequired();

        builder.HasOne(e => e.ClassRoom)
            .WithMany()
            .HasForeignKey(e => e.ClassRoomId)
            .OnDelete(DeleteBehavior.Cascade);

        // Bir öğrenci sadece 1 sınıfta olabilir
        builder.HasIndex(e => e.StudentId)
            .IsUnique();
    }
}
