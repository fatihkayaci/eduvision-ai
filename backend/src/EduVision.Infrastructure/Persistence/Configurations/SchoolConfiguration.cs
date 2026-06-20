using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class SchoolConfiguration : IEntityTypeConfiguration<School>
{
    public void Configure(EntityTypeBuilder<School> builder)
    {
        builder.ToTable("Schools");

        builder.HasKey(school => school.Id);

        builder.Property(school => school.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(school => school.Code)
            .HasMaxLength(50)
            .IsUnicode(false)
            .IsRequired();

        builder.Property(school => school.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(school => school.Code)
            .IsUnique();
    }
}
