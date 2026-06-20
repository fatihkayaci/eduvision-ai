using EduVision.Domain.Entities;
using EduVision.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class SchoolMembershipConfiguration : IEntityTypeConfiguration<SchoolMembership>
{
    public void Configure(EntityTypeBuilder<SchoolMembership> builder)
    {
        builder.ToTable(
            "SchoolMemberships",
            table => table.HasCheckConstraint(
                "CK_SchoolMemberships_Role",
                $"[Role] <> {(int)UserRole.None}"));

        builder.HasKey(membership => membership.Id);

        builder.Property(membership => membership.Username)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(membership => membership.Role)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(membership => membership.StudentNumber)
            .HasMaxLength(50)
            .IsUnicode(false);

        builder.Property(membership => membership.CreatedAtUtc)
            .IsRequired();

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(membership => membership.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<School>()
            .WithMany()
            .HasForeignKey(membership => membership.SchoolId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(membership => membership.UserId)
            .IsUnique();

        builder.HasIndex(membership => new { membership.SchoolId, membership.Username })
            .IsUnique();

        builder.HasIndex(membership => new { membership.SchoolId, membership.StudentNumber })
            .IsUnique()
            .HasFilter("[StudentNumber] IS NOT NULL");

        builder.HasIndex(membership => new { membership.SchoolId, membership.Role });
    }
}
