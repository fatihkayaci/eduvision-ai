using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class ClassRoomConfiguration : IEntityTypeConfiguration<ClassRoom>
{
    public void Configure(EntityTypeBuilder<ClassRoom> builder)
    {
        builder.ToTable("ClassRooms",
            table => table.HasCheckConstraint(
                "CK_ClassRooms_GradeLevel",
                "[GradeLevel] BETWEEN 9 AND 12"));

        builder.HasKey(c => c.Id);

        builder.Property(c => c.GradeLevel).IsRequired();

        builder.Property(c => c.Section)
            .HasMaxLength(5)
            .IsRequired();

        builder.Property(c => c.CreatedAtUtc).IsRequired();

        builder.HasOne<School>()
            .WithMany()
            .HasForeignKey(c => c.SchoolId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(c => c.HomeRoomTeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // Aynı okulda 9-A'dan 2 tane olamaz
        builder.HasIndex(c => new { c.SchoolId, c.GradeLevel, c.Section })
            .IsUnique();
    }
}
