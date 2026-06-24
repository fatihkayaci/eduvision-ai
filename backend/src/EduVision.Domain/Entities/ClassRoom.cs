using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class ClassRoom : BaseEntity
{
    public Guid SchoolId { get; private set; }

    public Guid HomeRoomTeacherId { get; private set; }

    public int GradeLevel { get; private set; }

    public string Section { get; private set; } = string.Empty;

    private ClassRoom()
    {
    }

    public static ClassRoom Create(
        Guid schoolId,
        Guid homeRoomTeacherId,
        int gradeLevel,
        string section)
    {
        if (schoolId == Guid.Empty) throw new DomainValidationException("School ID cannot be empty.");
        if (homeRoomTeacherId == Guid.Empty) throw new DomainValidationException("HomeRoom teacher ID cannot be empty.");
        if (gradeLevel is < 9 or > 12) throw new DomainValidationException("Grade level must be between 9 and 12.");
        if (string.IsNullOrWhiteSpace(section)) throw new DomainValidationException("Section cannot be empty.");

        return new ClassRoom
        {
            SchoolId = schoolId,
            HomeRoomTeacherId = homeRoomTeacherId,
            GradeLevel = gradeLevel,
            Section = section.Trim().ToUpperInvariant()
        };
    }
}
