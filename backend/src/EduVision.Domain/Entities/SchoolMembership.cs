using EduVision.Domain.Enums;
using EduVision.Domain.Exceptions;

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
        if (userId == Guid.Empty) throw new DomainValidationException("User ID cannot be empty.");
        if (schoolId == Guid.Empty) throw new DomainValidationException("School ID cannot be empty.");
        if (string.IsNullOrWhiteSpace(username)) throw new DomainValidationException("Username cannot be empty.");
        if (role == UserRole.None) throw new DomainValidationException("A school membership must have a role.");

        return new SchoolMembership
        {
            UserId = userId,
            SchoolId = schoolId,
            Username = username.Trim(),
            Role = role
        };
    }
}
