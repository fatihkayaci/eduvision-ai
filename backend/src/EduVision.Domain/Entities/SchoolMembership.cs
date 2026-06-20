using EduVision.Domain.Enums;

namespace EduVision.Domain.Entities;

public sealed class SchoolMembership : BaseEntity
{

    public Guid UserId { get; private set; }

    public Guid SchoolId { get; private set; }

    public string Username { get; private set; } = string.Empty;

    public UserRole Role { get; private set; }

    public string? StudentNumber { get; private set; }

    private SchoolMembership()
    {
    }
    
    public static SchoolMembership Create(
        Guid userId,
        Guid schoolId,
        string username,
        UserRole role,
        string? studentNumber = null)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("User ID cannot be empty.", nameof(userId));
        }

        if (schoolId == Guid.Empty)
        {
            throw new ArgumentException("School ID cannot be empty.", nameof(schoolId));
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(username);

        if (role == UserRole.None)
        {
            throw new ArgumentException("A school membership must have a role.", nameof(role));
        }

        if (role == UserRole.Student && string.IsNullOrWhiteSpace(studentNumber))
        {
            throw new ArgumentException(
                "A student membership must have a student number.",
                nameof(studentNumber));
        }

        if (role != UserRole.Student && !string.IsNullOrWhiteSpace(studentNumber))
        {
            throw new ArgumentException(
                "Only a student membership can have a student number.",
                nameof(studentNumber));
        }

        return new SchoolMembership
        {
            UserId = userId,
            SchoolId = schoolId,
            Username = username.Trim(),
            Role = role,
            StudentNumber = string.IsNullOrWhiteSpace(studentNumber) ? null : studentNumber.Trim()
        };
    }
}
