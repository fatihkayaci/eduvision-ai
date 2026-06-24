using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduVision.Infrastructure.Persistence.Configurations;

public sealed class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.ToTable("Assignments");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.CreatedAtUtc).IsRequired();

        builder.Property(a => a.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(a => a.Description)
            .HasMaxLength(2000);

        builder.Property(a => a.Type)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(a => a.FileUrl)
            .HasMaxLength(500);

        builder.Property(a => a.StartDate).IsRequired();

        builder.Property(a => a.DueDate).IsRequired();

        builder.HasOne(a => a.ClassRoom)
            .WithMany()
            .HasForeignKey(a => a.ClassRoomId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Term>()
            .WithMany()
            .HasForeignKey(a => a.TermId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
