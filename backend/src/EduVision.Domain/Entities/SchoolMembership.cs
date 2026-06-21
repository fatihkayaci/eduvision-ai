using EduVision.Domain.Enums;

namespace EduVision.Domain.Entities;

public sealed class SchoolMembership : BaseEntity
{

    public Guid UserId { get; private set; }

    public Guid SchoolId { get; private set; }

    public string Username { get; private set; } = string.Empty;

    public UserRole Role { get; private set; }

    private SchoolMembership()
    {
    }
    
    public static SchoolMembership Create(
        Guid userId,
        Guid schoolId,
        string username,
        UserRole role)
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

        return new SchoolMembership
        {
            UserId = userId,
            SchoolId = schoolId,
            Username = username.Trim(),
            Role = role
        };
    }
}
