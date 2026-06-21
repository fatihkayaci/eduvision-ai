using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class StudentProfileConfiguration : IEntityTypeConfiguration<StudentProfile>
{
    public void Configure(EntityTypeBuilder<StudentProfile> builder)
    {
        builder.ToTable("StudentProfiles");

        builder.HasKey(profile => profile.UserId);

        builder.Property(profile => profile.StudentNumber)
            .HasMaxLength(50)
            .IsUnicode(false)
            .IsRequired();

        builder.HasOne(profile => profile.User)
            .WithOne(user => user.StudentProfile)
            .HasForeignKey<StudentProfile>(profile => profile.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
